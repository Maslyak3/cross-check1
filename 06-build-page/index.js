const fs = require('fs');
const fspromises = require('fs/promises');
const path = require('node:path');

const styleFolder = path.join(__dirname, '..', '06-build-page', 'styles');
const targetFolder = path.join(
  __dirname,
  '..',
  '06-build-page',
  'project-dist',
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
const writerStyle = fs.createWriteStream(path.join(targetFolder, 'style.css'));

fs.mkdir(targetFolder, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
  assembleTemplate();
  copyAssets(assetsFolder, assetsTarget);
  copyStyles(styleFolder);
});

//assemble template

function assembleTemplate() {
  const regTemplate = /{{.+?}}/g;
  const readStream = fs.createReadStream(templateHTML);
  readStream.on('data', (chunk) => {
    //const temp = chunk.toString();
    const components = chunk.toString().match(regTemplate);
    addComponents(chunk, components);
  });

  readStream.on('error', (error) => console.log(error.message));
  readStream.on('end', () => {
    console.log('HTML assemble finished');
    readStream.close();
  });
}

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

//assets copy

function copyAssets(assetsFolder, assetsTarget) {
  makeCopy(assetsFolder, assetsTarget);
  console.log('Coping the fiiles finished');
}

function makeCopy(pathFolder, pathCopy) {
  fspromises.mkdir(pathCopy, { recursive: true }).then((dir) => {
    fspromises.readdir(pathCopy, { withFileTypes: true }).then((filenames) => {
      if (!filenames.length) {
        copyFolder(assetsFolder, assetsTarget);
      } else {
        filenames.forEach((element) => {
          if (element.isDirectory()) {
            fspromises
              .rm(getPath(element.path, element.name), { recursive: true })
              .then(() => copyFolder(assetsFolder, assetsTarget));
          } else {
            if (element.path === assetsTarget) {
              fspromises.unlink(
                getPath(element.path, element.name),
                {
                  recursive: true,
                },
                (error) => {
                  console.log('no such', element.name);
                },
              );
            }
          }
        });
      }
    });
  });
}

//gather style

function copyFolder(folder, folderCopy) {
  fspromises
    .readdir(folder, { withFileTypes: true })
    .then((filenames) => {
      filenames.forEach((element) => {
        if (element.isDirectory()) {
          makeCopy(
            getPath(folder, element.name),
            getPath(folderCopy, element.name),
          );
          copyFolder(
            getPath(folder, element.name),
            getPath(folderCopy, element.name),
          );
        } else {
          fspromises
            .copyFile(
              path.join(folder, element.name),
              path.join(folderCopy, element.name),
            )
            .then(() => {})
            .catch((error) => console.log(error));
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

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
            readStream.on('data', (chunk) =>
              writerStyle.write(chunk.toString()),
            );
            readStream.on('error', (error) => console.log(error.message));
            readStream.on('end', () => readStream.close());
          }
        } else {
          copyStyles(path.join(element.path, element.name));
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  console.log('Styles coping styles finished');
}
