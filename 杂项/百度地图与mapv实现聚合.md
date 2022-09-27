文件在mapv文件夹下

直接在html文件中引入

离开页面时需销毁

### 为何不使用百度地图自带聚合功能

百度地图自带聚合功能在点位较多时会非常卡顿，超过2万就会很卡，5万大概率网页崩溃，使用mapv可大大缓解这种情况

### 1.创建百度地图，监听缩放事件

```js
map1() {
            if (this.currentWidth < 768 && this.flag == "1") {
                this.map = new BMap.Map(this.$refs.allmap, { minZoom: 5, maxZoom: 20, enableMapClick: false });// 创建Map实例
                var point = new BMap.Point(105.479048, 30.240008);
                this.map.centerAndZoom("四川省资阳市安岳县", 5);
                this.map.enableScrollWheelZoom(true);
            } else {
                this.map = new BMap.Map(this.$refs.allmap, { minZoom: 5, maxZoom: 20, enableMapClick: false });// 创建Map实例
                this.map.centerAndZoom("北京", 5);
                this.map.enableScrollWheelZoom(true);
            }
            this.map.addEventListener('zoomend', this.changeZoom)
        },
```

### 2.创建地图点，使用mapv进行聚合

```js
mapPonit(point) {
            let markers = []; 
            console.log(point)
            var loadImg = function (point, icon, dtuStatus, departmentCode) {
                markers.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [point.lon, point.lat]
                    },
                    info: {
                        equipId: point.equipId,
                        dtuStatus: dtuStatus,
                    },
                    icon: icon,
                    departmentCode: departmentCode
                });
            };
            if (point.length == 1) {
                var lonStr = "0.0000" + Math.ceil(Math.random() * 10);
                var latStr = "0.0000" + Math.ceil(Math.random() * 10);
                if (this.departmentCode != 1) {
                    point[0].lon = parseFloat(point[0].lon)
                    point[0].lat = parseFloat(point[0].lat)
                }
                point[0].lon = point[0].lon + parseFloat(lonStr);
                point[0].lat = point[0].lat + parseFloat(latStr);

                let dtuStatus, img;
                if (point[0].dtuStatus == "0") {
                    dtuStatus = "正常"
                    img = this.zxImg
                } else if (point[0].dtuStatus == "2" || point[0].dtuStatus == "1") {
                    dtuStatus = "离线"
                    img = this.lxImg
                } else if (point[0].dtuStatus == "3") {
                    dtuStatus = "异常"
                    img = this.ycImg
                }
                loadImg(point[0], img, dtuStatus, this.departmentCode)
            } else {
                for (var i = 0; i < point.length; i++) {
                    //经纬度 第五位随机加数字
                    var lonStr = "0.0000" + Math.ceil(Math.random() * 10);
                    var latStr = "0.0000" + Math.ceil(Math.random() * 10);
                    if (this.departmentCode != 1) {
                        point[i].lon = parseFloat(point[i].lon)
                        point[i].lat = parseFloat(point[i].lat)
                    }
                    point[i].lon = point[i].lon + parseFloat(lonStr);
                    point[i].lat = point[i].lat + parseFloat(latStr);
                    let dtuStatus, img;
                    if (point[i].dtuStatus == "0") {
                        dtuStatus = "正常"
                        img = this.zxImg
                    } else if (point[i].dtuStatus == "2" || point[i].dtuStatus == "1") {
                        dtuStatus = "离线"
                        img = this.lxImg
                    } else if (point[i].dtuStatus == "3") {
                        dtuStatus = "异常"
                        img = this.ycImg
                    }
                    loadImg(point[i], img, dtuStatus, this.departmentCode)
                }
            }
            let vue = this
            let dataSet = new mapv.DataSet(markers);
            var clusterImg = new Image()
            clusterImg.src = '/static/img/mapTb5.png'
            clusterImg.onload = () => {
                var options = {
                    clusterImg: clusterImg,
                    fillStyle: 'rgba(113,152,201,1)', // 非聚合点的颜色
                    size: 18, // 非聚合点的半径
                    minSize: 13, // 聚合点最小半径
                    maxSize: 31, // 聚合点最大半径
                    width: 35, // 规定图像的宽度
                    height: 50, // 规定图像的高度
                    circleOffset: { x: 16, y: 20 },//修正图标与点击区的位置
                    globalAlpha: 1, // 透明度
                    clusterRadius: 150, // 聚合像素半径
                    zoomChange: 'top',
                    methods: {
                        click: function (item) {
                            if (item && item.info) {
                                vue.link(item)
                            }
                            if (item && !item.info && vue.map) {
                                let nowZoom = vue.map.getZoom()
                                if (nowZoom >= 19) {
                                    return
                                }
                                if (Number(nowZoom) + 7 < 19) {
                                    vue.map.centerAndZoom(new BMap.Point(item.geometry.coordinates[0], item.geometry.coordinates[1]), Number(nowZoom) + 7)
                                } else {
                                    vue.map.centerAndZoom(new BMap.Point(item.geometry.coordinates[0], item.geometry.coordinates[1]), 19)
                                }
                            }
                        },
                        mousemove: function (item) {
                            if (item && item.info) {
                                vue.move(item)
                            }
                        }
                    },
                    maxZoom: 19, // 最大显示级别
                    label: { // 聚合文本样式
                        show: true, // 是否显示
                        fillStyle: 'white',
                        font: '14px bebas',
                    },
                    drawType:'img',
                    draw: 'cluster'
                }
			//创建聚合
                this.mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
                console.log(this.mapvLayer)
            }
        },
        
```

3.缩放事件

```js
changeZoom() {

            let nowZoom = map.getZoom();
            let vue = this
            if (nowZoom > 15 && nowZoom < 18) {
                this.mapvLayer.update({
                    options: {
                        clusterRadius: 100,
                        zoomChange: 'middle'
                    }
                }, true)
            } else if (nowZoom >= 18) {
                this.mapvLayer.update({
                    options: {
                        clusterRadius: 0.001,
                        zoomChange: 'bottom'
                    }
                }, true)
            } else {
                if (this.mapvLayer) {
                    this.mapvLayer.update({
                        options: {
                            clusterRadius: 150,
                            zoomChange: 'bottom'
                        }
                    }, true)
                }
            }
        },
```

4.销毁

```js
destoryMapv(){
		this.map.removeEventListener('zoomend', this.changeZoom)
         if(this.mapvLayer){
            this.mapvLayer.destroy()
         }
 }
```

