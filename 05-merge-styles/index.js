const fs = require('fs');
const fspromises = require('fs/promises');
const path = require('node:path');

const styleFolder = path.join(__dirname, '..', '05-merge-styles', 'styles');
const targetFolder = path.join(
  __dirname,
  '..',
  '05-merge-styles',
  'project-dist',
);
const writer = fs.createWriteStream(path.join(targetFolder, 'bundle.css'));

copyStyles(styleFolder);

function copyStyles(folder) {
  fspromises
    .readdir(folder, { withFileTypes: true })
    .then((filenames) => {
      filenames.forEach((element) => {
        if (element.isFile()) {
          if (path.extname(element.name) === '.css') {
            const readStream = fs.createReadStream(
              path.join(element.path, element.name),
            );
            readStream.on('data', (chunk) => writer.write(chunk.toString()));
            readStream.on('error', (error) => console.log(error.message));
            readStream.on('end', () => {
              console.log(`${element.name} coping styles finished`);
              readStream.close();
            });
          }
        } else {
          copyStyles(path.join(element.path, element.name));
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
