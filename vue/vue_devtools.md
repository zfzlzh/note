1. 从gitee（https://gitee.com/vaneyang/vue-devtools）或者github（https://github.com/vuejs/devtools/tree/v6.1.4）下载仓库，在文件夹下 npm install，vue3需要使用新版，gitee上版本可能过低
2. 然后npm run build
3. 完成之后，打开…\vue-devtools-dev\vue-devtools-dev\shells\chrome 下的manifest.json修改"persistent": false —> "persistent": true
4. 完成之后，打开…\vue-devtools-dev\vue-devtools-dev\shells\chrome 下的webpack.config.js修改为 process.env.NODE_ENV !== 'development'
5. 在chrome://extensions/中打开开发者模式，将vue-devtools-dev\vue-devtools-dev\shells\chrome 文件夹拉入

## vue3 devtools

从github上https://github.com/vuejs/devtools拉取仓库，

安装yarn，npm i -g yarn

yarn install

yarn run build:watch     不加watch可能会报错

执行完后退出，执行yarn run dev:chrome

在chrome://extensions/中打开开发者模式，将vue-devtools-dev\vue-devtools-dev\shells\chrome 文件夹拉入

