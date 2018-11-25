'use strict';

const stream = require('stream');
const Deque = require('double-ended-queue');

class DequeReadableStream extends stream.Readable {
    constructor(options) {
        super(options);

        this.readingData = false;
        this.buffer = new Deque(options.bufferSize);
    }

    write(data) {
        this.buffer.push(data);

        this.startReadingData();
    }

    end() {
        this.buffer.push(null);
    }

    _read() {
        this.startReadingData()
    }

    startReadingData() {
        if (!this.readingData) {
            this.readingData = true;

            setImmediate(() => this.readData());
        }
    }

    readData() {
        const buffer = this.buffer;

        while (this.readingData) {
            const item = buffer.peekFront();

            if (item === undefined) {
                this.readingData = false;
            } else if (this.push(item)) {
                buffer.shift();
            } else {
                this.readingData = false;
            }
        }
    }
}

module.exports = DequeReadableStream;