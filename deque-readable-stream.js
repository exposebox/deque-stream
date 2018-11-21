'use strict';

const stream = require('stream');
const Deque = require('double-ended-queue');

class DequeReadableStream extends stream.Readable {
    constructor(options) {
        super(options);

        this.buffer = new Deque(options.bufferSize);
    }

    write(data) {
        this.buffer.push(data);
    }

    end() {
        this.buffer.push(null);
    }

    _read() {
        this.allowPushData = true;

        this.readData();
    }

    readData() {
        const buffer = this.buffer;

        while (this.allowPushData) {
            if (buffer.isEmpty()) {
                return setImmediate(() => this.readData());
            }

            if (this.push(buffer.peekFront())) {
                buffer.shift();
            } else {
                this.allowPushData = false;
            }
        }
    }
}

module.exports = DequeReadableStream;