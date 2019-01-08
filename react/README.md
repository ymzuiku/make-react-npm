# 编译组件约定

### 方案1:给需要编译的文件或文件夹添加.lib后缀,确保文件名不要重复

`yarn lib` 会把所有 `*.lib.js` 匹配的文件 或所有 `*.lib` 匹配的文件夹中的文件编译成被使用的文件
编译结束之后会拷贝所有 `*.lib.d.ts` 至 lib/ 文件夹中，以方便引用后的 typescript 提示

### 方案2:配置.libconfig.js文件，声明需要编译或排除编译的文件，确保文件名不要重复

/* .libconfig.js 文件例子
module.exports = {
  lib: ['./src/HBComponents', './src/tools/*'], // *表示递归子文件夹
  dontLib: ['./src/units/paths.js'],
};
*/

发布后引用：

```js
import YourModule from 'your-module'
import YourModuleOther from 'your-module/other' // 推荐，只引用某个文件
```