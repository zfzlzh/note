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

## 注意

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

## 创建固定长度固定内容的数组

```js
let arr = new Array(2).fill({ })//或者null都可以，只要不让其只有长度
//使用map填充具体内容
arr = arr.map((val)=>{
	val = {xx:'',dd:''}
	return val
})
```

# 移动端检测用的是wifi还是流量

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

