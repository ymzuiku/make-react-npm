#!/usr/bin/env node

const argv = process.argv.splice(2);
const kind = argv[0];
const name = argv[1];

const fs = require('fs-extra');
const resolve = require('path').resolve;
const cwd = process.cwd();
const targetPath = resolve(cwd, name);
const reactPath = resolve(__dirname, 'react');
const readmeFile = resolve(__dirname, './README.md');
const nextPath = resolve(__dirname, 'next');

function makeProject(copyPath) {
  const isHaveDir = fs.existsSync(targetPath);
  if (isHaveDir) {
    console.log(`Error: ${cwd}/${name} is exists`);
  } else {
    fs.mkdir(targetPath);
    fs.copySync(copyPath, targetPath);
    fs.copySync(readmeFile, targetPath + '/README.md');

    const package = require(reactPath + '/package.json');
    package.name = name;
    const oldGit = 'old-repleat-name';
    if (package.repository && package.repository.url) {
      package.repository.url = package.repository.url.replace(oldGit, name);
    }
    if (package.bugs && package.bugs.url) {
      package.bugs.url = package.bugs.url.replace(oldGit, name);
    }
    if (package.homepage) {
      package.homepage = package.homepage.replace(oldGit, name);
    }
    fs.writeJSONSync(resolve(targetPath, 'package.json'), package, {
      spaces: 2,
    });
    console.log(' ');
    console.log('Create react project done:', resolve(process.cwd(), name));
    console.log(`Please "cd ${resolve(process.cwd(), name)}" , and run "yarn install"`);
    console.log(' ');
  }
}

if (kind === 'react') {
  makeProject(reactPath);
} else if (kind === 'next') {
  makeProject(nextPath);
} else {
  console.log(' ');
  console.log('Error: Please input project type: react | next, like:');
  console.log('make-react-npm react your-project');
  console.log(' ');
}
