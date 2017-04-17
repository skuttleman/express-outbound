const axios = require('axios');
const { startApp } = require('../../support/apiHelper');

describe('Error API', () => {
  let server, apiSpy;
  beforeEach(() => {
    apiSpy = jasmine.createSpy('api spy');
    server = runApp(apiSpy, { port: 8765 });
  });

  afterEach(() => {
    server.close();
  });

  it('produces an error response', done => {
    axios.get('http://localhost:8765/')
      .catch(({ response }) => {
        expect(response.data).toEqual({ error: 'Something blew up' });
        expect(apiSpy).toHaveBeenCalledTimes(1);
        expect(apiSpy).toHaveBeenCalledWith('this still happens');
      }).then(done);
  });
});

const runApp = (apiSpy, config) => startApp(({ app }) => {
  app.use((request, response, next) => {
    next((data, send) => {
      apiSpy('this still happens');
      send(data);
    });
  });

  app.get('/', (request, response, next) => {
    throw new Error('Something blew up');
  });

  app.use((error, request, response, next) => {
    response.status(500).send({ error: error.message });
  });
}, config);