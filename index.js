'use strict'

const pump = require('pump')
const toArray = require('stream-to-array');
const TRANSFER_ENCODING_HEADER_NAME = 'transfer-encoding'

const onRequestHooks = async (req, res, ...multipleHooks) => {
    let shouldAbort = false;
    const promises = multipleHooks.map(async oneHook => {
        shouldAbort = shouldAbort || await oneHook(req, res);
    })
    await Promise.all(promises);
    return shouldAbort;
};

const sendTheStreamUntouched = async (req, res, stream) => {
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

const onResponseHooks = async (req, res, stream, last, ...multipleHooks) => {
    let shouldAbort = false;
    const promises = multipleHooks.map(async oneHook => {
        shouldAbort = shouldAbort || await oneHook(req, res);
    })
    await Promise.all(promises);
    if (!shouldAbort) {
        if (!!last) {
            last(req, res, stream);
        } else {
            sendTheStreamUntouched(req, res, stream);
        }
    } else {
        res.statusCode = 500;
        console.error('On Response Hook Failed')
        res.end('On Response Hook Failed');
    }
};

const fgMultipleHooks = {};
fgMultipleHooks.onRequestHooks = onRequestHooks;
fgMultipleHooks.onResponseHooks = onResponseHooks;

module.exports = fgMultipleHooks;
