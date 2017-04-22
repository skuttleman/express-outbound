/**
 * Creates a function that rewinds response.send and response.json and passes the
 * data to the callback supplied to next.
 *  
 * @param {Function} chain
 * @param {Response} response
 * @param {Object} object
 * 
 * @return {Function}
 * @private
 */
const doNext = (chain, response, { json, send }) => {
  return function (data) {
    response.json = json;
    response.send = send;
    return chain(data);
  };
};

/**
 * Interrupts response.send and response.json with a callback function, 'chain',
 * which takes the data to be sent in the http response.
 *
 * @param {Function} chain
 * @param {Response} response
 * 
 * @return {Void}
 * @private
 */
const handle = (chain, response) => {
  const { json, send } = response;
  response.send = doNext(chain, response, { json, send });
  response.json = doNext(chain, response, { json, send });
};

module.exports = handle;