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

