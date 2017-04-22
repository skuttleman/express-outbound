const axios = require('axios');
const { startApp } = require('../../support/apiHelper');
const METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch'];

describe('Mehods API', () => {
  METHODS.forEach(method => {
    describe(`.${method}`, () => {
      let server;
      beforeEach(() => {
        server = runApp({ port: 8765, method });
      });

      afterEach(() => {
        server.close();
      });

      it(`recognizes the "${method}" method`, done => {
        axios[method](`http://localhost:8765/${method}`)
          .then(({ data, status }) => {
            expect(data).toEqual({ details: 'details' });
            expect(status).toEqual(202);
          }).then(done);
      });
    });
  });
});

const runApp = config => startApp(({ app }) => {
  const { method } = config;
  app.use((request, response, next) => {
    next(data => response.status(202).send(data));
  });

  app[method](`/${method}`, (request, response, next) => {
    next(data => response.send({ details: 'details' }));
  });

  app[method](`/${method}`, (request, response) => {
    response.status(200).json({});
  });
}, config);