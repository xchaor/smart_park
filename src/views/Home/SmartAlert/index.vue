<template>
      <div class="main_container">
            <h4 class="title">智能告警 INTELLIGENT ALARM</h4>
            <div class="chart">
                <div class="sumCount" @click="warnIcon()">
                  <div class="left">
                    <i></i><span>告警总数</span></div>
                  <div class="right"><span>{{getAlertSum}}</span></div>
                </div>
                <ul>
                  <li v-for="(item,index) in alertStatus" :key="index">{{item.alertType}} —— {{item.count}}</li>
                </ul>
            </div>
      </div>
  
</template>

<script>
import * as Cesium from 'cesium';
import ViewTab from "@/js/view/cream";
export default {
    data() {
        return {
          alertStatus:[
            {
              alertType:'设备告警',
              count:4
            },
            {
              alertType:'安防告警',
              count:5
            },{
              alertType:'能源告警',
              count:6
            },
          ],
        }
    },
    mounted() {
      
      // shapeEditMenu.style.display = "none";


      this.clickhandler()
    },
    computed:{
      getAlertSum(){
        let sum=0
        for(let i=0;i<this.alertStatus.length;i++){
          sum+=this.alertStatus[i].count
        }
        return sum
      }
    },
    methods: {
      //添加智能告警公告牌
      warnIcon() {
            var params = {
                data: [],
            };
            $.getJSON("./Apps/model/gjsb.json", function (data) {
                popFloat.warnNote = data.features;
                var typeIcon;
                for (var i = 0; i < popFloat.warnNote.length; i++) {
                    var vote = {};
                    vote.lon = popFloat.warnNote[i].geometry.coordinates[0];
                    vote.lat = popFloat.warnNote[i].geometry.coordinates[1];
                    vote.gc = popFloat.warnNote[i].geometry.coordinates[2];
                    vote.id = popFloat.warnNote[i].geometry.id;
                    typeIcon = popFloat.warnNote[i].geometry.name;
                    params.data.push(vote);
                    gjsb_FN(typeIcon, vote);
                }
            });
            function gjsb_FN(typeIcon, vote) {
                var image = document.createElement("img");
                if (typeIcon === "设备告警") {
                    image.src = "./Apps/img/图层 31.png";
                }
                else if (typeIcon === "安防告警") {
                    image.src = "./Apps/img/图层 32.png";
                }
                else if (typeIcon === "能源告警") {
                    image.src = "./Apps/img/图层 33.png";
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
                        nameJor(canvas, vote);
                    }
                };
            }
            function nameJor(canvas, value) {
                viewer.entities.add({
                    id: value.id,
                    position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
                    billboard: {
                        image: canvas,
                        // scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        width: canvas.width,
                        height: canvas.height,
                    },
                });
            }
            ViewTab(5);
      },
      clickhandler(){
        const that=this
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement){
          const pickingEntity=viewer.scene.pick(movement.position);
          if (pickingEntity !== undefined){
              if(pickingEntity.id !== undefined ){
                if (pickingEntity.id._id !== undefined) {
                  var index = Number(pickingEntity.id._id);
                  if (popFloat.warnNote !== undefined){
                      that.editWranLeverHtml(
                        movement.position.x ,
                        movement.position.y ,
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
                          that.checkWarn(index);
                        }
                      }
                  }
                }
              };
          }
  
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      editWranLeverHtml(x, y, index) {
        shapeEditMenu.style.width="200px"
        shapeEditMenu.style.height="150px"
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        this.showWranLeverHtml(shapeEditMenu, index);
      },
      showWranLeverHtml(shapeEditMenu, index) {
        var objTable = popFloat.warnNote[index];
        var start = objTable.properties.TIMESTART;
        var end = objTable.properties.TIMEEND;
        var cx = this.DateToTamp(end) - this.DateToTamp(start);
        var time = this.formatSecond(cx);
        var strNum2 =
          '<div class="redBg">\n' +
          '\t<div class="redBg_title">\n' +
          "\t\t告警等级</div>\n" +
          '\t<div class="redCont">\n' +
          "\t\t<div>告警等级：" +
          objTable.properties.LEVEL +
          "</div>\n" +
          "\t\t<div>告警信息：" +
          objTable.properties.NAME +
          "</div>\n" +
          "\t\t<div>告警开始时间：" +
          objTable.properties.TIMESTART +
          "</div>\n" +
          "\t\t<div>告警结束时间：" +
          objTable.properties.TIMEEND +
          "</div>\n" +
          "\t\t<div>告警持续时间：" +
          time.days +
          "天-" +
          time.hours +
          "小时-" +
          time.minutes +
          "分钟-" +
          time.seconds +
          "秒</div>\n" +
          "\t</div>\n" +
          "</div>";
        shapeEditMenu.innerHTML = strNum2;
      },
      checkWarn(index) {
        var type = popFloat.warnNote[index].geometry.name;
        var radar = viewer.entities.getById(mapClick.warnArr[0]);
        var isTrue = viewer.entities.remove(radar);
        if (isTrue) {
          addLastTime(mapClick.warnArr[0]);
        }
        var image = document.createElement("img");
        if (type === "设备告警") {
          image.src = "./Apps/img/icons/map-sbgj.png";
        } else if (type === "安防告警") {
          image.src = "./Apps/img/icons/map-afgj.png";
        } else if (type === "能源告警") {
          image.src = "./Apps/img/icons/map-nygj.png";
        }
        var vote = {};
        vote.lon = popFloat.warnNote[index].geometry.coordinates[0];
        vote.lat = popFloat.warnNote[index].geometry.coordinates[1];
        vote.gc = popFloat.warnNote[index].geometry.coordinates[2];
        vote.id = popFloat.warnNote[index].geometry.id;
        image.onload = image.onreadystatechange = function () {
          if (
            !this.readyState ||
            this.readyState == "loaded" ||
            this.readyState == "complete"
          ) {
            var canvas = document.createElement("canvas");
            canvas.height = image.height;
            canvas.width = image.width;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            name(canvas, vote);
          }
        };
        function name(canvas, value) {
          viewer.entities.add({
            id: value.id,
            position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
            billboard: {
              name: value.id,
              image: canvas,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              width: canvas.width,
              height: canvas.height,
            },
          });
        }
        function addLastTime(index) {
          var vote = {};
          var params = {
            data: [],
          };
          var icon;
          vote.lon = popFloat.warnNote[index].geometry.coordinates[0];
          vote.lat = popFloat.warnNote[index].geometry.coordinates[1];
          vote.gc = popFloat.warnNote[index].geometry.coordinates[2];
          vote.id = popFloat.warnNote[index].geometry.id;
          icon = popFloat.warnNote[index].geometry.name;
          params.data.push(vote); 
          monitor_FN(icon, vote);
          function monitor_FN(typeIcon, vote) {
            var image = document.createElement("img");
            if (typeIcon === "设备告警") {
              image.src = "./Apps/img/图层 31.png";
            } else if (typeIcon === "安防告警") {
              image.src = "./Apps/img/图层 32.png";
            } else if (typeIcon === "能源告警") {
              image.src = "./Apps/img/图层 33.png";
            }
            image.onload = image.onreadystatechange = function () {
              if (
                !this.readyState ||
                this.readyState == "loaded" ||
                this.readyState == "complete"
              ) {
                var canvas = document.createElement("canvas");
                canvas.height = image.height;
                canvas.width = image.width;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                name(canvas, vote);
              }
            };
          }
          function name(canvas, value) {
            viewer.entities.add({
              id: value.id,
              position: Cesium.Cartesian3.fromDegrees(
                value.lon,
                value.lat,
                value.gc
              ),
              billboard: {
                name: value.id,
                image: canvas,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                width: canvas.width,
                height: canvas.height,
              },
            });
          }
        }
      },
      formatSecond(second) {
        const days = Math.floor(second / 86400);
        const hours = Math.floor((second % 86400) / 3600);
        const minutes = Math.floor(((second % 86400) % 3600) / 60);
        const seconds = Math.floor(((second % 86400) % 3600) % 60);
        const forMatDate = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        };
        return forMatDate;
      },
      DateToTamp(oString) {
        var f = oString.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        //使用Date的构造函数，实力化并解析
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
      },
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
        .chart{
        width: 100%;
        height: 100%;
        padding: .1333rem;
          .sumCount{
              display: grid;
              grid-template-columns: 1fr 1fr;
              padding: .2rem .5rem;
              height: 1.5rem;
              background:linear-gradient(rgba(0,0,0,0),rgba(112,22,19,1));
              font-size: .4rem;
              .left{
                  i{  
                  display: inline-block;
                  width: 1rem;
                  height: 1rem;
                  background: url(@/assets/images/alert.png);
                  background-size: 100% auto;
                  margin-right: .3rem
                  };
                  i,span{
                      vertical-align: middle;
                  }
              };
              .right{
                position: relative;
                span{
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  right: .5rem;
                  display: block;
                  color: red;
                  font-size: .7rem;
                  margin: 0 auto;
                }
              }
          }
          ul{
            padding: .1rem;
            li{
            height: 1.5rem;
            font-size: .4rem;
            border-bottom: 1px solid #0976C1;
            line-height: 1.5rem;
            }
          } 
        }
     }
</style>