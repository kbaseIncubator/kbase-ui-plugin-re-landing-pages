const proxy = require('http-proxy-middleware');
const morgan = require('morgan');

module.exports = function(app) {
    app.use(proxy('/services/**/*', { target: 'https://ci.kbase.us', changeOrigin: true }));
    app.use(proxy('/dynserv/**/*', { target: 'https://ci.kbase.us', changeOrigin: true }));
    app.use(morgan('combined'));
};
