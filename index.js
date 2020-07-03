const fgMultipleHooks = async (req, res, ...multipleHooks) => {
    let shouldAbort = false;
    const promises = multipleHooks.map(async oneHook => {
        shouldAbort = shouldAbort || await oneHook(req, res);
    })
    await Promise.all(promises);
    return shouldAbort;
};

module.exports = fgMultipleHooks;