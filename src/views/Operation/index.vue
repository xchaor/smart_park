<template>
  <div class="view_container">
    <ul>
      <li><i></i><span>人脸识别门禁</span></li>
      <li><i></i><span>路灯</span></li>
      <li><i></i><span>视频监控</span></li>
      <li><i></i><span>地磁</span></li>
      <li><i></i><span>智能垃圾桶</span></li>
    </ul>
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
      this.addPosCoord()
      // 初始化设备信息弹窗
      this.clickHandler()
    },
    methods:{
        //添加在地图中  智能运维广告牌
        addPosCoord() {
            var params = {
                data: [],
            };
            $.getJSON("./Apps/model/attributes_GeoJSON.json", function (data) {
                queryTools.znywLoc = "Apps/model/物联网设备/";
                popFloat.attributesArr = data.features;
                var icon;
                for (var i = 0; i < popFloat.attributesArr.length; i++) {
                    var vote = {};
                    vote.lon = popFloat.attributesArr[i].geometry.coordinates[0];
                    vote.lat = popFloat.attributesArr[i].geometry.coordinates[1];
                    vote.gc = 1;
                    params.data.push(vote);
                    icon = popFloat.attributesArr[i].properties.icon;
                    attributes_FN(icon, vote);
                }
            });
            function attributes_FN(typeIcon, vote) {
                var image = document.createElement("img");
                if (typeIcon === "renlian") {
                    image.src = "./Apps/img/图层 41.png";
                }
                else if (typeIcon === "ludeng") {
                    image.src = "./Apps/img/图层 42.png";
                }
                else if (typeIcon === "dici") {
                    image.src = "./Apps/img/图层 44.png";
                }
                else if (typeIcon === "lajitong") {
                    image.src = "./Apps/img/图层 45.png";
                }
                image.onload = image.onreadystatechange = function () {
                    if (!this.readyState ||
                        this.readyState == "loaded" ||
                        this.readyState == "complete") {
                        var canvas = document.createElement("canvas");
                        canvas.height = image.height;
                        canvas.width = image.width;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);
                        //循环添加公告牌
                        name(canvas, vote);
                    }
                };
            }
            
            function name(canvas, value) {
                viewer.entities.add({
                    id: value.type,
                    position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
                    billboard: {
                        image: canvas,
                        scaleByDistance: new Cesium.NearFarScalar(150, 1, 15000000, 0.5),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        width: canvas.width,
                        height: canvas.height,
                    },
                    show: true
                });
            }
        },
      //处理点击事件
      clickHandler(){
        const that=this
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (click){
          const pickingEntity=viewer.scene.pick(click.position);
          if (pickingEntity !== undefined){
            if(pickingEntity.tileset!==undefined){
              //点击智能运维3dtile模型时调用editHandlerSmart()
              if(pickingEntity.tileset._basePath === queryTools.znywLoc){
                that.editHandlerSmart(click.position.x, click.position.y)

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
              }else{
                //点击其他模型还原前选择要素的本颜色
                previousPickedEntity.feature.color =previousPickedEntity.originalColor;
              }
            }
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      editHandlerSmart(x, y){
        //将点击事件的坐标赋值给弹窗的方位
        shapeEditMenu.style.width="200px"
        shapeEditMenu.style.height="170px"
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        this.editHandlerSmartHtml(shapeEditMenu);
      },
      editHandlerSmartHtml(shapeEditMenu){
        var imei;
        var objTable;
        for (var i = 0; i < popFloat.attributesArr.length; i++) {
          if (
            popFloat.attributesArr[i].properties.NAME === viewer.selectedEntity.name
          ) {
            imei = popFloat.attributesArr[i].properties.IMEI;
            break;
          }
        }
        $.getJSON("./Apps/model/设备列表(除人脸设备外).json", function (data) {
          for (var i = 0; data.length; i++) {
            if (data[i].imei === imei) {
              objTable = data[i];
              break;
            }
          }
          var textContent =
            '\t<div class="znywAlert">\n' +
            '\t\t<div class="znywAlert-title">设备信息</div>\n' +
            "\t\t<div> 设备识别码：" +
            objTable.imei +
            "</div>\n" +
            "\t\t<div> \t\t设备类型：" +
            objTable.equipmentType +
            "</div>\n" +
            "\t\t<div> \t\t事件编号：" +
            objTable.eventId +
            "</div>\n" +
            "\t\t<div> \t\t事件名称：" +
            objTable.eventName +
            "</div>\n" +
            "\t\t<div> \t\t详情编号：" +
            objTable.equipmentId +
            "</div>\n" +
            "\t\t<div> \t\t设备名称：" +
            objTable.equipmentName +
            "</div>\n" +
            "\t\t<div> \t\t设备地址：" +
            objTable.address +
            "</div>\n" +
            "\t\t<div> \t\t上报时间：" +
            objTable.reportTime +
            "</div>\n" +
            "\t</div>";
          shapeEditMenu.innerHTML = textContent;
        });
      }
    },
    beforeDestroy() {
        this.$store.dispatch("clearArrAll")
    },
}
</script>

<style lang="less" scoped>
    .view_container{
      width:9.5333rem ;
      margin: 0.2rem auto 0;
      ul{
        font-size: 0.4rem;
        padding: .1rem;
        li{
          margin-bottom: .2rem;
          i{
            display: inline-block;
            width: .6rem;
            height: .6rem;
            background-size: 100% auto;
            margin-right: .3rem
          }
          i,span{
            vertical-align: middle;
          }
        }
        :nth-child(1) i{
          background: url(@/assets/images/门禁icon.png);
          background-size: 100% auto;
        }
        :nth-child(2) i{
          background: url(@/assets/images/路灯icon.png);
          background-size: 100% auto;
        }
        :nth-child(3) i{
          background: url(@/assets/images/监控icon.png);
          background-size: 100% auto;
        }
        :nth-child(4) i{
          background: url(@/assets/images/地磁icon.png);
          background-size: 100% auto;
        }
        :nth-child(5) i{
          background: url(@/assets/images/垃圾桶icon.png);
          background-size: 100% auto;
        }
      }
      }
</style>