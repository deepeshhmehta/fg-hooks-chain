'use strict'

const pump = require('pump')
const toArray = require('stream-to-array');
const TRANSFER_ENCODING_HEADER_NAME = 'transfer-encoding'

const onRequestHooks = async (req, res, ...multipleHooks) => {
    // Used to terminate the hooks
    let shouldAbort = false;

    // Iterate and check logical condition of each hook
    const promises = multipleHooks.map(async onRequestHook => {
        shouldAbort = shouldAbort || await onRequestHook(req, res);
    })
    await Promise.all(promises);
    
    // If we return true, the the hook stops the flow at 'fast-gateway'
    return !!shouldAbort;
};

const defaultOnResponseHook = async (req, res, stream) => {
    // Default handling for stream copied from 'fast-gateway'
    const chunked = stream.headers[TRANSFER_ENCODING_HEADER_NAME]
        ? stream.headers[TRANSFER_ENCODING_HEADER_NAME].endsWith('chunked')
        : false

    if (req.headers.connection === 'close' && chunked) {
        try {
            // remove transfer-encoding header
            const transferEncoding = stream.headers[TRANSFER_ENCODING_HEADER_NAME].replace(/(,( )?)?chunked/, '')
            if (transferEncoding) {
                // header format includes many encodings, example: gzip, chunked
                res.setHeader(TRANSFER_ENCODING_HEADER_NAME, transferEncoding)
            } else {
                res.removeHeader(TRANSFER_ENCODING_HEADER_NAME)
            }

            if (!stream.headers['content-length']) {
                // pack all pieces into 1 buffer to calculate content length
                const resBuffer = Buffer.concat(await toArray(stream))

                // add content-length header and send the merged response buffer
                res.setHeader('content-length', '' + Buffer.byteLength(resBuffer))
                res.statusCode = stream.statusCode
                res.end(resBuffer)
            }
        } catch (err) {
            res.statusCode = 500
            res.end(err.message)
        }
    } else {
        res.statusCode = stream.statusCode
        pump(stream, res)
    }
}

const onResponseHooks = async (req, res, stream, useDefaultHook, ...multipleHooks) => {
    // To be used to abort the request
    let shouldAbort = false;
    
    // run through logical block of each hook
    const promises = multipleHooks.map(async onResponseHook => {
        shouldAbort = shouldAbort || await onResponseHook(req, res, stream);
    })
    
    await Promise.all(promises);
    if (!!shouldAbort) {
        res.statusCode = 500;
        console.error('On Response Hook Failed')
        res.end('On Response Hook Failed');
        return;
    }
    
    if (!!useDefaultHook) {
        // Handle default connection close scenario
        defaultOnResponseHook(req, res, stream);
        return;
    }

    // else Simple Stream
    res.statusCode = stream.statusCode
    pump(stream, res)
};

const fgMultipleHooks = {};
fgMultipleHooks.onRequestHooks = onRequestHooks;
fgMultipleHooks.onResponseHooks = onResponseHooks;

module.exports = { fgMultipleHooks };
