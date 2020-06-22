const multipleHooks = async (req, res, ...multipleHooks) => {
    let shouldAbort = false;
    multipleHooks.forEach(async onRequestHook => {
        const thisHookAborts = await onRequestHook(req, res);
        shouldAbort = shouldAbort || thisHookAborts;
    });
    return shouldAbort;
};

module.exports = { multipleHooks };