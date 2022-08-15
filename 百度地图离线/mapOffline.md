# 百度地图离线版

## 1.找到百度地图的主文件

①申请百度地图密钥，

②输入地址：http://api.map.baidu.com/api?v=3.0&ak=您的密钥

③复制看到的代码，使用js格式化工具格式化，建立一个文件命名为appiv3.0，粘贴代码进去

④编写一个html文件，引用创建的文件，初始化一个地图，新建一个空的js文件，（这里命名为getModules3.0）

## 2.修改appiv3.0文件

①再appiv3.0中查找**&mod=**字符串，找到**0 == a.length ? f.LJ() : pa(f.eF.MO + "&mod=" + a.join(","))**，*（**变量名与函数名每次都不同）***

②浏览器打开html，在这个语句上打上断点，获取f.eF.MO的值，http://api.map.baidu.com/getmodules?v=3.0，这个地址为主文件获取模块的地址，***且并非每次都相同***

③将**pa(f.eF.MO + "&mod=" + a.join(","))**替换为**pa(getModules3.0.js文件所在的地址)**

④在该句下方添加console.log(a)，打印出需要调用的模块的数组；有时候打印出来的时空数组，可以使用无痕模式，或者清除缓存再尝试获取，***获取到的值并非每次都相同***

⑤分别把数组中的值添加到②中获取到的地址后访问，把显示的内容拷贝到getModules3.0.js文件中，都完成后继续运行html文件，如果有继续打印出数组就重复步骤，没有就说明已经下载好了

⑥在appiv3.0中查找utf-8，找到pa函数中的e.charset = "utf-8"，注释掉

⑦ 查找A.pa =

  A.url.proto +

  ("2" == A.Cu

 ? A.**url.domain.main_domain_cdn.other[0]**

 : A.**url.domain.main_domain_nocdn.baidu**) +

 "/";样式的句子，改为A.pa = ""

⑧修改获取瓦片地图的url，在appiv3.0文件中查找getTilesUrl字符串，会有多个，找到类似下面的代码块

```js
Ce.getTilesUrl = function (a, b, c) {
  var e = a.x,
  a = a.y,
  f = Xb("normal"),
  g = 1,
  c = Be[c];
  this.map.Lx() && (g = 2);
  e = this.map.ef.js(e, b).lj;
  return (
      Ae[Math.abs(e + a) % Ae.length] +
      "?qt=vtile&x=" +
      (e + "").replace(/-/gi, "M") +
      "&y=" +
      (a + "").replace(/-/gi, "M") +
      "&z=" +
      b +
      "&styles=" +
      c +
      "&scaler=" +
      g +
      (6 == x.ga.oa ? "&color_dep=32&colors=50" : "") 		+
      "&udt=" +
      f +
      "&from=jsapi3_0"
    ).replace(/-(\d+)/gi, "M$1");
  };
```

修改为

```js
Ce.getTilesUrl = function(a,b,c){
    var x=a.x,y=a.y,e=1,z=a;
    return "/map/"+b+"/"+x+"/"+y+".png";//自己瓦片地图存放的文件夹的地址，b,x,y为瓦片地图下载下来后默认的文件夹层级，
  }
```

如此地图就可以显示了

## 3.其他

①此时打开开发者工具，会发现很多报错，主要是找不到某些图片，比如openhand.cur，在appiv3.0文件中搜索openhand.cur，找到类似于**url(" + J.ta + "openhand.cur) 8 8,default**的代码，J.ta为地址前缀，查找var J，找到**ta:A.pa + "images**/，修改为自己的地址,比如ta:A.pa + "/images/",A.pa已在2.⑦中修改为""，所以不需要修改。

②当你想要用在线地图API上的功能时，发现在离线地图上用不了。先使用在线地图API把代码写好，然后再使用离线地图API，他会把相应的缺失模块打印出来，你只要把模块导进自己的模块中，就能够离线使用了。

③比如地图添加覆盖物，html文件添加一个添加边界的方法

```js
function getBoundary(boundaryString,bmap){
			const  bdary = new BMap.Boundary();
			bdary.get(boundaryString, function(rs){//获取行政区域
                console.log(rs)//获取点
				polygonOverlay && bmap.removeOverlay(polygonOverlay);
				var count = rs.boundaries.length;//行政区域的点有多少个
				if (count === 0) {
					alert('未能获取当前输入行政区域');
					return ;
				}
		      	var pointArray = [];
				for (var i = 0; i < count; i++) {
					var ply = new BMap.Polygon(rs.boundaries[i], { fillColor:"#000000",fillOpacity:0.01,strokeWeight: 2, strokeColor: "#000000"}); //建立多边形覆盖物
					polygonOverlay = ply;
					bmap.addOverlay(ply);//添加覆盖物
					pointArray = pointArray.concat(ply.getPath());
				}    
			});   
		}
```

在线百度地图绘制边框是获取一些点，然后调用Polygon方法去绘制覆盖物，打印rs的数据，复制粘贴到json文件中，然后读取文件内容使用Polygon方法绘制

例子：

```js

$.getJSON("guangdongBoundary.json",function(result){
	var count = result.boundaries.length;
		if (count === 0) {
			alert('未能获取当前输入行政区域');
			return ;
		}
		var pointArray = [];
		for (var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(result.boundaries[i], { fillColor:"#000000",fillOpacity:0.01,strokeWeight: 2, strokeColor: "#000000"}); //建立多边形覆盖物
		    polygonOverlay = ply;
		    map.addOverlay(ply);//添加覆盖物
	    }    
```



## 4.与echarts一起使用

两者结合使用的时候我们就使用echarts进行地图绘制,

①获取百度地图的map实例对象的方法：myChart.getModel().getComponent('bmap').getBMap() 