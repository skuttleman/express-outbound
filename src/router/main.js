const wrap = require('./wrap');
const { flatten } = require('fun-util');
const { METHODS } = require('../config');

/**
 * Mutates the supplied router to enhance the middleware functions passed them
 * to take an optional callback.
 *
 * @param {Router|App} router
 * 
 * @return {Router}
 * @private
 */
const enhanceRouter = router => {
  METHODS.forEach(method => {
    const fn = router[method];
    router[method] = (...args) => wrap(fn)(router, ...args);
  });
  return router;
};

/**
 * Returns an enhanced app by invoking the supplied express function.
 *
 * @param {Function} express
 * 
 * @return {ExpressApp}
 * @public
 */
module.exports = express => enhanceRouter(express());

/**
 * Returns an enhanced router by invoking the supplied express' Router method.
 *
 * @param {Function} express
 * 
 * @return {Router}
 * @public
 */
module.exports.Router = express => enhanceRouter(express.Router());
