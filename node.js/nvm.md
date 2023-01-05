node版本管理

1.https://github.com/coreybutler/nvm-windows/releases下载nvm.exe并安装

2.cmd中输入nvm ls available可查看所有可安装node版本，如果报错Could not retrieve https://nodejs.org/dist/latest/.....，打开nvm安装目录的settings.txt文件，

添加两行代码

```
node_mirror:https://npm.taobao.org/mirrors/node/
npm_mirror:https://npm.taobao.org/mirrors/npm/
```

3.nvm install node版本号，如nvm install 16.17.0

4.安装成功后，输入nvm use node版本号使用该版本node，如nvm use 16.17.0，如果报错exit status 1: ��û���㹻��Ȩ��ִ�д˲�����，使用管理员运行cmd

5.nvm ls 可查看所有安装的node版本，与当前选择的版本

6.删除node版本，可用nvm uninstall node版本号，如nvm uninstall 16.17.0 