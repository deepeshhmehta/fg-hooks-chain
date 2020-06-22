const multipleHooks = async (req, res, ...multipleHooks) => {
    let shouldAbort = false;
    const promises = multipleHooks.map(async onRequestHook => {
        shouldAbort = shouldAbort || await onRequestHook(req, res);
    })
    await Promise.all(promises);
    return shouldAbort;
};

module.exports = { multipleHooks };