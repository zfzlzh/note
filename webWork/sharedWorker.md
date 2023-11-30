```js
//sharedWorker.js
self.onconnect = function(e) {
  var port = e.ports[0];
  port.onmessage = function(e){
  	...
  	port.postMessage('')
  }
    //如果需要创建函数，需写在onconnect中，不然onmessage中无法调用
    function(){}
}
//onmessage使用addEventListener('message',()=>{})代替时，需要执行一次port.start()
```

```js
//main.js
if (typeof SharedWorker !== 'undefined') {
        let worker = new SharedWorker('sharedWorker.js')
        if (typeof worker !== 'undefined') {
          worker.port.postMessage('')
          worker.port.onmessage = (result) => {
              
          }
        }
}
//onmessage使用addEventListener('message',()=>{})代替时，需要执行一次worker.port.start()
```

