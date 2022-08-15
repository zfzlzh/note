## 1.初始化vue简单模板：

```js
vue init webpack-simple projectName
cd projectName
npm install
npm run dev
```

## 2.创建目录

创建src/myPlugin目录，src/myPlugin/projectName目录存放要封装的组件，创建index.js，作为打包后的入口。

## 3.加入组件，调试

## 4.修改index.js文件

```js
// projectName 插件对应组件的名字
import projectName from './projectName.vue';

// Vue.js 的插件应当有一个公开方法 install 。第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
// 参考：https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6
// 此处注意，组件需要添加name属性，代表注册的组件名称，也可以修改成其他的

projectName.install = Vue => Vue.component(projectName.name, projectName);//注册组件
//挂载在window上的自动安装，也就是通过script标签引入时不需要手动调用Vue.use(projectName)
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component(muliteTransfer.name, muliteTransfer);
}
export default projectName
```

5. ## webpack.config.js修改

    ```js
    // 执行环境
    const NODE_ENV = process.env.NODE_ENV;
    
    module.exports = {
      // 根据不同的执行环境配置不同的入口
      entry: NODE_ENV == 'development' ? './src/main.js' : './src/myPlugin/index.js',
      output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'projectName.js',
        library: 'projectName', // 指定的就是你使用require时的模块名
        libraryTarget: 'umd', // 指定输出格式
        umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
      },
    ```

    **library**：指定的就是你使用require时的模块名

    **libraryTarget**：为了支持多种使用场景，我们需要选择合适的打包格式。常见的打包格式有 CMD、AMD、UMD，CMD只能在 Node 环境执行，AMD 只能在浏览器端执行，UMD 同时支持两种执行环境。显而易见，我们应该选择 UMD 格式。

    ​		**有时我们想开发一个库，如lodash，underscore这些工具库，这些库既可以用commonjs和amd方式使用也可以用script方式引入。**

    　　**这时候我们需要借助library和libraryTarget，我们只需要用ES6来编写代码，编译成通用的UMD就交给webpack了**

    　　**umdNamedDefine**：会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define

## 6.package.json修改

```json
//公有还是私有，false为公有
"private": false,
//指定入口文件
"main": "dist/projectName.js",
```

## 7.index.html修改

```html
//src与webpack.conf.js > output > filename一致
<script src="/dist/projectName.js"></script>
```



## 8.注册npm账号

## 9.发布

```js
npm run build
//未登录时执行，输入密码时不会显示，但是密码是输入进去了的
npm login
//修改版本号，第一次发布不需要执行
npm version <update-type>
update-type : patch：这个是补丁的意思，补丁最合适；
     　　		minor：这个是小修小改；
     　　		major：这个是大改；
例：npm version patch   ;  1.0.0 -> 1.0.1
//推送,非第一次推送都要先执行版本号更新，同样版本号无法推送
npm publish
//24小时内可删除npm包，但是该包名称不可再使用
npm unpublish --force //强制删除
npm unpublish guitest@1.0.1 //指定版本号
```

