const fs = require('fs');
const BUFFER_SIZE = 256;
const buf = new Buffer(BUFFER_SIZE);
let bytes;

console.log('Please, input something:');
// eslint-disable-next-line
while (true) {
    bytes = 0;
    try {
        // eslint-disable-next-line
        bytes = fs.readSync(process.stdin.fd, buf, 0, BUFFER_SIZE, 0);
        if (bytes === 0) {
            break;
        }
        process.stdout.write(`${reverse(buf.toString('utf8', 0, bytes))  }\n`);
    } catch (error) {
        console.log(error);
    }
}

function reverse(s) {
    return s.split('').reverse().join('');
}
