# 1.概览

IntersectionObserver接口，提供了一种异步观察目标元素与其祖先元素或顶级文档视窗交叉状态的方法。

`IntersectionObserver`可以用来自动监听元素是否进入了设备的可视区域之内，而不需要频繁的计算来做这个判断。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器",

```js
const io = new IntersectionObserver(callback, option);
```

### IntersectionObserver 是浏览器原生提供的构造函数，接受两个参数：

callback：可见性发现变化时的回调函数
option：配置对象（可选）。

### 构造函数的返回值是一个观察器实例。实例一共有4个方法：

observe：开始监听特定元素
unobserve：停止监听特定元素
disconnect：关闭监听工作
takeRecords：返回所有观察目标的对象数组

## 1.1 observe 方法

该方法需要接收一个target参数，值是Element类型，用来指定`被监听`的目标元素

```js
// 获取元素
const target = document.getElementById("dom");

// 开始观察
io.observe(target);
```

## 1.2 unobserve 方法

该方法需要接收一个target参数，值是Element类型，用来指定`停止监听`的目标元素

```js
// 获取元素
const target = document.getElementById("dom");

// 停止观察
io.unobserve(target);
```

## 1.3 disconnect 方法

该方法不需要接收参数，用来关闭观察器

```js
// 关闭观察器
io.disconnect();
```

## 1.4 takeRecords 方法

该方法不需要接收参数，返回所有被观察的对象，返回值是一个数组

```js
// 获取被观察元素
const observerList = io.takeRecords();
```

## 1.5 callback 参数

目标元素的可见性变化时，就会调用观察器的回调函数`callback`。

`callback`一般会触发两次。一次是目标元素刚刚进入视口，另一次是完全离开视口。

```js
const io = new IntersectionObserver((changes, observer) => {
  console.log(changes);
  console.log(observer);
});
```

## 1.6 options

threshold: 决定了什么时候触发回调函数。它是一个数组，每个成员都是一个门槛值，默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数。用户可以自定义这个数组。比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。
root: 用于观察的根元素，默认是浏览器的视口，也可以指定具体元素，指定元素的时候用于观察的元素必须是指定元素的子元素
rootMargin: 用来扩大或者缩小视窗的的大小，使用css的定义方法，10px 10px 30px 20px表示top、right、bottom 和 left的值

# 2. IntersectionObserverEntry 对象

`changes`数组中的每一项都是一个`IntersectionObserverEntry` 对象

boundingClientRect：目标元素的矩形区域的信息
intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0
intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
isIntersecting: 布尔值，目标元素与交集观察者的根节点是否相交（常用）
isVisible: 布尔值，目标元素是否可见（该属性还在试验阶段，不建议在生产环境中使用）
rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
target：被观察的目标元素，是一个 DOM 节点对象（常用）
time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒