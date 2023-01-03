# 1.圆环南丁格尔图数据极差过大显示不友好

防止数据极差过大显示不友好，所有数值（除了0）加上最大的数值的一半，data使用处理后的数据，tooltip中还原原来的数字显示

```js
 //放大值
            var newData=this.rosePieData//饼图数据
			var showData =[];
			var sum = 0, max = 0;
			newData.forEach(item => {//获取最大值
			    sum += item.value;
			    if(item.value >= max) max = item.value;
			});
			// 放大规则
			var number = Math.round(max * 0.5);
            showData = newData.map(item=>{//所有数值加上规则值
                return {
			        value: item.value>0?number + item.value:item.value,
			        name: item.name
			    }
            })
xxx.setOption({
    //tooltip中还原数字显示
    tooltip: {
         trigger: 'item',
		formatter: function (param){
            let html = '<p>'+param.seriesName+'</p>'
            html+='<p>'+ param.name +': '+ (param.value - number) + ' (' + (((param.value - number) / sum) *100).toFixed(2) + '%)'+'</p>'
			return html
		}
    },
    series:[
        {
            data:showData//数据使用处理后的数据
        }
    ]
})
```

# 监听dataZoom

```js
myChart2.on('dataZoom',function(params){
				// 监听dataZoom事件，获取返回值params
				console.log(params)
				console.log(myChart2)
				let start = params.batch[0].startValue,
					end = params.batch[0].endValue;
					console.log('start',start)
					console.log('end',end)
					let xList,
						chartsMap = myChart2._chartsMap;//折线图的数据
					for(let i in chartsMap){
						xList = chartsMap[i]._data._idList//折线图的x轴的数据
					}
					console.log('xList',xList)
					let nowArr = [xList[start],xList[end]]//框选的x轴的开头和结尾
					console.log('nowArr',nowArr)
			})
```

