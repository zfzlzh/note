## 轻松地运行本地命令

Node.js 开发者过去通常将大多数可执行命令发布为全局的软件包，以使它们处于路径中且可被立即地执行。

这很痛苦，因为无法真正地安装同一命令的不同版本。

运行 `npx commandname` 会自动地在项目的 `node_modules` 文件夹中找到命令的正确引用，而无需知道确切的路径，也不需要在全局和用户路径中安装软件包。

## 无需安装的命令执行

1. 不需要安装任何东西。
2. 可以使用 @version 语法运行同一命令的不同版本。

使用场景比如

- 运行 `vue` CLI 工具以创建新的应用程序并运行它们：`npx vue create my-vue-app`。
- 使用 `create-react-app` 创建新的 `React` 应用：`npx create-react-app my-react-app`。

当被下载完，则下载的代码会被擦除。



## 使用不同的 Node.js 版本运行代码

使用 `@` 指定版本，并将其与 [`node` npm 软件包](https://www.npmjs.com/package/node) 结合使用：

```sh
npx node@10 -v #v10.18.1
npx node@12 -v #v12.14.1
```

这有助于避免使用 `nvm` 之类的工具或其他 Node.js 版本管理工具

## 直接从 URL 运行任意代码片段

`npx` 并不限制使用 npm 仓库上发布的软件包。

可以运行位于 GitHub gist 中的代码，例如：

```
npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32
```

需要格外小心，代码不受控制