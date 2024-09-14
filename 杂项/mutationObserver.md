## 概览

MutationObserver用来监视 DOM 变动。DOM 的任何变动，比如节点的增减、属性的变动、文本内容的变动都会触发MutationObserver事件。
但是，它与事件有一个本质不同：事件是同步触发，也就是说，DOM 的变动立刻会触发相应的事件；Mutation Observer 则是异步触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。
Mutation Observer 有以下特点：

它等待所有脚本任务完成后，才会运行（即异步触发方式）。
它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。

```js
let dom = document.getElementById('xxx')
var observer = new MutationObserver((mutations,observer) => {
        console.log(mutation)
    	console.log(observer)
});
var config = { attributes: true, childList: true, characterData: true };
observer.observe(dom, config);
```

## 实例方法

### 1.observe(dom, config)

启动监听，它接受两个参数。
第一个参数：所要观察的 DOM 节点
第二个参数：一个配置对象，指定所要观察的特定变动

config的可取值

childList：子节点的变动（指新增，删除或者更改）。
attributes：属性的变动。
characterData：节点内容或节点文本的变动。
subtree：布尔值，表示是否将该观察器应用于该节点的所有后代节点。
attributeOldValue：布尔值，表示观察attributes变动时，是否需要记录变动前的属性值。
characterDataOldValue：布尔值，表示观察characterData变动时，是否需要记录变动前的值。
attributeFilter：数组，表示需要观察的特定属性（比如[‘class’,‘src’]）。

### 2.disconnect()

disconnect方法用来停止观察。调用该方法后，DOM 再发生变动，也不会触发观察器

### 3.takeRecords()

用来清除变动记录，即不再处理未处理的变动。该方法返回变动记录的数组

## MutationRecord 对象

DOM 每次发生变化，就会生成一条变动记录（MutationRecord 实例）。该实例包含了与变动相关的所有信息。Mutation Observer 处理的就是一个个MutationRecord实例所组成的数组。
MutationRecord对象包含了DOM的相关信息，有如下属性:

type：观察的变动类型（attribute、characterData或者childList）。
target：发生变动的DOM节点。
addedNodes：新增的DOM节点。
removedNodes：删除的DOM节点。
previousSibling：前一个同级节点，如果没有则返回null。
nextSibling：下一个同级节点，如果没有则返回null。
attributeName：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
oldValue：变动前的值。这个属性只对attribute和characterData变动有效，如果发生childList变动，则返回null。

## 例子：监听contenteditable属性的元素的输入事件

```js
let dom = document.querySelector('span[contenteditable]')
var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 内容改变时的操作
          console.log(mutation)
        });
});
var config = { attributes: true, childList: true, characterData: true };
observer.observe(dom, config);
```

