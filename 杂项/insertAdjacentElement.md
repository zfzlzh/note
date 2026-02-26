`insertAdjacentElement`方法可以在一个元素旁边插入一个新的元素。如果你想要将一个元素插入到另一个元素的后面，可以使用`afterbegin`、`beforeend`、`afterend`或`beforebegin`属性。所有浏览器都支持。

## afterbegin:插入到元素后面

```js
const span = document.getElementById("mySpan");
const h2 = document.getElementById("myH2");
h2.insertAdjacentElement("afterend", span);
/**
	结果：
	<h2>标题</h2>
	<span>内容</span>
*/
```

## afterbegin：在元素开始之后（第一个子元素）

```js
const span = document.getElementById("mySpan");
const h2 = document.getElementById("myH2");
h2.insertAdjacentElement("afterbegin", span);
/**
	结果：
	<h2>
		<span>内容</span>
		标题
	</h2>
*/
```

## beforebegin:插入到元素之前

```js
const span = document.getElementById("mySpan");
const h2 = document.getElementById("myH2");
h2.insertAdjacentElement("beforebegin", span);
/**
	结果：
	<span>内容</span>
	<h2>标题</h2>
*/
```

## beforeend:在元素结束之前（最后一个子元素）。

```js
const span = document.getElementById("mySpan");
const h2 = document.getElementById("myH2");
h2.insertAdjacentElement("beforeend", span);
/**
	结果：
	<h2>
		标题
		<span>内容</span>
	</h2>
*/
```

