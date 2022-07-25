
/*属性查询*/
/*
 * */
//获取事件触发所在的  html Canvas容器
var canvas = viewer.scene.canvas;
var mapClick = {
  czlArr: [], //记录视屏监控
  warnArr: [], //记录告警
  NumberArr: [], //人员轨迹记录
  professionArr: [], //人员轨迹记录
};
//高亮显示代码
var previousPickedEntity = {
  feature: undefined,
  originalColor: undefined,
};

$(function () {
  //  获取事件句柄
  // var handler = new Cesium.ScreenSpaceEventHandler(canvas);
  handler.setInputAction(function (movement) {
    var pickingEntity = viewer.scene.pick(movement.position);
    //判断选择是否为Cesium3DTileFeature
    viewer.entities.remove(BillboardDiy);

    if (pickingEntity !== undefined) {

      // if (pickingEntity.tileset._basePath===queryTools.InternetThings._basePath) {
      if (pickingEntity.tileset !== undefined) {
        if (pickingEntity.tileset._basePath === queryTools.znywLoc) {
          // 第一种方式
          popFloat.editHandlerSmart(movement.position.x, movement.position.y);
          //  广告牌  第二种方式
          // popFloat.showBillboardDevice(movement.position.x,movement.position.y)
          //判断以前是否选择要素
          if (pickingEntity != previousPickedEntity.feature) {
            if (previousPickedEntity.feature != undefined) {
              //还原前选择要素的本颜色
              previousPickedEntity.feature.color =
                previousPickedEntity.originalColor;
              //将当前选择要素及其颜色添加到previousPickedEntity1
              previousPickedEntity.feature = pickingEntity;
              previousPickedEntity.originalColor = pickingEntity.color;
            }
            //将当前选择要素及其颜色添加到previousPickedEntity
            previousPickedEntity.feature = pickingEntity;
            previousPickedEntity.originalColor = pickingEntity.color;
          }
          //将模型变为黄色高亮
          pickingEntity.color = Cesium.Color.RED;
        } else if (pickingEntity.tileset._basePath === queryTools.sxcx3dtitle) {
          // 第一种方式
          var pick1 = new Cesium.Cartesian2(
            movement.position.x,
            movement.position.y
          );
          var cartesian3 = viewer.scene.globe.pick(
            viewer.camera.getPickRay(pick1),
            viewer.scene
          );
          var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
            cartesian3
          );
          var lon = (curPosition.longitude * 180) / Math.PI;
          var lat = (curPosition.latitude * 180) / Math.PI;
          var ellipsoid = scene.globe.ellipsoid;
          var height = ellipsoid.cartesianToCartographic(viewer.camera.position)
            .height;
          popFloat.editHandler3dtitle(
            movement.position.x - 318,
            movement.position.y - 242,
            lon,
            lat,
            height,
            movement.position.x,
            movement.position.y
          );

          if (pickingEntity != previousPickedEntity.feature) {
            if (previousPickedEntity.feature != undefined) {
              //还原前选择要素的本颜色
              previousPickedEntity.feature.color =
                previousPickedEntity.originalColor;
              //将当前选择要素及其颜色添加到previousPickedEntity1
              previousPickedEntity.feature = pickingEntity;
              previousPickedEntity.originalColor = pickingEntity.color;
            }
            //将当前选择要素及其颜色添加到previousPickedEntity
            previousPickedEntity.feature = pickingEntity;
            previousPickedEntity.originalColor = pickingEntity.color;
          }
          //将模型变为黄色高亮
          pickingEntity.color = Cesium.Color.fromBytes(255, 135, 0, 255);
        }
      }
      //视屏监控 人员 设备
      if (pickingEntity.id !== undefined) {
        if (pickingEntity.id._id !== undefined) {
          var index = Number(pickingEntity.id._id);
          // 首页警告
          if (popFloat.warnNote !== undefined) {
            popFloat.editWranLeverHtml(
              movement.position.x - 318,
              movement.position.y - 242,
              index
            );
            mapClick.warnArr.push(index);
            if (mapClick.warnArr.length > 2) {
              mapClick.warnArr.shift();
            }
            if (mapClick.warnArr.length <= 2) {
              if (
                mapClick.warnArr[0] !== mapClick.warnArr[1] ||
                mapClick.warnArr[1] === undefined
              ) {
                var radar = viewer.entities.getById(index);
                viewer.entities.remove(radar);
                popFloat.checkWarn(index);
              }
            }
            //监控
          } else if (popFloat.monitorArr !== undefined) {
            mapClick.czlArr.push(index);
            if (mapClick.czlArr.length > 2) {
              mapClick.czlArr.shift();
            }
            if (mapClick.czlArr.length <= 2) {
              if (
                mapClick.czlArr[0] !== mapClick.czlArr[1] ||
                mapClick.czlArr[1] === undefined
              ) {
                var radar = viewer.entities.getById(index);
                viewer.entities.remove(radar);
                popFloat.checkMapMonitor(index);
              }
            }
            $(".PlayChoose").show();
            $(".monitorVideoPlay").show();
            // 人员轨迹
          } else if (popFloat.trackArr !== undefined) {
            var NumberPro = Number(pickingEntity.id._id.split("_")[1]);
            var profession = pickingEntity.id._id.split("_")[2];
            var id = pickingEntity.id._id;
            mapClick.NumberArr.push(NumberPro);
            mapClick.professionArr.push(profession);
            if (mapClick.NumberArr.length > 2) {
              mapClick.NumberArr.shift();
              mapClick.professionArr.shift();
            }
            if (mapClick.NumberArr.length <= 2) {
              if (
                mapClick.NumberArr[0] !== mapClick.NumberArr[1] ||
                mapClick.NumberArr[1] === undefined
              ) {
                // 移除当前点击的
                var radarNew = viewer.entities.getById(id);
                viewer.entities.remove(radarNew);
                popFloat.checkTrack(NumberPro);
                popFloat.editHandlerTrack(
                  movement.position.x - 60,
                  movement.position.y - 80,
                  NumberPro,
                  profession
                );
              }
            }
          }
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (e) {
    ClearDis();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  //绑定地图移动
  handler.setInputAction(function (e) {
    ClearDis();
  }, Cesium.ScreenSpaceEventType.LEFT_UP);
  //绑定地图移动
  handler.setInputAction(function (e) {
    ClearDis();
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  //绑定地图缩放
  handler.setInputAction(function (e) {
    ClearDis();
  }, Cesium.ScreenSpaceEventType.WHEEL);
  //绑定滚轮点击事件
  handler.setInputAction(function (e) {
    ClearDis();
  }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
});
/*清除地图上div*/
function ClearDis() {
  var shapeEditMenuNum1 = document.getElementById("apparatusDiv");
  shapeEditMenuNum1.style.display = "none";
  var shapeEditMenuNum2 = document.getElementById("warningDiv");
  shapeEditMenuNum2.style.display = "none";
  // document.getElementById('mainFrame').contentWindow.document.getElementById('trackDiv').style.display = "none";
  var shapeEditMenuNum3 = document.getElementById("trackDiv");
  shapeEditMenuNum3.style.display = "none";
  var shapeEditMenuNum4 = document.getElementById("attributesDiv");
  shapeEditMenuNum4.style.display = "none";
  // viewer.entities.remove(BillboardDiy)
  if (previousPickedEntity.feature != undefined) {
    previousPickedEntity.feature.color = Cesium.Color.WHITE;
  }
}
