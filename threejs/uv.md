### 三维建模中的"UV"可理解为立体模型的“皮肤”，将“皮肤”展开然后进行二维平面上的绘制并赋予物体，例如立方体的uv展开图如下



![](C:\Users\zfz\Desktop\笔记\note\threejs\立方体展开uv.jpg)

![](C:\Users\zfz\Desktop\笔记\note\threejs\矩形uv.png)

## 已知模型的xy点位坐标，生成模型和设置uv

```js
//坐标
var c = [
  0, 0, //顶点1坐标
  60, 0, //顶点2坐标
  60, 80, //顶点3坐标
  40, 120, //顶点4坐标
  -20, 80, //顶点5坐标
  0, 0, //顶点6坐标  和顶点1重合
]
var posArr = [];
var uvrr = [];
var h = 20; //高度，z轴数据
for (var i = 0; i < c.length - 2; i += 2) {
  // 三角形1  三个顶点坐标
  posArr.push(
      c[i], c[i + 1], 0, 
      c[i + 2], c[i + 3], 0, 
      c[i + 2], c[i + 3], h
  );
  // 三角形2  三个顶点坐标
  posArr.push(
      c[i], c[i + 1], 0,
      c[i + 2], c[i + 3], h, 
      c[i], c[i + 1], h
  );

  // 注意顺序问题，和顶点位置坐标对应，一起顺时针或逆时针
  uvrr.push(
      0, 0, 
      1, 0, 
      1, 1
  );
  uvrr.push(
      0, 0, 
      1, 1, 
      0, 1
  );
}
```

![](C:\Users\zfz\Desktop\笔记\note\threejs\uv设置方向.png)