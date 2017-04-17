const toBeJSON = data => data instanceof Object && !Buffer.isBuffer(data);

const doNext = (chain, response, { json, send }) => (method, data, ...args) => {
  response.json = json;
  response.send = send;
  return chain(data, result => method.call(response, result, ...args))
};

const handle = (chain, response) => {
  const { json, send } = response;

  response.send = function (data, ...args) {
    if (toBeJSON(data)) {
      return response.json(data, ...args);
    }
    return doNext(chain, response, { json, send })(send, data, ...args);
  };

  response.json = function (data, ...args) {
    return doNext(chain, response, { json, send })(json, data, ...args);
  };
};

module.exports = {
  handle
};