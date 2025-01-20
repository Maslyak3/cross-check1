const fs = require('fs/promises');
const { error } = require('node:console');
const path = require('node:path');

const getFolder = (nameFolder) =>
  path.join(__dirname, '..', '04-copy-directory', nameFolder);
const initialPath = path.join(__dirname, '..', '04-copy-directory');

const getPath = (currPath, name) => path.join(currPath, name);

const folder = 'files';
const folderCopy = 'files-copy';

fs.mkdir(getFolder(folderCopy), { recursive: true }).then(() => {
  console.log('Directory created successfully!');
  makeCopy(getFolder(folder), getFolder(folderCopy));
  console.log('Copy is ready');
});

function makeCopy(pathFolder, pathCopy) {
  fs.mkdir(pathCopy, { recursive: true }).then((dir) => {
    fs.readdir(pathCopy, { withFileTypes: true }).then((filenames) => {
      if (!filenames.length) {
        copyFolder(getFolder(folder), getFolder(folderCopy));
      } else {
        filenames.forEach((element) => {
          if (element.isDirectory())
            fs.rm(getPath(element.path, element.name), {
              recursive: true,
            }).then(() => copyFolder(getFolder(folder), getFolder(folderCopy)));
          else {
            if (element.path === getFolder(folderCopy)) {
              fs.unlink(
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

function copyFolder(folder, folderCopy) {
  fs.readdir(folder, { withFileTypes: true })
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
          fs.copyFile(
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
