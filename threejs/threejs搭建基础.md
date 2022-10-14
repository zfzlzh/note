## **1 创建场景对象Scene**

```javascript
let scene = new THREE.Scene()
```



## **2. 创建网格模型**

```javascript
let geometry = new THREE.SphereGeometry(60, 40, 40)//SphereGeometry为球体，替换为其他geometry生成其他图形
```



## **3. 材质**

```javascript
let material = new THREE.MeshStandardMaterial({

  color:0xff0000,
  opacity:0.1,
  transparent:true,//为false时opacity不起作用
  wireframe:false,//是否为线框。默认false
  specular:0xff0000,//球体网格模型的高光颜色
  shininess:12,//光照强度的系数
  ...

})

//MeshStandardMaterial可替换为其他材质内容
//MeshBasicMaterial  基础网格材质,不受光照影响的材质
//MeshLambertMaterial()  漫反射
//MeshPhongMaterial()  镜面反射
//MeshStandardMaterial  PBR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃等效果
```



## ** 4.网格模型对象**

```javascript
let mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
```



## **#5.多个对象需要移动位置时**

```js
mesh.translateX(120)//yz同理
```



## **6.类型数组创建顶点数据**

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



## **7.光源设置**

仅仅使用环境光的情况下，你会发现整个立方体没有任何棱角感，这是因为环境光只是设置整个空间的明暗效果。如果需要立方体渲染要想有立体效果，需要使用具有方向性的点光源、平行光源等。

点光源

```js
let point = new THREE.PointLight(0xef34ea)

point.position.set(400, 200, 300) //点光源位置

scene.add(point)
```

环境光源

```javascript
let ambient = new THREE.AmbientLight(0x444444);

scene.add(ambient)
```

平行光（比如太阳光）

```js
let directional = new THREE.DirectionalLight(0x444444);

scene.add(directional)
```

聚光源

```js
let spot = new THREE.SpotLight(0x444444);

scene.add(spot)
```



## **8.相机设置**

```js
let k = width / height; //窗口宽高比

let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)//OrthographicCamera可替换为其他相机，

camera.position.set(200, 300, 200); //设置相机位置

camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```



## **9. 创建渲染器对象**

```js
let renderer = new THREE.WebGLRenderer()

renderer.setSize(width, height);//设置渲染区域尺寸

renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

dom.appendChild(renderer.domElement); //body元素中插入canvas对象

renderer.render(scene, camera);
```



## **10.使用OrbitControls---可拖拽旋转平移放大缩小**

```js
function render(){

   renderer.render(scene, camera);

}

var controls = new OrbitControls(camera,renderer.domElement)

controls.addEventListener('change', render)//当有使用requestAnimationFrame进行周期性的渲染时可以不用监听，当两者同时使用时不可绑定同一个函数，会冲突
```



## **11.出现坐标系**

```js
let axisHelper = new THREE.AxisHelper(250);//新版本叫AxesHelper，老版本叫AxisHelper

scene.add(axisHelper);
```



## **12.渐变色**

```js
let colors = new Float32Array([



])

geometry.attributes.color = new THREE.BufferAttribute(colors, 3)//3,与类型数组创建顶点数据相同

material = new THREE.MeshBasicMaterial({

  vertexColors: THREE.VertexColors,

  side: THREE.DoubleSide //两面可见

});
```



## 13.顶点法向量

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



## **14. 顶点索引复用顶点数据**

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

