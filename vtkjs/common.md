## 根据图像尺寸与世界坐标点坐标计算该点在一维数组中的下标

作用：vtk.js的vtkImageData的源数据是一个ArrayBuffer的一维数组，在有图像尺寸与点世界坐标的情况下可以找到对应的下标，从而获取或者修改对应的值

方法：假设图像尺寸是H,W,C，点的坐标是（x列索引，y行索引，z通道索引），转换为一维坐标是x+y*H+z*H*W，该点坐标为图像坐标(0 =< x <= W-1,0 <= y <= H-1,0 <= z <= C-1)，如果获取到的点位是世界坐标，需要将世界坐标转化为图像坐标，需要获取到图像的spacing与origin

例：

```js
let demisions = [512,512,306];//尺寸，imageData的源数据长度为512*512*306 = 80216064
let wPoint = [182.1240234375, -52.124023437500014, -246];//世界坐标点
let origin = [-202.1240234375, -332.1240234375, -246]
let spacing = [0.751953125, 0.751953125, 1]
let pixelPoint = wPoint.map((val,index) => {
    //有时不需要origin，视具体情况使用
    return Math.round((val - origin[index]) / spacing[index])
  });//转化为图像坐标，得到[511, 372, 0]
let index = pixelPoint[0] + pixelPoint[1] * demisions[0] + (pixelPoint[2] * demisions[0]) * demisions[1]//得到190975
```

