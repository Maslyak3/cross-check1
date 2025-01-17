const path = require('node:path');
const fs = require('node:fs');

const getPath = (fileName) =>
  path.join(__dirname, '..', '01-read-file', fileName);

const fullName = getPath('text.txt');

const stream = fs.createReadStream(fullName);
stream.on('data', (chunk) => console.log(chunk.toString()));
stream.on('error', (error) => console.log(error.message));
stream.on('end', () => stream.close());
