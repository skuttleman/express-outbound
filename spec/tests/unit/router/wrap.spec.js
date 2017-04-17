const apply = require('../../../../src/router/apply');
const wrap = require('../../../../src/router/wrap');

describe('wrap', () => {
  let fn;
  beforeEach(() => {
    fn = jasmine.createSpy('fn spy').and.returnValue('fn spy');
    spyOn(apply, 'apply').and.returnValue('applied');
  });

  it('returns the value returned by the router method', () => {
    const result = wrap.wrap(fn)('router');

    expect(result).toEqual('fn spy');
  });

  it('uses the router as method context', () => {
    spyOn(fn, 'apply').and.callThrough();
    const middleware = () => null;

    wrap.wrap(fn)('router', middleware);

    expect(fn).toHaveBeenCalledWith(jasmine.any(Function));
    expect(fn.apply).toHaveBeenCalledWith('router', [jasmine.any(Function)]);
  });

  it('flattens middlewares', () => {
    wrap.wrap(fn)('router', [[() => null], [[() => null]], () => null, []]);

    expect(fn).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), jasmine.any(Function));
  });

  it('filters out arguments that are not functions', () => {
    wrap.wrap(fn)('router', () => null, null, 'something', 137, [], () => null);

    expect(fn).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
  });

  it('retains the path', () => {
    wrap.wrap(fn)('router', 'path', () => null);

    expect(fn).toHaveBeenCalledWith('path', jasmine.any(Function));
  });

  it('uses middlewares as is when they take four arguments', () => {
    const middleware = (a, b, c, d) => null;

    wrap.wrap(fn)('router', middleware);

    expect(fn).toHaveBeenCalledWith(middleware);
  });

  it('applies the chain to the third argument', () => {
    const spy = jasmine.createSpy('spy');
    const middleware = (a, b, c) => spy(a, b, c);

    wrap.wrap(fn)('router', middleware);
    fn.calls.argsFor(0)[0]('request', 'response', 'next');

    expect(apply.apply).toHaveBeenCalledWith('response', 'next');
    expect(spy).toHaveBeenCalledWith('request', 'response', 'applied');
  });
});