## 1.引入

```js
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
```

## 2.基础使用

```js
//基础用法
function createPanel(){
  let panel = new GUI( { width: 310 } );
  let folder = panel.addFolder( 'Camera' );//大类名称1
  const folder1 = panel.addFolder( 'Global' );//大类名称2
  const custom = {
    rotate:true
  }//自定义属性
  //大类名称1的条目，内部既有的属性可以用的写法
  //add(属性所在的对象，属性名称，属性值) -- 非数字滑动条
  //add(属性所在的对象，属性名称，最大值，最小值，step) -- 数字滑动条
  folder.add( camera.value.position, 'y',-1000,1000,0.1).name('camera.y')
  folder.add( camera.value.position, 'x',-1000,1000,0.1).name('camera.x')
  //需要双向绑定的条目，后面接上listen
  folder.add( camera.value.position, 'z',-1000,1000,0.1).name('camera.z').listen()
  //大类名称2的条目，通用写法，自定义属性可以通过onChange绑定修改事件
  folder1.add(custom,'rotate',true).name('自动旋转').onChange((val: boolean) => {
    autoRotate.value = val
  })
  console.log(folder)
}
```

## 3.添加颜色配置

```js
var palette = {
  color1: '#FF0000', // CSS string
  color2: [ 0, 128, 255 ], // RGB array
  color3: [ 0, 128, 255, 0.3 ], // RGB with alpha
  color4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};
gui.addColor(palette, 'color1');
gui.addColor(palette, 'color2');
gui.addColor(palette, 'color3');
gui.addColor(palette, 'color4');
```



## 4.API文档

https://github.com/dataarts/dat.gui/blob/master/API.md#Controller