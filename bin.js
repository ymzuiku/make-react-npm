#!/usr/bin/env node

const fs = require('fs-extra');
const resolve = require('path').resolve;
const cwd = process.cwd();
const copyPath = resolve(__dirname, 'copy');
const argv = process.argv.splice(2);
const git = argv[0];
const name = git.split('/')[1];
const oldGit = 'ymzuiku/old-name';

const isHaveDir = fs.existsSync(cwd + '/' + name);
if (isHaveDir) {
  console.log(`Error: ${cwd}/${name} is exists`);
} else {
  fs.mkdir(cwd + '/' + name);
  fs.copySync(copyPath, cwd + '/' + name);

  const package = require(copyPath + '/package.json');
  package.name = name;
  package.repository.url = package.repository.url.replace(oldGit, git);
  package.bugs.url = package.repository.url.replace(oldGit, git);
  package.homepage = package.repository.url.replace(oldGit, git);
  const jsonformat = JSON.stringify(package, null, 2);
  fs.writeFile(cwd + '/' + name + '/package.json', jsonformat);

  console.log('Create project done:', name);
}
