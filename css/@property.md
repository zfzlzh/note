@property,是 CSS Houdini API 的一部分, 它允许开发者显式地定义他们的 CSS 自定义属性，允许进行属性类型检查、设定默认值以及定义该自定义属性是否可以被继承。

CSS Houdini API : 开放 CSS 的底层 API 给开发者，使得开发者可以通过这套接口自行扩展 CSS，并提供相应的工具允许开发者介入浏览器渲染引擎的样式和布局流程中，使开发人员可以编写浏览器可以解析的 CSS 代码，从而创建新的 CSS 功能

使用方式：

```css
//在<style>中使用
@property --name{     //自定义名称,在css中使用 var(--name) 使用
	syntax: '<color>';   //该自定义属性的语法规则，也可以理解为表示定义的自定义属性的类型，必须
	inherits: false;    //是否允许继承，必须
	initial-value: fuchsia;  //初始值
}
```

```js
//在js中使用
CSS.registerProperty({
    name:'',
    syntax: '<color>',
	inherits: false,
	initial-value: fuchsia,
})
```

## syntax取值：

- length
- number
- percentage
- length-percentage
- color
- image
- url
- integer
- angle
- time
- resolution
- transform-list
- transform-function
- custom-ident (a custom identifier string)

## syntax符号

+：空格分隔

#：逗号分隔

|：或者

例子：

```css
<color#>   //接受 逗号 分隔的颜色值列表
<color+>   //接受 空格 分隔的颜色值列表
<color | color#>   //接受单个颜色值  或者  逗号分隔的颜色值列表
```

## 例子：使用@property制作渐变背景动画

渐变色不支持动画与过渡，除了@property之外，还可以使用background-size，background-position，filter:hue-rotate,transform之类的实现，

注：background-size，background-position会引起大量重绘，不建议使用，transform方法为设置一个比元素要大的伪元素，给伪元素添加渐变，通过transform移动伪元素来达到渐变动画的效果，filter:hue-rotate方法见filter.md文件

@property实现代码

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
   @property --colorA{
       syntax: '<color>';
       inherits: false;
       initial-value: #409eff;
   }
   @property --colorB{
       syntax: '<color>';
       inherits: false;
       initial-value: #3cf774;
   }
   @property --colorC{
       syntax: '<color>';
       inherits: false;
       initial-value: #e6510c;
   }
    .property{
      background: linear-gradient(45deg, var(--colorA), var(--colorB), var(--colorC));
      animation: propertyAni 10s infinite alternate;
    }
    @keyframes  propertyAni{
      0% {
        --colorA:#409eff;
        --colorB:#3cf774;
        --colorC:#e6510c;
      }
      25% {
        --colorA:#10caeb;
        --colorB:#96ec0b;
        --colorC:#e61a0c;
      }
      50% {
        --colorA:#971be9;
        --colorB:#08d8e7;
        --colorC:#e25353;
      }
      75% {
        --colorA:#dbf10d;
        --colorB:#f33809;
        --colorC:#3414eb;
      }
      100% {
        --colorA:#eb640b;
        --colorB:#12dfce;
        --colorC:#0fdd8e;
      }
    }
    /* 使用过渡  */
    .property-transition{
      background: linear-gradient(45deg, var(--colorA), var(--colorB), var(--colorC));
      transition: 1s --colorA,1s --colorB,1s --colorC;
    }
    .property-transition:hover{
        --colorA:#dbf10d;
        --colorB:#f33809;
        --colorC:#3414eb;
    }
  </style>
</head>
<body>
  <div class="property"></div>
  <div class="property-transition"></div>
</body>
</html>
```

