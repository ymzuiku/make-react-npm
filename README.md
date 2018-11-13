此脚手架可以方便生成编写 React 组件库 所需的依赖

## 安装

```js
npm i -g make-react-npm
```

## 使用脚手架创建 React 组件库

npm 库最好和 github 保持一致，创建项目的命令是 `make-react-npm <你的github账户>/<github仓库名>`, 如:

```sh
$ mkdir new-project && cd new-project
$ make-react-npm ymzuiku/new-project
$ yarn
```

## 编写代码时所注意

- 请把源代码代码编写在 src 文件夹
- 请修改 public/index.d.ts 文件为您项目的 TypeScript 类型声明, 方便他人使用时会有提示
- 如果有任何依赖，请安装到 dependencies , webpage 打包时不会混编 node_modules 的依赖，但是他人安装此库时，会自动安装 dependencies 中的依赖

## 发布

- 前提有一个 [npmjs.com](https://www.npmjs.com/) 的账号，在本机登录
- 设置好 package.json 中的 name 和 version，它们分别是 npm 包名和 包版本号
- 请确保包可用，共同保证 npm 包的质量

然后使用以下命令发布

```sh
$ yarn build
$ sudo npm publish
```

你也可以[预览此库发布后在npmjs上的页面](https://www.npmjs.com/package/make-react-npm)

## 更新webpack

当前使用的是 webpack4 及 babel7 进行编译，如果需要扩展 webpack 请自行修改 scripts 文件夹中的 webpack 文件

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
