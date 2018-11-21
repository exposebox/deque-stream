'use strict';

const stream = require('stream');

const DequeReadableStream = require('./deque-readable-stream');

const CHUNK_SIZE = 1024 * 4096;
const QUEUE_BUFFER_SIZE = 32 * 4096;
const MAX_IN_BYTES = 256 * 1024 * 1024;

describe('Deque readable stream', function () {
    before(function () {
        this.dataChunk = new Array(CHUNK_SIZE).fill('X').join('');
    });

    it('should pipe data', function (done) {
        this.timeout(10 * 1000);

        let inByteCounter = 0;
        let outByteCounter = 0;

        const dequeReadableStream = new DequeReadableStream({bufferSize: QUEUE_BUFFER_SIZE});

        const writeableStream = new stream.Writable({
            write(chunk, encoding, callback) {
                outByteCounter += chunk.length;

                callback();
            }
        });

        dequeReadableStream
            .on('error', done)
            .pipe(writeableStream)
            .on('error', done)
            .on('finish', () => {
                console.log({
                    inBytes: inByteCounter,
                    outBytes: outByteCounter,
                });

                done();
            });

        const writeInterval = setInterval(() => {
            dequeReadableStream.write(this.dataChunk);

            inByteCounter += this.dataChunk.length;

            if (inByteCounter > MAX_IN_BYTES) {
                dequeReadableStream.end();

                clearInterval(writeInterval);
            }
        }, 10);
    })
});