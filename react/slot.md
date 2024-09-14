## slot插槽

**React中是没有插槽的概念的, 或者说在React中是不需要插槽的, 因为React对于这种需要插槽的情况非常灵活，有两种方案可以实现**：

### 1.组件的children子元素；即匿名插槽

**每个组件都可以获取到 `props.children`：它包含组件的`开始标签和结束标签之间的内容`**

parent.tsx

```tsx
import React  from 'react'
import NavBar from './c-cpns/NavBar'

export function App{
    return (
      <div>
        {/* 父组件将要插入到子组件的元素写到组件标签中 */}
        <NavBar>
          <button>按钮</button>
          <h2>标题</h2>
          <i>斜体</i>
        </NavBar>
      </div>
    )
}

export default App

```

son.tsx

```tsx
import React from 'react'
import './style.css'

export function NavBar {
    // 在子组件通过props中的children, 获取到要插入的元素
    const { children } = this.props
    return (
      <div className='nav-bar'>
        <div className='left'>
          {children[0]}
        </div>
        <div className='center'>
          {children[1]}
        </div>
        <div className='right'>
          {children[2]}
        </div>
      </div>
    )
    //如果children中有多个元素, 那么children是一个数组, 数组中存放着所有内容; 如果只插入一个元素到子组件中, 那么children本身就是插入的该元素
    return (
        <div className='nav-bar'>
        <div className='left'>
          {children}
        </div>
      </div>
    )
}

export default NavBar

```

## 2.props实现插槽,即具名插槽

**通过children实现的方案虽然可行，但是有一个弊端：通过索引值获取传入的元素很容易出错，不能精准的获取传入的原生**，且对顺序有严格的要求；

使用props实现，通过具体的属性名，可以让我们在传入和获取时更加的精准；

parent.tsx

```tsx
import React, { Component } from 'react'
import NavBarTwo from './c-cpns/NavBarTwo'

function centerSlot(){
    return (
    	<h2>标题</h2>
    )
}
export function App {

    // 定义要传入到子组件的元素
    const leftSlot = <button>按钮</button>
    const rightSlot = <i>斜体</i>

    return (
      <div>
        {/* 将插入的元素通过props的方式传入到子组件 */}
        <NavBarTwo
          leftSlot={leftSlot}
            {/*函数式组件传入方式，直接名字传入的是函数*/}
          centerSlot={<centerSlot></centerSlot>}
          rightSlot={rightSlot}
        />
      </div>
    )
}
export default App
```

son.tsx

```tsx
import React, { Component } from 'react'

export function NavBarTow {
    // 在子组件中获取到父组件传递过来的数据
    const { leftSlot, centerSlot, rightSlot } = this.props

    return (
      <div className='nav-bar'>
        {/* 将传递过来的数据进行展示 */}
        <div className='left'>
          {leftSlot}
        </div>
        <div className='center'>
          {centerSlot}
        </div>
        <div className='right'>
          {rightSlot}
        </div>
      </div>
    )
}

export default NavBarTow

```

