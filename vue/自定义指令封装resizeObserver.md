directive/ResizeObserver.js

```js
// 监听元素大小变化的指令
const map = new WeakMap()
const throttle = (fun,delay) => {
	let timer = null;
	return function() {
		const args = arguments
		if(timer) {
			clearTimeout(timer)
            timer = null
		}
        timer = setTimeout(() => {
            fun(args)
            clearTimeout(timer)
            timer = null
        }, delay)
        
	}
}
const ob = new ResizeObserver(throttle((entries) => {
    for (const entry of entries) {
        // 获取dom元素的回调
        const handler = map.get(entry.target)
        //存在回调函数
        if (handler) {
            // 将监听的值给回调函数
            handler({
                width: entry.borderBoxSize[0].inlineSize,
                height: entry.borderBoxSize[0].blockSize
            })
        }
    }
},500))


export const Resize = {

    mounted(el, binding) {
        //将dom与回调的关系塞入map
        map.set(el, binding.value)
        //监听el元素的变化
        ob.observe(el)
    },
    unmounted(el) {
        //取消监听
        ob.unobserve(el)
    }
}

export default Resize
```

directive/index.js

```js
import { Resize } from "./resizeObserver"


// 自定义指令集合
const directives = {
    Resize,
}

export default {
    install(app) {
        Object.keys(directives).forEach((key) => {
            app.directive(key, directives[key])
        })
    }
}
```

使用

xxx.vue

```vue
<template>
  <div id="advicedFunctionViewer">
    <component :is='currentComponent' v-if="currentComponent" v-resize="onResize" :ref="setComponentRef"></component>
    <div class="Sagittal mprViewer" ref="SagittalDom" v-resize="onResize"></div>
    <div class="Coronal mprViewer" ref="CoronalDom" v-resize="onResize"></div>
    <div class="Axial mprViewer" ref="AxialDom" v-resize="onResize"></div>
  </div>
</template>
```

