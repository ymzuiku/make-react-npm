## 安装

```js
npm i -g make-react-npm
```

## 使用脚手架创建 React 组件库

例如，我们使用github仓库路径作为参数创建组件库，这样别人从 npmjs.com 上也能链接到github仓库；

创建 React 项目的命令是 `make-react-npm react <你的github账户>/<github仓库名>`。

创建 Next 项目的命令是 `make-react-npm next <你的github账户>/<github仓库名>`。

例子：

```sh
$ make-react-npm react ymzuiku/new-project
$ cd new-project && yarn
```

## 更新 webpack

- 当前是在 create-react-app@2 上进行扩展, 原则上此库是一个完整的 React 项目库，你使用 yarn start 启动项目, 亦可使用 jest 进行测试，亦可配合 yarn lib 进行指定文件的编译
- 如果需要扩展 webpack 请自行修改 scripts 文件夹中的 webpack 文件

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
