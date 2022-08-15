# 概念

是一个基于 JavaScript 的面向对象的事务型数据库,不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

## 与localStorage，cookie的区别

`IndexedDB` 

1.类似数据库风格的数据存储和使用方式，适合存储大量的数据

2.使用索引存储数据，各种数据库操作放在事务中执行

3.支持简单的数据类型，也支持二进制存储

4.API相对复杂，异步

5.**同源限制** IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

6.存储空间大，一般不少于250MB，甚至没有上限

localStorage

1.key-value键值对式存储数据，适合存储简单少量的数据

2.存储的都是字符串形式的数据，存储对象时需使用JSON转化

3.api简单，同步

4.空间小，2.5MB-10MB

cookie类似localStorage

总结：存储少量简单的数据可以使用localStorage，大量复杂的数据使用indexedDB



# 特性

## 对象仓库

indexedDB没有表的概念，取而代之的是对象仓库objectStore，一个数据库可以包含多个objectStore。

objectStore：一个灵活的数据结构，可以存放多种类型数据，相当于表，里面存储的每条数据和一个键相关联，可以自己指定某个字段（keyPath），也可以使用自动生成的递增数字（keyGenerator），也可以不指定。选择的键值不同，可以存储的数据解构也有差异

## 事务性

在 indexedDB 中，每一个对数据库操作是在一个事务的上下文中执行的。事务范围一次影响一个或多个 object stores，你通过传入一个 object store 名字的数组到创建事务范围的函数来定义，创建事务的第二个参数是事务模式。当请求一个事务时,必须决定是按照只读还是读写模式请求访问。

```js
/**
*@params storeName  对象仓库objectStore名称
*@params  type   事务模式 
*/
db.transaction(storeName, 'readwrite')
```



## 基于请求

对 indexedDB 数据库的每次操作，描述为通过一个请求打开数据库,访问一个 object store，再继续，对于你在数据库执行的每次操作,你必须首先为这个操作创建一个请求。当请求完成,你可以响应由请求结果产生的事件和错误。

## 异步

就像使用 ajax 一样，语句执行完并不代表已经获取到了对象，所以我们一般在其回调函数中处理。



# 操作流程

## 检验

```js
let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
if(!indexedDB)
{
    console.log("你的浏览器不支持IndexedDB");
}else{
    //创建/开启
}
```



## 开启/创建

使用**open()**创建或开启，当数据库不存在时创建，参数1为数据库名称，参数2为版本号，版本号可以在升级数据库时用来调整数据库结构和数据。但你增加数据库版本号时，会触发onupgradeneeded事件，这时可能会出现成功、失败和阻止事件三种情况

返回一个 IDBRequest 对象，通过三种事件**error`、`success`、`upgradeneeded**处理结果

```js
/**
*@params name 数据库名称
*@param version 版本号 大于0，可省略，默认打开当前版本数据库，如果不存在数据库，则创建一个默认版本为1的数据库
*/
let request = indexedDB.open(name, version);
let database
//成功，出现 A version change transaction is running.报错，在onsuccess后再执行
request.onsuccess = function (e){
    database = e.target.result
}
//失败
request.onerror = function (e){
    console.log('打开或创建失败')
}
//更新，创建数据库时会触发这个事件，如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件upgradeneeded
request.onupgradeneeded = function (e){
    database = e.target.result
}
```



### 创建objectStore

使用**createObjectStore()**创建objectStore，参数1是名称，参数二是指定主键

```js
//自己指定主键 
var objectStore = database.createObjectStore('person', { keyPath: 'id' });
//自定义主键也可以使用下一层对象中的字段
var objectStore = database.createObjectStore('person', { keyPath: 'foo.id' });
//使用自动生成的递增数字作为主键
var objectStore = database.createObjectStore('person', { autoIncrement: true });
//最好可以先判断有没有这个表再取创建
 if (!database.objectStoreNames.contains('person')) {
     var objectStore = database.createObjectStore('person', { keyPath: 'id' });
 }
```

### 创建索引

创建完objectStore后使用**createIndex()**创建索引，参数1为索引名称，参数2为索引所在的属性，参数3为配置对象（说明该属性是否包含重复的值，可选），只能在onupgradeneeded事件中使用

参数3的可选项：

- unique：如果设为`true`，将不允许重复的值
- multiEntry：如果设为`true`，对于有多个值的主键数组，每个值将在索引里面新建一个条目，否则主键数组对应一个条目。

```js
objectStore.createIndex('name', 'name', { unique: false });
objectStore.createIndex('email', 'email', { unique: true });
```

### 删除索引

只能在onupgradeneeded事件中使用

```js
//indexName为索引名称
objectStore.deleteIndex(indexName)
```



## 新增数据

通过事务**transaction()**插入数据

新建时必须指定**表格名称**和**操作模式**（**"只读"或"读写"**）。新建事务以后，通过**IDBTransaction.objectStore(name)**方法，拿到 IDBObjectStore 对象，再通过表格对象的**add()**方法，向表格写入一条记录。

写入操作是一个异步操作，通过监听连接对象的**success**事件和**error**事件，了解是否写入成功。

```js
//'readwrite'   /    'readonly'
function add() {
  var request = database.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' });

  request.onsuccess = function (event) {
    console.log('数据写入成功');
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
  }
}

add();
```

## 读取数据

同样通过事务进行，使用**objectStore.get()**获取数据，参数是主键

```js
function read() {
   var transaction = database.transaction(['person']);
   var objectStore = transaction.objectStore('person');
   var request = objectStore.get(1);

   request.onerror = function(event) {
     console.log('事务失败');
   };

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name);
        console.log('Age: ' + request.result.age);
        console.log('Email: ' + request.result.email);
      } else {
        console.log('未获得数据记录');
      }
   };
}
read()
```

## openCursor()

用于获取一个指针对象，可以用来遍历数据。该对象也是异步的，有自己的`success`和`error`事件，可以对它们指定监听函数

continue（）方法将光标移到下一个数据对象，如果当前数据对象已经是最后一个数据了，则光标指向null

参数：参数1为主键值或者 IDBKeyRange ，省略则处理所有

​			参数2为遍历方向，默认next，可选prev，nextunique，prevunique ，后面两个表示遇到重复自动跳过

### 遍历数据

遍历数据表格的所有记录，要使用指针对象 **IDBCursor**,新建指针对象的**openCursor()**方法是一个异步操作，所以要监听`success`事件

```js
function readAll() {
  var objectStore = database.transaction('person').objectStore('person');

   objectStore.openCursor().onsuccess = function (event) {
     var cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

readAll();
```

# 更新数据

使用**IDBObject.put()**方法，参数与新增相似，主键相同的被更新

```js
function update() {
  var request = database.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}

update();
```

# 删除数据

**IDBObjectStore.delete()**方法用于删除记录，参数为主键

```js
function remove() {
  var request = database.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}

remove();
```

# 使用索引

索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）。

```js
//crateIndex('name', 'name', { unique: false })
var transaction = database.transaction(['person'], 'readonly');
var store = transaction.objectStore('person');
var index = store.index('name');
var request = index.get('张三');

request.onsuccess = function (e) {
  var result = e.target.result;
  if (result) {
    // ...
  } else {
    // ...
  }
}
```

# IDBKeyRange 对象

IDBKeyRange 对象代表数据仓库（object store）里面的一组主键。根据这组主键，可以获取数据仓库或索引里面的一组记录

IDBKeyRange 可以只包含一个值，也可以指定上限和下限。它有四个静态方法，用来指定主键的范围

- `IDBKeyRange.lowerBound()`：指定下限。
- `IDBKeyRange.upperBound()`：指定上限。
- `IDBKeyRange.bound()`：同时指定上下限。
- `IDBKeyRange.only()`：指定只包含一个值。



```js
// All keys ≤ x
var r1 = IDBKeyRange.upperBound(x);

// All keys < x
var r2 = IDBKeyRange.upperBound(x, true);

// All keys ≥ y
var r3 = IDBKeyRange.lowerBound(y);

// All keys > y
var r4 = IDBKeyRange.lowerBound(y, true);

// All keys ≥ x && ≤ y
var r5 = IDBKeyRange.bound(x, y);

// All keys > x &&< y
var r6 = IDBKeyRange.bound(x, y, true, true);

// All keys > x && ≤ y
var r7 = IDBKeyRange.bound(x, y, true, false);

// All keys ≥ x &&< y
var r8 = IDBKeyRange.bound(x, y, false, true);

// The key = z
var r9 = IDBKeyRange.only(z);
```

`IDBKeyRange.lowerBound()`、`IDBKeyRange.upperBound()`、`IDBKeyRange.bound()`这三个方法默认包括端点值，可以传入一个布尔值，修改这个属性。

与之对应，IDBKeyRange 对象有四个只读属性。

- `IDBKeyRange.lower`：返回下限
- `IDBKeyRange.lowerOpen`：布尔值，表示下限是否为开区间（即下限是否排除在范围之外）
- `IDBKeyRange.upper`：返回上限
- `IDBKeyRange.upperOpen`：布尔值，表示上限是否为开区间（即上限是否排除在范围之外）

IDBKeyRange 有一个实例方法`includes(key)`，返回一个布尔值，表示某个主键是否包含在当前这个主键组之内。

