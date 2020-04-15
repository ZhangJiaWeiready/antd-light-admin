/* eslint-disable */
const proxy = require('http-proxy-middleware').createProxyMiddleware;

module.exports = (app) => {
  app.use(
    '/api',
    proxy({
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    }),
  );
};
