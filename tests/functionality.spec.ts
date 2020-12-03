const {fgMultipleHooks} = require('..');


class Mocks {
  static getFalse = () => false;
  static getTrue = () => true;
}

describe('Testing Basic Functionality of Multiple Hooks', () => {
  const req = {};
  const res = {};
  const stream = {};

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Mocks, 'getFalse');
    jest.spyOn(Mocks, 'getTrue');
  });

  it('REQUEST - should call both functions and return true', async (done) => {
    const result = await fgMultipleHooks.onRequestHooks(
      req,
      res,
      Mocks.getFalse,
      Mocks.getTrue
    );
    expect(result).toBeTruthy();
    expect(Mocks.getFalse).toHaveBeenCalledTimes(1);
    expect(Mocks.getTrue).toHaveBeenCalledTimes(1);
    done();
  });

//   it('REQUEST - should call only getFalse and return false', async (done) => {
//     const result = await fgMultipleHooks.onRequestHooks(
//       req,
//       res,
//       Mocks.getFalse,
//       Mocks.getFalse
//     );
//     expect(result).toBeFalsy();
//     expect(Mocks.getFalse).toHaveBeenCalledTimes(2);
//     expect(Mocks.getTrue).toHaveBeenCalledTimes(0);
//     done();
//   });

//   it('RESPONSE - should call default response', async (done) => {
//       jest.spyOn()
//       const result = await fgMultipleHooks.onResponseHooks(req, res, stream, false)
//   });
});
