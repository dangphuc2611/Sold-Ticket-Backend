export default {
  routes: [
    {
      method: 'POST',
      path: '/forgot-password/send-otp',
      handler: 'forgot-password.sendOtp',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/forgot-password/verify-otp',
      handler: 'forgot-password.verifyOtp',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/forgot-password/update',
      handler: 'forgot-password.resetPassword',
      config: {
        auth: false
      }
    }
  ]
};
