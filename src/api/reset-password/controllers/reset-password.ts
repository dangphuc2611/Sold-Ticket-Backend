'use strict';

export default {
  async sendOtp(ctx) {
    const { email } = ctx.request.body;
    if (!email) return ctx.badRequest('Missing email');

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
    if (!user) return ctx.notFound('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        reset_otp: otp,
        reset_otp_expires: expires.toISOString(),
      },
    });

    await strapi.plugin('email').service('email').send({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP Code is: ${otp}`,
    });

    ctx.send({ message: 'OTP sent' });
  },

  async verifyOtp(ctx) {
    const { email, otp } = ctx.request.body;

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
    if (!user) return ctx.notFound('User not found');

    if (
      user.reset_otp !== otp ||
      new Date(user.reset_otp_expires) < new Date()
    ) {
      return ctx.badRequest('Invalid or expired OTP');
    }

    ctx.send({ message: 'OTP verified' });
  },

  async resetPassword(ctx) {
    const { email, password } = ctx.request.body;

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
    if (!user) return ctx.notFound('User not found');

    const hashedPassword = await strapi
      .plugin('users-permissions')
      .service('user')
      .hashPassword(password);

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expires: null,
      },
    });

    ctx.send({ message: 'Password reset successfully' });
  },
};
