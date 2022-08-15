# 1.Vue .sync修饰符与$emit(update:xxx)写法问题

使用.sync修饰符

```vue
// this.$emit('update:father-num',100);  //无效
this.$emit('update:fatherNum',100); //有效
<father v-bind:father-num.sync="test"></father>
```

*不使用.sync*

```vue
this.$emit('update:father-num',100);  //有效
//this.$emit('update:fatherNum',100); // 无效
<father v-bind:father-num="test" v-on:update:father-num="test=$event" ></father>
```

# 2.强制更新渲染

有时会应为**层次太深**，或者**数组与对象赋值不是响应式**等问题导致render函数不执行更新渲染，需要手动强制更新渲染,可以使用this.$forceUpdate()。

```vue
<el-input @input="clickInput"></el-input>
<el-select @input="clickInput"></el-select>
<script>
    clickInput(){
        this.$forceUpdate()
    }
</script>	

```

# 3.vue的响应式更新

由于 JavaScript 的限制，Vue **不能检测**数组和对象的变化。

Vue 无法检测 property 的添加或移除，property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式，

对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property（#1），对象可以使用$set方法变为响应式（#2）。

```js
var vm = new Vue({
  data:{
    a:1,
    someObject:{}
  }
})

// `vm.a` a在data中，所以是响应式的

vm.b = 2
// `vm.b` data中没有b，所以是非响应式的

//#1
vm.someObject['xxx'] = xxx//非响应式
//#2
this.$set(vm.someObject,'xxx',xxx)//响应式
```

Vue **不能检测**以下数组的变动：

1. 当你利用索引直接设置一个数组项时#3，

2. 当你修改数组的长度时#4，

    可以使用vue.set与splice来操作，变为响应式

    ```js
    var vm = new Vue({
      data: {
        items: ['a', 'b', 'c']
      }
    })
    vm.items[1] = 'x' // #3不是响应性的
    vm.items.length = 2 // #4不是响应性的
    //响应式
    Vue.set(vm.items, indexOfItem, newValue)
    vm.items.splice(indexOfItem, 1, newValue)
    ```

    **Vue 将数组的某些变更方法进行了侦听，使其变为响应式，并进行了包裹，它们也将会触发视图更新**

    包括：**push()，pop()，shift(),unshift(),splice(),sort(),reverse()**

    直接替换数组与对象也会触发更新

# vue-cli4  vue.config.js配置

```js
// vue.config.js
const path = require('path');
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) = >path.join(__dirname, dir);
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/site/vue-demo/': '/',
    // 公共路径
    indexPath: 'index.html',
    // 相对于打包路径index.html的路径
    outputDir: process.env.outputDir || 'dist',
    // 'dist', 生产环境构建文件的目录
    assetsDir: 'static',
    // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    runtimeCompiler: true,
    // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: !IS_PROD,
    // 生产环境的 source map
    parallel: require("os").cpus().length > 1,
    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    pwa: {},
    // 向 PWA 插件传递选项。
    chainWebpack: config = >{
        config.resolve.symlinks(true); // 修复热更新失效
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args = >{
            // 修复 Lazy loading routes Error
            args[0].chunksSortMode = "none";
            return args;
        });
        config.resolve.alias // 添加别名
        .set('@', resolve('src')).set('@assets', resolve('src/assets')).set('@components', resolve('src/components')).set('@views', resolve('src/views')).set('@store', resolve('src/store'));
        // 压缩图片
        // 需要 npm i -D image-webpack-loader
        config.module.rule("images").use("image-webpack-loader").loader("image-webpack-loader").options({
            mozjpeg: {
                progressive: true,
                quality: 65
            },
            optipng: {
                enabled: false
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4
            },
            gifsicle: {
                interlaced: false
            },
            webp: {
                quality: 75
            }
        });
        // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
        if (IS_PROD) {
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
                analyzerMode: "static"
            }]);
        }
    },
    configureWebpack: config = >{
        // 开启 gzip 压缩
        // 需要 npm i -D compression-webpack-plugin
        const plugins = [];
        if (IS_PROD) {
            plugins.push(new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: productionGzipExtensions,
                threshold: 10240,
                minRatio: 0.8
            }));
        }
        config.plugins = [...config.plugins, ...plugins];
    },
    css: {
        extract: IS_PROD,
        requireModuleExtension: false,
        // 去掉文件名中的 .module
        loaderOptions: {
            // 给 less-loader 传递 Less.js 相关选项
            less: {
                // `globalVars` 定义全局对象，可加入全局变量
                globalVars: {
                    primary: '#333'
                }
            }
        }
    },
    devServer: {
        overlay: { // 让浏览器 overlay 同时显示警告和错误
            warnings: true,
            errors: true
        },
        host: "localhost",
        port: 8080,
        // 端口号
        https: false,
        // https:{type:Boolean}
        open: false,
        //配置自动启动浏览器
        hotOnly: true,
        // 热更新
        // proxy: 'http://localhost:8080' // 配置跨域处理,只有一个代理
        proxy: { //配置多个跨域
            "/api": {
                target: "http://172.11.11.11:7071",
                changeOrigin: true,
                // ws: true,//websocket支持
                secure: false,
                pathRewrite: {
                    "^/api": "/"
                }
            },
            "/api2": {
                target: "http://172.12.12.12:2018",
                changeOrigin: true,
                //ws: true,//websocket支持
                secure: false,
                pathRewrite: {
                    "^/api2": "/"
                }
            },
        }
    }
}
```

# vue-cli 4 全局加载scss等预处理器文件

直接在main.js文件中引入预处理器文件无法使用文件中的@mixin、@extend文件中的样式等，需使用style-resources-loader，并配置对应的地址

```js
//vue-cli环境搭建好以后，执行vue add style-resources-loader,添加后会让你选择哪种预处理器，在webpack.conf.js或vue.conf.js（无会生成）中生成对应代码，不用在main.js文件中引入scss文件
const path = require('path') //该行没有自行添加
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
		  path.resolve(__dirname,`./static/css/global.scss`) //需要全局导入的scss文件
	  ]
    }
  }
}
```

# 修改node_modules中文件----path-package

```js
//package.json文件添加
"scripts": {
  "postinstall": "patch-package"
}
//执行npm i patch-package -S安装path-package
//在 node_modules 里面修改依赖包的代码
//每次修改代码之后执行命令 npx patch-package request    --request为修改的modules包名称，例如修改了element-ui的文件，执行时输入npx patch-package element-ui
//执行成功后根目录下会出现patches文件夹，里面保存着修改过的文件记录
```

