export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  // 'strapi::cors',
  // {
  //   name: 'strapi::cors',
  //   config: {
  //     origin: ['http://localhost:3000'],
  //     credentials: true,
  //   },
  // },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
