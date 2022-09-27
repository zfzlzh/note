# 1.判断点击位置是否在多边形内，屏幕坐标转换未svg坐标

```js
//判断点击位置是否在多边形内
        isInPolygon(el, points) {
            //转化点击屏幕位置为svg位置，非svg省略这步
            let svgDom = document.getElementById('mySvg')
            let screenPToSvgP = this.reportMouseCoordinates(svgDom, el.x, el.y, svgDom)
            let clickP = [screenPToSvgP.x - 0, screenPToSvgP.y - 0]
            let list = points.split(',').map((val) => {
                return val.split(' ')
            })
            //获取四个最大最小的点，组成矩形，先判断是否在该矩形内,不在的直接返回false
            let maxMin = list.reduce((pre, val) => {
                pre['min'][0] = pre['min'][0] && val[0] > pre['min'][0] ? pre['min'][0] - 0 : val[0] - 0
                pre['min'][1] = pre['min'][1] && val[1] > pre['min'][1] ? pre['min'][1] - 0 : val[1] - 0

                pre['max'][0] = pre['max'][0] && val[0] < pre['max'][0] ? pre['max'][0] - 0 : val[0] - 0
                pre['max'][1] = pre['max'][1] && val[1] < pre['max'][1] ? pre['max'][1] - 0 : val[1] - 0
                return pre
            }, { min: [], max: [] })
            let { max, min } = maxMin
            if (clickP[0] > max[0] || clickP[1] > max[1] || clickP[0] < min[0] || clickP[1] < min[1]) {
                return false
            }
            //射线法
            //以点击位置为顶点，画一条射线穿过图形，如果相交的点为偶数，说明未在图形内，奇数则说明在图形内
            //每次取两个相邻的点与点击位置比较，满足条件时改变c的值，设c初始值为false，当满足条件的次数是偶数时，最终为false，为奇数时，最终为true
            //将图形的点x，y分别存入两个数组
            //循环，最大值为图形点的个数-1，每次取相邻两个点,起点为[x1,y1],终点为[x2,y2],点击点为[px,py]
            //判断：1.判断y：两个点的y坐标与点击位置的y坐标对比，当verty[j] <testy < verty[i]或者verty[i] <testy < verty[j]时点在线段范围中
            //2.判断x：使用两个三角形比例换算的方式得到交点x坐标，公式为x1 - (x1 - x2) / (y1 - y2) * (y1 - py),即计算大三角型的横边与竖边的比例，与小三角形的竖边相乘得到小三角形的横边，用顶点的x坐标减去这个值，即为点击点的x坐标px;得到px后与x1比较，即可知道点是否在线段上；
            //(x1-x2)*(py - y2)/(y1 - y2) + x2 > px写法只是颠倒了头尾，最终结果一致
            //计算px的图片示例如下
            let vert = list.reduce((pre, val) => {
                pre.vertx.push(Number(val[0]))
                pre.verty.push(Number(val[1]))
                return pre
            }, { vertx: [], verty: [] })
            let nvert = list.length
            let { vertx, verty } = vert
            let c = false
            //j = i++;j先取i的值，i再计算++
            for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
                //(x2-x1)*(py - y1)/(y2 - y1) + x1 > px写法
                let clickPXJudge = clickP[0] < (vertx[j] - vertx[i]) * (clickP[1] - verty[i]) / (verty[j] - verty[i]) + vertx[i]
                //x1 - (x1 - x2) / (y1 - y2) * (y1 - py) < px写法
                // let clickPXJudge = clickP[0] > vertx[i] - (vertx[i] - vertx[j]) / (verty[i] - verty[j]) * (verty[i] - clickP[1])
                
                if (
                    ((verty[i] > clickP[1]) != (verty[j] > clickP[1])) &&
                    clickPXJudge
                )
                    //每次满足要求取反，奇数次最后会返回true，说明在图形内，偶数次会返回false，说明在图型外，也可用累加次数来判断
                    c = !c
            }
            return c
        },
        //根据点击的坐标生成一个点，转化为svg坐标
        reportMouseCoordinates(svgElement, pageX, pageY, svgChild) {
            var point = svgElement.createSVGPoint();
            point.x = pageX;
            point.y = pageY;
            point = this.coordinateTransform(point, svgChild);
            return point;
        },
        //屏幕转化为svg坐标
        coordinateTransform(screenPoint, someSvgObject) {
            var CTM = someSvgObject.getScreenCTM();
            return screenPoint.matrixTransform(CTM.inverse());
        },
```

## 2.计算重心

```js
//计算重心，splitList -> 构成多边形的点的坐标的数组
        calcKeyPoint(splitList){
            let area = 0;//多边形面积
            let Gx = 0, Gy = 0;// 重心的x、y
            let len = splitList.length
            for (let i = 1; i <= len; i++) {
                let iLat = splitList[i % len][0] - 0 ;
                let iLng = splitList[i % len][1] - 0;
                let nextLat = splitList[i - 1][0] - 0;
                let nextLng = splitList[i - 1][1] - 0;
                let temp = (iLat * nextLng - iLng * nextLat) / 2.0 - 0;
                area += temp;
                Gx += temp * (iLat + nextLat) / 3.0;
                Gy += temp * (iLng + nextLng) / 3.0;
            }
            Gx = Gx / area;
            Gy = Gy / area;
            return {x:Gx,y:Gy};
        },
```

