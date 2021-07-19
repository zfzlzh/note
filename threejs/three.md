## **1 创建场景对象Scene**

```javascript
let scene = new THREE.Scene()
```



## **# 创建网格模型**

```javascript
let geometry = new THREE.SphereGeometry(60, 40, 40)//SphereGeometry为球体，替换为其他geometry生成其他图形
```



## **# 材质**

```javascript
let material = new THREE.MeshStandardMaterial({

  color:0xff0000,

  ...

})

//MeshStandardMaterial可替换为其他材质内容
```



## **# 网格模型对象**

```javascript
let mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
```



## **# 多个对象需要移动位置时**

```js
mesh.translateX(120)//yz同理
```



## **# 类型数组创建顶点数据**

```js
let geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象

let vertices = new Float32Array([

  0, 0, 0, //顶点1坐标

  50, 0, 0, //顶点2坐标

  0, 100, 0, //顶点3坐标

  0, 0, 10, //顶点4坐标

  0, 0, 100, //顶点5坐标

  50, 0, 10, //顶点6坐标

]);

let attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标

material = new THREE.MeshBasicMaterial({

  color: colors, //三角面颜色

  //vertexColors: THREE.VertexColors,//渐变色时使用

  side: THREE.DoubleSide //两面可见

}

let mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
```



## **# 光源设置--点光源**

```js
let point = new THREE.PointLight(0xef34ea)

point.position.set(400, 200, 300) //点光源位置

scene.add(point)
```



## **# 光源设置--环境光**

```javascript
let ambient = new THREE.AmbientLight(0x444444);

scene.add(ambient)
```



## **# 相机设置**

```js
let k = width / height; //窗口宽高比

let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)//OrthographicCamera可替换为其他相机，

camera.position.set(200, 300, 200); //设置相机位置

camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```



## **# 创建渲染器对象**

```js
let renderer = new THREE.WebGLRenderer()

renderer.setSize(width, height);//设置渲染区域尺寸

renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

dom.appendChild(renderer.domElement); //body元素中插入canvas对象

renderer.render(scene, camera);
```



## **# 使用OrbitControls---可拖拽旋转平移放大缩小**

```js
function render(){

   renderer.render(scene, camera);

}

var controls = new OrbitControls(camera,renderer.domElement)

controls.addEventListener('change', render)
```



## **# 出现坐标系**

```js
let axisHelper = new THREE.AxisHelper(250);

scene.add(axisHelper);
```



## **# 渐变色**

```js
let colors = new Float32Array([



])

geometry.attributes.color = new THREE.BufferAttribute(colors, 3)//3,与类型数组创建顶点数据相同

material = new THREE.MeshBasicMaterial({

  vertexColors: THREE.VertexColors,

  side: THREE.DoubleSide //两面可见

});
```



## **# 顶点法向量**

```js
let normals = new Float32Array([

 0, 0, 1, //顶点1法向量

 0, 0, 1, //顶点2法向量

 0, 0, 1, //顶点3法向量



 0, 1, 0, //顶点4法向量

 0, 1, 0, //顶点5法向量

 0, 1, 0, //顶点6法向量

]);

// 设置几何体attributes属性的位置normal属性

geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
```



## **# 顶点索引复用顶点数据**

```js
//原来

let vertices = new Float32Array([

  0, 0, 0, //顶点1坐标

  50, 0, 0, //顶点2坐标

  0, 100, 0, //顶点3坐标

  0, 0, 10, //顶点4坐标

  0, 0, 100, //顶点5坐标

  50, 0, 10, //顶点6坐标

]);

//使用顶点索引

let vertices = new Float32Array([

  0, 0, 0, //顶点1坐标

  80, 0, 0, //顶点2坐标

  80, 80, 0, //顶点3坐标

  0, 80, 0, //顶点4坐标

])

let attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组

let indexes = new Uint16Array([

 // 0对应第1个顶点位置数据、第1个顶点法向量数据

 // 1对应第2个顶点位置数据、第2个顶点法向量数据

 // 索引值3个为一组，表示一个三角形的3个顶点

 0, 1, 2,

 0, 2, 3,

])

// 索引数据赋值给几何体的index属性

geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
```

