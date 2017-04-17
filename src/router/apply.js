const handle = require('./handle');

const apply = (response, next) => chain => {
  if (typeof chain === 'function') {
    handle.handle(chain, response);
    next();
  } else {
    next(chain);
  }
};

module.exports = {
  apply
};