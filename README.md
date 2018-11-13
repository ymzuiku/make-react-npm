## 安装

```js
npm i -g make-react-npm
```

## 创建 npm-modules 项目

npm 库最好和 github 保持一致，创建项目的命令是 `make-react-npm <你的github账户>/<github仓库名>`, 如:

```sh
$ mkdir new-project && cd new-project
$ make-react-npm ymzuiku/new-project
$ yarn
```

## 编写代码时所注意

- 请把库\组件代码编写在 src 文件夹
- 请修改 public\index.d.ts 文件为您项目的 typescript 类型声明, 方便他人使用时会有提示
- 如果有任何依赖，请安装到 dependencies , webpage 打包时不会混编 node_modules 的依赖，但是他人安装此库时，会自动安装 dependencies 中的依赖

## 发布

- 前提有一个 [npmjs.com](https://www.npmjs.com/) 的账号，在本机登录
- 设置好 package.json 中的 name 和 version，它们分别是 npm 包名和 包版本号
- 请确保包可用，共同保证 npm 包的质量

并且使用以下命令发布

```sh
$ yarn build
$ sudo npm publish
```
