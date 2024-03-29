# 创建一个node项目

```node
npm init
```

# 主要模块

## express

## bodyParser

数据解析转换

application/json

```js
bodyParser.json()把application/json格式的请求主体数据解析出来放入req.body属性
```

x-www-form-urlencoded

```
bodyParser.urlencoded({})//把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性
```

bodyParser.raw(options):解析二进制:

返回一个将所有数据做为[Buffer](https://link.jianshu.com/?t=http://itbilu.com/nodejs/core/4y8qlhOml.html)格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的req.body中将会是一个Buffer
数据。

bodyParser.text(options):解析文本格式

返回一个仅处理字符串格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的req.body中将会是一个字符串值

## cors

跨域解决

## multer

上传文件图片

```js
const multer = require('multer');
const fs = require('fs');
var upload = multer({
  dest: 'tmp/'    //指定客户端上传的文件临时存储路径
})
router.post('/image', upload.single('dishImg'), (req, res)=>{
    //fs.rename  改变文件存放的路径
    fs.rename(tmpFile, 'img/dish/'+newFile, ()=>{
        res.send({code:200, msg:'upload succ', fileName: newFile}) //把临时文件转移
      })
}）
```

## fs

文件与文件夹操作

# 创建index.js入口文件

引入主要模块，创建http应用服务器，挂载中间件与路由器。

```js
//引入模块
const PORT = 8090;
const express = require('express');
const cors = require('cors');//跨域
const bodyParser = require('body-parser');
const categoryRouter = require('./routes/admin/category');//路由
//创建HTTP应用服务器
var app = express();
app.listen(PORT, () => {
    console.log('Server Listening: ' + PORT);
});

//使用中间件
app.use(cors());
//app.use(bodyParser.urlencoded({}))  //把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性
app.use(bodyParser.json()); //把application/json格式的请求主体数据解析出来放入req.body属性

//挂载路由器
app.use('/admin/category', categoryRouter);
```

# 创建路由池pool.js

```js
const mysql = require('mysql');
var pool = mysql.createPool({
  host: '127.0.0.1',      //数据库地址
  port: 3306,             //数据库端口
  user: 'root',           //数据库管理员
  password: '',           //数据库管理员密码
  database: 'xiaofeiniu', //默认连接的数据库
  connectionLimit: 10     //连接池中连接数量
});
module.exports = pool;
```

# 创建路由xxx.js文件

引入必须的模块组件

```js
const express = require('express');
const pool = require('../../pool');
var router = express.Router();//创建路由
module.exports = router;
```

express路由书写模式

```js
router.get(url,(req, res)=>{
	//获取参数
    //get系的为req.params,post系的为req.body
    let xxx = req.body/req.params.xxx
    pool.query(sql,param,callback=>{
        if(err)throw err;
        res.send()
    })
})
```

例子

```js
router.get('/login/:aname/:apwd', (req, res)=>{
  var aname = req.params.aname;
  var apwd = req.params.apwd;
    
  //pool.query(sql,param,callback)
  pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)', [aname, apwd], (err, result)=>{
    if(err)throw err;
    if(result.length>0){   //查询到一行数据，登录成功
      res.send({code:200, msg:'login succ'})
    }else {   //没有查询到数据
      res.send({code:400, msg:'aname or apwd err'})
    }
  });
})
```

# 读取环境变量

使用process.env

# 使用REPL

终端输入node回车进入REPL模式

REPL为*运行评估打印循环，是一种编程语言环境*

输入global.并按下tab探索全局对象

输入js类的名称例如Array，再添加一个点并按下tab，就会打印出该类上访问的所有属性和方法

再某些代码之后输入_,会打印出最后一次操作的结果

## 点命令

REPL 有一些特殊的命令，所有这些命令都以点号 `.` 开头

- `.help`: 显示点命令的帮助。
- `.editor`: 启用编辑器模式，可以轻松地编写多行 JavaScript 代码。当处于此模式时，按下 ctrl-D 可以运行编写的代码。
- `.break`: 当输入多行的表达式时，输入 `.break` 命令可以中止进一步的输入。相当于按下 ctrl-C。
- `.clear`: 将 REPL 上下文重置为空对象，并清除当前正在输入的任何多行的表达式。
- `.load`: 加载 JavaScript 文件（相对于当前工作目录）。
- `.save`: 将在 REPL 会话中输入的所有内容保存到文件（需指定文件名）。
- `.exit`: 退出 REPL（相当于按下两次 ctrl-C）。

# 从命令行接受参数

使用process的argv属性获取命令行的参数

第一个参数是node命令的完整路径#1

第二个参数是正在被执行的文件的完整路径，#2

其他参数从第三个开始#3

npm(#1) run temp(#2) xxx(#3)

可以使用循环迭代所有的参数,也可以使用slice

```sh
node app.js name=joe
```

出现这种情况需要进行解析

最好使用minimist库

```sh
const args = require('minimist')(process.argv.slice(2))
args['name'] //joe
//但是需要在每个参数名称之前使用双破折号：
node app.js --name=joe
```

# console

传入变量和格式说明符来格式化用语

- `%s` 会格式化变量为字符串

- `%d` 会格式化变量为数字

- `%i` 会格式化变量为其整数部分

- `%o` 会格式化变量为对象

    ```js
    console.log('我的%s已经%d岁', '猫', 2)
    ```



## console.clear()  清空控制台

## console.count()元素计数

```js
const oranges = ['橙子', '橙子']
oranges.forEach(fruit => {
  console.count(fruit)
})
```

## console.trace()打印堆栈踪迹

再REPL模式中会打印如下内容

```sh
Trace
    at function2 (repl:1:33)
    at function1 (repl:1:25)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:44:33)
    at REPLServer.defaultEval (repl.js:239:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:440:10)
    at emitOne (events.js:120:20)
    at REPLServer.emit (events.js:210:7)
```

## 计算耗时console.time()与conosle.timeEnd()

## stdout 和 stderr

console.log 非常适合在控制台中打印消息。 这就是所谓的标准输出（或称为 `stdout`）。

`console.error` 会打印到 `stderr` 流。

它不会出现在控制台中，但是会出现在错误日志中。

## 为输出着色

使用转义符为控制台中的文本着色，转义序列是一组标识颜色的字符

```js
var styles = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'],
    'italic'        : ['\x1B[3m',  '\x1B[23m'],
    'underline'     : ['\x1B[4m',  '\x1B[24m'],
    'inverse'       : ['\x1B[7m',  '\x1B[27m'],
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
    'white'         : ['\x1B[37m', '\x1B[39m'],
    'grey'          : ['\x1B[90m', '\x1B[39m'],
    'black'         : ['\x1B[30m', '\x1B[39m'],
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'cyan'          : ['\x1B[36m', '\x1B[39m'],
    'green'         : ['\x1B[32m', '\x1B[39m'],
    'magenta'       : ['\x1B[35m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
    'yellow'        : ['\x1B[33m', '\x1B[39m'],
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG'       : ['\x1B[40m', '\x1B[49m'],
    'blueBG'        : ['\x1B[44m', '\x1B[49m'],
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
    'greenBG'       : ['\x1B[42m', '\x1B[49m'],
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
    'redBG'         : ['\x1B[41m', '\x1B[49m'],
    'yellowBG'      : ['\x1B[43m', '\x1B[49m']
}
//使用
console.log(styles['red'][0] + '%s' + styles['red'][1],'hello')
```
另一种写法
```js

console.log('\x1B[31m这是红色\x1B[0m')
//颜色加背景色加字体属性，顺序为背景 颜色 字体属性 
console.log("\x1b[40m \x1b[31m \x1B[1m 红色黑底加粗 \x1b[0m");
//封装
const colorStyles = {
  black: "\x1B[30m", // 黑色
  red: "\x1B[31m", // 红色
  green: "\x1B[32m", // 绿色
  yellow: "\x1B[33m", // 黄色
  blue: "\x1B[34m", // 蓝色
  magenta: "\x1B[35m", // 品红
  cyan: "\x1B[36m", // 青色
  white: "\x1B[37m", // 白色
};
const fontStyles = {
  bold: "\x1B[1m", // 加粗
  normal: "\x1B[2m", // 正常
  italic: "\x1B[3m", // 斜体
  underline: "\x1B[4m", // 下划线
  reverse: "\x1B[7m", // 反向
  hidden: "\x1B[8m", // 隐藏
};
const bgStyles = {
  blackBG: "\x1B[40m", // 背景色为黑色
  redBG: "\x1B[41m", // 背景色为红色
  greenBG: "\x1B[42m", // 背景色为绿色
  yellowBG: "\x1B[43m", // 背景色为黄色
  blueBG: "\x1B[44m", // 背景色为蓝色
  magentaBG: "\x1B[45m", // 背景色为品红
  cyanBG: "\x1B[46m", // 背景色为青色
  whiteBG: "\x1B[47m", // 背景色为白色
};
/**
 * 
 * @param {* Object 打印信息} obj
 *    @param   {* String 字体颜色} color  -- [black黑色,red红色,green绿色,yellow黄色,blue蓝色,magenta品红,cyan青色,white白色]
 *    @param {* String 背景颜色} bgColor  -- [blackBG黑色,redBG红色,greenBG绿色,yellowBG黄色,blueBG蓝色,magentaBG品红,cyanBG青色,whiteBG白色]
 *    @param {* String 文字属性} font  -- [bold加粗,normal 正常,italic 倾斜,underline 下划线,reverse 反转,hidden 隐藏]
 *    @param {* String 文字} text
 */
const log = (obj) => {
  let { color,bgColor,font,text } = obj
  let logColor = colorStyles[color] || ''
  let backColor = bgStyles[bgColor] || ''
  let fontAttr = fontStyles[font] || ''

  console.log(
    // styles[color][0] + "%s" + styles[color][1],
    `${backColor} ${logColor} ${fontAttr} ${text} \x1B[0m`
  );
}
module.exports = {log}
```
这是底层的方法，简单使用可以用chalk库，需安装npm install chalk

```js
const chalk = require('chalk')
console.log(chalk.yellow('你好'))
```

## 创建进度条

使用[progress](https://www.npmjs.com/package/progress)包，可以在控制台中创建进度条，npm install progress

```js
//创建一个 10 步的进度条，每 100 毫秒完成一步。 当进度条结束时，则清除定时器
const ProgressBar = require('progress')
const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(() => {
  bar.tick()
  if (bar.complete) {
    clearInterval(timer)
  }
}, 100)
```

## 选项

:bar the progress bar itself   ==========
:current current tick number  数字自增
:total total ticks  直接出现最大数字
:elapsed time elapsed in seconds  变为小数 
:percent completion percentage  变为百分比
:eta estimated completion time in seconds   小数自减
:rate rate of ticks per second

# 从命令行接收输入

## [readline](http://nodejs.cn/api/readline.html)，内置模块

```js
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`你叫什么名字?`, name => {
  console.log(`你好 ${name}!`)
  readline.close()
})
```

这段代码会询问用户名，当输入了文本并且用户按下回车键时，则会发送问候语。

使用密码不想回显密码时可以使用[readline-sync包](https://www.npmjs.com/package/readline-sync)

也可以使用[Inquirer.js包](https://github.com/SBoudrias/Inquirer.js)，提供更完整更抽象的解决方案，npm install inquirer

```js
const inquirer = require('inquirer')

var questions = [
  {
    type: 'input',
    name: 'name',
    message: "你叫什么名字?"
  },
    {
        type: 'password',
        name: 'pwd',
        message: "请输入密码",
        mask:'*'
    }
]

inquirer.prompt(questions).then(answers => {
  console.log(`你好 ${answers['name']}!`)
})
```

Inquirer.js 可以执行许多操作，例如询问多项选择、展示单选按钮、确认等

# npm view <package> versions  查看包所有的版本

# 更新所有的包到最新版本

下载npm-check-updates包，

```sh
npm install -g npm-check-updates
//然后运行
ncu -u
```

# npm outdated查看软件包有无更新

# 语义版本控制

所有的版本都有 3 个数字：`x.y.z`。

- 第一个数字是主版本。
- 第二个数字是次版本。
- 第三个数字是补丁版本。

- 当进行不兼容的 API 更改时，则升级主版本。
- 当以向后兼容的方式添加功能时，则升级次版本。
- 当进行向后兼容的缺陷修复时，则升级补丁版本。

因为 `npm` 设置了一些规则，可用于在 `package.json` 文件中选择要将软件包更新到的版本（当运行 `npm update` 时）

- `^`: 如果写入的是 `^0.13.0`，则当运行 `npm update` 时，会更新到补丁版本和次版本：即 `0.13.1`、`0.14.0`、依此类推。
- `~`: 如果写入的是 `〜0.13.0`，则当运行 `npm update` 时，会更新到补丁版本：即 `0.13.1` 可以，但 `0.14.0` 不可以。
- `>`: 接受高于指定版本的任何版本。
- `>=`: 接受等于或高于指定版本的任何版本。
- `<=`: 接受等于或低于指定版本的任何版本。
- `<`: 接受低于指定版本的任何版本。
- `=`: 接受确切的版本。
- `-`: 接受一定范围的版本。例如：`2.1.0 - 2.6.2`。
- `||`: 组合集合。例如 `< 2.1 || > 2.6`

可以合并其中的一些符号，例如 `1.0.0 || >=1.1.0 <1.2.0`，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

还有其他的规则：

- 无符号: 仅接受指定的特定版本（例如 `1.2.1`）。
- `latest`: 使用可用的最新版本。

# 查看全局安装的包

```sh
npm list -g --depth 0
```

# --production

设置 `--production` 标志（`npm install --production`），避免安装开发依赖项