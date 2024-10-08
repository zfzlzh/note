/js/worker.js

```js
var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()", 500);
}

timedCount();
```

index.html

```js
<div id="result"></div>
<button type="button" id="stopBtn"></button>
    <script>
        if (typeof (Worker) !== "undefined") {
           let w = new Worker("../js/worker.js");
           if (typeof (w) == "undefined") {
                w.onmessage = function (event) {
                    document.getElementById("result").innerHTML = event.data;
                };
           }
           
            document.getElementById("stopBtn").addEventListener('click',stop)
            function stop(){
                if(typeof (w) != "undefined"){
                    w.terminate();
                    x = undefined
                }
            }
        }
        else {
            console.log('不支持web Worker')
        }
        
    </script>
```

webWorker无法加载本地文件,所以要在本地文件创建worker,有两种方式

1.通过Blob()方式；主要操作为将本地方法的script标签里加上id与无法识别的type，然后在需要用的抵挡使用id获取对应的内容，转为blob，再使用window.URL.createObjectURL转化blob，new Worker中使用转化后的结果。

```js
// 主方法
function handle() {
  if (typeof Worker !== 'undefined') {
    // 将本地文件地址转为blob
    const blob = new Blob([document.getElementById('workerScript').textContent]);
    const url = window.URL.createObjectURL(blob);
    const worker: Worker = new Worker(url);
    if (typeof worker !== 'undefined') {
      	worker.postMessage('test')
        worker.onmessage = function (event){
            worker.terminate();
            console.log(event)//接收postMessage
        }
    }
  }
}
//  本地文件方法，type一定要是js无法识别的
<script id="workerScript" type="javascript/worker">
   onmessage = function(){
     console.log(e)
}
</script>
```

2.将文件放入静态文件文件夹中，

```js
//文件worker_f.js放在dist/worker文件夹中
//主文件
worker = new Worker('dist/webWorker/worker_f.js')
```

## import导入js文件，将其作为webworker文件使用

webpack配置worker-loader

```js
//webpack.config.js
module: {
    rules: [
      {
        test: /\.customWorker\.js$/,//后缀自定，一般为worker.js
        use: [{ loader: "worker-loader", options: { inline: "no-fallback" } }],
      },
    ],
  },
```

```js
//main.js
import workerFile from './worker.customWorker.js';
let worker = new workerFile();//worker-loader会将指定后缀的文件打包为构造函数形式的worker文件
//worker操作.....
```

```js
//worker.customWorker.js
//与普通文件书写无异
import  xxx from 'xxxx';
//操作....
```

