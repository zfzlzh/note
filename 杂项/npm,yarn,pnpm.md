## npm install报错 unable to resolve dependency tree

无法解析依赖树，可能是安装的包和已有的包有冲突，

解决：使用npm install xxx --force 或者 npm install xxx --legacy-peer-deps



**pnpm,cnpm,yarn :无法加载文件 C:\Users\hp\AppData\Roaming\npm\pnpm.ps1，因为在此系统上禁止运行脚本**

1.在系统中搜索框输入 Windos PowerShell 

2.点击[管理员身份运行] # 以管理员身份运行power shell 

3.set-executionpolicy remotesigned 

4.根据提示，输入A，回车 

5.再次回到pnpm -v执行成功。