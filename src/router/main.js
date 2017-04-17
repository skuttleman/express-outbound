const wrap = require('./wrap');
const { flatten } = require('fun-util');

const METHODS = ['use', 'get', 'put', 'delete', 'post', 'patch', 'all', 'options'];

module.exports = router => {
  METHODS.forEach(method => {
    const fn = router[method];
    router[method] = (...args) => wrap.wrap(fn)(router, ...args);
  });
  return router;
};

METHODS.forEach(method => {
  module.exports[method] = (router, ...args) => {
    return wrap.wrap(router[method])(router, ...args);
  };
});