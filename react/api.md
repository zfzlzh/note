## 当 props 变化时重置所有 state

例子

`ProfilePage` 组件接收一个 prop：`userId`。页面上有一个评论输入框，你用了一个 state：`comment` 来保存它的值。有一天，你发现了一个问题：当你从一个人的个人资料导航到另一个时，`comment` 没有被重置。这导致很容易不小心把评论发送到不正确的个人资料。为了解决这个问题，你想在 `userId` 变化时，清除 `comment` 变量。

方法：

可以通过为每个用户的个人资料组件提供一个明确的键来告诉 React 它们原则上是 **不同** 的个人资料组件。将你的组件拆分为两个组件，并从外部的组件传递一个 `key` 属性给内部的组件

```tsx
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');
  // ...
  
  //错误方法
  // 🔴 避免：当 prop 变化时，在 Effect 中重置 state
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

通常，当在相同的位置渲染相同的组件时，React 会保留状态。**通过将 `userId` 作为 `key` 传递给 `Profile` 组件，使  React 将具有不同 `userId` 的两个 `Profile` 组件视为两个不应共享任何状态的不同组件**。每当 key（这里是 `userId`）变化时，React 将重新创建 DOM，并 [重置](https://react.docschina.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) `Profile` 组件和它的所有子组件的 state。现在，当在不同的个人资料之间导航时，`comment` 区域将自动被清空。

## 当 prop 变化时调整部分 state

例子

`List` 组件接收一个 `items` 列表作为 prop，然后用 state 变量 `selection` 来保持已选中的项。当 `items` 接收到一个不同的数组时，你想将 `selection` 重置为 `null

方法

在渲染期间直接调整 state

```tsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);
  //错误方法
  // 🔴 避免：当 prop 变化时，在 Effect 中调整 state
  useEffect(() => {
    setSelection(null);
  }, [items]);
   
  //正确方法
  // 好一些：在渲染期间调整 state,虽然这种方式比 Effect 更高效，但大多数组件也不需要它。无论你怎么做，根据 props 或其他 state 来调整 state 都会使数据流更难理解和调试。
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  //总是检查是否可以通过添加 key 来重置所有 state，或者 在渲染期间计算所需内容。例如，你可以存储已选中的 item ID 而不是存储（并重置）已选中的 item：
  const [selection, setSelection] = useState(null);//去除这句
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 非常好：在渲染期间计算所需内容
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

