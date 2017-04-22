const handle = require('./handle');

/**
 * Creates a function in place of 'next' that applies
 * registers a callback (if supplied) or invokes 'next' as usual.
 *
 * @return {Function}
 * @private
 */
const apply = (response, next) => chain => {
  if (typeof chain === 'function') {
    handle(chain, response);
    next();
  } else {
    next(chain);
  }
};

module.exports = apply;