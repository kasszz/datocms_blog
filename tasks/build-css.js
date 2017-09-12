const chalk = require('chalk');
const sass = require('node-sass');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

const inputFile = 'src/index.scss';
const outputFile = 'dist/assets/css/index.css';

sass.render({
  file: inputFile,
  outputFile: outputFile,
  outputStyle: 'compressed',
  sourceMap: true,
  sourceMapContents: true
}, (err, result) => {
  if (err) console.log(chalk.red(err));

  createDir(result)
    .then(writeFile)
    .catch(err => console.log(chalk.red(err)));
});

function createDir(result) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(outputFile), err => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

function writeFile(result) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputFile, result.css, err => {
      if (err) reject(err);
      console.log(result);
      resolve();
    });
  });
}
