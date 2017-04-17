const apply = require('../../../../src/router/apply');
const handle = require('../../../../src/router/handle');

describe('apply', () => {
  let next;
  beforeEach(() => {
    spyOn(handle, 'handle');
    next = jasmine.createSpy('nextSpy');
  });

  it('calls next', () => {
    apply.apply('response', next)('chain');

    expect(handle.handle).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('chain');
  });

  it('handles the input when it is a function', () => {
    const chain = () => null;

    apply.apply('response', next)(chain);

    expect(handle.handle).toHaveBeenCalledWith(chain, 'response');
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});