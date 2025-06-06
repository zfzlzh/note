# 1.判断浏览器

```javascript
 	let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1;
	//判断是否Opera浏览器
    if (isOpera) {
        return "Opera"
    }; 
	//判断是否Firefox浏览器
   	if (userAgent.indexOf("Firefox") > -1) {
		this.browser="FF";
	} 
	//判断是否IE浏览器
	if (userAgent.indexOf("Trident") > -1) {
		this.browser="IE";
	}; 
 	//苹果、谷歌内核
	if (userAgent.indexOf("AppleWebKit") > -1) {
          this.browser = "Chrome";
    } 
```

# 2.实时监听input框oninput方法

```js
//实时监听input框oninput方法，ie用onpropertychange方法
// oninput 事件是 IE 之外的大多数浏览器支持的事件，在 value 改变时触发，实时的，即每增加或删除一个字符就会触发，然而通过 js 改变 value 时，却不会触发。
// onpropertychange 事件是任何属性改变都会触发的，而 oninput 却只在 value 改变时触发，
//oninput 要通过 addEventListener() 来注册，onpropertychange 注册方式跟一般事件一样。（此处都是指在js中动态绑定事件，以实现内容与行为分离）
	var inputBlock = false
	var searchInput = document.getElementById('projectName')
	// 防止中文输入法拼音触发oninput事件
	//监听中文输入法开始输入
	searchInput.addEventListener('compositionstart', () => {
		inputBlock = true
	})
	//监听中文输入法输入完成
	searchInput.addEventListener('compositionend', () => {
		inputBlock = false
	})
	//oninput事件触发
	searchInput.addEventListener('input',()=>{
	// oninput事件在compositionend事件前执行，所以加个定时器
		time1 =	setTimeout(()=>{},100)
		})
```

# 3.坐标转换

## 百度坐标转高德（传入经度、纬度）

```js
function bd_decrypt(bd_lng, bd_lat) {
   
 	var X_PI = Math.PI * 3000.0 / 180.0;
   
 	var x = bd_lng - 0.0065;
   
 	var y = bd_lat - 0.006;
   
 	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  
 	 var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
   
 	var gg_lng = z * Math.cos(theta);
  
 	 var gg_lat = z * Math.sin(theta);
   
 	return {lng: gg_lng, lat: gg_lat}

}

```

## 高德坐标转百度（传入经度、纬度）

```js

function bd_encrypt(gg_lng, gg_lat) {
  
 	 var X_PI = Math.PI * 3000.0 / 180.0;
  
  	var x = gg_lng, y = gg_lat;
  
 	 var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
   
 	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  
  	var bd_lng = z * Math.cos(theta) + 0.0065;
   
 	var bd_lat = z * Math.sin(theta) + 0.006;
   
 	return {
        bd_lat: bd_lat,
        bd_lng: bd_lng
    };

}
```

# 4.ie防止backspace回退页面

```js
export const banBackSpace = (e) => {
  let ev = e || window.event
  // 各种浏览器下获取事件对象
  let obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget
  // 按下Backspace键
  if (ev.keyCode === 8) {
    // 标签名称
    let tagName = obj.nodeName
    // 如果标签不是input或者textarea则阻止Backspace
      if (tagName !== 'input' && tagName !== 'textarea' && tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
      return stopIt(ev)
    }
    let tagType = obj.type.toUpperCase() // 标签类型
    // input标签除了下面几种类型，全部阻止Backspace
      if (tagName === 'input' && (tagType !== 'text' && tagType !== 'textarea' && tagType !== 'password') && tagName !== 'INPUT') {
      return stopIt(ev)
    }
    // input或者textarea输入框如果不可编辑则阻止Backspace
      if ((tagName === 'INPUT' || tagName === 'textarea') && (obj.readOnly === true || obj.disabled === true) && (tagName !== 'INPUT' && tagName !== 'TEXTAREA') ) {
      return stopIt(ev)
    }
  }
}

function stopIt (ev) {
  if (ev.preventDefault) {
    // preventDefault()方法阻止元素发生默认的行为
    ev.preventDefault()
  }
  if (ev.returnValue) {
  // IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
      window.event.returnValue = false
  }
  return false
}
```

# 5.forEach循环

## forEach循环里不要使用return与break（break会报错）。。。。

## forEach，map循环使用async与await有问题，他们不支持异步变同步，使用其他循环（比如for，for..in,for..of）

# 6.深拷贝

## 扩展运算符...slice和concat

扩展运算符只能深拷贝一维数组（#1）和一层的对象（#2），多层对象（#3）与多维数组（#4）以及对象数组（#5）并不能深拷贝

slice与concat只能对数组使用，与扩展运算符相同

```js
//#1
let arr = [1, 2, 3, 4, 5, 6];
    let arr1 = [...arr];
    arr1.push(7);
    console.log(arr); //[1, 2, 3, 4, 5, 6]
    console.log(arr1); //[1, 2, 3, 4, 5, 6, 7]
//#2
let obj = {
        name: "Wawa",
        age: 13,
        gender: "female"
    };
    let obj1 = {...obj
    };
    obj1.height = 165;
    console.log(obj);//{name: "Wawa", age: 13, gender: "female"}
    console.log(obj1);//{name: "Wawa", age: 13, gender: "female", height: 165}
//#3
let obj = {
        name: "Wawa",
        age: 13,
        gender: "female",
        hobby: {
            a: 'Chinese',
            b: 'Math',
            c: 'English'
        }
    };
    let obj1 = {...obj
    };
    obj1.hobby.a = "PE";
    console.log(obj); //{name: "Wawa", age: 13, gender: "female",hobby:{a: "PE", b: "Math", c: "English"}}
    console.log(obj1); //{name: "Wawa", age: 13, gender: "female", ,hobby:{a: "PE", b: "Math", c: "English"},height: 165}
//#4
 let arr = [1, 2, 3, 4, 5, 6, [1, 2, 3]];
    let arr1 = [...arr];
    arr1.push(7);
    arr1[arr1.length - 2][0] = 100;
    console.log(arr); //[1, 2, 3, 4, 5, 6,[100, 2, 3]]
    console.log(arr1); //[1, 2, 3, 4, 5, 6, [100, 2, 3],7]
//#5
let arr = [{name:1,value:1}, {name:2,value:2}, {name:3,value:3}, {name:4,value:4}];
    let arr1 = [...arr];
    arr1[0].name = 1000
    console.log(arr);//[{name: 1000, value: 1}，{name: 2, value: 2}，{name: 3, value: 3}，{name: 4, value: 4}]
    console.log(arr1);//[{name: 1000, value: 1}，{name: 2, value: 2}，{name: 3, value: 3}，{name: 4, value: 4}]
```

## map

能深拷贝二维数组，对象数组彻底深拷贝需要特定的写法

```js
//可以深拷贝 #map
var c22 = [{val:1,name:1},{val:'2',name:'2'}],c11
c11 = c22.map((val)=>{ return {name:val.name,val:val.val}})//不同点
c11[0].val = 20000
c11.push({val:3,name:3})
console.log(c22)//[{val: 1, name: 1},{val:'2',name:'2'}]
console.log(c11)//[{name: 1, val: 20000},{val:'2',name:'2'},{val:3,name:3}]
//无法彻底深拷贝，修改已有的值两者都变，添加新值老数组不变
var c22 = [{val:1,name:1},{val:'2',name:'2'}],c11
c11 = c22.map((val)=>{ return val})//不同点
c11[0].val = 20000
c11.push({val:3,name:3})
console.log(c22)//[{val: 20000, name: 1},{val:'2',name:'2'}]
console.log(c11)//[{val: 20000, name: 1},{val:'2',name:'2'},{val:3,name:3}]
```



## 对象数组的深拷贝

### 1.JSON.parse(JSON.stringify())

### 2.通用循环

```js
function deepCopy(obj) {
  if (typeof obj !== 'object') return;

  const newObj = obj instanceof Array ? [] : {};

  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }

  return newObj;
}
```

### 3.上面的#map方法

### 4.高浏览器版本可用 -结构化克隆法---structuredClone(xxx)，

# 7.手动触发window的resize

```js
var myEvent = new Event('resize');//新建resize事件
window.dispatchEvent(myEvent);//触发事件，dispatchEvent自定义事件的触发
```

# 8.评估网站的表现

比如网页加载时间，发送与获取请求的时间，网页渲染时间等等,也可用来判断是否刷新，但判断是在刷新后执行。不能用来刷新前阻止刷新

```js
if (window.performance) {
  console.info("window.performance works fine on this browser");
}
  if (performance.navigation.type == 1) {
    console.info( "This page is reloaded" );
    location.hash='xxx'
  } else {
    console.info( "This page is not reloaded");
  }

```

# 9.获取元素中的文字的大小

```js
let m=document.getElementById(id)
window.getComputedStyle(m).fontSize
```

# 10.数组的fill方法

fill用于填充数组，用法array(length).fill(something),得到[somrthing*length]

例如

```js
let top = Array(2).fill('1')
console.log(top)//['1','1']
```

### 注意

使用Array(length).fill({ }) 这样填充的数组，里面的每一项{ }都是全相等的,

```js
let arr = Array(6).fill({});
console.log(arr[1] === arr[2])    //true

//哪怕是使用 new Object() 来创建每一项，一旦使用fill(), 则每一项也全等
let  other = Array(6).fill( new Object() )
console.log(other[1] === other[2])       //true 

//即使使用 Object.create({ }), 也是一样的效果
let  arr_new = Array(6).fill( Object.create({}) )
console.log(arr_new[1] === arr_new[2])    //true
```

### 创建固定长度固定内容的数组

```js
let arr = new Array(2).fill({ })//或者null都可以，只要不让其只有长度
//使用map填充具体内容
arr = arr.map((val)=>{
	val = {xx:'',dd:''}
	return val
})
```

# 11.移动端检测用的是wifi还是流量

```js
getNetworkType() {
            var ua = navigator.userAgent;
            var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
            networkStr = networkStr.toLowerCase().replace('nettype/', '');
            var networkType;
            console.log('ua',ua)
            switch(networkStr) {
                case 'wifi':
                    networkType = 'wifi';
                    break;
                case '4g':
                    networkType = '4g';
                    break;
                case '3g':
                    networkType = '3g';
                    break;
                case '3gnet':
                    networkType = '3g';
                    break;
                case '2g':
                    networkType = '2g';
                    break;
                default:
                    networkType = 'other';
            }
            alert(networkStr)
        },
```

# 12.视频设置第一帧为封面

```js
//video标签设置poster(规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像。).
getVideoBase64(url) {
        return new Promise(function (resolve, reject) {
            let dataURL = '';
            let video = document.createElement("video");
            video.setAttribute('crossOrigin', 'anonymous');//处理跨域
            video.setAttribute('src', url);
            video.setAttribute('width', 400);
            video.setAttribute('height', 240);
            //监听loaddata，当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时，会发生 loadeddata 事件
            video.addEventListener('loadeddata', function () {
                let canvas = document.createElement("canvas"),
                    width = video.width, //canvas的尺寸和图片一样
                    height = video.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
                dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
                resolve(dataURL);
            });
        })
    }
```

# 13.本地调试时内存泄漏-console.log

console.log打印的数据不会被垃圾回收机制回收，会对结果造成影响，所以检查内存泄漏时需要去除所有的console.log

![](C:\Users\zfz\Desktop\笔记\note\杂项\084b82e80f6c9e5d6faad75ea2ada9e0.png)

# 14.点击的点是否在该段线段上

```js
// 排序边上的点
  function min(x:number,y:number){
    if(x < y)
      return x;
    else
      return y;
  }
  function max(x:number,y:number){
    if(x > y)
      return x;
    else
      return y;
  }
// 点击的点是否在该段线段上
/**
*prev:起点
*next：终点
*current：点击的点
*/
  function isInWhichRange(prev:{x:number,y:number}, next:{x:number,y:number},current:{x:number,y:number}) {
    //如果没有终点，直接false
    if(!next){
      return false
    }
    let len;
    //如果p1.x==p2.x 说明是条竖着的线，直接使用x相减获取距离
    if(prev.x - next.x == 0)
    {
        len = Math.abs(current.x - prev.x)
    }else{
        //计算斜率
        let K = (prev.y - next.y) / (prev.x - next.x)
        //计算截距，通过点截式y = kx + b反用获取，b = y - kx,k为斜率
        let B = prev.y - K * prev.x
        //根据点到直线距离公式(kx-y+b)/Math.sqrt(k^2 +1)获取距离
         //Math.sqrt  返回平方根
        len = Math.abs((K * current.x + B - current.y) / Math.sqrt(K * K + 1))
    }
    // 点击线段是会有误差，设置点击误差，此处为10到-10，满足后判断点在不在两点形成的线段上，
    if(len < 10 && len > -10){
        //计算的距离在当点击点在线段的延长线上时也会满足条件，所以需要判断点击点的x，y坐标在起点与终点的范围内，
        let judge = current.x < max(prev.x,next.x) && current.x > min(prev.x,next.x)
        let judge2 = current.y < max(prev.y,next.y) && current.y > min(prev.y,next.y)
      return judge || judge2 ? true : false
    }else{
      return false
    }
  }
```

# 15.修改图片尺寸，压缩图片

```js
 function cutImages(fileObj, callback) {
    try {
        const image = new Image()
        image.src = URL.createObjectURL(fileObj)
        image.onload = function () {
            const that = this
            // 默认按比例压缩
            let w = 840
            let h = 400
            // let w = that.width
            // let h = that.height
            // const scale = w / h
            // w = fileObj.width || w
            // h = fileObj.height || (w / scale)
            let quality = 0.7 // 默认图片质量为0.7
            // 生成canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            // 创建属性节点
            const anw = document.createAttribute('width')
            anw.nodeValue = w
            const anh = document.createAttribute('height')
            anh.nodeValue = h
            canvas.setAttributeNode(anw)
            canvas.setAttributeNode(anh)
            ctx.drawImage(that, 0, 0, w, h)
            // 图像质量
            if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
                quality = fileObj.quality
            }
            // quality值越小，所绘制出的图像越模糊
            const data = canvas.toDataURL('image/jpeg', quality)
            // 压缩完成执行回调
            const newFile = convertBase64UrlToBlob(data)
            callback(newFile)
        }
    } catch (e) {
        console.log('压缩失败!')
    }
}
function convertBase64UrlToBlob(urlData) {
    const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/png' })
}
```

# 16.?? 与 ||的区别

?? 只有当左边的值为null或者undefined时才会返回右边的值，||会将左边的值转为布尔值，再去判断，为false返回右边的值

```js
//??
undefined ?? 2	// 2
null ?? 2		// 2
0 ?? 2			// 0
"" ?? 2			// ""
true ?? 2		// true
false ?? 2		// false

// ||
undefined || 2	// 2
null || 2		// 2
0 || 2			// 2
"" || 2			// 2
true || 2		// true
false || 2		// 2
```

# 17.字符串书写html，添加到dom的方法

```js
let a = document.getElementById('xxx')
let htmlStr = '<div></div>'
//1.innerHTML
a.innerHTML = htmlStr
//2.DOMParser().parseFromString(),返回格式为#document，不能用appedChild等插入，
//第二个参数为minetype,返回值类型不同
//text/html -- Document，返回一个HTMLDocument
//text/xml -- XMLDocument
//application/xml -- XMLDocument
//application/xhtml+xml -- XMLDocument
//image/svg+xml -- XMLDocument
//
let parseDom = new DOMParser().parseFromString(a, 'text/html')
//3.DocumentFragment
//DocumentFragment 对象表示一个没有父级文件的最小文档对象。它被当做一个轻量版的 
//Document 使用，用于存储已排好版的或尚未打理好格式的XML片段。最大的区别是因
//为DocumentFragment不是真实DOM树的一部分，它的变化不会引起DOM树的重新渲染的操作
//(reflow) ，且不会导致性能等问题
let virutDom = document.createRange().createContextualFragment(a)
//document.createDocumentFragment(),创建一个虚拟dom，可以用来包裹拼接好的html

```



# 18.获取设备部分信息

```js
//大概得知浏览器种类以及版本号
navigator.userAgent
//用户浏览器的默认语言
navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage
//当前浏览器环境所拥有的CPU核心数
navigator.hardwareConcurrency
//用户的时区
new window.Intl.DateTimeFormat().resolvedOptions().timeZone
//物理像素与CSS像素的比值
window.devicePixelRatio
```

# 19.手机打开控制台查看console.log

html文件中引入cdn上的vConsole，或者在github中下载源码，打包获取min文件，在放入项目中引入

```html
<script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js "></script>
<script type="text/javascript">
    //初始化，cdn引入默认放在window中
    var vConsole = new window.VConsole();
</script>
```

# 20.int16Array与float32Array互转

```js
function floatTo16Bit(inputArray, startIndex){
    var output = new Uint16Array(inputArray.length-startIndex);
    for (var i = 0; i < inputArray.length; i++){
        var s = Math.max(-1, Math.min(1, inputArray[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}
function int16ToFloat32(inputArray, startIndex, length) {
    var output = new Float32Array(inputArray.length-startIndex);
    for (var i = startIndex; i < length; i++) {
        var int = inputArray[i];
        // If the high bit is on, then it is a negative number, and actually counts backwards.
        var float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
        output[i] = float;
    }
    return output;
}
```

# 21.新标签页打开空白页面，生成对应的代码，并绑定事件和修改标签名称

```js
let vrReport = window.open('/viewer/dist/vrReport.html');//一个初始化的html文件，直接用''会打开新窗口
let reportHtml = createReport()//构建html的方法，获得dom
vrReport.onload = () => {//onload方法里执行
  vrReport.document.write(reportHtml.outerHTML)//写入dom的outerHTML
  bindEvent(vrReport)//绑定需要的事件，在新页面的document中寻找元素
  vrReport.document.title = 'AI重建结构化报告'//修改标题，放在写入后面，不然会被覆盖
}
```

# 22.计算某个三维点旋转后的坐标

```js
// 定义向量 Vector3
var vector = [1, 2, 3]; // 这里假设向量为[x, y, z]
 
// 定义矩阵 Matrix
var matrix = [[0.5, -0.866, 0], [-0.866, 0.5, 0], [0, 0, 1]]; // 这里假设矩阵为[[a, b, c], [d, e, f], [g, h, i]]
 
// 将向量应用于矩阵进行旋转操作
function rotate(vector, matrix) {
    var result = [];
    
    for (let i = 0; i < vector.length; i++) {
        let sum = 0;
        
        for (let j = 0; j < vector.length; j++) {
            sum += vector[j] * matrix[i][j];
        }
        
        result.push(sum);
    }
    
    return result;
}
 
// 调用函数并输出结果
console.log("旋转前的向量：", vector);
console.log("旋转后的向量：", rotate(vector, matrix));
```

# 23.base64与file或blob转化

```js
//base64转为file或blob
var base64 = document.querySelector('#content_right canvas').toDataURL();
var arr = base64.split(',');
var mime = arr[0].match(/:(.*?);/)[1];
var bstr = atob(arr[1])
var n = bstr.length
var u8arr = new Uint8Array(n);
while(n--){
    u8arr[n] = bstr.charCodeAt(n)
}
//file为new File，blob为new Blob
var file = new File([u8arr],'xxx',{type:mime})
//file或blob转为base64
var reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => {
    var img = document.createElement('img')
    img.style = 'width:300px;height:300px;position:absolute;z-index:99999;top:0;left:0'
    img.src = reader.result
    document.body.appendChild(img)
    
}
```

# 24.new Proxy自定义简易watch

```js
/**
 * 设置监听变化
 * @param {*} obj -- 初始对象
 * @param {*} setBind -- set事件时触发的方法 
 * @param {*} getLogger -- get事件时触发的方法
 * @returns Proxy
 */
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger && getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
        let oldVal = target[property]
        target[property] = value
        setBind(value, property,target,oldVal)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

//使用
let watchxx = onWatch({value:''},(target, property, value,oldVal)=>{},(target, property)=>{})
//watchxx.value = xxx会触发set里的事件
```

# 25.16进制颜色与rgba互转

```js
//16转rgba
function hexToRgba(hex) {
 let hexColor = hex
 if(hex.length == 4){
      hexColor = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b);
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hexColor);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const a = result[4] ? Math.floor(parseInt(result[4], 16) / 255) : 1;
 
  return {rgba:`rgba(${r}, ${g}, ${b}, ${a})`,r,g,b,a};
}
//rgba转16
function rgbaToHex(r, g, b, a) {
  const toHex = (num) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
 
  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);
  const hexA = Math.round(a * 255).toString(16);
 
  return `#${hexR}${hexG}${hexB}${hexA}`;
}
```

# 26.reduce配合promise

```js
//处理blob到base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
          resolve(event.target.result);
      };
      reader.onerror = function(error) {
          reject(error);
      };
      reader.readAsDataURL(blob);
  });
}
//处理数据，使用reduce
async function handleDefaultImages(data){
  return Object.keys(data.render).reduce(async (pre,val) => {
    //pre需要使用await接收
    pre = await pre;
    let item = data.render[val]
    let image = item.image
    // let img = typeof image == 'string' ? `data:image/${item.format},${image}` : window.URL.createObjectURL(image)
    let img = typeof image == 'string' ? `data:image/${item.format},${image}` : await blobToBase64(image)
    //切割返回的图片名字
    let arr = val.split('_')
    //当第一位是VR时，判断第二位是否为mip，是则返回mip，否则返回vr，其他多为lesions
    let key = arr[0] == 'VR' ? arr[1] == 'mip' ? 'mip' : 'vr' : 'lesions'
    if(!pre[key]){
      pre[key] = {}
    }
    let last = arr[arr.length - 1]
    if(arr[0] == 'VR'){
      //以最后一位为key，back与front
      pre[key][last] = img
    }else{
      
      //以最后一位为key，
      if(!pre[key][last]){
        pre[key][last] = {}
      }
      //如果长度为3位，则使用第一位，MIP与MinIP，否则使用第二位A,C,S，代表axial，coronal，sagittal
      let lesionKey = arr.length == 3 ? arr[0] : arr[2]
      pre[key][last][lesionKey] = img
    }
    return pre
    //pre的初始值要是使用Promise.resolve包裹的值
  },Promise.resolve({}))
}
//调用
function handleImage(){
    handleDefaultImages(data).then((res) => {
       Object.keys(res).forEach((val,index) => {
           setDefaultImages({type:val,imgs:res[val]})
        })
        callback && callback()
    })
}

```

# 27.图片镜面翻转

### 1.使用css

```html
<!-- 使用css，transform:scaleX(-1) || scaleY(-1);分别为左右镜像翻转与上下镜面翻转 -->
<header>
	<style>
		.reverseY{
			transform:scaleY(-1)
		}
	</style>
</header>
<body>
	<img src="图片地址" />
<body>
```

### 2.使用canvas

```js
let image = new Image()
image.src = '图片地址'
image.onload = () => {
    const ctx = canvas.getContext("2d");
    //上下镜面翻转
    ctx.translate(0, item.size[1])
    ctx.scale(1, -1)
    ctx.drawImage(imageDom,0,0,item.size[0],item.size[1])
    //.....后续操作
} 

```

### 3.直接计算图片源数据

```js
function imageDataVRevert(sourceData, newData) {
      for (let i = 0, h = sourceData.height; i < h; i++) {
        for (let j = 0, w = sourceData.width; j < w; j++) {
          newData.data[i * w * 4 + j * 4 + 0] = sourceData.data[(h - i) * w * 4 + j * 4 + 0];
          newData.data[i * w * 4 + j * 4 + 1] = sourceData.data[(h - i) * w * 4 + j * 4 + 1];
          newData.data[i * w * 4 + j * 4 + 2] = sourceData.data[(h - i) * w * 4 + j * 4 + 2];
          newData.data[i * w * 4 + j * 4 + 3] = sourceData.data[(h - i) * w * 4 + j * 4 + 3];
        }
      }
      return newData;
    }
//使用
let image = new Image()
let ctx = canvas.getContext('2d')
image.src = '图片地址'
image.onload = () => {
    ctx.drawImage(img, 0, 0, 210, 80);
    let imgData = ctx.getImageData(0, 0, 210, 80);
    let newImgData = ctx.getImageData(0, 0, 210, 80);
    ctx.putImageData(imageDataVRevert(newImgData, imgData), 0, 0);  //上下翻转
} 
     
```

# 28.js实现单页签

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>单页应用示例</title>
</head>
<body>
    <nav>
        <ul>
            <li><a href="#home">首页</a></li>
            <li><a href="#about">关于</a></li>
            <li><a href="#contact">联系我们</a></li>
        </ul>
    </nav>
    <div id="content"></div>
 
    <script src="app.js"></script>
</body>
</html>
```



```js
document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('content');
    const routes = {
        '#home': '<h1>欢迎来到首页</h1><p>这是首页的内容。</p>',
        '#about': '<h1>关于我们</h1><p>这是关于我们的内容。</p>',
        '#contact': '<h1>联系我们</h1><p>这是联系我们的内容。</p>'
    };
 
    function loadContent() {
        const hash = window.location.hash;
        if (hash in routes) {
            contentDiv.innerHTML = routes[hash];
        } else {
            contentDiv.innerHTML = '<h1>404 页面未找到</h1>';
        }
    }
 
    window.addEventListener('hashchange', loadContent);
    loadContent(); // 初始加载内容
});
```

### 不使用a标签

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA Example</title>
</head>
<body>
    <nav>
        <button data-route="/">Home</button>
        <button data-route="/about">About</button>
        <button data-route="/contact">Contact</button>
    </nav>
    <div id="app"></div>
    <script src="app.js"></script>
</body>
</html>
```



```js
// app.js
const routes = {
    '/': 'Home Page',
    '/about': 'About Page',
    '/contact': 'Contact Page'
};

function render(path) {
    const app = document.getElementById('app');
    app.innerHTML = routes[path] || '404 Not Found';
}

function navigateTo(path) {
    window.history.pushState({}, path, window.location.origin + path);
    render(path);
}

window.onpopstate = function(event) {
    render(window.location.pathname);
};

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('button[data-route]')) {
            const path = e.target.getAttribute('data-route');
            navigateTo(path);
        }
    });

    // Initial render
    render(window.location.pathname);
});
```

