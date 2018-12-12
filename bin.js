#!/usr/bin/env node

const fs = require("fs-extra");
const resolve = require("path").resolve;
const cwd = process.cwd();
const reactPath = resolve(__dirname, "react");
const nextPath = resolve(__dirname, "next");
const argv = process.argv.splice(2);
const kind = argv[0];

if (kind === "react") {
  const git = argv[1];
  const name = git.split("/")[1];
  const oldGit = "ymzuiku/old-name";

  const isHaveDir = fs.existsSync(cwd + "/" + name);
  if (isHaveDir) {
    console.log(`Error: ${cwd}/${name} is exists`);
  } else {
    fs.mkdir(cwd + "/" + name);
    fs.copySync(reactPath, cwd + "/" + name);

    const package = require(reactPath + "/package.json");
    package.name = name;
    if (package.repository && package.repository.url) {
      package.repository.url = package.repository.url.replace(oldGit, git);
    }
    if (package.bugs && package.bugs.url) {
      package.bugs.url = package.bugs.url.replace(oldGit, git);
    }
    if (package.homepage) {
      package.homepage = package.homepage.replace(oldGit, git);
    }
    fs.writeJSONSync(cwd + "/" + name + "/package.json", package, {
      spaces: 2
    });
    console.log("Create react project done:", name);
  }
} else if (kind === "next") {
  const name = argv[1];
  const isHaveDir = fs.existsSync(name);
  if (isHaveDir) {
    console.log(`Error: ${name} is exists`);
  } else {
    fs.mkdir(name);
    fs.copySync(nextPath, name);

    const package = require(nextPath + "/package.json");
    package.name = name;
    fs.writeJSONSync(name + "/package.json", package, { spaces: 2 });
    console.log("Create next project done:", name);
  }
}
