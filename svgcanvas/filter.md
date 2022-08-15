# svg-filter滤镜

## 1.基础滤镜

**将滤镜效果加在图形上需要用feDisplacementMap或feComposite**

```html
<feOffset dx="0" dy="0"/>
<--表示偏移，0，0为没有偏移-->

```

```html
<--高斯模糊，stdDeviation表示模糊程度，result属性值是自己定义的，相同于把结果输出，然后给其他滤镜使用。-->
<feGaussianBlur stdDeviation="6" result="offset-blur"/>
```

```html
<--混合滤镜，实现混合效果-->
<--in表示在上面的输入资源，in2表示在下面的输入资源-->
<--SourceGraphic表示应用滤镜的资源图形-->
<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
```

operator表示**混合模式**，支持以下模式

```js
 /**
  * operator可取模式，与canvas的globalCompositeOperation类似
  * over --- 直接覆盖在上面
  * in --- 重叠的地方混合，不重叠的地方透明
  * out --- 原始图像和高斯模糊重叠的位置是透明，即原始图像只有边缘高斯模糊的区域显示
  * atop ---
  * xor ---
  * lighter ---
  * arithmetic ---
 */
```

```html
<--颜色投影，修改颜色与不透明度-->
<feFlood flood-color="black" flood-opacity=".95" result="color"/>
```

## 例子：添加内阴影

```xml
<--内阴影-->
<filter id="inset-shadow">
    <!-- 投影偏移 -->
    <feOffset dx="0" dy="0"/>
    <!-- 投影模糊 -->
    <feGaussianBlur stdDeviation="6" result="offset-blur"/>
    <!-- 反转投影使其变成内投影 -->
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
    <!-- 内投影附加黑色 -->
    <feFlood flood-color="black" flood-opacity=".95" result="color"/>
    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
    <!-- 把内投影显示在图像上，如果需要底色为透明只显示阴影，则此步不需要加 -->
    <feComposite operator="over" in="shadow" in2="SourceGraphic"/> 
  </filter>
```

## 2.湍流滤镜--feTurbulence

用于制作云朵，烟雾，火焰，水流，波纹等效果;

属性如下：

```js
/**
* baseFrequency --噪声的基本频率参数，默认值是0，频率越高，噪声越密集（即如水流效果，越大水流越密）
	----值可为'0.012 0.12'的样式，前后比前小后大，垂直；前小后大，水平。
* numOctaves --倍频，可理解为由频率和振幅定义的噪声函数，越大越自然，计算也会更多，可能会有性能问题，默认1，整数，小数会被当做1
*seed --伪随机数生成的起始值，不同数量的seed不会改变噪声的频率和密度，改变的是噪声的形状和位置
*stitchTiles --定义了Perlin噪声在边框处的行为表现，支持两个属性值，分别是noStitch和stitch
	----noStitch
		默认值。表示如果SVG中有多个元素同时使用了feTurbulence滤镜效果，则在各个元素的边界处的湍流各自为政，因此，不会表现为平滑。
	----stitch
		表示会自动调整坐标，让下一个噪声图形应用上一个噪声图形的宽高等数据，如果这几个元素相互连接，则会看到平滑的边界效果。
*type --- 类型，fractalNoise和turbulence
	----turbulence
		默认值。表示湍流、混乱。
	----fractalNoise
		表示分形噪声。
*/
```

## 3.置换贴图滤镜--feDisplacementMap

可以让图形按照R、G、B通道的颜色进行位置的偏移，从而让图形产生各种形变的效果。

实际上是一个位置替换滤镜，就是改变元素和图形的像素位置的。

`map`含义和ES5中数组的`map`方法是一样的，遍历原图形的所有像素点，使用`feDisplacementMap`重新映射替换一个新的位置，形成一个新的图形。

因此，`feDisplacementMap`滤镜在业界的主流应用是对图形进行形变，扭曲，液化.

公式：P'(x,y) = P( x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5))

· `P'(x,y)`指的是转换之后的`x, y`坐标。
· `x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5)`指的是具体的转换规则。
· `XC(x,y)`表示当前`x,y`坐标像素点其X轴方向上设置的对应通道的计算值，范围是0~1。
· `YC(x,y)`表示当前`x,y`坐标像素点其Y轴方向上设置的对应通道的计算值，范围是0~1。
· `-0.5`是偏移值，因此`XC(x,y) - 0.5`范围是`-0.5~0.5`，`YC(x,y) - 0.5`范围也是`-0.5~0.5`。
· `scale`表示计算后的偏移值相乘的比例，`scale`越大，则偏移越大。

根据设定的通道颜色对原图的`x, y`坐标进行偏移.

属性：

```js
/**
* xChannelSelector --表示X轴坐标使用的是哪个颜色通道进行位置偏移(R,G,B,A),默认是A，基于透明度进行位置偏移。
 ----  当设为A时，透明度为1并不会不变化，根据公式计算会有偏移量，当为0.5时不变
* yChannelSelector -- 同xChannelSelector
* color-interpolation-filters --表示滤镜对颜色进行计算时候采用的颜色模式类型 --linearRGB（默认值）和sRGB（Safari兼容问题）
*in，in2 --- 输入，对于该标签，`in`表示输入的原始图形，`in2`表示用来映射的图形。
	---- 值为
	SourceGraphic --- 使用该filter元素的图形作为原始图像，
	SourceAlpha，
	BackgroundImage，
	BackgroundAlpha，
	FillPaint，
	StrokePaint，
	以及自定义的滤镜的id
* scale ---缩放比例，可正可负，默认是0，通常使用正数值处理，值越大，偏移越大。
*/
```



## 4.feDisplacementMap与feTurbulence一起使用实现自然效果

水波纹效果

```html
<--图片-->
<img src="/public/img/loginBack.png" alt="" style="width:100%;height:100%" class="reflect">
<--滤镜-->
<svg width="0" height="0" style="posiotion:absolute;">
    <filter id="displacementFilter">
        <feTurbulence type="turbulence" :baseFrequency="baseFrequency" numOctaves="1" result="turbulence"  seed="53" />
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="B" />
    </filter>
  </svg>
---css部分
.reflect {
    // transform: scaleY(-1);翻转
    filter: url(#displacementFilter);
}
```



```js
//实现水面波纹的动画效果，通过修改baseFrequency的值实现
var frames = 0;
var rad = Math.PI / 180;
const baseFrequency = ref<string>("0.01 .1")
function AnimateBaseFrequency() {
  let bf = "0.01 .1"
    let bfx = Number(bf.split(" ")[0]);
    let bfy = Number(bf.split(" ")[1]);
    frames += .5
    bfx += 0.001 * Math.cos(frames * rad);
    bfy += 0.005 * Math.sin(frames * rad);

    baseFrequency.value = bfx.toString() + ' ' + bfy.toString();

    requestAnimationFrame(AnimateBaseFrequency);
}

window.requestAnimationFrame(AnimateBaseFrequency);
```

原理：

feTurbulence： `baseFrequency`的属性值的水平和垂直的噪点频率比是1:10，因此，会有类似水平拉伸的效果。

feDisplacementMap：根据R（红色）通道进行水平方向的位置偏移，根据B（蓝色）通道进行垂直方向位置偏移，由于彩色湍流水平拉伸了，因此，最终的滤镜效果就是一个水平方向拉伸为主的液化效果，视觉上就像是自然界水波荡漾的效果

## 3.设置了filter，直线不显示

**方法：修改filterUnits由objectBoundingBox为userSpaceOnUse，同时检查x,y,width,height是否过小**

```js
//滤镜效果区域
//filterUnits = "userSpaceOnUse | objectBoundingBox"
//userSpaceOnUse表示使用引用该filter元素的元素的用户坐标系统。
//objectBoundingBox表示使用引用该filter元素的元素的包围盒的百分比做取值范围
//包含x,y,width,height这4个属性，滤镜效果不会应用在超过这个区域的点上，x,y的默认值是-10%，width与height的默认值是120%。
```

