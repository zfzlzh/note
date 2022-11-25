# vue3与ts搭配，v-for出现unknow问题

```vue
<div 
      v-for="item in list" //出现提示item是unknow类型
      :key="item?.id" 
      :style="`background-image:url('${item?.url}');width:100px;height:100px`" 
      class="div-image"
      @click="clickDiv(item)"
    >
</div>
<script>
//解决方法，引入PropType
import { ref,PropType} from 'vue'
//数组内部对象的类型声明
interface listItem{
  id:string|number,
  url:string
}
const props = defineProps({
  list:{
      //Array as PropType<listItem[]>,不会出现报错
    type:Array as PropType<listItem[]>,
    default:()=>[
      {id:"",url:''}
    ]
  }
})
</script>
```

# vue3  setup语法糖中使用render

```js
import { h } from 'vue'
const renderDiv = {
    render:() => {
        return h('div',{id:'test'},[h('p','test')])
    }
}
//template中使用
<renderDiv></renderDiv>
```

# [Vue warn]: Non-function value encountered for default slot. Prefer function slots for better performance

使用render时警告，直译为  默认插槽为非函数值。推荐使用函数插槽以获得更佳性能，即render的第三个参数的值没有为函数值

解决方法：

```js
//原来
h('div',{id:'test'},'tesfdfdfdsf')
//修改后
h('div',{id:'test'},{default:() => 'tesfdfdfdsf'})
//具名插槽
h('div',{id:'test'},{
    default:() => 'tesfdfdfdsf'},
  	name:() => 'sdfaafadsf'
 )
```

# render引入组件

1.直接引入组件，

2.如果一个组件是用名字注册的，不能直接导入 (例如，由一个库全局注册)，可以使用 resolveComponent 来解决这个问题

```js
//直接引入，自定义组件与可按需引入的组件库的组件可直接用这个
import { ElButton } from 'element-plus'
h(ElButton,{},{default:() => 'tesfdfdfdsf'})
//resolveComponent，无法直接导入的组件用这个，组件库也可以用这个
import { resolveComponent } from 'vue'
h(resolveComponent('el-button'),{},{default:() => 'tesfdfdfdsf'})
```

# render绑定事件

vue3要求驼峰命名

```js
h('div',{onClick:() => {console.log(111)}},{default:() => 'tesfdfdfdsf'})
```

# render  v-model

```js
props: ['modelValue'],
emits: ['update:modelValue'],
setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
```

