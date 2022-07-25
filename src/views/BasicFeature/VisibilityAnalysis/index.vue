<template>
  <div class="main_container">
    <h4 class="title">通视分析 VISIBILITY ANALYSIS</h4>
    <div class="createPath">
        <p>
            <label for="startAlti">起点高度:</label><input id="startAlti" type="text" v-model="startAlti" placeholder="起点高度（米）">
        </p>
        <p>
          <label for="targetAlti">目标高度:</label><input id="targetAlti" type="number" v-model="targetAlti" placeholder="目标高度（米）">
        </p>
        <p class="buttons">
          <button @click="lineSightAdd()">分析</button>
        </p>
    </div>
    
  </div>
</template>

<script>
import * as Cesium from 'cesium';
export default {
    data() {
        return {
            startAlti:0,
            targetAlti:0,
            lineSightPoints : [], //鼠标拾取的数据集
            sightlonlats : [], //存储两点间插值组合完成后的结果集
            visualLine : null, //绘制可视线对象
            unvisualLine : null, //绘制不可视线对象
            sverticalLine : null, //起点竖线
            everticalLine : null, //终点竖线
            }
    },
    mounted() {

    },
    methods: {
        lineSightAdd(){
            const that=this
            console.log("开始绘制");
            var pickPointsArr = []; //拾取点数组
            var assistPointArr = []; //辅助点对象
            var poly = null;
            //是否高程遮挡
            viewer.scene.globe.depthTestAgainstTerrain = true;
            this.handler = new Cesium.ScreenSpaceEventHandler(
                viewer.scene._imageryLayerCollection
            );
            this.clearAll();
            this.handler.setInputAction(function (movement) {
                var cartesian = viewer.scene.pickPosition(movement.position);
                if (cartesian) {
                pickPointsArr.push(cartesian);
                assistPointArr.push(cartesian.clone());
                var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                    cartesian
                );
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                that.lineSightPoints.push({
                    lon: longitudeString,
                    lat: latitudeString,
                    height: cartographic.height,
                });
                if (that.lineSightPoints.length > 1) {
                    that.sampleHeights(
                    pickPointsArr[pickPointsArr.length - 2],
                    pickPointsArr[pickPointsArr.length - 1]
                    );

                    //getSightLerpPoint(lineSightPoints[lineSightPoints.length - 2], lineSightPoints[lineSightPoints.length - 1]);
                    that.lineSightPoints = [];
                    pickPointsArr = [];
                    that.clearAll();

                }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                //双击取消绘制
              that.handler.setInputAction(function () {
                that.lineSightPoints = [];
                that.clearAll();
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        },
        //通视分析方法
        sampleHeights(point1, point2){
            const that=this
            var sValue = this.startAlti
            var eValue = this.targetAlti
            //清除辅助线
            viewer.entities.removeById("assistLine");

            var lineSightPoints2 = [];
            var lineSightPoints3 = [];
            var index = null; //是否通视界线索引

            var cartesian1 = new Cesium.Cartesian3(point1.x, point1.y, point1.z);
            var cartesian2 = new Cesium.Cartesian3(point2.x, point2.y, point2.z);

            var point1cartographic = Cesium.Cartographic.fromCartesian(cartesian1);
            var point2cartographic = Cesium.Cartographic.fromCartesian(cartesian2);
            //根据经纬度计算出距离
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            //获取起点和终点之间的曲面距离
            var stance = geodesic.surfaceDistance.toFixed(0);

            //默认按照50米插值计算插值点
            var count = Math.round(stance / 50);
            var cartesians = new Array(count);
            for (var i = 0; i < count; ++i) {
                var offset = i / (count - 1);
                cartesians[i] = Cesium.Cartesian3.lerp(
                cartesian1,
                cartesian2,
                offset,
                new Cesium.Cartesian3()
                );
            }

            
                viewer.scene.clampToHeightMostDetailed(cartesians)
                .then(function (clampedCartesians) {


                //获取插值点对应坐标数组
                for (var j = 0; j < clampedCartesians.length; j++) {
                    var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
                    clampedCartesians[j]
                    );
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                    lineSightPoints2.push({
                    lon: longitudeString,
                    lat: latitudeString,
                    height: cartographic.height,
                    });
                }

                for (var i = 0; i < lineSightPoints2.length; i++) {
                    //插值经纬度和高程数组
                    var lon = Cesium.Math.lerp(
                    lineSightPoints2[0].lon,
                    lineSightPoints2[lineSightPoints2.length - 1].lon,
                    i / (clampedCartesians.length - 1)
                    );
                    var lat = Cesium.Math.lerp(
                    lineSightPoints2[0].lat,
                    lineSightPoints2[lineSightPoints2.length - 1].lat,
                    i / (clampedCartesians.length - 1)
                    );
                    var heights = Cesium.Math.lerp(
                    lineSightPoints2[0].height + Number(sValue),
                    lineSightPoints2[lineSightPoints2.length - 1].height + Number(eValue),
                    i / (clampedCartesians.length - 1)
                    );
                    lineSightPoints3.push({ lon: lon, lat: lat, height: heights });
                }

                for (var i = 0; i < lineSightPoints3.length; i++) {
                    if (lineSightPoints2[i].height > lineSightPoints3[i].height) {
                    index = i;
                    break;
                    } else {
                    index = lineSightPoints3.length - 1;
                    }
                }

                //显示起点竖线
                that.sverticalLine = viewer.entities.add({
                    polyline: {
                    show: true,
                    //positions: horizonPositions,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints2[0].lon,
                        lineSightPoints2[0].lat,
                        lineSightPoints2[0].height,
                        lineSightPoints2[0].lon,
                        lineSightPoints2[0].lat,
                        lineSightPoints2[0].height + Number(sValue),
                    ]),
                    material: Cesium.Color.GOLD, //纹理
                    width: 2,
                    clampToGround: false,
                    //指定在折线位于地形下方时用于绘制折线的材质
                    depthFailMaterial: Cesium.Color.GOLD,
                    },
                });

                //显示终点竖线
                that.everticalLine = viewer.entities.add({
                    polyline: {
                    show: true,
                    //positions: horizonPositions,
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints2[lineSightPoints2.length - 1].lon,
                        lineSightPoints2[lineSightPoints2.length - 1].lat,
                        lineSightPoints2[lineSightPoints2.length - 1].height,
                        lineSightPoints2[lineSightPoints2.length - 1].lon,
                        lineSightPoints2[lineSightPoints2.length - 1].lat,
                        lineSightPoints2[lineSightPoints2.length - 1].height +
                        Number(eValue),
                    ]),
                    material: Cesium.Color.GOLD, //纹理
                    width: 2,
                    clampToGround: false,
                    //指定在折线位于地形下方时用于绘制折线的材质
                    depthFailMaterial: Cesium.Color.GOLD,
                    },
                });

                //可视线
                that.visualLine = viewer.entities.add({
                    polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints3[0].lon,
                        lineSightPoints3[0].lat,
                        lineSightPoints3[0].height,
                        lineSightPoints3[index].lon,
                        lineSightPoints3[index].lat,
                        lineSightPoints3[index].height,
                    ]),
                    width: 2,
                    material: Cesium.Color.GREEN,
                    },
                });

                //不可视线
                that.unvisualLine = viewer.entities.add({
                    polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                        lineSightPoints3[index].lon,
                        lineSightPoints3[index].lat,
                        lineSightPoints3[index].height,
                        lineSightPoints3[lineSightPoints3.length - 1].lon,
                        lineSightPoints3[lineSightPoints3.length - 1].lat,
                        lineSightPoints3[lineSightPoints3.length - 1].height,
                    ]),
                    width: 2,
                    material: Cesium.Color.RED,
                    },
                });
                });
        },
        clearAll(){
             //清除可视绘制线
            if (this.visualLine) {
                viewer.entities.remove(this.visualLine);
                this.visualLine = null;
            }
            //清除不可视绘制线
            if (this.unvisualLine) {
                viewer.entities.remove(this.unvisualLine);
                this.unvisualLine = null;
            }
            //清除起点竖线
            if (this.sverticalLine) {
                viewer.entities.remove(this.sverticalLine);
                this.sverticalLine = null;
            }
            //清除终点竖线
            if (this.everticalLine) {
                viewer.entities.remove(this.everticalLine);
                this.everticalLine = null;
            }
            //释放鼠标事件
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            // handler.destroy();
        }
    },
    beforeDestroy() {
        this.$store.dispatch("clearArrAll")
    },
}
</script>

<style lang="less" scoped>
  .main_container{
        width: 100%;
        height: 100%;
        padding: .2rem;
        .title{
            font-size: .35rem ;
            font-weight: normal;
        };
        .createPath{
            font-size: .4rem;
            padding: .2rem;
            p{
                margin-bottom: .2rem;
            }
            label{
                vertical-align: middle;
            }
            input{
                border: 1px solid #0078FF;
                background-color: rgba(1, 1, 1, .2);
                border-radius: 0;
            }
            .buttons{
              display: grid;
              grid-template-columns: 1fr 1fr;
              button{
                width: 3rem;
                height: .8rem;
                background-color: #0078FF;
            }
            
            }
            label,button{
                text-align: center;
                vertical-align: middle;
            }
        }
        
    }
</style>