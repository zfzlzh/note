## 基本原理

读取已经渲染好的DOM元素的结构和样式信息，然后基于这些信息去构建截图，呈现在canvas画布中。

它无法绕过浏览器的内容策略限制，如果要呈现跨域图片，需要设置一个代理。

```shell
npm install html2canvas
```

```html
<div id="parent">
	<div id="children1"></div>
	<div id="children2"></div>
	<div id="children3">
		<div id="children3_1"></div>
	</div>
	<div id="children4"></div>
</div>
```

```js
import html2anvas from 'html2canvas'
html2canvas(
    //需要转为canvas的dom
    document.getElementById('parent'),
    //配置项，可不传
    {
    	allowTaint:false,//是否允许跨域图像污染画布
        backgroundColor:'#ffffff',//画布背景颜色，如果dom中没有置顶，设置'null'(透明)
        canvas:null,//使用现有画布元素
        foreignObjectRendering:false,//是否使用ForeignObject渲染
        imageTimeout:15000,//加载图像的超时时间（ms），设置为0禁用超时
        ignoreElements:(element) => false,//从元素中排除匹配元素，返回true的元素被排除
        logging:true,//启用日志记录
        onclone:null,//回调函数，参数为每个dom，可以用来修改将要呈现的内容，不影响原始文档
        proxy:null,//用来加载跨域图片的代理URL，默认为空，为空不会加载跨域图片
        removeContainer:true,//是否清除html2canvas临时创建的克隆DOM元素
        scale:window.devicePixelRatio,//用于渲染的缩放比例，默认为浏览器设备像素比
        useCORs:false,//是否尝试使用CORS从服务器加载图像
        width:Element.width,//canvas的宽度
        height:Element.height,//canvas的高度
        x:Element.x-offset,//canvas的x轴位置
        y:Element.y-offset,//canvas的y轴位置
        scrollX:Element.scrollX,//渲染元素时使用的x轴位置
        scrollY:Element.scrollY,//渲染元素时使用的y轴位置
        windowWidth:Window.innerWidth,//渲染元素时使用的窗口宽度，这可能会影响诸如媒体查询之类的事情
        windowHeight:Window.innerHeight,//渲染元素时使用的窗口高度，这可能会影响诸如媒体查询之类的事情
	}
).then(canvas => {
    let dataURL = canvas.toDataURL("image/png");
})
```

## 忽略元素的方法

### 1.使用options中的ignoreElements

```js
html2canvas(
    //需要转为canvas的dom
    document.getElementById('parent'),
    {
    	ignoreElements:(element) => {
            return element.id != 'children2'
        }
    }
 )
```

### 2.在元素上添加`data-html2canvas-ignore`属性

```html
<div id="parent">
	<div id="children1"></div>
	<div id="children2" data-html2canvas-ignore></div>
	<div id="children3">
		<div id="children3_1"></div>
	</div>
	<div id="children4"></div>
</div>
```

