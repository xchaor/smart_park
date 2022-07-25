/*********************************
 * 作    者：RuiGIS
 * 创建日期：2018年10月30日10:53:58
 * 描    述：通视分析
 * 注意事项：
 * 修改日期：2019年3月5日11:17:02
 *********************************/

var lineSightPoints = []; //鼠标拾取的数据集
var sightlonlats = []; //存储两点间插值组合完成后的结果集
var visualLine = null; //绘制可视线对象
var unvisualLine = null; //绘制不可视线对象
var sverticalLine = null; //起点竖线
var everticalLine = null; //终点竖线

//初始化通视分析框
function addlineSightHTML() {
  $("#analysisConDiv").slideToggle();
  $("#analysisConDiv").empty();
  //三级菜单初始化
  var strHtml =
    '<div class="zz_bg_right">' +
    "<div style='pointer-events: painted;' class=\"tsfx\">\n" +
    '\t<div class="plcH4">\n' +
    "\t\t<h4>通视分析</h4>\n" +
    "\t\t<p>VISIBILITY ANALYSIS </p>\n" +
    '\t\t<img src="./Apps/img/人员统计.png" alt="">\n' +
    "\t</div>\n" +
    '\t<div class="tsfx_item" style="margin-top: 16px;">\n' +
    "\t\t<h5>起点高度：</h5>\n" +
    '\t\t<div class="layui-input-block">\n' +
    '\t\t\t<input type="text" lay-verify="number" value="0" onblur="value=zhzs(this.value)" id="sValue" style="width: 330px;margin-left: -40px" autocomplete="off" placeholder="起点高度（米）" class="layui-input">\n' +
    "\t\t</div>\n" +
    "\t</div>\n" +
    '\t<div class="tsfx_item">\n' +
    "\t\t<h5>目标高度：</h5>\n" +
    '\t\t<div class="layui-input-block">\n' +
    '\t\t\t<input type="text" id="eValue" lay-verify="number" value="0" onblur="value=zhzs(this.value)"  style="width: 330px;margin-left: -40px" autocomplete="off" placeholder="目标高度（米）" class="layui-input">\n' +
    "\t\t</div>\n" +
    "\t</div>\n" +
    '\t<div class="tsfx_item" style="margin-left: 69px;">\n' +
    '\t\t<button type="button" style="width: 110px;background-color:rgba(0, 120, 255, 1) ;" onclick="lineSightAdd();" class="layui-btn layui-btn-normal">分析</button>\n' +
    '\t\t<button type="button" style="width: 110px;background-color:rgba(0, 120, 255, 1) ;" onclick="closelineSightDiv();" class="layui-btn layui-btn-normal">退出</button>\n' +
    "\t</div>\n" +
    "</div>\n" +
    "</div>";
  $(strHtml).appendTo("#analysisConDiv");
}

//右上角关闭按钮事件
function closelineSightDiv() {
  $("#analysisConDiv").slideUp();
  $("#analysisDiv").slideUp();
  clearAll();
}

//清除鼠标事件和地图绘制痕迹
function clearAll() {
  //清除可视绘制线
  if (visualLine) {
    viewer.entities.remove(visualLine);
    visualLine = null;
  }
  //清除不可视绘制线
  if (unvisualLine) {
    viewer.entities.remove(unvisualLine);
    unvisualLine = null;
  }
  //清除起点竖线
  if (sverticalLine) {
    viewer.entities.remove(sverticalLine);
    sverticalLine = null;
  }
  //清除终点竖线
  if (everticalLine) {
    viewer.entities.remove(everticalLine);
    everticalLine = null;
  }
  //释放鼠标事件
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  // handler.destroy();
}

// 通视分析点击事件
function lineSightAdd() {

  var pickPointsArr = []; //拾取点数组
  var assistPointArr = []; //辅助点对象
  var poly = null;
  //鼠标十字型
  document.getElementById("appDiv").style.cursor = "crosshair";
  clearAll();
  //是否高程遮挡
  viewer.scene.globe.depthTestAgainstTerrain = true;
  handler = new Cesium.ScreenSpaceEventHandler(
    viewer.scene._imageryLayerCollection
  );
  //鼠标移动事件，移动刷新绘制对象
  handler.setInputAction(function (movement) {
    var cartesian = viewer.scene.pickPosition(movement.endPosition);
    if (!Cesium.defined(poly)) {
      poly = new sPolyLinePrimitive(assistPointArr);
    } else {
      assistPointArr.pop();
      assistPointArr.push(cartesian);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (click) {
    var cartesian = viewer.scene.pickPosition(click.position);
    if (cartesian) {
      pickPointsArr.push(cartesian);
      assistPointArr.push(cartesian.clone());
      var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        cartesian
      );
      var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      lineSightPoints.push({
        lon: longitudeString,
        lat: latitudeString,
        height: cartographic.height,
      });
      if (lineSightPoints.length > 1) {
        sampleHeights(
          pickPointsArr[pickPointsArr.length - 2],
          pickPointsArr[pickPointsArr.length - 1]
        );

        //getSightLerpPoint(lineSightPoints[lineSightPoints.length - 2], lineSightPoints[lineSightPoints.length - 1]);
        lineSightPoints = [];
        pickPointsArr = [];
        clearAll();
        //鼠标十字型
        document.getElementById("appDiv").style.cursor = "auto";
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (click) {
    lineSightPoints = [];
    clearAll();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  //绘制辅助对象线
  var sPolyLinePrimitive = (function () {
    function obj(spacePositions) {
      this.options = {
        id: "assistLine",
        polyline: {
          show: true,
          positions: [],
          material: Cesium.Color.AQUA, //纹理
          width: 2,
          //指定在折线位于地形下方时用于绘制折线的材质
          depthFailMaterial: Cesium.Color.AQUA,
        },
      };
      this.positions = spacePositions;
      this._init();
    }

    obj.prototype._init = function () {
      var _self = this;
      var _update = function () {
        return _self.positions;
      };
      //实时更新polyline.positions
      this.options.polyline.positions = new Cesium.CallbackProperty(
        _update,
        false
      );
      viewer.entities.add(this.options);
    };
    return obj;
  })();
}

//通视分析方法
function sampleHeights(point1, point2) {
  var sValue = $("#sValue").val();
  var eValue = $("#eValue").val();
  //清除辅助线
  viewer.entities.removeById("assistLine");
  if (!scene.clampToHeightSupported) {
    alert("当前版本不支持clampToHeightMostDetailed对象");
  }

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

  scene
    .clampToHeightMostDetailed(cartesians)
    .then(function (clampedCartesians) {
      /*for (var i = 0; i < count; ++i) {
            viewer.entities.add({
                position: clampedCartesians[i],
                ellipsoid: {
                    radii: new Cesium.Cartesian3(2, 2, 2),
                    material: Cesium.Color.RED
                }
            });
        }*/

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
      sverticalLine = viewer.entities.add({
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
      everticalLine = viewer.entities.add({
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
      visualLine = viewer.entities.add({
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
      unvisualLine = viewer.entities.add({
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
}

/**
 * getFlatternDistance 计算两点间距离
 * @param  lat1 坐标一纬度
 * @param  lng1 坐标一经度
 * @param  lat2 坐标二纬度
 * @param  lng2 坐标二经度
 * @return 长度 number
 */
/*function getFlatternDistance(lat1, lng1, lat2, lng2) {
    var EARTH_RADIUS = 6378137.0; //单位M
    var PI = Math.PI;

    function getRad(d) {
        return d * PI / 180.0;
    }
    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}*/

/**
 * getLerpPoint 获取插值数据
 * @param  point1 第一个坐标对象
 * @param  point2 第二个坐标对象
 * @return null
 */
/*function getSightLerpPoint(point1, point2) {
    //清空本次的插值数组
    sightlonlats = [];
    //取绘制的两点间的直线距离
    var distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon);
    //计算插值个数，默认按照100米间隔
    var interval = 10;

    //按照距离计算插值点个数
    var num = Math.round(distance / interval);
    var H = [];
    var H0 = [];
    var H1 = [];
    var H2 = [];
    for (var i = 0; i < num; i++) {
        //插值经纬度和高程数组
        var lon = Cesium.Math.lerp(point1.lon, point2.lon, i / (num - 1));
        var lat = Cesium.Math.lerp(point1.lat, point2.lat, i / (num - 1));
        var heights = Cesium.Math.lerp(point1.height, point2.height, i / (num - 1));
        var obj = Cesium.Cartographic.fromDegrees(lon, lat);
        H0.push(heights);
        H.push(obj);
    }

    //根据经纬度求高程 terrainProvider为目标地形图层，这里是全球地形
    var promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, H);
    Cesium.when(promise, function(updatedPositions) {
        for (var i = 0; i < updatedPositions.length; i++) {
            var longitudeString = Cesium.Math.toDegrees(updatedPositions[i].longitude);
            var latitudeString = Cesium.Math.toDegrees(updatedPositions[i].latitude);
            var height = updatedPositions[i].height;
            var lonlat = { "longitude": longitudeString, "latitude": latitudeString, "height": height };
            sightlonlats.push(lonlat);
            var sIndex = sightlonlats.length - 1;
            if (H0[sIndex] > height) {
                H1.push(H[sIndex]);
            } else {
                H2.push(H[sIndex]);
            }
            if (sightlonlats.length == num) {
                var index = (H1.length == 0) ? 0 : H1.length - 1;
                //可视线
                visualLine = viewer.entities.add({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                            sightlonlats[0].longitude, sightlonlats[0].latitude, H0[0],
                            sightlonlats[index].longitude, sightlonlats[index].latitude, H0[index]
                        ]),
                        width: 2,
                        material: Cesium.Color.GREEN,
                    }
                });

                var pointEntity = viewer.entities.add({
                    id: "sigMidPoint",
                    position: Cesium.Cartesian3.fromDegrees(sightlonlats[index].longitude, sightlonlats[index].latitude, H0[index]),
                    point: {
                        color: Cesium.Color.CHARTREUSE,
                        pixelSize: 5,
                        //标签原点的像素偏移量
                        pixelOffset: new Cesium.Cartesian2(-20, -20),
                        //相对于地形的位置
                        heightReference: Cesium.HeightReference.NONE,
                        //获取或设置从摄像机到禁用深度测试的距离
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    },
                });

                //不可视线
                unvisualLine = viewer.entities.add({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                            sightlonlats[index].longitude, sightlonlats[index].latitude, H0[index],
                            sightlonlats[num - 1].longitude, sightlonlats[num - 1].latitude, H0[num - 1]
                        ]),
                        width: 2,
                        material: Cesium.Color.RED,
                    }
                });

                //清空本次的插值数组
                sightlonlats = [];
            }
        }
    });
}*/
