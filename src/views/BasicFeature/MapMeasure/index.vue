<template>
  <div class="main_container">
    <h4 class="title">地图量算 MAP MEASURE</h4>
    <div id="toolbar" class="param-container tool-bar" >
        <button id="area" class="button black" @click="measureAreaSpace()">开始绘制图形(双击确定)</button>
        <button type="button" id="clear" class="button black" @click="removeMeasure()">清除</button> 
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
export default {
  data() {
      return {
          
      }
  },
    mounted(){
    },
    methods: {
        //测量空间面积
        measureAreaSpace() {
            console.log("开始绘制图形");
            // this.removeMeasure();
            let _this = this;
            // 取消双击事件-追踪该位置
            viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            // 鼠标事件
            this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
            var positions = [];
            var tempPoints = [];
            var polygon = null, areaText = null;
            var cartesian = null, areaArray = [];
            var floatingPoint;//浮动点

            this.handler.setInputAction(function (movement) {
                let ray = viewer.camera.getPickRay(movement.endPosition);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length >= 2) {
                    if (!Cesium.defined(polygon)) {
                        polygon = new PolygonPrimitive(positions);
                    } else {
                        positions.pop();
                        positions.push(cartesian);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            this.handler.setInputAction(function (movement) {
                let ray = viewer.camera.getPickRay(movement.position);
                cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                positions.push(cartesian);
                //在三维场景中添加点
                var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                tempPoints.push({lon: longitudeString, lat: latitudeString, hei: heightString});
                floatingPoint = viewer.entities.add({
                    name: '多边形面积',
                    position: positions[positions.length - 1],
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.RED,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                areaArray.push(floatingPoint);
                _this.areapointArray = areaArray;
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


            this.handler.setInputAction(function (movement) {
                _this.handler.destroy();
                positions.pop();

                var textArea = getArea(tempPoints) + "平方米";
                areaText = viewer.entities.add({
                    name: '点与标签',
                    position: positions[positions.length - 1],
                    point : {
                    pixelSize : 10,
                    color : Cesium.Color.RED,
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                    },
                    label: {
                        id:"label",
                        text: textArea,
                        font: '.5rem sans-serif',
                        fillColor: Cesium.Color.BLUE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(20, -40),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });

                areaArray.push(areaText);
                _this.areapointArray = areaArray;
            }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

            var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
            var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

            //计算多边形面积
            function getArea(points) {

                var res = 0;
                //拆分三角曲面

                for (var i = 0; i < points.length - 2; i++) {
                    var j = (i + 1) % points.length;
                    var k = (i + 2) % points.length;
                    var totalAngle = Angle(points[i], points[j], points[k]);


                    var dis_temp1 = distance(positions[i], positions[j]);
                    var dis_temp2 = distance(positions[j], positions[k]);
                    res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
                    // console.log(res);
                }


                return (res ).toFixed(2);
            }

            //角度
            function Angle(p1, p2, p3) {
                var bearing21 = Bearing(p2, p1);
                var bearing23 = Bearing(p2, p3);
                var angle = bearing21 - bearing23;
                if (angle < 0) {
                    angle += 360;
                }
                return angle;
            }

            //方向
            function Bearing(from, to) {
                var lat1 = from.lat * radiansPerDegree;
                var lon1 = from.lon * radiansPerDegree;
                var lat2 = to.lat * radiansPerDegree;
                var lon2 = to.lon * radiansPerDegree;
                var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
                if (angle < 0) {
                    angle += Math.PI * 2.0;
                }
                angle = angle * degreesPerRadian;//角度
                return angle;
            }

            var PolygonPrimitive = (function () {
                function _(positions) {
                    this.options = {
                        id: 'areaPolygon',
                        name: '多边形',
                        polygon: {
                            hierarchy: [],
                            material: Cesium.Color.GREEN.withAlpha(0.5),
                            heightReference:20000
                        }
                    };

                    this.hierarchy = {positions};
                    this._init();
                }

                _.prototype._init = function () {
                    var _self = this;
                    var _update = function () {
                        return _self.hierarchy;
                    };
                    //实时更新polygon.hierarchy
                    this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                    viewer.entities.add(this.options);
                };

                return _;
            })();

            function distance(point1, point2) {
                var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
                var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
                //根据经纬度计算出距离
                var geodesic = new Cesium.EllipsoidGeodesic();
                geodesic.setEndPoints(point1cartographic, point2cartographic);
                var s = geodesic.surfaceDistance;
                //返回两点之间的距离
                s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
                return s;
            }
        },
        // 清除测量数据
        removeMeasure() {
            console.log("清除");
            // 删除面积测量
            if (this.areahandler) {
                this.areahandler.destroy();
            }
            let areaentitys = this.areapointArray;
            if (this.areapointArray) {
                if (areaentitys.length > 0) {
                    for (var i = 0; i < areaentitys.length; i++) {
                        viewer.entities.remove(areaentitys[i]);
                    }
                }
            }
            if (viewer.entities.getById("areaPolygon"))
                viewer.entities.removeById("areaPolygon");

            if (viewer.entities.getById("measurePoint"))
                viewer.entities.removeById("measurePoint");
            if (viewer.entities.getById("label"))
            viewer.entities.removeById("label");
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
        .tool-bar{
            .button{
                font-size: .4rem;
                padding: 10px;
                margin-right: .5rem;
                background-color: #355A91;
                border-radius: .1rem;
            } 
        }
    
   }
</style>