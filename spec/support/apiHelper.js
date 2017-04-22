const express = require('express');
const outbound = require('../../src/outbound');

const startApp = (configure, { port = 8080 } = {}) => {
  const app = outbound(express);
  const router = outbound.Router(express);
  configure({ app, router });
  const server = require('http').createServer(app);

  server.listen(port);
  return server;
};

module.exports = {
  startApp
};