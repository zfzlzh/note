# 1.vue2项目为主应用，vite+vue3项目为子应用

## 准备工作：

### 1.主应用vue2项目安装qiankun

yarn add qiankun

### 2.子应用vite+vue3项目安装vite-plugin-qiankun

yarn add vite-plugin-qiankun

### 本地运行时，将主、子应用都跑起来，注意端口号

## 主应用

### 1.修改主应用main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
//引入qiankun的注册与开始api
import { registerMicroApps, start } from "qiankun";
Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small" });
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
//注册子应用
/**
* name:子应用名称，
* entry：子应用启动的地址
* container：渲染在 主应用 的哪个容器内，
* activeRule：路由地址，使用hash模式时前面要加#，重要，子应用多处需与其保持一致
*/
registerMicroApps([
  {
    name: "vue3-micro-app",
    entry: "//localhost:5173",
    container: "#micro-container",
    activeRule: "#/vue3-micro-app",
  },
]);
//开始
start()
```

### 2.修改主应用vue.config.js

```js
module.exports = {
  devServer: {
    port: 8080, //主应用启动端口号，视情况而定
    headers: {
      "Access-Control-Allow-Origin": "*", // 允许跨域访问子应用页面
    },
  }
}
```

## 子应用

html文件与app.vue中的id要与主应用区分开

### 1.修改子应用vite.config.js

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入qiankun
import qiankun from "vite-plugin-qiankun";
//name与activeRule中/后的部分保持一致
import { name } from './package.json'

// https://vitejs.dev/config/
export default ({mode}) => {
  const __DEV__ = mode === 'development'
  return defineConfig({
     //生产环境需要写死，vite不支持运行时publicPath，只能在打包时写死Base配置
    base: __DEV__ ? "/" : "http://192.168.90.137:8089/",
    plugins: [
      vue(),
      //注册
      qiankun(`${name}`, {
        useDevMode: true,
      }),
    ],
    resolve: {
      extensions: [".js", ".json"],
    },
  });
}

```

### 2.修改main.js文件

```js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHashHistory } from "vue-router";
import {name} from '../package.json';
import routes from "./router";
//from 'vite-plugin-qiankun'会提示找不到qiankunWindow
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
let instance = null;
let router = null
//生命周期导出
renderWithQiankun({
  mount(props) {
    render(props);
    instance.config.globalProperties.$onGlobalStateChange =
      props.onGlobalStateChange;
    instance.config.globalProperties.$setGlobalState = props.setGlobalState;
  },
  bootstrap() {
    console.log("%c ", "color: green;", "micro-container app bootstraped");
  },
  unmount(props) {
    instance.unmount();
    instance._container.innerHTML = "";
    instance = null;
    router = null;
  },
});
function render(props = {}) {
  const { container } = props;
    //router创建移到此处，router/index文件只存放路由地址，路由方式要与主应用一致，此处使用hash
  router = createRouter({
    history: createWebHashHistory(
        //window替换为qiankunWindow
      !qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${name}` : "/"
    ),
    routes:routes,
  });

  instance = createApp(App);
  instance.use(router);
  instance.mount(
      //id为index.html中的id
    container ? container.querySelector("#app-vue3") : "#app-vue3"
  );
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}

```

### 3.router/index文件

```js
import index from '../views/index.vue'
import { name } from '../../package.json'
const constantRoutes = [
  {
    path: "/index",
    component: index,
    name: "index",
  },
];
//path前面需要与上文activeRule一致，即/vue3-micro-app/index
export default constantRoutes.map((val) => {
  val.path = `/${name}` + val.path;
  console.log(val);
  return val;
});
```

## 在主应用的某个路由页面加载微应用

主应用中添加一个组件，此处名为vue3，

主应用的main.js文件

```js
registerMicroApps([
  {
    name: "vue3-micro-app",
    entry: "//localhost:5173",
    container: "#micro-container",//如果之前写的主应用的html或app.vue中id，修改为需要渲染子应用的容器的id
    activeRule: "#/vue3-micro-app",
  },
]);
```

主应用的router/index文件

```js
const routes = [
  {
    path: "/",
    name: "home",
    component: home,
    children: [
      {
        path: "/index",
        name: "index",
        component: index,
      },
        //activeRule的值后面添加/*，
      {
        path: "/vue3-micro-app/*",
        name: "vue3-micro-app",
        component: vue3,
      },
    ],
  },
];
```

主应用跳转路由的地方

```js
routerTo(index){
    //如果要跳到子应用的页面，地址为activeRule + 具体子应用的页面
        let path = index ? '/vue3-micro-app/index' : '/index'
        this.$router.push({path})
      }
```

主应用的名为vue3的组件

```js
//在mounted方法中添加一下内容
import { start } from 'qiankun';
mounted(){
      if (!window.qiankunStarted) {
        window.qiankunStarted = true;
        start();
      }
    },
```

子应用的某些元素在主应用显示时需要隐藏

```js
import {
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
//判断有无qiankunWindow.__POWERED_BY_QIANKUN__，有就不显示
computed:{
  computedShow(){
   return !qiankunWindow.__POWERED_BY_QIANKUN__
  }
},
```

router传递参数可用

## 主应用和微应用通信

利用`qiankun`框架的`initGlobalState`和`MicroAppStateActions` 

`setGlobalState`：设置 `globalState` - 设置新的值时，内部将执行`浅检查`，如果检查到`globalState`发生改变则触发通知，通知到所有的`观察者`函数。

`onGlobalStateChange`：注册`观察者`函数 - 响应`globalState`变化，在`globalState`发生改变时触发该`观察者`函数。

`offGlobalStateChange`：取消`观察者`函数 - 该实例不再响应`globalState`变化。

主应用需要传输数据的页面

```js
import {   
    initGlobalState 
} from "qiankun";
submit(){
    const state = {}
    //初始化
    const actions = initGlobalState(state)
    //设置需要传递的数据
    actions.setGlobalState({pwd: this.form.pwd,name:this.form.user})
}

```

子应用main.js文件的render方法

```js
function render(props = {}) {
  const { container } = props;
  //监听变化，获取传过来的数据，赋值到全局变量或者store使用
    //在生产环境props上没有onGlobalStateChange，所以要加判断
    if(window.__POWERED_BY_QIANKUN__) { 
      props.onGlobalStateChange((state, prevState) => {  
        userInfo.value = {
          name:state.name,
          pwd:state.pwd
        }
      },true)
    }
  
  router = createRouter({
    history: createWebHashHistory(
      !qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${name}` : "/"
    ),
    routes: routes,
  });

  instance = createApp(App);
  instance.use(router);
  instance.use(ElementPlus);
  instance.mount(
    container ? container.querySelector("#app-vue3") : "#app-vue3"
  );
}
```

## 问题

### 1.Uncaught TypeError: application 'iotV3' died in status SKIP_BECAUSE_BROKEN: Cannot read properties of null (reading 'use')

子应用main文件中修改

```js
//createApp写在外面，第一次跳转使用
let instance: any = createApp(App);
let router = null
renderWithQiankun({
  mount(props) {
    render(props);
    instance.config.globalProperties.$onGlobalStateChange =
      props.onGlobalStateChange;
    instance.config.globalProperties.$setGlobalState = props.setGlobalState;
  },
  bootstrap() {
    console.log("%c ", "color: green;", "micro-container app bootstraped");
  },
  update(){
    
  },
  unmount(props) {
    instance.unmount();
    instance._container.innerHTML = "";
    // instance.$destroy();
    instance = null;
    router = null;
  },
});
function render(props: any = {}) {
  const { container } = props;
  (router as any) = createRouter({
    history: createWebHashHistory(
      !qiankunWindow.__POWERED_BY_QIANKUN__ ? `#/${name}` : "#/"
    ),
    routes:routes,
  });
    //判断无时重新赋值，跳转页面是使用
  if(!instance){
     instance = createApp(App)
  }
  instance.use(router);
  instance.use(i18n)
  instance.use(store);
   instance.use(ElementPlus, {
    locale: zhCn,
    i18n: i18n.global.t,
  });
  instance.mount(
    container ? container.querySelector("#iotV3") : "#iotV3"
  );
  props.onGlobalStateChange((state, prevState) => {  
    console.log('state',state)
    store.commit('setToken', state.token);
  },true);
}



```

## 2.子应用使用地图

① 在主应用引入地图

②

```js
//主应用的main.js文件中start方法中加入excludeAssetFilter，指定部分特殊的动态加载的微应用资源（css/js) 不被 qiankun 劫持处理
start({
	excludeAssetFilter: (assetUrl) => { 
      const whiteList = [];
      const whiteWords = ['baidu', 'map'];
      if (whiteList.includes(assetUrl)) { return true } 
      return whiteWords.some(w => { return assetUrl.includes(w)})
    }
});
```

