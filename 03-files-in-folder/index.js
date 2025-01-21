const fs = require('node:fs/promises');
const path = require('node:path');

const getPathFolder = () => path.join(__dirname, 'secret-folder');
const getPathFile = (file) => path.join(__dirname, 'secret-folder', '/', file);

function getSize(size) {
  if (size < 1024) return `${size}b`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(3)}kb`;
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(3)}mb`;
  if (size < 1024 ** 4) return `${(size / 1024 ** 3).toFixed(3)}gb`;
}

const formatStr = (name, extension, size, last = false) =>
  `File: ${name.slice(
    0,
    -(extension.length + 1),
  )}\nExtension: ${extension}\nSize: ${size}\n*******\n`;

function fileInfo(file, extension) {
  fs.stat(getPathFile(file))
    .then((data) => {
      //console.log(data);
      console.log(formatStr(file, extension, getSize(data.size)));
    })
    .catch((err) => {
      console.log(err);
    });
}

fs.readdir(getPathFolder(), { withFileTypes: true })
  .then((filenames) => {
    filenames
      .filter((item) => item.isFile())
      .forEach((element, index) =>
        fileInfo(element.name, path.extname(element.name).slice(1)),
      );
  })
  .catch((err) => {
    console.log(err);
  });
