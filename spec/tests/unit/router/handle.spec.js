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

      handle.handle(chain, response);
      expect(response.json).not.toEqual(json);

      const result = response.json('data', 'arg1', 'arg2');
      expect(json).not.toHaveBeenCalled();
      expect(response.send).toEqual(send);
      expect(result).toEqual('chain');

      chain.calls.argsFor(0)[1]('result');
      expect(json).toHaveBeenCalledWith('result', 'arg1', 'arg2');
    });
  });

  describe('.send', () => {
    it('chains the function', () => {
      const { json, send } = response;

      handle.handle(chain, response);
      expect(response.send).not.toEqual(send);

      const result = response.send('data', 'arg1', 'arg2');
      expect(send).not.toHaveBeenCalled();
      expect(result).toEqual('chain');

      chain.calls.argsFor(0)[1]('result');
      expect(send).toHaveBeenCalledWith('result', 'arg1', 'arg2');
    });

    describe('when data is an object', () => {
      it('calls .json', () => {
        const { json, send } = response;

        handle.handle(chain, response);
        const result = response.send({ some: 'data' }, 'arg1', 'arg2');
        expect(result).toEqual('chain');

        chain.calls.argsFor(0)[1]('result');
        expect(json).toHaveBeenCalledWith('result', 'arg1', 'arg2');
        expect(send).not.toHaveBeenCalled();
      });
    });

    describe('when data is a buffer', () => {
      it('does not call .json', () => {
        spyOn(Buffer, 'isBuffer').and.returnValue(true);
        const { json, send } = response;

        handle.handle(chain, response);
        response.send({ some: 'data' }, 'arg1', 'arg2');
        chain.calls.argsFor(0)[1]('result');
        expect(send).toHaveBeenCalledWith('result', 'arg1', 'arg2');
        expect(json).not.toHaveBeenCalled();
      });
    });
  });
});