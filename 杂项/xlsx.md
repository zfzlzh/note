### 1.需要在导出的excel里面修改样式，需要使用xlsx-style

用到的文件放在export2excelVue2,export2excelVue3下

vue2版本导出

```js
//转换用
formatJson(filterVal, jsonData) {
    return jsonData.map(v =>
      filterVal.map(j => (v[j] === null || v[j] === undefined ? "" : v[j]))
    );
  },
export2Excel(data) {
            require.ensure([], () => {
                //引入方法
                const { export_json_to_excel } = require("../../vendor/Export2Excel");
                let tHeader1 = ['名字1','名字2'];//名称
                let filterVal = ['name1','name2'];//字段
                let title = "文件名字";
                let list = data;//数据,[{name1:xxx,name2:xxx},...]
                let newData = formatJson(filterVal, list);//将数据与字段对应
                export_json_to_excel(tHeader1, newData, title);
            });
        },
```



### 2.导入excel，使用fileReader读取

```js
readExcel(file, equipmentModelType) {
            if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
                this.$message.error("只能上传.xls或.xlsx文件")
                //出现问题需要清空，不然无法进行下一次导入
                this.$refs['upload'].clearFiles()
                return false
            }
            var rABS = false
            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
                try {
                    const data = ev.content;
                    let workbook;
                    if(rABS) {
                        workbook = XLSX.read(btoa(commonUtils.fixdata(data)), { //手动转化
                            type: 'base64'
                        });
                    } else {
                        workbook = XLSX.read(data, {
                        type: 'binary'
                        });
                    }
                    for (let sheet in workbook.Sheets) {
                        let work=workbook.Sheets[sheet]
                        
                        this.sheetArray = XLSX.utils.sheet_to_json(work);
                        break
                    }
                    if(!this.sheetArray || this.sheetArray.length == 0){
                        this.$message({
                            message:'空文件，请填入数据',
                            type:'warning'
                        })
                        //出现问题需要清空，不然无法进行下一次导入
                        this.$refs['upload'].clearFiles()
                        return
                    }
                    //后续操作
                    //.....
                    //执行完后清空上传
                    this.$refs['upload'].clearFiles()
                }
                catch
                (e) {
                    console.log(e)
                    this.$message.warning('错误的文件，请使用导入模板文件！');
                    return false;
                }
            }
            if(rABS) {
                fileReader.readAsArrayBuffer(file.raw);
            } else {
                fileReader.readAsBinaryString(file.raw);
            }
        },
```

```js
//兼容ie11
FileReader.prototype.readAsBinaryString = function (fileData) {
	var binary = "";
	var pt = this;
	var reader = new FileReader();
	reader.onload = function (e) {
		var bytes = new Uint8Array(reader.result);
		var length = bytes.byteLength;
		for (var i = 0; i < length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		pt.content = binary;
		pt.onload(pt); //页面内data取pt.content文件内容
	}
	reader.readAsArrayBuffer(fileData);
}
```

