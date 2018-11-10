#!/usr/bin/env node

const fs = require('fs-extra');
const resolve = require('path').resolve;
const cwd = process.cwd();
const copyPath = resolve(__dirname, 'copy');
const argv = process.argv.splice(2);
const git = argv[0];
const name = git.split('/')[1];
const oldGit = 'ymzuiku/old-name';

fs.copySync(copyPath, cwd);
console.log('copy done:', name);

const package = require(copyPath + '/package.json');
package.name = name;
package.repository.url = package.repository.url.replace(oldGit, git);
package.bugs.url = package.repository.url.replace(oldGit, git);
package.homepage = package.repository.url.replace(oldGit, git);
fs.writeJson(cwd+'/package.json', package);
