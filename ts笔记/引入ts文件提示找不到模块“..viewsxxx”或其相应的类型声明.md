**找不到模块“../views/xxx”或其相应的类型声明**

vite

```js
//vite.config.js
export default defineConfig({
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"]//导入时想要省略的扩展名列表。默认值为 ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'] 。
  },
}
```

```json
//tsconfig.json
"compilerOptions": {
    "baseUrl": ".",
    "paths": {
          "@/*": [ "src/*" ],
    }
  },
```

