## 使用postMessage进行iframe通讯

postMessage，存在于window、iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames

### 1.父 —> 子

```js
//父
//html
<iframe src="xxxxx" id="son">
//js
let dom = document.getElementById('son');
dom.contentWindow.postMessage('父传子','*')
//vue中可使用ref，contentWindow可以使用
//第一个参数messageData，会被结构化克隆算法序列化，所以不可以传递不能被序列化的数据，会报错
//第二个参数targetOrigin目标域名，使用*，代表所有，无限制；也可以是一个url，在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口，如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin
//参数3Transferable 对象,可空，是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权
//postMessage可以跨域调用
```

### 2.子 —> 父

```js
window.parent.postMessage('子传父','*')
```

