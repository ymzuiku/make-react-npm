## 痛点

如果你平时想发布一个自己的 React 组件，发现它并没有和发布其他 JavaScript 库一样简单，首先它得对 JSX 进行转化，并且得使用 babel 把语法转化为 ES3，还得忽略掉一些项目里已用到的库，如 react、react-dom 等等，还得编写 TypeScript 声明文件。

天啊，我只是想把一个组件抽离到 module 中，为什么需要配置这么多琐事？

这个脚手架就是做以上的事情，它非常简单，仅仅是帮我们生成了一个已经配置好的webpack的项目，我们编写完代码，根据约定抽离指定的代码，编译并发布到 [npmjs.com](https://www.npmjs.com/) 即可。


## 安装

```js
npm i -g make-react-npm
```

## 使用脚手架创建 React 组件库


创建 React 项目的命令是 `make-react-npm react <仓库名>`。

创建 Next 项目的命令是 `make-react-npm next <仓库名>`。

例子：

```sh
$ make-react-npm react new-project
$ cd new-project && yarn
```

## 编译抽离约定

### 方案1: 给需要编译的文件或文件夹添加.lib后缀

`yarn lib` 会把所有 `*.lib.js` 匹配的文件 或所有 `*.lib` 匹配的文件夹中的文件编译成被使用的文件
编译结束之后会拷贝所有 `*.lib.d.ts` 至 lib/ 文件夹中，以方便引用后的 typescript 提示

### 方案2: 配置 `.libconfig.js` 文件，声明需要编译或排除编译的文件 (推荐)

`.libconfig.js` 文件例子

```js
module.exports = {
  // 如果 lib 的元素是文件夹，编译文件夹内所有 js 文件，*表示递归子文件夹
  // 如果 lib 的元素是文件，直接编译该文件
  // xxx/index.js?button, 表示把index编译成button文件
  lib: ['./src/HBComponents', './src/tools/*'],
  dontLib: ['./src/units/paths.js'],
  copy: ['./scripts/fixInterfaceApis.js'], // 仅做拷贝至dist的文件
  delete: ['interfaceApis.json'], // 编译后需要删除dist的文件
  sourceMap: true, // 是否编译 sourceMap
};
```

### 发布

- 发布之前修改 package.json 中的 `hompage` 地址，方便他人从 npm 库链接至项目仓库
- 前提有一个 [npmjs.com](https://www.npmjs.com/) 的账号，在本机登录
- 设置好 package.json 中的 name 和 version，它们分别是 npm 包名和 包版本号
- 请确保包可用，共同保证 npm 包的质量

然后使用以下命令发布

```sh
$ yarn lib
$ cd dist # 只发布dist文件夹，这样方便他人下载时更快
$ npm publish --access public
```

发布其他项目安装引用：

```js
import YourModule from 'your-module' // 相当于引入 index.lib.js
import YourModuleOther from 'your-module/other' // 相当于引入 other.lib.js
```

你可以 [预览此库发布后在npmjs上的页面例子](https://www.npmjs.com/package/make-react-npm)


## 如果有资源被打包依赖

只需把 `lib_media` 中的资源拷贝到静态目录中：

```sh
$ yarn add your-module
$ cp -rf ./node_modules/your-module/lib_media ./public
```

然后在项目中引用资源:

```js
import img from 'your-module/img'
require(img.face) // require('lib_media/face_JF73F.png')
```


## 更新 webpack

- 当前是在 create-react-app@2 上进行扩展, 原则上此库是一个完整的 React 项目库，你使用 yarn start 启动项目, 亦可使用 jest 进行测试，亦可配合 yarn lib 进行指定文件的编译
- 如果需要扩展 webpack 请自行修改 scripts 文件夹中的 webpack 文件
- webpack 已经配置好 sass 和 less 的loader， 如果需要使用这些css预处理工具，请添加依赖即可：
  - less: yarn add less less-loader -D
  - sass: yarn add node-sass sass-loader

## Licenes

```
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
