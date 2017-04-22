const proxyquire = require('proxyquire');

const { METHODS } = require('../../../../src/config');

describe('main', () => {
  let main, router, proxy, wrapSpy;
  const express = () => router;
  express.Router = () => router;

  beforeEach(() => {
    wrapSpy = jasmine.createSpy('wrapSpy');
    proxy = {
      './wrap': jasmine.createSpy('wrap').and.returnValue(wrapSpy)
    };
    main = proxyquire('../../../../src/router/main', proxy);
    router = jasmine.createSpyObj(METHODS);
  });

  describe('when invoked', () => {
    METHODS.forEach(method => {
      it(`overwrites the "${method}" method`, () => {
        const fn = router[method];

        main(express);
        router[method]('arg1', 'arg2');

        expect(proxy['./wrap']).toHaveBeenCalledWith(fn);
        expect(wrapSpy).toHaveBeenCalledWith(router, 'arg1', 'arg2');
      });
    });
  });
});
