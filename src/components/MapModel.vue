<template>
   <div class="mapbox">
    <div id="cesiumContainer"></div>
    <!-- // 小图标 -->
    <div class="iconBox" @click="enlarge"></div>
    <!-- 空间量算 -->
    <Header v-show="!isfullScreen"></Header>
   </div>
</template>

<script>
import "cesium/widgets.css";
import * as Cesium from 'cesium';
// import $ from 'jquery';
//引入镜头切换方法
import ViewTab from "@/js/view/cream";
import Header from "./Header.vue";
export default {
    data() {
        return {
            isfullScreen: false,
            tabIndex:null,
        };
    },
    components: { Header },
    mounted() {
        window.queryTools = {
            InternetThings: undefined,
            znywLoc: undefined,
            sxcx3dtitle: undefined,
            isClick: true, //点击次数
        },
        window.popFloat = {
            monitorArr: null,
            warnNote: undefined,
            attributesArr: null,
            trackArr: null //人员监视
        };
        window.mapClick = {
            czlArr: [],
            warnArr: [],
            NumberArr: [],
            professionArr: [], //人员轨迹记录
        };
        window.previousPickedEntity={
            feature: undefined,
            originalColor: undefined,
        }
        

        //接收Tabbar组件主导航栏传递来的索引
        this.$bus.$on("getTabCurrent", (data) => {
            //镜头切换
            ViewTab(data);
            this.tabIndex=data
        });
        //初始化地球
        this.init();
        //引入js地图点击
        // this.mapClick()
        this.MouseMoveClearDis();
        //弹窗初始化
        window.shapeEditMenu =document.createElement('div')
        shapeEditMenu.style=`
            position:absolute;
            background:#153251;
            font-size:10px;
            padding:5px;
            border:1px solid #0976C1;
            z-index:7
            `
        shapeEditMenu.style.display="none"
        const cesiumContainer=document.querySelector("#cesiumContainer")
        cesiumContainer.appendChild(shapeEditMenu)

    },
    methods: {
        //初始化3d模型
        init() {
            //   /*初始化加载配置 */
            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZWFkZjMzMS1kZTk1LTQyY2EtOTA0MC1kOGMxMWIyYzEwNTQiLCJpZCI6OTk0MzksImlhdCI6MTY1NjQ4Nzg2NX0.xAxSGKj9QR2uMMhkXLDqciQ_vb0CyYGJY0iLvMFOOmI";
            window.viewer = window.viewer || new Cesium.Viewer("cesiumContainer", {
                infoBox: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                baseLayerPicker: false,
                navigationHelpButton: false,
                timeline: true,
                animation: false,
                fullscreenButton: false,
                vrButton: false,
                selectionIndicator: false,
                imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                    show: true
                }),
            });
            // 事件句柄
            window.handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            // 隐藏logo
            viewer.cesiumWidget.creditContainer.style.display = "none";
            viewer.scene.skyAtmosphere.show = true; // 关闭大气层
            viewer.scene.globe.depthTestAgainstTerrain = true; // 地面以下不可见（高程遮挡）
            viewer.timeline.container.style.display = "none"; //隐藏时间线控件

            /*解决抗锯齿 */
            if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
                //判断是否支持图像渲染像素化处理
                viewer.resolutionScale = window.devicePixelRatio;
            }
            /*加载贝尔园区场景模型 */
            window.tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: "  /apps/3dtitle/贝尔园区场景模型/tileset.json",
            }));    
            tileset.readyPromise
                .then(function (tileset) {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0, -0.3, tileset.boundingSphere.radius * 1));
            })
                .catch(function (error) {
                console.log("出错了"+error);
            });
            /*加载物联网设备模型 */
            queryTools.InternetThings = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: "Apps/model/物联网设备/tileset.json" }));
            viewer.scene.primitives.add(queryTools.InternetThings);
        },
        //点击全屏事件
        enlarge() {
            let iconBox = document.querySelector(".iconBox"); //全屏按钮
            let mapbox = document.querySelector(".mapbox"); //需要全屏容器的id
            mapbox.classList.toggle("fullScreen"); //全屏样式切换
            iconBox.classList.toggle("shrink"); //全屏按钮样式切换
            this.isfullScreen=!this.isfullScreen
        },
        clearArrAll(){
            if (popFloat !== undefined) {
            popFloat.attributesArr = undefined;
            popFloat.warnNote = undefined;
            popFloat.monitorArr = undefined;
            popFloat.trackArr = undefined;
            }
            queryTools.znywLoc = undefined;
            queryTools.sxcx3dtitle = undefined;
            mapClick.czlArr = [];
            mapClick.warnArr = [];
            mapClick.NumberArr = [];
            mapClick.professionArr = [];
            viewer.dataSources.removeAll();
            viewer.trackedEntity = undefined;
            viewer.entities.removeAll();
            //释放鼠标事件
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.ClearDis();
        },
        //清除所有cesium容器中的dlv
        ClearDis(){
            if(window.shapeEditMenu != undefined){
                shapeEditMenu.style.display = "none";
            }
            if(window.alertShapeEditMenu != undefined){
                alertShapeEditMenu.style.display = "none";
            }
            if(window.personelShapeEditMenu != undefined){
                personelShapeEditMenu.style.display = "none";
            }
            if (previousPickedEntity.feature != undefined) {
                previousPickedEntity.feature.color = Cesium.Color.WHITE;
            }
        },
        MouseMoveClearDis(){
            const that=this
            handler.setInputAction(function (e) {
                that.ClearDis();
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            //绑定地图移动
            handler.setInputAction(function (e) {
                that.ClearDis();
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            //绑定地图移动
            handler.setInputAction(function (e) {
                that.ClearDis();
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            //绑定地图缩放
            handler.setInputAction(function (e) {
                that.ClearDis();
            }, Cesium.ScreenSpaceEventType.WHEEL);
            //绑定滚轮点击事件
            handler.setInputAction(function (e) {
                that.ClearDis();
            }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
        }
    },
    watch:{
        //监视主导航栏的变化清除公告牌和其他模型
        tabIndex(){
            // this.clearArrAll()
        }
    },
    beforeDestroy() {
        this.$bus.$off("getTabCurrent");
    },
}
 
</script>

<style lang="less" scoped>
    .mapbox{
        position: relative;
        width: 9.5333rem;
        height: 10rem;
        border: 1px solid #0976C1;
        margin: 0 auto 0;
        #cesiumContainer {
        width: 100%;
        height: 100%;
        } 
        .iconBox {
          z-index: 6;
          cursor: pointer;
          position: absolute;
          width: .64rem;
          height: .64rem;
          bottom: .2667rem;
          right:.2667rem;
          background: url(@/assets/images/fullscreen-expand.png);
          background-size: contain;
        }
        .shrink{
          bottom: 3rem;
          right:.5rem;
          background-image: url(@/assets/images/fullscreen-shrink.png) !important;
          background-size: contain;
        }
    }
    .fullScreen{
      z-index: 5;
      position: fixed;
      top: 0px;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      margin: 0;
    }
   .tool-bar{
    position: absolute;
    top:2rem;
    left:0;
    .button{
      font-size: .4rem;
      padding: 10px;
      margin-right: .5rem;
      background-color: #355A91;
      border-radius: .1rem;
    } 
   }

</style>