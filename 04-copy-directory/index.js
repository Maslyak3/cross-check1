const fs = require('fs/promises');
const path = require('node:path');

const getFolder = (nameFolder) =>
  path.join(__dirname, '..', '04-copy-directory', nameFolder);

const getPath = (currPath, name) => path.join(currPath, name);

const folder = 'files';
const folderCopy = 'files-copy';

makeDir(getFolder(folderCopy));

function makeDir(path) {
  fs.mkdir(path, { recursive: true }).then((dir) => {
    if (!dir) {
      fs.readdir(path, { withFileTypes: true }).then((filenames) => {
        filenames.forEach((element) => {
          if (element.isDirectory()) {
            fs.rm(getPath(path, element.name), { recursive: true }).then(() =>
              copyFolder(getFolder(folder), getFolder(folderCopy)),
            );
          } else {
            console.log('del', element.name);
            fs.unlink(getPath(path, element.name)).then(() => {});
          }
        });
      });
    }
  });
}

function copyFolder(folder, folderCopy) {
  fs.readdir(folder, { withFileTypes: true })
    .then((filenames) => {
      filenames.forEach((element) => {
        if (element.isDirectory()) {
          makeDir(getPath(folderCopy, element.name));
          copyFolder(
            getPath(folder, element.name),
            getPath(folderCopy, element.name),
          );
        } else {
          fs.copyFile(
            path.join(folder, element.name),
            path.join(folderCopy, element.name),
          )
            .then(() => {})
            .catch((error) => console.log(error, 'err2'));
        }
      });
    })
    .catch((err) => {
      console.log(err, 'err3');
    });
}
