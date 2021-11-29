const { pipeline } = require('stream');
const fs = require('fs');
const csv = require('csvtojson');

const readStream = fs.createReadStream('./csv/data_task2.csv');
const writeStream = fs.createWriteStream('result.txt');

pipeline(
    readStream,
    csv(),
    writeStream,
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Pipeline succeeded.');
        }
    }
);
