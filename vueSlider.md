# 1.动态修改最大最小值

直接修改插件的dotsValue为新的值，不然会异常

```js
this.$refs['vueSlider'].control.dotsValue = this.colorNum
```

# 2.动态设置多段颜色

改写colorProcess函数的返回值

```js
//colorProcess为vueSlider的process
this.colorProcess = dotsPos=>{
                let arr = []
                    // [dotsPos[0], dotsPos[1], { backgroundColor: '#74C9CA' }],
                    // [dotsPos[1], dotsPos[2], { backgroundColor: '#9DD56F' }],
                    // [dotsPos[2], dotsPos[3], { backgroundColor: '#F7CF72' }],
                    // [dotsPos[3], dotsPos[4], { backgroundColor: 'rgba(245, 98, 98, 1)' }],
                this.setForm.colorArr.forEach((val,index)=>{
                    if(!arr[index]){
                        arr.push([dotsPos[index], dotsPos[index+1], { backgroundColor: val }])
                    }else{
                        arr[index][2].backgroundColor = val
                        arr[index][0]=dotsPos[index]
                        arr[index][1]=dotsPos[index+1]
                    }
                })
                return arr
            }
```

# 3.添加新的dots

当dotsPos的长度小于colorNum的长度时，取最后第二个和最后第三个，取两者的平均数，替换原来的倒数第二个，原来的倒数第二个继续放入倒数第二个的位置

```js
//colorNum为vueSlider的value，即v-model的值，dotOptions为其dot-options，
// 取最后第二个和最后第三个，取两者的平均数，替换原来的倒数第二个，原来的倒数第二个继续放入倒数第二个的位置
let newArr = this.colorNum.concat()
            let max = newArr[newArr.length-2]
            let num =Math.floor((newArr[newArr.length-2] + newArr[newArr.length-3])/2) 

            this.colorNum.splice(this.colorNum.length-2,1,num)
            this.colorNum.splice(this.colorNum.length-1,0,max)
            
             //  dotOptions倒数第二个位置添加一个{disabled:false}
            let obj = {disabled:false}
            this.dotOptions.splice(this.dotOptions.length-2,0,obj)
            
            this.$refs['vueSlider'].control.dotsValue = this.colorNum 
//当dotsPos的长度小于colorNum的长度时，执行上面一样的操作
if(this.$refs['vueSlider'].control.dotsPos.length<this.colorNum.length){
                let dotsPos = this.$refs['vueSlider'].control.dotsPos.concat()
                max = dotsPos[dotsPos.length-2]
                num =Math.floor((dotsPos[dotsPos.length-2] + dotsPos[dotsPos.length-3])/2) 

                dotsPos.splice(dotsPos.length-2,1,num)
                dotsPos.splice(dotsPos.length-1,0,max)
                this.$refs['vueSlider'].control.dotsPos = dotsPos
            }
```

