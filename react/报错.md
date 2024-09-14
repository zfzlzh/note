# 使用函数创建懒加载路由，报错

### The above error occurred in one of your React components;

### can't find module  '../xxx/xxx'

### Consider adding an error boundary to your tree to customize error handling behavior

```js

//错误,疑似import处无法使用变量,报错：

const createRoute = (path:string) => {
  const Page = lazy(() => import(path));
  return (
    <Suspense fallback={<Spin />}>
      <Node />
    </Suspense>
  );
};
//正确，直接传入懒加载组件，可以正确生成
//element:createRoute(lazy(() => import("../components/AppLayout")))
const createRoute = (Node: LazyExoticComponent<React.FC>) => {
  return (
    <Suspense fallback={<Spin />}>
      <Node />
    </Suspense>
  );
};

```

## 导入路径不能以“.tsx”扩展名结束。考虑改为导入“./App.js”

```tsx
//vite-env.d.ts
declare module '*.tsx'
```

## react-dom/client没有默认导出

```json
//tsconfig.json
{
	"compilerOptions":{
		"esModuleInterop": true
	}
}
```

