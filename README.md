# Deque Stream :zap:

Stream powered by Deque circular queue for blazing fast performance

### Installing

````bash
npm install deque-stream
````

## Example

```javascript
const dequeReadableStream = new DequeReadableStream({bufferSize: 16 * 4096});

// Use .write(data) to populate the read stream
dequeReadableStream.write('chunk of data');
```

See more detailed example at ```./test.js```

## License

This project is licensed under the ISC License - see the [ISC License](https://opensource.org/licenses/ISC) file for details