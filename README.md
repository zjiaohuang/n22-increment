# n22-increment

webpack编译后生成增量更新文件

## 生成约定
根目录下建diff/old目录，目录中存放上次编译生成的manifest.json文件

## 使用
* 在package.json中增加调用
```
"scripts": {
    "diff": "node n22-increment"
  }
```
在运行npm run build后运行，差异文件存在diff/diff目录下
```
npm run build
npm run diff
```

* 修改build.js，在webpack编译过程中引入并执行


## TODO
