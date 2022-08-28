const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:5000",
      changeOrigin: true,
      onError: (err, req, res) => {
        console.log(err);
      },
    })
  );
};