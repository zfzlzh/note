必须放在main函数中

```glsl
void main {
//内容
}
```

## 版本声明

\#version 300 es 声明为指定使用 OpenGL ES 3.0 版本

\#version 100 es 或不加声明为指定使用 OpenGL ES 3.0 版本

3.0向下兼容2.0，

当声明为3.0但机器最高只支持2.0时，会报错

## 关键字

**attribute**（从缓冲中获取的数据）：只能用于**顶点着色器**中，用来声明在GLSL中的**全局变量**，被用来表示**顶点信息**

```glsl
attribute vec4 a_Position  //定义一个叫a_Position的vec4类型的变量
```

**uniform**（在一次绘制中对所有顶点保持一致值）：既可以在**顶点着色器**中使用，也可以在**片元着色器**中使用，它也是一个**全局变量**，可以是除了数组与结构体的**任何类型**，在顶点着色器和片元着色器定义了同名uniform变量时会被二者共享，即会被所有**顶点和片元共用**，它可以被用来存储变换矩阵，时间纹理等

```glsl
uniform mat4 modelMatrix //定义一个类型为mat4的名为modelMatrix的变量
```

**varying**（可变量）：也是一个**全局变量**，与uniform不同的一点是：他必须**同时**在顶点着色器和片元着色器中定义**同名同类型**的varying变量，它的作用是把顶点着色器的数据传递给片元着色器

```glsl
//顶点着色器中
varying vec2 v_uv;
void main() {
  v_uv = uv;
  ···
}
//片元着色器中接收来自顶点着色器中的uv信息,并把它作为rbga中的前俩个值
varying vec2 v_uv;
void main() {
  gl_FragColor = vec4(v_uv, 0.0, 1.0); 
}
```

## 精度限定关键字 --- precision lowp/mediump/highp

在GLSL中需要指定精度以提高运行效率，减少内存损耗，可以在开头指定以下三个之一。

```glsl
precision lowp float;
precision medium float;
precision highp float;
```

## 模型转换矩阵

将一个（外部引入）模型的最终显示到二维屏幕上，实际经历了一系列模型转换过程，流程如下。后续我会单独记录一下流程原理，其中相机坐标系又叫做视图坐标系；目前只需要知道他们在threejs中是如何代表的:

![](C:\Users\zfz\Desktop\笔记\note\threejs\着色器.jpg)

在webgl中它们的类型和名称如下：

```glsl
uniform mat4 modelMatrix; // 模型转换矩阵
uniform mat4 viewMatrix; // 视图矩阵
uniform mat4 projectionMatrix; // 投影矩阵
position // 模型坐标系中的坐标
```

## 内置的特殊变量

**vertex Shader** ：

```glsl
highp vec4 gl_Position;//gl_Position 放置顶点坐标信息
mediump float gl_PointSize;//gl_PointSize 需要绘制点的大小,(只在gl.POINTS模式下有效)
```

**fragment Shader**:

```glsl
//input类型
mediump vec4 gl_FragCoord;//片元在framebuffer画面的相对位置
bool gl_FrontFacing;//标志当前图元是不是正面图元的一部分
mediump vec2 gl_PointCoord;//经过插值计算后的纹理坐标,点的范围是0.0到1.0
//output类型
mediump vec4 gl_FragColor;//设置当前片点的颜色
mediump vec4 gl_FragData[n];//设置当前片点的颜色,使用glDrawBuffers数据数组
```



## 流控制

glsl的流控制和c语言非常相似,这里不必再做过多说明,唯一不同的是片段着色器中有一种特殊的控制流`discard`.
使用discard会退出片段着色器，不执行后面的片段着色操作。片段也不会写入帧缓冲区。

# RawShaderMaterial与ShaderMaterial

threejs中内置了这两种材质可以进行glsl编写，区别在于ShaderMaterial内置了许多许多常用的GLSL变量，而RawShaderMaterial没有

### 使用RawShaderMaterial进行编写

在顶点着色器中，主要做了这么几件事：

- 获取模型的每个顶点的模型坐标和uv坐标
- 使用varying定义v_uv,获取顶点的uv值传递给片元着色器
- 计算每个顶点的裁剪坐标 gl_Position(在RawShaderMaterial中需要手动计算)

顶点着色器（vertexShader）内容

```glsl
attribute vec3 position; // 顶点的坐标信息
attribute vec2 uv; // 顶点的uv坐标信息

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
//使用ShaderMaterial时以上内容不用写出来，会自动加上
varying vec2 v_uv;  // 要传递给片元着色器的数据

precision lowp float;//设置精度为lowp

void main() {
 	v_uv = uv; // uv坐标信息
 	// gl_Position为每个点裁剪坐标，在RawShaderMaterial可以使用下式获取
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

在片元着色器中，主要做了：

- 接收来自顶点着色器的信息——顶点坐标的uv
- 将来自顶点着色器的信息赋给颜色rgba中的rg值（gl_FragColor 表示片元颜色)

片元着色器（fragmentShader）内容

```glsl
precision lowp float;//设置精度为lowp,放第一行，换地方报错了
varying vec2 v_uv; // 接收来自顶点着色器的信息

void main() {
 	gl_FragColor = vec4(v_uv, 0.0, 1.0);  // 将来自顶点着色器的信息赋给颜色rg值（gl_FragColor 表示片元颜色)
}
```

引入写好的glsl

```js
import basicVertexShader from '../shader/vertexShader.glsl'
import basicFragmentShader from '../shader/fragmentShader.glsl'
···
const shaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
})
```

最终效果

![](C:\Users\zfz\Desktop\笔记\note\threejs\RawShaderMaterial例子效果图.png)

### 着色器变换操作

对模型的xyz坐标进行处理，修改顶点着色器，对于每个点顶点：

- XY坐标整体移动1.0个单位
- Z坐标随着其X坐标成正弦分布

```glsl
void main() {
	v_uv = uv; // uv坐标信息
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += 1.0;
    modelPosition.y += 1.0;
    modelPosition.z += 0.1 * sin(modelPosition.x * 10.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
```

材质修改

```js
 const shaderMaterial = new THREE.RawShaderMaterial({
      // 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side:THREE.DoubleSide
    })
```

效果

![](C:\Users\zfz\Desktop\笔记\note\threejs\修改顶点着色器效果1.png)

对模型的片元着色器再进行处理，按照Z坐标的大小为其设置颜色：

顶点着色器中设置varying float f_height， 用来向片元着色器传递模型的Z坐标
片元着色器中声明arying float f_height接收来自顶点着色器的信息，在main函数中接受它，把这个值赋给rgba中的第一位
顶点着色器：

```glsl
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_uv;
varying float f_height;// 传递Z

precision lowp float;

void main() {
	// v_uv = uv; // uv坐标信息
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += 1.0;
    modelPosition.y += 1.0;
    modelPosition.z += 0.1 * sin(modelPosition.x * 10.0); 
  f_height = modelPosition.z // 放入传递的数据
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
```

片元着色器：

```glsl
// varying vec2 v_uv;
varying float f_height; // 传递来的Z坐标
precision lowp float;

void main() {
  float height = f_height + 1.0;  // 创建变量接收数据
  // gl_FragColor = vec4(v_uv, 0.0, 1.0); 
  gl_FragColor = vec4(height * 1.0, 0.0, 0.0, 1.0);
}
```

波峰处R值很高，而波谷Z坐标为0，接近纯黑色，效果

![](C:\Users\zfz\Desktop\笔记\note\threejs\修改顶点与片元着色器效果.png)

### 让着色器动起来

在RawSahderMaterial中，需要我们手动将时间传递给着色器，为此我们需要：

定义Three.Clock变量，获取每帧的当前时间
在 RawShaderMaterial中定义uniform，将获取到的时间传递给它
片元着色器中接收时间，并把它传给坐标，实现“动起来”的效果
为此，需要对原有代码进行一些改造，同时也调整一下片元着色器的亮度

```js
const clock = useRef(new THREE.Clock()).current // 定义Three.Clock
  const shaderMaterial = useRef(null) // 将材质提到全局
  ···
	
// 初始化地板
  const initGeometry = () => {

    // 原始着色器材质
    shaderMaterial.current = new THREE.RawShaderMaterial({
      // 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 }
      },
      side: THREE.DoubleSide
    })

    const floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 32, 32),
      shaderMaterial.current
    );
    scence.add(floor)
  }	

  ···
  // 渲染器执行渲染
  const renderScene = useCallback(() => {
    console.log('renderScene')
    timer.current = window.requestAnimationFrame(() => renderScene())
    controls.update();

    const curElapsedTime = clock.getElapsedTime()
    shaderMaterial.current.uniforms.uTime.value = curElapsedTime
    // console.log(curElapsedTime,'---')
    render.render(scence, camera);
  }, [render])
```

顶点着色器：

```glsl
precision lowp float;
      attribute vec3 position;
      attribute vec2 uv;
      
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime; // 接收时间
      
      varying vec2 v_uv;
      varying float f_height;

      void main() {
        v_uv = uv; // uv坐标信息
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        modelPosition.x += 1.0;
        modelPosition.y += 1.0;
        modelPosition.z = 0.05 * sin((modelPosition.x + uTime)* 10.0);
        modelPosition.z += 0.05 * sin((modelPosition.y + uTime)* 10.0);
        f_height = modelPosition.z;
       gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
```

![](C:\Users\zfz\Desktop\笔记\note\threejs\着色器动图.gif)

### 使用ShaderMaterial代码---飘动的布料

index.vue

```js
//引入自定义着色器
import vertexShader from './vertexShader.glsl.js'
import fragmentShader from './fragmentShader.glsl.js'
//....构建threejs环境代码省略
function createOffice(){
    //构建一个1*1的平面，平面的宽度与高度分段数为32，改变宽高，需要同时修改分段数，如50*50，分段数为20
  const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32); 
  shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,//赋值自定义着色器--顶点着色器
    fragmentShader: fragmentShader,//赋值自定义着色器--片段着色器
    side: THREE.DoubleSide,
    uniforms:{//自定义着色器中使用的uniform变量
      uTime:{value:0},//时间
      uFrequency:{value:new THREE.Vector2(10, 5)},//速度，改变宽高时，10*宽，5*高
      vElevationX:{value:1.5}//系数，修改宽高时也需修改
    }
  });
  let mesh = new THREE.Mesh(geometry, shaderMaterial);
  scene.add(mesh)
}

```



vertexShader.glsl.js

```js
//js无法直接导入glsl文件，所以在js文件中使用模板字符串书写导出
export default /* glsl */ `
varying float f_height;
varying vec2 vUv; 

uniform float uTime;
uniform vec2 uFrequency;
uniform float vElevationX;

void main() {
	vUv = uv; 
	vec4 modelPosition = modelMatrix * vec4(position, 1.0); 
	//计算z轴坐标，实现飘扬效果
	float elevation = vElevationX * sin(modelPosition.x * uFrequency.x - uTime);
  	elevation += 0.1 * sin(modelPosition.y * uFrequency.y - uTime);
	modelPosition.z += elevation;
	//传递到片段着色器中生成阴影
  	f_height = 0.2 * sin(modelPosition.x * uFrequency.x - uTime);

	vec4 viewPosition = viewMatrix * modelPosition;
	gl_Position = projectionMatrix * viewPosition;
}`;
```

fragmentShader.glsl.js

```js
export default /* glsl */ ` 
precision lowp float;
varying float f_height;

void main() {
  float height = f_height + 1.0;
  gl_FragColor = vec4(height * 1.0, 0.0, 0.0, 1.0);
}`;
```

