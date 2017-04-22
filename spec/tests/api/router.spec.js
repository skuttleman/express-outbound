const axios = require('axios');
const { startApp } = require('../../support/apiHelper');

describe('Router API', () => {
  let server, apiSpy;
  beforeEach(() => {
    apiSpy = jasmine.createSpy('api spy');
    server = runApp(apiSpy, { port: 8765 });
  });

  afterEach(() => {
    server.close();
  });

  it('works with express Router()', done => {
    axios.get('http://localhost:8765/router')
      .then(({ data }) => {
        expect(data).toEqual({ some: 'router data' });
        expect(apiSpy).toHaveBeenCalledTimes(3);
        expect(apiSpy.calls.argsFor(0)).toEqual(['response']);
        expect(apiSpy.calls.argsFor(1)).toEqual(['router']);
        expect(apiSpy.calls.argsFor(2)).toEqual(['app']);
      }).then(done);
  });
});

const runApp = (apiSpy, config) => startApp(({ app, router }) => {
  router.use((request, response, next) => {
    next(data => {
      apiSpy('router');
      response.send(data);
    });
  });

  router.get('/', (request, response) => {
    apiSpy('response');
    response.json({ some: 'router data' });
  })

  app.use((request, response, next) => {
    next(data => {
      apiSpy('app');
      response.send(data);
    });
  });

  app.use('/router', router);
}, config);