const axios = require('axios');
const { startClean } = require('../../support/apiHelper');
const { use, get } = require('../../../src/outbound');

describe('Library API', () => {
  let server;
  beforeEach(() => {
    server = runApp({ port: 8765 });
  });

  afterEach(() => {
    server.close();
  });

  it('works without mutating app/router', done => {
    axios.get('http://localhost:8765/')
      .catch(({ response }) => {
        expect(response.data).toEqual({ error: '[Function]', and: 'details' });
      }).then(done);
  });
});

const runApp = config => startClean(({ app }) => {
  use(app, (request, response, next) => {
    next((data, send) => {
      send({
        error: data.error,
        and: 'details'
      });
    });
  });

  app.get('/', (request, response, next) => {
    next((data, send) => {
      send('this will get treated like an error');
    });
  });

  app.use((error, request, response, next) => {
    response.status(500).json({ error: '[Function]' });
  });
}, config);