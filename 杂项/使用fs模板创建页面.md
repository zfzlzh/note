# node不同颜色输出

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



# 页面快速生成脚本

```js
let style = {
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
}//console.log颜色，详见上一条
const fs = require('fs')//引入fs模块，node自带
const path = require('path')//引入path模块，node自带，处理路径用
//path.resolve([from ...], to)，将 to 参数解析为绝对路径，给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径
//__dirname 总是指向被执行 js 文件的绝对路径，例子：/d1/d2/myscript.js，__dirname为/d1/d2
const basePath = path.resolve(__dirname, '../src')
//process.argv 属性会返回一个数组，其中包含当 Node.js 进程被启动时传入的命令行参数，
//例如：npm run(#1) tepVue(#2) test1(#3) test5(#4) vueTable(#5)，process.argv为[
//		'C:\\Program Files\\nodejs\\node.exe',#1
//  	'E:\\tsLearn\\learn\\scripts\\templateVue',#2
//  	'test1',#3
//  	'test6',#4
//  	'vueTable'#5
//		]
const folderName = process.argv[2]//文件夹名
const dirName = process.argv[3]//文件名
const tepType = process.argv[4]//多个模板的情况下判断用
//判断提醒 
if (!folderName) {
    //添加不同的颜色，详见上一条
    console.log(styles['red'][0] + '%s' + styles['red'][1],'文件夹名称不能为空！')
    console.log(styles['blue'][0] + '%s' + styles['blue'][1],'示例：npm run tep 文件夹 文件名 类型')
    process.exit(0)
}
if (!dirName) {
    console.log(styles['red'][0] + '%s' + styles['red'][1],'文件名称不能为空！')
    console.log(styles['blue'][0] + '%s' + styles['blue'][1],'示例：npm run tep 文件夹 文件名 类型')
    process.exit(0)
}
//书写模板
例如
模板一
const VueTep = `<template>
    <div id="${dirName}">
        
    </div>
</template>

<script>
    export default{
       
    }
</script>

<style lang="scss" scoped>
   
</style>

`
模板二
const VueTepTable = `
....
`
//判断是否存在改文件夹，如无则创建该文件夹，fs.exists已弃用
fs.access(`${basePath}/views/${folderName}`, (err)=>{
    if (err){
        fs.mkdirSync(`${basePath}/views/${folderName}`) // mkdir创建
    }
    //cd  文件夹
    process.chdir(`${basePath}/views/${folderName}`) //cd  文件夹
    //在文件夹内创建vue文件，当该文件下已有该名称文件时会直接覆盖，如果不想直接覆盖可使用fs.readdirSync读取文件夹中的文件进行判断
    //多个模板的情况下可通过命令行参数判断使用哪个模板
    let temp = !tepType || tepType == "vue" ? VueTep : VueTepTable, 
        data = fs.readdirSync(`${basePath}/views/${folderName}`);//读取该文件下的文件
    if(data.includes(dirName+'.vue')){
        //当文件夹中有该名字的文件时提醒
        console.warn(styles['red'][0] + '%s' + styles['red'][1],`该文件夹下已有名为${dirName}的文件，请更换文件名`)
        process.exit(0)
    }
    //创建文件
    fs.writeFileSync(`${dirName}.vue`, temp) // vue  
    
    process.exit(0)
})

```



# 文件添加内容

```js
//在router的index中添加路由信息，读取index中的值，返回一个数组，index中的行作为下标
let newIndex = fs.readFileSync('/xx/xx', 'utf8')
//可能会有不同的分割方式，需要做个判断
if (newIndex.indexOf('\r\n') > -1) {
        unit = '\r\n'
    } else if (newIndex.indexOf('\r') > -1 && newIndex.indexOf('\n') < 0) {
        unit = '\r'
    } else if (newIndex.indexOf('\n') > -1 && newIndex.indexOf('\r') < 0) {
        unit = '\n'
    }
newIndex = newIndex.split('\n')
// 在index中设置一个锚点，寻找这个锚点的下标
let num = newIndex.indexOf('//index锚点')
//定型文
let text = `
  ....
    `
//添加定型文
newIndex.splice(num, 0, text)
//写入index
fs.writeFileSync(/xx/xx, newIndex.join('\n'), 'utf8')
```

# 判断有无文件或者文件夹

```js
//判断是否存在该文件夹或文件，如无则创建该文件夹，fs.exists已弃用
fs.access(`/xx/xx`, (err)=>{
    if (err){//即为没有该文件会文件夹
        fs.mkdirSync(`/xx/xx`) // mkdir创建
    }
})

```

# 判断某个文件夹下有无某个文件

```js
let data = fs.readdirSync(`/xx/xx`);//读取该文件下的文件
 if(data.includes('xxx.xx')){
        //当文件夹中有该名字的文件时提醒
        console.warn(styles['red'][0] + '%s' + styles['red'][1],`该文件夹下已有名为${xxx.xx}的文件，请更换文件名`)
        process.exit(0)
    }
```

