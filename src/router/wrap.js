const { flatten } = require('fun-util');
const apply = require('./apply');

const makeMiddleware = fn => (request, response, next) => {
  fn(request, response, apply(response, next));
};

/**
 * Determines when/how to wrap the supplied middleware(s)
 * with an enhanced 'next' callback.
 *
 * @param {Function} express
 * 
 * @return {App}
 * @private
 */
const wrap = fn => (router, ...args) => {
  const middlewares = flatten(args);
  const chain = middlewares
    .filter(fn => typeof fn === 'function')
    .map(fn => fn.length >= 4 ? fn : makeMiddleware(fn));
  if (typeof middlewares[0] !== 'function' && middlewares.length) {
    return fn.apply(router, [middlewares[0]].concat(chain));
  }
  return fn.apply(router, chain);
};

module.exports = wrap;