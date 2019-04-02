const handler = require('../../../../src/router/handler');

describe('handler', () => {
  let chain, response, next;
  beforeEach(() => {
    chain = jasmine.createSpy('chainSpy').and.returnValue('chain');
    response = jasmine.createSpyObj(['json', 'send']);
    next = jasmine.createSpy('nextSpy')
  });

  describe('when chain is not a function', () => {
    it('calls next', () => {
      handler('response', next)('chain');

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith('chain');
    });
  });

  describe('.json', () => {
    it('chains the function', () => {
      const { json, send } = response;

      handler(response, () => null)(chain);
      expect(response.json).not.toEqual(json);

      const result = response.json('data');
      expect(json).not.toHaveBeenCalled();
      expect(response.send).toEqual(send);
      expect(result).toEqual('chain');

      response.json('result');
      expect(json).toHaveBeenCalledWith('result');
    });
  });

  describe('.send', () => {
    it('chains the function', () => {
      const { json, send } = response;

      handler(response, () => null)(chain);
      expect(response.send).not.toEqual(send);

      const result = response.send('data');
      expect(send).not.toHaveBeenCalled();
      expect(result).toEqual('chain');

      response.send('result');
      expect(send).toHaveBeenCalledWith('result');
    });
  });
});
