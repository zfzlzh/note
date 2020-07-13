使用vue-property-decorator与vue-class-component

# Decorators are not valid here

原因：@Component({})是用来装饰class用的，两者之间不能有其他代码

```typescript
//错误，两者之间不能有其他代码
@Component({})
let md5 = require("md5");
export default class Login extends Vue{}

//正确
let md5 = require("md5");
@Component({})
export default class Login extends Vue{}
```

# elementui

elementUi引入需要在d.ts文件中申明，不然无法使用

other.d.ts

```typescript
declare module "ElementUI"{
    export const ElementUI = "element-ui"
}
```

## Property 'validate' does not exist on type 'Element'

引入后如果发生Property 'validate' does not exist on type 'Element'报错，

ts不知道这是什么属性，所以报错

解决办法为使用断言给validate前的元素限定类型

```typescript
(this.$refs['form'] as any).validate((valid : boolean)=> {
     ... ...
})
```

# vue.router

也需要在d.ts文件中申明,包括一些自定义的组件和其他的第三方插件，使用window与document的时候也需要如此

other.d.ts

```typescript
declare module "vue/types/vue"{
    interface Vue{
        $router:VueRouter,
        $route:Route,
        $eventBus:any,
        $_:any,
        $PERMISSION:any,
        $Global:any,
        $RequestUtil:any
    }
}
declare var document: Document;
declare var window: Window & typeof globalThis
//如果document还是不能使用就在.vue文件里再次申明
declare let document: Document | any;
```

# 全局引入公用scss文件

需要在vue.config.js中修改

```js
module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 要公用的scss的路径
                    resources: './src/assets/scss/global.scss'
                })
                .end()
        })
    },
}
```

# echarts

可能会报类型不兼容的错误，原因在于@type/echarts组件里有些类型为联合声明变量，例如type Type = 'value' | 'category' | 'time' | 'log'，直接写type:“dash”这样就会报错，可以用类型断言解决

```typescript
type:"dash" => type:("dash" as "dash")
```

或者不用@type/echarts，而是像elementui那样在d.ts文件中引入，但是失去了ts强引用的优势

全局引用需要在d.ts文件中声明this中有$echarts这一指令，与vue-router写在一起