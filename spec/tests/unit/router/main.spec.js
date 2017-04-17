const main = require('../../../../src/router/main');
const wrap = require('../../../../src/router/wrap');

const METHODS = ['use', 'get', 'put', 'delete', 'post', 'patch', 'all', 'options'];

describe('main', () => {
  let wrapSpy, router;

  beforeEach(() => {
    wrapSpy = jasmine.createSpy('wrapSpy');
    spyOn(wrap, 'wrap').and.returnValue(wrapSpy);

    router = jasmine.createSpyObj(METHODS);
  });

  describe('when invoked', () => {
    METHODS.forEach(method => {
      it(`overwrites the "${method}" method`, () => {
        const fn = router[method];

        main(router);
        router[method]('arg1', 'arg2');

        expect(wrap.wrap).toHaveBeenCalledWith(fn);
        expect(wrapSpy).toHaveBeenCalledWith(router, 'arg1', 'arg2');
      });
    });
  });

  METHODS.forEach(method => {
    describe(`.${method}`, () => {
      it('wraps the module', () => {
        main[method](router, 'arg1', 'arg2');

        expect(wrap.wrap).toHaveBeenCalledWith(router[method]);
        expect(wrapSpy).toHaveBeenCalledWith(router, 'arg1', 'arg2');
      });
    });
  });
});
