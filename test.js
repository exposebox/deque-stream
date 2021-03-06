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
        let inByteCounter = 0;
        let outByteCounter = 0;

        const dequeReadableStream = new DequeReadableStream({bufferSize: QUEUE_BUFFER_SIZE});

        const writeableStream = new stream.Writable({
            write(chunk, encoding, callback) {
                outByteCounter += chunk.length;

                callback();
            }
        });

        stream.pipeline(dequeReadableStream, writeableStream, err => {
            if (err) return done(err);

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
    });

    it('should keep data in order', function (done) {
        let inCounter = 0;
        let outCounter = 0;

        const dequeReadableStream = new DequeReadableStream({bufferSize: QUEUE_BUFFER_SIZE});

        const writeableStream = new stream.Writable({
            write(chunk, encoding, callback) {
                outCounter++;

                if (parseInt(chunk) !== outCounter) {
                    done(new Error(`chunk (${chunk}) !== outCounter (${outCounter})`));
                } else {
                    callback();
                }
            }
        });

        stream.pipeline(dequeReadableStream, writeableStream, err => {
            if (err) return done(err);

            console.log({
                inCounter,
                outCounter
            });

            done();
        });

        const writeInterval = setInterval(() => {
            for (let i = 0; i < 10000; i++) {
                dequeReadableStream.write((++inCounter).toString());
            }

            if (inCounter > 500000) {
                dequeReadableStream.end();

                clearInterval(writeInterval);
            }
        }, 10);
    })
});