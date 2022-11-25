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

# 同源页面跳转，url改变页面不改变

使用window.open / window.history / window.location.href跳转页面，会出现url改变但是页面需要刷新才改变的情况，原因为**只改变了#后的部分，其实同属一个链接，所以不触发更新，**

方法：**监听hashchange事件,判断新旧url的path是否一致，一致就触发刷新操作**

```js
window.addEventListener('hashchange',hashchangeHanlde)
function hashchangeHanlde(event: {[propName:string]:any}){
  let { oldURL,newURL } = event
  let oldUrlPath = oldURL.split('/#/')[0]
  let newUrlPath = newURL.split('/#/')[0]
  if(oldUrlPath === newUrlPath){
    window.location.reload()
  }
}
```

# vue2与webpack2配置多入口

src目录下创建modules文件夹，创建多入口各个入口的文件夹，将main.js,index.html,App.vue复制到每个文件夹中，修改为各自的名称，如果有各自入口唯一的页面，也可以放在这里，main文件中的内容大致相同，只有部分小区别，可以将main文件封装，然后各自的main文件中引入传参

公共的main文件

```js
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
// import Vue from "vue";
import ElementUI from "element-ui";
import store from "@/store";

import Global from "@/components/common/Global.vue";
import RequestUtil from "@/utils/RequestUtil.js";
import CommonUtils from "@/utils/CommonUtils.js";
import SearchUtils from "@/utils/SearchUtils.js";
import Pagination from "@/components/common/pagination";
import searchInput from "@/components/common/searchInput";
import textareaCheckRows from "@/components/common/textareaCheckRows";
import addressChoice from "@/components/address/addressChoice";
import DatePicker from "vue2-datepicker";
import tabsGetSession from '@/utils/tabsGetSession'

import common from "@/components/js/common.js";

import "iview/dist/styles/iview.css";
import "element-ui/lib/theme-chalk/index.css";
import "../static/css/global.css";
import "../static/css/theme.sass";
import "../static/css/muliteSelect.css"
import echarts from "echarts";
import moment from "moment";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/zh-cn";
import { Message } from "element-ui";
import {
  Button as IV_Button,
  Table as IV_Table,
  Modal as IV_Modal,
  FormItem as IV_FormItem
} from "iview";
import Axios from "axios";
// import { compact } from 'lodash'
import lodash from "lodash";
import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable-gorkys";

// // 可选择导入默认样式
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
//
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import { keyDownF11 } from "@/components/keyDownF11.js";
import ws from "@/components/websocket/websocket.js";
import operation from '@/utils/operation'
// import VueAMap from "vue-amap";
//不同客户使用的不同大屏与名称
import dashboardPre from '@/modules/settingJson/dashboardPre.json'
import customName from '@/modules/settingJson/customName'
import { children } from '@/modules/settingJson/customRouter'
// import screenResize from "./components/js/screenResize";
//多页面公共代码，各页面引入使用
export default class main{
  /**
   * 
   * @param {*String} pageType 当前客户
   * @param {*Vue} App 当前客户页面所用的app.vue
   * @param {*Vue} router 当前客户页面所用的路由
   */
  constructor(pageType,App,router){
    this.initMain(pageType,App,router)
  }
  initMain(type,App,router){
    Vue.component("vue-draggable-resizable", VueDraggableResizable);
    Vue.component("VueSlider", VueSlider);
    Vue.component("Button", IV_Button);
    Vue.component("Table", IV_Table);
    Vue.component("Modal", IV_Modal);
    Vue.component("Pagination", Pagination);
    Vue.component("searchInput", searchInput);
    Vue.component("textareaCheckRows", textareaCheckRows);
    Vue.component("addressChoice", addressChoice);
    Vue.component("DatePicker", DatePicker);
    Vue.use(ElementUI, { size: "small" });
    Vue.config.productionTip = false;
    Vue.use(store);
    Vue.use(common);
    //获取对应客户的大屏权限与名称
    let dashboard = dashboardPre[type]
    let childrenCustom = children[type]
    Global.MENUS = { ...Global.MENUS, ...dashboard }
    let custom = customName[type]
    if(custom.hasAreaTypeKpiList){
      Global.MENU.kpiList = "系统KPI管理"
      Global.MENUS.kpiList.name = "系统KPI管理"
    }
    //获取特有页面router
    if (childrenCustom){
      router.options.routes[0].children =  [...router.options.routes[0].children,...childrenCustom]
    }
    const bus = new Vue();
    Vue.prototype.$eventBus = bus;
    Vue.prototype.$echarts = echarts;
    Vue.prototype.$RequestUtil = RequestUtil;
    Vue.prototype.$Global = Global;
    Vue.prototype.$moment = moment;
    Vue.prototype.$_ = lodash;
    Vue.prototype.$dashboardPre = dashboard
    Vue.prototype.$customName = custom
    FileReader.prototype.readAsBinaryString = function (fileData) {
      var binary = "";
      var pt = this;
      var reader = new FileReader();
      reader.onload = function (e) {
        var bytes = new Uint8Array(reader.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        pt.content = binary;
        pt.onload(pt); //页面内data取pt.content文件内容
      }
      reader.readAsArrayBuffer(fileData);
    }
    // 注册全局公用方法
    window.commonUtils = CommonUtils;
    window.SearchUtils = SearchUtils;
    window.ws = ws;
    window.operation = operation
    /* eslint-disable no-new */
    // screenResize(router, bus)
    //绑定F11全屏事件
    keyDownF11();
    //多页面获取session
    tabsGetSession()
    document.onkeydown = (event) => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      //阻止F11全屏，改用html5的API来控制
      if (e && e.keyCode === 122) {
        var ele = document.documentElement;
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        }
        return false;
      }
    };

    router.beforeEach((to, from, next) => {
      //判断当前url是否是其他网站跳转，并且携带的参数在#之前，不做处理则携带的参数会一致存在于url中
      let href = window.location.href,hrefArr,url = null
      if(href.indexOf('?') > -1){
        hrefArr = href.split('?')
        if(hrefArr[1].indexOf('#') > -1 || hrefArr[1].indexOf('/') > -1){
          url = hrefArr[0]
        }
      }
      let pathObj = { path: to.path };
      let pathArr = to.path.split("/"); let newPath = "";
      pathArr = pathArr.includes('redirect') ? pathArr.filter((val) => { return val != 'redirect'}) : pathArr
      if (
        localStorage.getItem("userHasPer") && 
        to.path != "/Login" && 
        to.path != "/login" && 
        to.path != "/device/equipment/downloadConfiguration"
        ) {
        const permissions = JSON.parse(localStorage.getItem("userHasPer"));
        const urlArr = JSON.parse(localStorage.getItem("allUrl"));
        if (pathArr.length > 3 && !urlArr.includes(to.path)) {
          newPath = pathArr.slice(0, 3).join("/");
          if (!permissions[newPath]) {
            Message({
              type: "warning",
              message: "无该页面权限，已跳转"
            });
            pathObj = { path: Object.keys(permissions)[0] };
          } 
        } else if (urlArr.includes(to.path) && !permissions[to.path]) {
          Message({
            type: "warning",
            message: "无该页面权限，已跳转"
          });
          pathObj = { path: Object.keys(permissions)[0] };
        } 
        //当从其他网站跳转时，如果用户名与密码出现在#前，则执行去除操作，反之则按照原来的进行
        if (url != null) {
          window.location.href = url + '#' + pathObj.path
        } else {
          if(pathObj.path == to.path){
            next()
          }else{
            next(pathObj);
          }
        }
      } else {
          next();
      }
      if (pathObj.path == "/adminHomePage") {
        Vue.prototype.$eventBus.$emit("darkBack", true);
      } else {
        Vue.prototype.$eventBus.$emit("darkBack", false);
      }
      return;
    });

    window.addEventListener("beforeload", (event) => {
    });
    window.addEventListener("error", function (e) {
      const target = e.target; // 当前dom节点
      const tagName = target.tagName;
      if (tagName && tagName.toUpperCase() === "IMG") {
        const count = Number(target.dataset.count) || 0; // 以失败的次数，默认为0
        const max = 3; // 总失败次数，此时设定为3
        // 当前异常是由图片加载异常引起的
        if (count >= max) {
          target.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//AK3/ALYH+5hX6FV5N4Y/5GHwx/vyf+iJa9ZrysPhoYVShDZu/potDmwWFhhIzhT2bv6aLQ//Z";
        } else {
          target.dataset.count = count + 1;
          target.src = "/static/img/imgLoadError.png";
        }
      }
    }, true);

    Vue.filter("moment", function (value) {
      if (!value) return "";
      return moment(value).format("YYYY-MM-DD HH:mm");
    });
    Vue.filter("UTC+8", function (value) {
      if (!value) return "";
      return moment(value).add(8, "h").format("YYYY-MM-DD HH:mm");
    });

    // Vue.use(VueAMap);
    // VueAMap.initAMapApiLoader({
    //   key: "76aaf2bdb6c38ca25593b6e5ab2194ab",
    //   plugin: ["CitySearch", "MarkerClusterer"],
    //   uiVersion: "1.0", //ui库版本，不配置不加载,
    //   // v: "1.4.4"
    //   v: "1.4.15"
    // });
    (async () => {
      //获取计算机地址，用于地图poi搜索
      // await Axios.get("https://restapi.amap.com/v3/ip?key=8325164e247e15eea68b59e89200988b").then(
      //   (response) => {
      //     Vue.prototype.$adcode = response.data.adcode;
      //     common.setAdcode(response.data.adcode);
      //   }
      // );
      new Vue({
        el: "#app",
        router,
        store,
        components: { App },
        template: "<App/>"
      });
    })();
  }
}

```

各自的main.js文件

```js
import main from '@/main'
import App from "./App";
import router from '../../router'
let JHMain = new main('JH',App,router)
```

utils.js文件

```js
//多入口配置
// 通过glob模块读取modules文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
  var map = {}
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    //筛选客户页面
    if(custom === null || custom === filename){
      map[filename] = ["babel-polyfill", './src' + filePath.split('/src')[1]]
    }
  })
  return map
}
//多页面输出配置
// 与上面的多页面入口配置相同，读取modules文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let arr = []
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    //筛选客户页面
    if (custom === null || custom === filename) {
      let fileName = custom === null ? filename + '.html' : 'index.html'
      let conf = {
        // 模板来源
        template: './src' + filePath.split('/src')[1],
        // 文件名称
        filename: fileName,
        favicon: './static/img/nalc_logo.png',
        // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
        inject: true
      }
      if(custom === null){
        conf.chunks = ['manifest', 'vendor', filename]
      }
      if (process.env.NODE_ENV === 'production') {
        conf = merge(conf, {
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
          chunksSortMode: 'dependency'
        })
      }
      arr.push(new HtmlWebpackPlugin(conf))
    }
  })
  return arr
}
```

webpack.base.conf.js

```js
entry: {
    ...utils.entries()
  },
```

webpack.dev.conf.js   webpack.prod.conf.js

```js
 plugins:[].concat(utils.htmlPlugin())
```

## vue3与ts搭配，v-for出现unknow问题

```vue
<div 
      v-for="item in list" //出现提示item是unknow类型
      :key="item?.id" 
      :style="`background-image:url('${item?.url}');width:100px;height:100px`" 
      class="div-image"
      @click="clickDiv(item)"
    >
</div>
<script>
//解决方法，引入PropType
import { ref,PropType} from 'vue'
//数组内部对象的类型声明
interface listItem{
  id:string|number,
  url:string
}
const props = defineProps({
  list:{
      //Array as PropType<listItem[]>,不会出现报错
    type:Array as PropType<listItem[]>,
    default:()=>[
      {id:"",url:''}
    ]
  }
})
</script>
```

