# hue-rotate(angle) -- 色相旋转

hue-rotate(angle)函数是一个内置函数，用于对图像应用滤镜以设置图像的色调旋转

该函数接受单参数角度，该角度保持hue-rotation的角度。正色相角会增加色相值，而负角会降低色相值。

使用hue-rotate改变背景色与背景色变换动画：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div{
      width:30vw;
      height:30vh
    }
    /* 动画 */
    .hue-rotate{
      background: linear-gradient(45deg, #ffc107, #409eff, #9c27b0);
      animation: hueRotate 10s infinite alternate;
    }
    @keyframes hueRotate {
      0% {
          filter: hue-rotate(0);
      }
      100% {
          filter: hue-rotate(360deg);
      }
    }
    /* 悬浮过渡改变颜色 */
    .hue-rotate-transition{
      background: linear-gradient(45deg, #ffc107, #409eff, #9c27b0);
      transition: filter 1s linear;
    }
    .hue-rotate-transition:hover{
      filter:hue-rotate(270deg)
    }
  </style>
</head>
<body>
  <div class="hue-rotate"></div>
    <div class="hue-rotate-transition"></div>
</body>
</html>
```

# blur(radius) -- 高斯模糊

设置高斯模糊，radius不接受百分比参数，px,rem,em,vw,vh,vmin,vmax均可

```css
xx{
	filter:blur(10px)
}
```

# brightness(num) -- 亮度

更亮或更暗，值是0%，图像会全黑。值是100%，则图像无变化，默认为1，可为百分比或小数，一般取值范围是0-1，也可取超出1的值，会更加明亮，不可取负数

```css
xx{
	filter:brightness(1)
}
```

# contrast(num) --对比度

值是0%的话，图像会全黑。值是100%，图像不变。值可以超过100%，意味着会运用更低的对比，与亮度相似

```css
xx{
	filter:contrast(40%)
}
```

# drop-shadow(*h-shadow v-shadow blur spread color*) -- 阴影

给图像设置一个阴影效果。阴影是合成在图像下面，可以有模糊度的，可以以特定颜色画出的遮罩图的偏移版本。 函数接受<shadow>(在CSS3背景中定义)类型的值，除了"inset"关键字是不允许的。该函数与已有的box-shadow box-shadow属性很相似；不同之处在于，通过滤镜，一些浏览器为了更好的性能会提供硬件加速

h-shadow :水平偏移量，必须，长度，不能为除0外的纯数字

v-shadow :垂直偏移量，必须，长度，不能为除0外的纯数字

blur：模糊度

spread：放大缩小，Webkit, 以及一些其他浏览器 不支持该属性，加了直接渲染不出来

color：颜色

```css
xx{
	filter:drop-shadow(10px 0 10px #409eff) 
}
```

# grayscale(*%*) --灰度

将图像转换为灰度图像,为100%则完全转为灰度图像，值为0%图像无变化,可取百分比与数字，范围在0-1之间

```
xx{
	filter:grayscale(20%)
}
```

# invert(%) -- 反转

反转输入图像。值定义转换的比例。100%的价值是完全反转。值为0%则图像无变化。值在0%和100%之间，与灰度类似

```
xx{
	filter:invert(20%)
}
```

# opacity(%) -- 透明度

该函数与已有的opacity属性很相似，不同之处在于通过filter，一些浏览器为了提升性能会提供硬件加速。

```
xx{
	filter:opacity(20%)
}
```

# saturate(%)--饱和度

与对比度类似

```
ss{
	filter:saturate(10%)
}
```

# sepia(*%*) -- 深褐色

与灰度类似

```
xx{
	filter:sepia(10%)
}
```

# url() -- svg滤镜

URL函数接受一个XML文件，该文件设置了 一个SVG滤镜，且可以包含一个锚点来指定一个具体的滤镜元素。

```
xx{
	filter: url(svg-url#element-id)
}
```

# initial --设置为默认值

设置属性为默认值,filter属性默认值为none

```
xx{
	filter:initial
}
```

# inherit --继承父元素的属性

继承父元素的filter属性

```
xx{
	filter:inherit
}
```

# 多个滤镜

使用多个滤镜，每个滤镜使用空格分隔

```
xx{
	filter:contrast(200%) brightness(150%)
}
```

