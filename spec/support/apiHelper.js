const express = require('express');
const outbound = require('../../src/outbound');

const startApp = (configure, { port = 8080 } = {}) => {
  const app = express();
  const router = express.Router();
  outbound(app);
  outbound(router);
  configure({ app, router });
  const server = require('http').createServer(app);

  server.listen(port);
  return server;
};

const startClean = (configure, { port = 8080 } = {}) => {
  const app = express();
  const router = express.Router();
  configure({ app, router });
  const server = require('http').createServer(app);

  server.listen(port);
  return server;
};

module.exports = {
  startApp,
  startClean
};