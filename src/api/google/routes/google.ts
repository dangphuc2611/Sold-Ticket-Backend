export default {
  routes: [
    {
      method: 'POST',
      path: '/google',
      handler: 'google.loginWithGoogleAccessToken', // <-- FIXED
      config: {
        auth: false,
      },
    },
  ],
};
