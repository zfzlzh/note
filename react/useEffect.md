# useEffect

类比vue的watch，依赖添加空数组[]类比于vue3的watchEffect

## 使用场景：

### 1.需要在渲染完成后执行的方法，使用useEffect包裹，把它分离到渲染逻辑的计算过程之外，但每次渲染完成都会触发

```tsx
const ref = useRef(null);
const [isPlaying,setIsPlaying] = useState(true)
useEffect(() => {
	const a = isPlaying ? '关闭' : '开启'
    ref.current.play();
})
```



### 2.如果需要只当某个或者某几个变量变化的时候执行，可以指定 Effect 依赖，在结尾加上变量的数组，如

```tsx
const ref = useRef(null);
const [isPlaying,setIsPlaying] = useState(true)
useEffect(() => {
    //如果内部使用了任何props传参或者state，指定依赖不可以为[],必须指明内部使用到的依赖
	const a = isPlaying ? '关闭' : '开启'
},[isPlaying,ref])//ref可以省略，这是因为 ref 具有 稳定 的标识：React 保证 每轮渲染中调用 useRef 所产生的引用对象时，获取到的对象引用总是相同的，即获取到的对象引用永远不会改变，所以它不会导致重新运行 Effect。因此，依赖数组中是否包含它并不重要

//如果useEffect中没有使用任何state或者props，此时指定依赖数组为空数组 []。这告诉 React 仅在组件“挂载”时运行此代码，即首次出现在屏幕上这一阶段
useEffect(() => {
    const a = 1;
    a++
},[])
```

### 3.指定依赖数组为空数组 []时，在开发环境中，React 会在初始挂载组件后，立即再挂载一次，问题所在：在代码中，组件被卸载时没有关闭连接，可以在 Effect 中返回一个 **清理（cleanup）** 函数

```tsx
 useEffect(() => {
    const connection = createConnection();
    connection.connect();
     //每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数
    return () => {
      connection.disconnect();
    };
  }, []);
```

重复挂载组件，可以确保在 React 中离开和返回页面时不会导致代码运行出现问题。上面的代码中规定了挂载组件时连接服务器、卸载组件时断连服务器。所以断开、连接再重新连接是符合预期的行为。当为 Effect 正确实现清理函数时，无论 Effect 执行一次，还是执行、清理、再执行，用户都不会感受到明显的差异。所以，在开发环境下，出现额外的连接、断连时，这是 React 正在调试你的代码。这是很正常的现象，不要试图消除它！

**在生产环境下，`"✅ 连接中……"` 只会被打印一次**。也就是说仅在开发环境下才会重复挂载组件，以帮助你找到需要清理的 Effect。你可以选择关闭 [严格模式](https://react.docschina.org/reference/react/StrictMode) 来关闭开发环境下特有的行为，但我们建议保留它。这可以帮助发现许多上面这样的错误。

#### 如何处理在开发环境中 Effect 执行两次？ 

在开发环境中，React 有意重复挂载你的组件，以查找像上面示例中的错误。**正确的态度是“如何修复 Effect 以便它在重复挂载后能正常工作”，而不是“如何只运行一次 Effect”**。

通常的解决办法是实现清理函数。清理函数应该停止或撤销 Effect 正在执行的任何操作。简单来说，用户不应该感受到 Effect 只执行一次（如在生产环境中）和执行“挂载 → 清理 → 挂载”过程（如在开发环境中）之间的差异。

### 4.控制非 React 组件

有时需要添加不是使用 React 编写的 UI 小部件,比如地图

假设你要向页面添加地图组件，并且它有一个 `setZoomLevel()` 方法，你希望调整缩放级别（zoom level）并与 React 代码中的 `zoomLevel` state 变量保持同步。Effect 看起来应该与下面类似

```tsx
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
  //请注意，在这种情况下不需要清理。在开发环境中，React 会调用 Effect 两次，但这两次挂载时依赖项 zoomLevel 都是相同的，所以会跳过执行第二次挂载时的 Effect。开发环境中它可能会稍微慢一些，但这问题不大，因为它在生产中不会进行不必要的重复挂载。
    
 //某些 API 可能不允许连续调用两次。例如，内置的 <dialog> 元素的 showModal 方法在连续调用两次时会抛出异常，此时实现清理函数并使其关闭对话框：
    //在开发环境中，Effect 将调用 showModal()，然后立即调用 close()，然后再次调用 showModal()。这与调用只一次 showModal() 的效果相同。也正如在生产环境中看到的那样
   //return ....
}, [zoomLevel]);
```

### 5.订阅事件

如果 Effect 订阅了某些事件，清理函数应该退订这些事件,开发环境中也是先执行一次监听，再执行解除，再执行监听

```tsx
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 6.触发动画

动画同样需要重置，使用支持过渡的第三方动画库，你的清理函数应将时间轴重置为其初始状态

```tsx
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 触发动画
  return () => {
    node.style.opacity = 0; // 重置为初始值
  };
}, []);
```

### 7.获取数据

如果 Effect 将会获取数据，清理函数应该要么 [中止该数据获取操作](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)，要么忽略其结果

```
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

我们无法撤消已经发生的网络请求，但是清理函数应当确保获取数据的过程以及获取到的结果不会继续影响程序运行。如果 `userId` 从 `'Alice'` 变为 `'Bob'`，那么请确保 `'Alice'` 响应数据被忽略，即使它在 `'Bob'` 之后到达。

**在开发环境中，浏览器调试工具的“网络”选项卡中会出现两个 fetch 请求**。这是正常的。使用上述方法，第一个 Effect 将立即被清理，而 `ignore` 将被设置为 `true`。因此，即使有额外的请求，由于有 `if (!ignore)` 判断检查，也不会影响程序状态。

**在生产环境中，只会显示发送了一条获取请求**。如果开发环境中，第二次请求给你造成了困扰，最好的方法是使用一种可以删除重复请求、并缓存请求响应的解决方案：

```tsx
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

## 初始化应用时不需要使用 Effect 的情形

### 1.某些逻辑应该只在应用程序启动时运行一次。比如，验证登陆状态和加载本地程序数据。你可以将其放在组件之外

```tsx
if (typeof window !== 'undefined') { // 检查是否在浏览器中运行
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ……
}
```

### 2.不要在 Effect 中执行购买商品一类的操作 

有时，即使编写了一个清理函数，也不能避免执行两次 Effect。例如，Effect 包含会发送 POST 请求以执行购买操作

```tsx
useEffect(() => {
  // 🔴 错误：此处的 Effect 会在开发环境中执行两次，这在代码中是有问题的。
  fetch('/api/buy', { method: 'POST' });
}, []);
```

一方面，开发环境下，Effect 会执行两次，这意味着购买操作执行了两次，但是这并非是预期的结果，所以不应该把这个业务逻辑放在 Effect 中。另一方面，如果用户转到另一个页面，然后按“后退”按钮回到了这个界面，该怎么办？Effect 会随着组件再次挂载而再次执行。所以，当用户重新访问某个页面时，不应当执行购买操作；当只有用户点击“购买”按钮时，才执行购买操作。

因此，“购买”的操作不应由组件的挂载、渲染引起的；它是由特定的交互作用引起的，它应该只在用户按下按钮时运行。因此，**它不应该写在 Effect 中，应当把 `/api/buy` 请求操作移动到购买按钮事件处理程序中**：

```tsx
 function handleClick() {
    // ✅ 购买商品应当在事件中执行，因为这是由特定的操作引起的。
    fetch('/api/buy', { method: 'POST' });
  }
```

**这个例子说明如果重新挂载破坏了应用程序的逻辑，则通常含有未被发现的错误**。从用户的角度来看，访问一个页面不应该与访问它、点击链接然后按下返回键再次查看页面有什么不同。React 通过在开发环境中重复挂载组件以验证组件是否遵守此原则。

## 摘要

- 与事件不同，Effect 是由渲染本身，而非特定交互引起的。
- Effect 允许你将组件与某些外部系统（第三方 API、网络等）同步。
- 默认情况下，Effect 在每次渲染（包括初始渲染）后运行。
- 如果 React 的所有依赖项都与上次渲染时的值相同，则将跳过本次 Effect。
- 不能随意选择依赖项，它们是由 Effect 内部的代码决定的。
- 空的依赖数组（`[]`）对应于组件“挂载”，即添加到屏幕上。
- 仅在严格模式下的开发环境中，React 会挂载两次组件，以对 Effect 进行压力测试。
- 如果 Effect 因为重新挂载而中断，那么需要实现一个清理函数。
- React 将在下次 Effect 运行之前以及卸载期间这两个时候调用清理函数。