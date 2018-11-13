如果你平时想发布一个自己的React组件，发现它并没有和发布其他JS组件一样简单，首先它得对JSX进行转化，并且得使用babel把语法转化为ES3，还得忽略掉一些项目里已用到的库，如 react \ react-dom 等等，还得编写 TypeScript 声明文件。天啊，我只是想把一个组件抽离到 modules 中，为什么需要配置这么多细节？

这个脚手架就是做以上的事情，它非常简单，仅仅是帮我们生成了一个已经配置好以上配置的webpack的项目，我们编写完代码，编译并发布到 [npmjs.com](https://www.npmjs.com/) 即可。

## 安装

```js
npm i -g make-react-npm
```

## 使用脚手架创建 React 组件库

我们使用github仓库路径作为参数创建组件库，这样别人从 npmjs.com 上也能链接到github仓库；

创建项目的命令是 `make-react-npm <你的github账户>/<github仓库名>`。

例子：

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

你也可以 [预览此库发布后在npmjs上的页面](https://www.npmjs.com/package/make-react-npm)

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
