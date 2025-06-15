import nodemailer from 'nodemailer';
// import { Strapi } from '@strapi/strapi';

let otpStorage: { [email: string]: string } = {};

export default {
  async sendOtp(ctx) {
    const { email } = ctx.request.body;

    if (!email) return (ctx.badRequest('Email is required'));

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });

    if (!user) return ctx.notFound('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[email] = otp;

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'phucnd2611@gmail.com',
        pass: 'shxr roma clxd hzbv'
      }
    });

    await transporter.sendMail({
      from: '"Sold Ticket Project" <your_email@gmail.com>',
      to: email,
      subject: 'OTP for Password Reset',
      text: `Your OTP is: ${otp}`,
    });

    ctx.send({ message: 'OTP sent to email' });
  },

  async verifyOtp(ctx) {
    const { email, otp } = ctx.request.body;

    if (otpStorage[email] !== otp) return ctx.badRequest('Invalid OTP');
    ctx.send({ success: true });
  },

  async resetPassword(ctx) {
    const { email, password } = ctx.request.body;

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });

    if (!user) return ctx.notFound('User not found');

    await strapi.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        password,
      }
    });

    delete otpStorage[email];
    ctx.send({ message: 'Password updated' });
  }
};
