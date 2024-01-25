## 1.npm安装依赖卡住显示idealTree buildDeps

设置镜像源

```powershell
//设置淘宝镜像源
npm config set registry https://registry.npm.taobao.org
//检查当前源
npm config get registry
```

如果不行先执行下面两步再执行上面的

```powershell
//删除用户界面下的npmrc文件（注意一定是用户C:\Users\{账户}\下的.npmrc文件下不是nodejs里面）
//清除缓存，注意不要用npm cache clean --force，容易出现npm WARN using --force I sure hope you know what you are doing.
npm cache verify
```

