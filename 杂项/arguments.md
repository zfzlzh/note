## 类数组对象

就是拥有一个 length 属性和若干索引属性的对象，与数组相似，但**不可直接使用数组方法**，arguments对象只定义在函数体中，包括了函数的参数和其他属性。

```js
var array = ['house', 'car', 'money'];

var arrayLike = {
    0: 'house',
    1: 'car',
    2: 'money',
    length: 3
}

//读取
console.log(array[0]); // house
console.log(arrayLike[0]); // house

array[0] = 'new house';
arrayLike[0] = 'new house';

//长度
console.log(array.length); // 3
console.log(arrayLike.length); // 3

//遍历
for(var i = 0, len = array.length; i < len; i++) {
   ……
}
for(var i = 0, len = arrayLike.length; i < len; i++) {
    ……
}

//push，报错arrayLike.push is not a function
arrayLike.push('name');
```

## 使用call调用数组方法

Array.prororype.方法.call(arguments)

```js
var arrayLike = {0: 'house', 1: 'car', 2: 'money', length: 3 }

console.log(Array.prototype.join.call(arrayLike, '&')); // house&car&money

console.log(Array.prototype.slice.call(arrayLike, 0)); // ["house", "car", "money"] 
// slice可以做到类数组转数组

Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
}); 
```

## 转为数组

```js
var arrayLike = {0: 'house', 1: 'car', 2: 'money', length: 3 }
// 1. slice
console.log(Array.prototype.slice.call(arrayLike)); // ["house", "car", "money"] 
// 2. splice
console.log(Array.prototype.splice.call(arrayLike, 0)); // ["house", "car", "money"] 
// 3. ES6 Array.from
console.log(Array.from(arrayLike)); // ["house", "car", "money"] 
// 4. apply
console.log(Array.prototype.concat.apply([], arrayLike));
```

## **callee属性**

每个参数实例都有一个callee属性，通过它可以调用函数自身。 **严格模式不允许访问arguments.callee**。

```js
//经典闭包面试题使用callee解决方法
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

## **利用arguments实现方法的重载**

由于JS是一种弱类型的语言，没有重载机制，当我们重写函数时，会将原来的函数直接覆盖，这里我们能利用arguments，来判断传入的实参类型与数量进行不同的操作，然后返回不同的数值。

```js
//不论传入多少参数都行，将传入的参数相加后返回。
function add() {
    var len = arguments.length,
        sum = 0;
    for(;len--;){
        sum += arguments[len];
    }
    return sum;
}

console.log( add(1,2,3) );   //6
console.log( add(1,3) );     //4
console.log( add(1,2,3,5,6) );   //17
```

## **利用arguments.callee实现递归**

```js
//原来
function foo(num) { 
    if(num<=1) { 
        return 1; 
    }else { 
        return num * foo(num-1); 
    } 
} 
//callee
function foo(num) { 
    if(num<=1) { 
        return 1; 
    }else { 
        return num * arguments.callee(num-1); 
    } 
}
```

