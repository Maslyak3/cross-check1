const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');

const getPath = (fileName) =>
  path.join(__dirname, '..', '02-write-file', fileName);

const recordFinish = (interface) => {
  console.log('The recording write proses finished.');
  interface.close();
};

const fullName = getPath('text.txt');

const writer = fs.createWriteStream(fullName);

const interface = readline.createInterface(process.stdin, writer);

console.log(
  'Please input something to write in file. To stop the input use exit',
);

interface.on('line', (str) => {
  /* Check if line include exit.

    if (str.toLowerCase().includes('exit')) {
    const index = str.toLowerCase().indexOf('exit');
    writer.write(str.slice(0, index));
    recordFinish(interface);
    return;
  } */
  // if line === exit
  if (str.toLowerCase() === 'exit') {
    recordFinish(interface);
    return;
  }
  writer.write(str + '\n');
});

process.on('SIGINT', () => recordFinish(interface));
