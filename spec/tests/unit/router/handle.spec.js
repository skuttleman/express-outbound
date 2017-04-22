const handle = require('../../../../src/router/handle');

describe('handle', () => {
  let chain, response;
  beforeEach(() => {
    chain = jasmine.createSpy('chainSpy').and.returnValue('chain');
    response = jasmine.createSpyObj(['json', 'send']);
  });

  describe('.json', () => {
    it('chains the function', () => {
      const { json, send } = response;

      handle(chain, response);
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

      handle(chain, response);
      expect(response.send).not.toEqual(send);

      const result = response.send('data');
      expect(send).not.toHaveBeenCalled();
      expect(result).toEqual('chain');

      response.send('result');
      expect(send).toHaveBeenCalledWith('result');
    });
  });
});