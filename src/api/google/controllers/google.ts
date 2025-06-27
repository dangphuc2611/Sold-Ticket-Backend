export default {
  async loginWithGoogleAccessToken(ctx) {
    const access_token =
      ctx.request.body?.access_token ||
      ctx.request.query?.access_token;

    if (!access_token) {
      return ctx.badRequest('Thiếu access_token');
    }

    try {
      const result = await strapi
        .service('api::google.google')
        .verifyAndLogin(access_token);

      return ctx.send(result);
    } catch (err) {
      console.error('❌ Lỗi xác thực Google:', err);
      return ctx.internalServerError('Google login failed');
    }
  },
};
