const axios = require('axios');
const { startApp } = require('../../support/apiHelper');

describe('API', () => {
  let server, apiSpy;
  beforeEach(() => {
    apiSpy = jasmine.createSpy('api spy');
    server = runApp(apiSpy, { port: 8765 });
  });

  afterEach(() => {
    server.close();
  });

  it('produces the expected response', done => {
    axios.get('http://localhost:8765/')
      .then(({ data }) => {
        expect(data).toEqual({ some: 'response', extra: 'stuff' });
      }).then(done);
  });

  it('calls the middlewares in the expected order', done => {
    axios.get('http://localhost:8765/')
      .then(() => {
        expect(apiSpy).toHaveBeenCalledTimes(5);
        expect(apiSpy.calls.argsFor(0)).toEqual(['first']);
        expect(apiSpy.calls.argsFor(1)).toEqual(['second']);
        expect(apiSpy.calls.argsFor(2)).toEqual(['third']);
        expect(apiSpy.calls.argsFor(3)).toEqual(['fourth']);
        expect(apiSpy.calls.argsFor(4)).toEqual(['fifth']);
      }).then(done);
  });

  it('mounts middleware as expected', done => {
    axios.post('http://localhost:8765', { some: 'body' })
      .then(({ data }) => {
        expect(data).toEqual({ some: 'response' });
        expect(apiSpy).toHaveBeenCalledTimes(1);
        expect(apiSpy).toHaveBeenCalledWith('only');
      }).then(done)
  });
});

const runApp = (apiSpy, config) => startApp(({ app }) => {
  app.get('/', (request, response, next) => {
    apiSpy('first');
    next();
  }, (request, response, next) => {
    apiSpy('second');
    next((data, send) => {
      apiSpy('fifth');
      send(data);
    });
  }, (request, response, next) => {
    apiSpy('third');
    next((data, send) => {
      apiSpy('fourth');
      Promise.resolve().then(() => send({ ...data, extra: 'stuff' }));
    });
  }, (request, response) => {
    response.send({ some: 'response' });
  });

  app.post('/', (request, response, next) => {
    apiSpy('only');
    next();
  });

  app.post('/', (request, response) => {
    response.send({ some: 'response' });
  });
}, config);