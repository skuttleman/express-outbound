const proxyquire = require('proxyquire');

describe('apply', () => {
  let apply, next, proxy;
  beforeEach(() => {
    proxy = {
      './handle': jasmine.createSpy('handle')
    };
    apply = proxyquire('../../../../src/router/apply', proxy);

    next = jasmine.createSpy('nextSpy');
  });

  it('calls next', () => {
    apply('response', next)('chain');

    expect(proxy['./handle']).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('chain');
  });

  it('handles the input when it is a function', () => {
    const chain = () => null;

    apply('response', next)(chain);

    expect(proxy['./handle']).toHaveBeenCalledWith(chain, 'response');
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});