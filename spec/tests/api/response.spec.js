const axios = require('axios');
const { startApp } = require('../../support/apiHelper');
const { use, get } = require('../../../src/outbound');

describe('Library API', () => {
  let server;
  beforeEach(() => {
    server = runApp({ port: 8765 });
  });

  afterEach(() => {
    server.close();
  });

  it('allows you to use the response object in the response chain', done => {
    axios.get('http://localhost:8765/')
      .catch(({ response }) => {
        expect(response.status).toEqual(420);
        expect(response.data).toEqual({ someData: 'some data', otherData: 'other data' });
      }).then(done);
  });
});

const runApp = config => startApp(({ app }) => {
  app.use((request, response, next) => {
    next((data, send) => {
      send({ ...data, someData: 'some data' });
    });
  });

  app.get('/', (request, response, next) => {
    next(data => {
      response.status(420).send(data);
    });
  });

  app.get('/', (request, response, next) => {
    next((data, send) => {
      send({ ...data, otherData: 'other data' });
    });
  });

  app.get('/', (request, response, next) => {
    response.status(500).json({});
  });
}, config);