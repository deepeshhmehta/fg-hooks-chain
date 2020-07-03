
describe('Testing Basic Functionality of Multiple Hooks', () => {
    const fun1 = () => {
        //does something
        return false;
    }

    const fun2 = () => {
        //does something else
        return true;
    }

    const req = {};
    const res = {};
    let multipleHooks;
    let master = {
        fun1,
        fun2,
    }

    beforeEach(() => {
        master = {
            fun1,
            fun2
        }
        jest.spyOn(master, 'fun1')
        jest.spyOn(master, 'fun2')
        multipleHooks = require('../index');
        
    })

    it('should call both functions and return true', async (done) => {
        const result = await multipleHooks(req, res, master.fun1, master.fun2)
        expect(result).toBeTruthy();
        expect(master.fun1).toHaveBeenCalledTimes(1);
        expect(master.fun2).toHaveBeenCalledTimes(1);
        done();
    })

    it('should call only fun1 and return false', async (done) => {
        const result = await multipleHooks(req, res, master.fun1)
        expect(result).toBeFalsy();
        expect(master.fun1).toHaveBeenCalledTimes(1);
        expect(master.fun2).toHaveBeenCalledTimes(0);
        done();
    })

})