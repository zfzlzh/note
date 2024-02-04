获取数据用于监听

```js
import {  storeToRefs } from 'pinia'
//将数据取出时设置为响应式，不包含函数，函数不使用该方法
const { mode } = storeToRefs(useViewerModeStore())
watch(mode,(newVal) => {
    console.log(newVal)
})
```

