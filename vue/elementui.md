# 1.checkbox取消文字点击选中

文字加标签加一个点击事件，@click要加prevent

```vue
<el-checkbox-group 
    v-model="checkedData" 
    @change="handleCheckedPointChange" 
    class="checkBoxGroup">
     <el-checkbox  :label="point.index" class="flexBox checkBox">
         <div 
              v-for="item in point.arr" 
              :key="item.name" 
              class="checkBoxHeadDiv flexBox" 
              @click.prevent="()=>{}">
             
          </div>
      </el-checkbox>
</el-checkbox-group>
```

## 2.element-plus,el-table的width无限延伸

检查是否再.el-table上有border设置，且width为100%，

方法：去掉border或者width设置为99%

## 3.elementplus自定义命名空间设置

官网不完全，需要重新引入组件样式，可使用Vue官方人员开发的一款自动引入插件 -- unplugin-vue-components，可省去大量 import 语句

**主应用中start方法不可添加sandbox为true，会导致挂载在body下的组件，如el-select的下拉选项框，样式消失。**

```html
<!-- App.vue -->
<template>
  <el-config-provider namespace="ep">
    <!-- ... -->
  </el-config-provider>
</template>
```

新建styles/elemntui/index.scss文件

```scss
//@forward with   替换引用文件中的对应值
@forward 'element-plus/theme-chalk/src/mixins/config.scss' with (
  $namespace: 'ep'
);
```

vite.config.js

```js
import { defineConfig } from 'vite'
//安装unplugin-vue-components
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  // plugins中加入以下内容，不然不生效
  plugins:[
         Components({
            // allow auto load markdown components under `./src/components/`
            extensions: ['vue', 'md'],
            // allow auto import and register components used in markdown
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [
              ElementPlusResolver({
                importStyle: 'sass',
              }),
            ],
            dts: 'src/components.d.ts',//所有用到的elementplus组件的样式引入文件，即node_modules/element-plus/global.d.ts文件，可自行删减
          }),
    ]
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  // ...
})
```

