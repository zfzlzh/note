



响应式的终极目标：对象本省或者内部属性发生变化时，执行一些函数，最常见的便是render函数。只要数据发生了变化后运行了一些函数，就是响应式，比如watch。

# vue2响应式原理

vue是一个很明显的使用数据驱动视图的框架。vue2内部的核心原理是使用的es5中的`Object.defineProperty`API来实现数据相应式的，这个api提供了`getter`和`setter`方法来实现数据劫持,使得vue可以来监听访问对象的属性或者对对象的属性进行赋值。

通过 Object.defineProperty 遍历对象的每一个属性，把每一个属性变成一个 getter 和 setter 函数，读取属性的时候调用 getter，给属性赋值的时候就会调用 setter.

当运行 render 函数的时候,发现用到了响应式数据，这时候就会运行 getter 函数，然后 watcher（发布订阅）就会记录下来。当响应式数据发生变化的时候，就会调用 setter 函数，watcher 就会再记录下来这次的变化，然后通知 render 函数，数据发生了变化，然后就会重新运行 render 函数，重新生成虚拟 dom 树。


Observer

作用是将普通对象转换成响应式对象，

实现：observer 把对象的每个属性通过 object.defineProperty 转换为带有 getter 和 setter 的属性，这样一来，当访问或者设置属性时，vue 就会有机会做一些别的事情。在组件的生命周期中，这件事发生在 beforeCreate 之后，create 之前。他会递归遍历对象的所有属性，以完成深度的属性转换

### Dep

即dependency 表示依赖的意思

vue 会为响应式对象中的每一个属性，对象本身，数组本身创建一个 dep 实例，每个 dep 实例都可以做两件事情：

1，记录依赖：是谁在用我  

2，派发更新：我变了，我要通知那些用我的人

### watcher

当函数执行的过程中，用到了响应式数据，响应式数据是无法知道是谁在用自己的

所以，我们不要直接执行函数，而是把函数交给一个 watcher 的东西去执行，watch 是一个对象，每个函数执行时都应该创建一个 watcher，通过 wacher 去执行

watcher 会创建一个全局变量，让全局变量记录当前负责执行的 watcher 等于自己，然后再去执行函数，在函数执行的过程中，如果发生了依赖记录，那么 dep 就会把这个全局变量记录下来，表示有一个 wathcer 用到了我这个属性。

当 dep 进行派发更行时，他会通知之前记录的所有 watcher，我变了
、

### Scheduler

就是 dep 通知 watcher 之后，如果 wathcer 执行重新运行对应的函数，就有可能导致频繁运行，从而导致效率低下，所以当 watcher 收到派发更新的通知后，需要通过schedule调度器，调度器查看数组里面有没有push进去过render函数的watcher，没有就加进去，然后通过 nextTick，把这些需要执行的 watcher 放到事件循环的微队列，同步代码执行完后开始执行异步任务，微队列中的函数开始执行，将watcher一个个拿出来依次执行。nextTick 是通过 Promise then 来完成的。

observer把每个属性通过Object.defineProperty设置setter和getter函数，使其变成响应式，同时生成dep属性，dep属性可以做两个事情，一个是记录谁调用了我，一个派发更新，响应式数据是不知道谁在用自己的，所以要通过watcher去执行，dep中会记录那个watche调用了自己，当更新时，dep会通知这些watcher，但这样可能会频繁的出发watcher，所以还需要经过一个调度器去处理，调度器先检查数组中有没有这些watcher，没有就放进去，通过nextTick去放入微队列，等同步操作执行完成后执行异步操作，将数组中的watcher一个个拿出来依次执行，调用render函数，使用diff算法更新虚拟Dom，再更新到真实Dom上。