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

webWorker无法加载本地文件,所以要在本地文件创建worker,要通过Blob()方式本地创建

使用本地文件方法，主要操作为将本地方法的script标签里加上id与无法识别的type，然后在需要用的抵挡使用id获取对应的内容，转为blob，再使用window.URL.createObjectURL转化blob，new Worker中使用转化后的结果。

```js
// 主方法
function registerForWorker() {
  if (typeof Worker !== 'undefined') {
    // 将本地文件地址转为blob
    const blob: any = new Blob([document.getElementById('workerScript')?.textContent]);
    const url = window.URL.createObjectURL(blob);
    const worker: Worker = new Worker(url);
    if (typeof worker !== 'undefined') {
      worker.terminate();
        onmessage = function (event){
            console.log(event)//接收postMessage
        }
    }
  }
}
//  本地文件方法，type一定要是js无法识别的
<script id="workerScript" type="javascript/worker">
    const { registerAllCustomCell } = customCell();
    function registerCell() {
      registerAllCustomCell();
      postMessage('end');
    }
    registerCell();
</script>
```

