## ResizeObserver

监听大小变化做出操作

```js
const resizeOb = new ResizeObserver((entries) => {
   for (const entry of entries) {
		//写入要监听的内容
   }
});
const dom = document.getElementById('')
//传入需要监听的DOM元素
resizeOb.observe(dom);
//取消监听某个DOM节点
resizeOb.unobserve(dom);

//取消对所有节点的监听
resizeOb.disconnect();

```

在使用ResizeObserver API的时候，在每次触发元素的大小变化时，会在1s内触发回调蛮多次的。如果想进一步优化性能，可以加上throttle节流函数处理

```js
const throttle = （fun,delay） => {
	let timer = null;
	return function() {
		const args = arguments
		if(!timer) {
			timer = setTimeout(() => {
				timer = null
			}, delay)
			fun(args )
		}
	}
}

const myObserver = new ResizeObserver(throttle(entries => {
  entries.forEach(entry => {
    console.log('大小位置 contentRect', entry.contentRect)
    console.log('监听的DOM target', entry.target)
  })
}), 500)

myObserver.observe(document.body)

```

## 兼容性

##### 2018年前的浏览器不支持，部分2020年前的浏览器也不支持，可使用resize-observer-polyfill

```js
//安装
npm install resize-observer-polyfill --save-dev
//页面引入
import ResizeObserver from 'resize-observer-polyfill';
```

或没有该api的浏览器使用其他方法

通过内嵌iframe，监听iframe的resize事件进行自适应