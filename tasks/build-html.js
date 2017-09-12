const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const glob = require('glob');
const chalk = require('chalk');
const mkdirp = require('mkdirp');

const dataFolder = 'data';
const distFolder = 'dist';
const jsonSelector = '/**/*.json';

nunjucks.configure('src/views');

glob(path.join(dataFolder, jsonSelector), (err, filePaths) => {
  if (err) console.log(chalk.red(err));

  filePaths.forEach(filePath => {
    const filePathObj = path.parse(filePath);

    createDir(filePathObj)
      .then(readData)
      .then(generateHtml)
      .then(writeFile)
      .catch(err => console.log(chalk.red(err)));
  });
});

function createDir(filePathObj) {
  return new Promise((resolve, reject) => {
    const dir = removeDataFolderFromDir(filePathObj.dir);

    mkdirp(path.join(distFolder, dir), err => {
      if (err) reject(err);


      resolve(filePathObj);
    });
  });
}

function readData(filePathObj) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(filePathObj.dir, filePathObj.base), (err, data) => {
      if (err) reject(err);
      filePathObj.data = JSON.parse(data);

      resolve(filePathObj);
    });
  });
}

function generateHtml(filePathObj) {
  return new Promise((resolve, reject) => {
    const dir = removeDataFolderFromDir(filePathObj.dir);

    let templateName = '';

    if (dir) {
      templateName = dir;
    } else {
      templateName = filePathObj.name;
    }

    nunjucks.render(`${templateName}.html`, (err, html) => {
      if (err) reject(err);
      filePathObj.html = html;

      resolve(filePathObj);
    });
  });
}

function writeFile(filePathObj) {
  return new Promise((resolve, reject) => {
    const dir = removeDataFolderFromDir(filePathObj.dir);

    if (filePathObj.name === 'home') {
      filePathObj.name = 'index';
    }

    fs.writeFile(path.join(distFolder, dir, `${filePathObj.name}.html`), filePathObj.html, err => {
      if (err) reject(err);

      resolve(filePathObj);
    });
  });
}

function removeDataFolderFromDir(path) {
  return path
    .split('/')
    .filter(foldername => foldername !== dataFolder)
    .join('/');
}
