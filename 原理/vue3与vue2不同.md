# 响应式实现原理不同

**Vue3是使用Proxy**，Proxy可以**劫持整个data对象**，然后**递归返回属性的值的代理**即可实现响应式；但是它的兼容性不是很好；

proxy的优点：

可直接监听数组类型的数据变化
性能的提升
监听的目标为对象本身，不需要像Object.defineProperty一样遍历每个属性，有一定的性能提升
可直接实现对象属性的新增/删除

**Vue2是使用Object.defineProperty**，它只能劫持**对象的属性，**所以它需要深度遍历data中的每个属性，这种方式对于数组很不友好，**而且对象观测后，新增的属性就不是响应式的，不过可以用`Vue.set()`来添加新的属性**；

# api类型不同

vue2：vue2使用选项类型api，选项型api在代码里分割了不同的属性：data,computed,methods等。

vue3：vue3使用组合式api，新的合成型api能让我们使用方法来分割，相比于旧的api使用属性来分组，这样代码会更加简便和整洁。

定义数据变量和方法不同

vue2：vue2是把数据放入data中，在vue2中定义数据变量是data(){}，创建的方法要在methods:{}中。

vue3：，vue3就需要使用一个新的setup()方法，此方法在组件初始化构造的时候触发。使用以下三个步骤来建立反应性数据：

从vue引入reactive；

使用reactive() 方法来声明数据为响应性数据；

使用setup()方法来返回我们的响应性数据，从而template可以获取这些响应性数据。

# 命周期钩子函数不同

vue2：vue2中的生命周期：

beforeCreate 组件创建之前

created 组件创建之后

beforeMount 组价挂载到页面之前执行

mounted 组件挂载到页面之后执行

beforeUpdate 组件更新之前

updated 组件更新之后

vue3：vue3中的生命周期：

setup 开始创建组件前

onBeforeMount 组价挂载到页面之前执行

onMounted 组件挂载到页面之后执行

onBeforeUpdate 组件更新之前

onUpdated 组件更新之后
而且vue3.x 生命周期在调用前需要先进行引入

vue3中移除v-on.native修饰符；vue3中移除过滤器filter

# 根节点不同

vue3模板可以有多个根节点，vue2只能有一个

# diff算法

vue2 diff算法就是进行虚拟节点对比，并返回一个patch对象，用来存储两个节点不同的地方，最后用patch记录的消息去局部更新Dom。
vue2 diff算法会比较每一个vnode,而对于一些不参与更新的元素，进行比较是有点消耗性能的。

vue3 diff算法在初始化的时候会给每个虚拟节点添加一个patchFlags，patchFlags就是优化的标识。
只会比较patchFlags发生变化的vnode,进行更新视图，对于没有变化的元素做静态标记，在渲染的时候直接复用。

# v-if 和 v-for的优先级

vue2 v-for优先级高，vue3v-if优先级高