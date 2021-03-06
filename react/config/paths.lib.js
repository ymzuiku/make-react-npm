/**
 * 在项目根路径创建一个 .libconfig.js 文件
 * 运行 node scripts/build.lib.js
 * 即可对路径中的文件逐个进行编译
 */

const path = require('path');
const fs = require('fs-extra');
const url = require('url');
const rootPath = path.resolve(__dirname, '../');

function message(msg, isError) {
  console.warn('');
  if (isError) {
    console.warn('Error:');
  }
  console.warn(msg);
  console.warn('');
}

let libConfig = { lib: {}, dontLib: {} };
const libConfigPath = path.resolve(rootPath, '.libconfig.js');

if (!fs.existsSync(libConfigPath)) {
  fs.writeFileSync(
    libConfigPath,
    `module.exports = {
  lib: [], // need babel files or dirs
  dontLib: [],  // dont babel files or dirs
  copy: [], // only copy files or dirs
  delete: [], // after copy builded, delete files
  sourceMap: true, // Is create sourceMap
};`,
  );
}

let libFile = require(libConfigPath);

if (!libFile.lib || libFile.lib.length === 0) {
  message('Please set lib array in .fixInterfaceApisConfig.js', true);
  return;
}

if (!libFile.dontLib) {
  message('Please set dontLib array in .fixInterfaceApisConfig.js', true);
  return;
}

if (!libFile.copy) {
  message('Please set copy array in .fixInterfaceApisConfig.js', true);
  return;
}

for (let i = 0; i < libFile.lib.length; i++) {
  let fileName = libFile.lib[i];
  let outName = true;
  if (fileName && fileName.search(/\?/) > -1) {
    const fileNameList = fileName.split('?');
    fileName = fileNameList[0];
    outName = fileNameList[1];
  }
  libConfig.lib[path.resolve(rootPath, fileName)] = outName;
}

for (let i = 0; i < libFile.dontLib.length; i++) {
  libConfig.dontLib[path.resolve(rootPath, libFile.dontLib[i])] = true;
}

// 递归 src/, 如果有 *.lib.js 的文件就添加到lib编译中, 请确保 *.lib.js 不要重名
// index.lib.js 为库的默认main文件
// 如果文件夹包含 .lib 就会把文件夹拷贝到输出目录
// 读取根目录的 .libconfig.js 文件，文件返回一个数组，数组的路径如果满足以上规则也会进行编译

const entryList = {};
const copyList = {};
for (let i = 0; i < libFile.copy.length; i++) {
  const str = libFile.copy[i];
  if (str.search(/\//) > -1) {
    const list = str.split('/');
    copyList[list[0]] = path.resolve(rootPath, list[1]);
  } else {
    copyList[str] = path.resolve(rootPath, str);
  }
}
function loadAllEnters(rootP) {
  const ignoreFiles = {
    '.DS_Store': true,
  };
  function loadFiles(p, isReal = false) {
    const libList = fs.readdirSync(p);
    for (let i = 0; i < libList.length; i++) {
      const v = libList[i];
      const vp = p + '/' + v;
      if (ignoreFiles[v]) {
        continue;
      }

      const stat = fs.statSync(vp);
      if (stat && stat.isDirectory()) {
        // 如果匹配 isReal === 0, 所有子层级不进行抽离
        if (isReal === 0) {
          loadFiles(vp, 0);
        }
        // 如果匹配 isReal === * 所有子层级都抽离
        else if (isReal === '*') {
          loadFiles(vp, '*');
        }
        // 如果匹配 dontLib, 不进行抽离
        else if (libConfig.dontLib[vp + '/*']) {
          loadFiles(vp, 0);
        } else if (libConfig.dontLib[vp]) {
          loadFiles(vp, false);
        }
        // 如果匹配 lib, 进行抽离
        else if (libConfig.lib[vp + '/*']) {
          loadFiles(vp, '*');
        } else if (libConfig.lib[vp]) {
          loadFiles(vp, true);
        }
        // 如果文件夹名字包含 .lib 进行抽离
        else if (v.search(/\.lib/) > 0) {
          loadFiles(vp, true);
        }
        // 以上不满足，此文件夹不进行抽离
        else {
          loadFiles(vp, false);
        }
      } else {
        // 如果isReal，并且 dotLib 中没有这个文件, 不管文件名有没有包含 .lib 都进行抽离文件
        if (v.search(/\.nolib/) > -1) {
          // 如果文件名包含 nolib 不抽出
        } else if (isReal && !libConfig.dontLib[vp]) {
          if (v.search(/\.js/) > -1) {
            const vlist = v.split('.');
            entryList[vlist[0]] = vp;
          } else if (v.search(/\.d\.ts/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.d.ts'] = vp;
          } else if (v.search(/\.less/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.less'] = vp;
          } else if (v.search(/\.scss/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.scss'] = vp;
          } else if (v.search(/\.css/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.css'] = vp;
          }
        }
        // 如果 .libconfig.js 中直接包含了文件，也进行抽离
        else if (libConfig.lib[vp]) {
          const vlist = v.split('.');
          if (typeof libConfig.lib[vp] === 'string') {
            entryList[libConfig.lib[vp]] = vp;
          } else {
            entryList[vlist[0]] = vp;
          }
        }
        // 如果以上条件不满足，但是文件名中包含 .lib 进行抽离
        else {
          if (v.search(/\.lib\.js/) > -1) {
            const vlist = v.split('.');
            entryList[vlist[0]] = vp;
          } else if (v.search(/\.lib\.d\.ts/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.d.ts'] = vp;
          } else if (v.search(/\.lib\.less/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.less'] = vp;
          } else if (v.search(/\.lib\.scss/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.scss'] = vp;
          } else if (v.search(/\.lib\.css/) > -1) {
            const vlist = v.split('.');
            copyList[vlist[0] + '.css'] = vp;
          }
        }
      }
    }
  }
  loadFiles(rootP, libConfig.lib[rootP] !== undefined);
}
loadAllEnters(path.resolve(__dirname, '../src'));

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension => fs.existsSync(resolveFn(`${filePath}.${extension}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  entryList,
  copyList,
  libFile,
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
