<template>
    <el-row id="homeindex">
        <div :class="mapDiv" style="position:relative">
            <div id="allmap" ref="allmap"></div>
        </div>
    </el-row>
</template>

<script>
let map='';
export default {
    name: 'homeIndex',
    data() {
        return {
            infoShow: true,
            point: [],
            mapDiv: null,
            markers: [],
            markerClusterer: null,
            fullscreen: false,
            timer: null,
            currentWidth: null,
            agentName: "",
            pt: '',
            mapvLayer: '',
            nowOpen:{},
            zxImg:'',
            lxImg:'',
            ycImg:'',
            infoBox:'',
            oldP:'',
            infoLoading:null,
            savedPointData:{}
        }
    },
    created() {
        // 加载图片
        let zximg,lximg,ycimg;
        zximg = new Image();
        lximg = new Image();
        ycimg = new Image();
        zximg.src = "/static/img/glzx.png"
        lximg.src = "/static/img/gllx.png"
        ycimg.src = "/static/img/gljg.png"
        zximg.onload = ()=>{
            this.zxImg = zximg
        }
        lximg.onload = ()=>{
            this.lxImg = zximg
        }
        ycimg.onload = ()=>{
            this.ycImg = zximg
        }
    },
    mounted: function () {
        //获取当前页面高度
        this.getHeight();
        //初始化地图
        this.map1()
        //查询地图
        this.search();
    },


    methods: {
        //初始获取高度
        getHeight() {
            this.currentWidth = `${document.documentElement.clientHeight}`
            if (this.currentWidth == 1080 && this.flag == "1") {
                this.mapDiv = "mapDiv3"
            } else if (this.currentWidth < 1080 && this.flag == "1") {
                this.mapDiv = "mapDiv1"
            } else if (this.currentWidth == 1080 && this.flag == "3") {
                this.mapDiv = "mapDiv5"
            } else if (this.currentWidth < 1080 && this.flag == "3") {
                this.mapDiv = "mapDiv6"
            } else {
                this.mapDiv = "mapDiv1"
            }
        },
        search() {
            this.point = []
            let nowZoom = map.getZoom();
            if (nowZoom != 5) {
                if (this.currentWidth < 768 && this.flag == "1") {
                    map.centerAndZoom('四川省资阳市安岳县', 5)
                } else {
                    map.centerAndZoom('北京', 5)
                }
            }
            
            this.$RequestUtil.post({                
                url: '',
                params: {                    
                   
                },
                type:'sync',
                success: (data) => {
                    this.point = data.list;
                    // 汇总同样省份的点的数量
                    map.clearOverlays()
                    this.mapPonit(this.point)
                }
            });
        },
      
        map1() {
            if (this.currentWidth < 768 && this.flag == "1") {
                map = new BMap.Map(this.$refs.allmap, { minZoom: 5, maxZoom: 20, enableMapClick: false });// 创建Map实例
                var point = new BMap.Point(105.479048, 30.240008);
                map.centerAndZoom("四川省资阳市安岳县", 5);
                map.enableScrollWheelZoom(true);
            } else {
                map = new BMap.Map(this.$refs.allmap, { minZoom: 5, maxZoom: 20, enableMapClick: false });// 创建Map实例
                map.centerAndZoom("北京", 5);
                map.enableScrollWheelZoom(true);
            }
            map.addEventListener('zoomend', this.changeZoom)
        },


        sortBy(a, b) {
            if (a != null && b != null) {
                return Number(a) - Number(b)
            }

        },

        // 数组取平均数
        ava(nums) {
            return nums.reduce((a, b) => a + b) / nums.length
        },


        dateFtt(fmt, date) { //author: meizz   
            var o = {
                "M+": date.getMonth() + 1,                 //月份   
                "d+": date.getDate(),                    //日   
                "h+": date.getHours(),                   //小时   
                "m+": date.getMinutes(),                 //分   
                "s+": date.getSeconds(),                 //秒   
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
                "S": date.getMilliseconds()             //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },


        // //  层级改变事件
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

                this.mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
                console.log(this.mapvLayer)
            }
        },
        //跳转到详情页
        link(e) {
            var p = e.info;
            if(this.oldP == p.equipId){
                let time = setTimeout(()=>{
                    this.oldP = ''
                    clearTimeout(time)
                },1000)
                return
            }
            this.oldP = p.equipId
            const { href } = this.$router.resolve({
                path: "",
                name: "",
                query: {

                }
            })
            window.open(href, '_blank')
        },
        //鼠标移入显示详情
        move(e) {
            let timeOut = setTimeout(() => {
                var p = e.info;
                if(this.nowOpen.lng == e.geometry.coordinates[0] && this.nowOpen.lat == e.geometry.coordinates[1]){
                    return
                }
                let point = this.savedPointData[p.equipId] ? this.savedPointData[p.equipId] : {
                    equipId:'',
                    dtuPid :'',
                    equipmentType:'',
                    projectName:'',
                    agentName:'',
                    dtuStatus:'',
                    address:'',
                }
                this.initInfoDialog(point,e,this.savedPointData[p.equipId] ? '' : 'empty')
                // 如果有保存就直接取值不再请求
                if(this.savedPointData[p.equipId]){
                    this.infoLoading && this.infoLoading.close()
                    return
                }
                this.$RequestUtil.get({
                    url:'',
                    params:{
                       
                    },
                    success:res => {

                        point = {
                        
                        }
                        this.savedPointData[p.equipId] = point
                        this.initInfoDialog(point,e)
                        this.infoLoading && this.infoLoading.close()
                    },
                    error:res=>{
                        this.infoLoading && this.infoLoading.close()
                    }
                })
                clearTimeout(timeOut)
            },100)
        },
        initInfoDialog(p,e,type){
            console.log(p)
            var sContent =
                "<div class='tc'><h4 class='mapTcH4'>:xxxx" + '<span class="mapTcH4Span">' + p + '</span>' + "</h4></div>"
            var steelOpts = {
                width: 60,     //信息窗口宽度
                height: 250,     //信息窗口高度
                offset: new BMap.Size(13, 5)
            };
            this.infoBox = new BMap.InfoWindow(sContent, steelOpts);
            this.infoBox.addEventListener('open',this.openInfo)
            this.infoBox.addEventListener('close',this.closeInfo)
            let point = new BMap.Point(e.geometry.coordinates[0], e.geometry.coordinates[1])
            map.openInfoWindow(this.infoBox, point)
            this.infoLoading && this.infoLoading.close()
        },
        openInfo(type){
            this.infoLoading = this.$loading({
                target:'.tc',
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            this.nowOpen = type.point
        },
        closeInfo(){
            this.nowOpen = {}
        }
    },
    components: {
    },

    beforeDestroy() {
        map.removeEventListener('zoomend', this.changeZoom)
        if(this.infoBox){
            this.infoBox.removeEventListener('open',this.openInfo)
        }
        this.point = null
        if(this.mapvLayer){
            this.mapvLayer.destroy()
        }
        
        map.clearOverlays()
        map = null
        this.mapvLayer = null

        let arr = []
        for (let i in this.$el.childNodes) {
            if (!isNaN(i) && this.$el.childNodes[i].nodeType != 8) {
                arr.push(i)
            }
        }
        arr = arr.reverse()
        for (let a of arr) {
            this.$el.removeChild(this.$el.childNodes[a])
        }
        arr = []
        if (this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }

    },

}
</script>

<style scoped>

</style>
