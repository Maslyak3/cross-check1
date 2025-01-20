const fs = require('fs');
const fspromises = require('fs/promises');
const path = require('node:path');
const { fileURLToPath } = require('node:url');

const styleFolder = path.join(__dirname, '..', '06-build-page', 'styles');
const targetFolder = path.join(
  __dirname,
  '..',
  '06-build-page',
  //'project-dist',
  't',
);
const templateHTML = path.join(
  __dirname,
  '..',
  '06-build-page',
  'template.html',
);
const componentsHTML = path.join(
  __dirname,
  '..',
  '06-build-page',
  'components',
);

const assetsFolder = path.join(__dirname, '..', '06-build-page', 'assets');
const assetsTarget = path.join(
  __dirname,
  '..',
  '06-build-page',
  'project-dist',
  'assets',
);

const getPath = (pathFile, name) => path.join(pathFile, name);

const regTemplate = /{{.+?}}/g;

const readStream = fs.createReadStream(templateHTML);
readStream.on('data', (chunk) => {
  const temp = chunk.toString();
  const components = chunk.toString().match(regTemplate);
  addComponents(chunk, components);
});
readStream.on('error', (error) => console.log(error.message));
readStream.on('end', () => {
  //console.log(`${element.name} coping styles finished`);
  readStream.close();
});

function addComponents(template, components) {
  let result = template.toString();
  let curr = '';
  fspromises
    .readdir(componentsHTML, { withFileTypes: true })
    .then((filenames) => {
      filenames.forEach((element) => {
        if (element.isFile() && path.extname(element.name) === '.html') {
          components.forEach((item) => {
            if (item.slice(2, -2) === element.name.slice(0, -5)) {
              const readComponents = fs.createReadStream(
                getPath(element.path, element.name),
              );
              readComponents.on('data', (chunk) => {
                curr = result.replace(item, chunk.toString());
                result = curr;
                const writer = fs.createWriteStream(
                  path.join(targetFolder, 'index.html'),
                );
                writer.write(result);
              });
            }
          });
        }
      });
    });
}

console.log(`styleFolder ${styleFolder}
targetFolder ${targetFolder}
templateHTML ${templateHTML}
assetsFolder ${assetsFolder}
assetsTarget ${assetsTarget}
`);

/*
const str = '1, 2, 3, 4';
const regex = /\d+/g;
const matches = str.match(regex);
console.log(matches); // ['1', '2', '3', '4']
*/

/*const fs = require('fs');
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
  console.log(folder);
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
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
*/
