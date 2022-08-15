## 1.'get' on proxy: property 'modelViewMatrix' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '#<Matrix4>' but got '#<Matrix4>')

意思：属性“modelViewMatrix”是代理目标上的一个只读且不可配置的数据属性，但代理没有返回它的实际值(预期为“#”，但得到了“#”)

原因：proxy的代理问题

解决方案：

1.toRaw(xxx.value)

2.设定为全局变量

3.const loader = new THREE.ObjectLoader()

​	loader.parse(object.toJSON())

本质都是取消proxy代理特性，使用原对象

```js
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const cube = ref<any>()
function init(){
    cube.value = new THREE.Mesh( geometry, material );
  	scene.add( toRaw(cube.value) );//这一步使用
    animate()
}
function animate() {
  requestAnimationFrame( animate );
  cube.value.rotation.x += 0.01;
  cube.value.rotation.y += 0.01;
  renderer.render( scene, camera.value );//如果scene也使用了proxy，使用toRaw(scene),实际scene无需使用响应式
}
```

