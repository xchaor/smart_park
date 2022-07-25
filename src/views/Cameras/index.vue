<template>
  <div class="view_container">
    <h4 class="view_title">重点监控 KEY MONITORING</h4>
    <ul>
      <li v-for="(item,index) in monitorSpots" :key="index">
        <div class="previewImg" @click="videoIsShow=true"></div>
        <div class="info">
          <h5 class="spot_Name">{{item.name}}</h5>
          <h5 class="spot_Id">{{item.id}}</h5>
          <!-- 根据监控点状态信息获取图标地址 -->
          <img :src="require(`@/assets/images/${item.status}icon.png`)" ><p class="spot_Status">{{item.status}}</p>
        </div>
      </li>
    </ul>
    <div v-show="videoIsShow" class="videocontainer">
      <div class="iconBox_close" @click="videoIsShow=false"></div>
      <video src="@/assets/video/jiankongvideo.mp4" muted controls autopictureinpicture="false"  disablePictureInPicture controlslist="nodownload" ></video>
    </div>

  </div>
</template>

<script>
import * as Cesium from 'cesium';
export default {
    data() {
        return {
            monitorSpots:[
              {
                name:'监控点1',
                id:'2123000101',
                status:'正常'
              },
              {
                name:'监控点2',
                id:'2123000102',
                status:'正常'
              },
              {
                name:'监控点3',
                id:'2123000103',
                status:'故障'
              },
              {
                name:'监控点4',
                id:'2123000104',
                status:'正常'
              },
              {
                name:'监控点5',
                id:'2123000105',
                status:'正常'
              },
              {
                name:'监控点6',
                id:'2123000106',
                status:'正常'
              },
              {
                name:'监控点7',
                id:'2123000107',
                status:'检修'
              },
              {
                name:'监控点8',
                id:'2123000108',
                status:'正常'
              },
              
            ],
            videoIsShow:false,
        }
    },
    mounted() {
      this.addMonitor()
      this.clickHandler()
    },
    methods: {
      //添加在地图中  视频监控广告牌
      addMonitor() {
          var params = {
              data: [],
          };
          $.getJSON("./Apps/model/monitor.json", function (data) {
              popFloat.monitorArr = data.features;
              var icon;
              for (var i = 0; i < popFloat.monitorArr.length; i++) {
                  var vote = {};
                  vote.lon = popFloat.monitorArr[i].geometry.coordinates[0];
                  vote.lat = popFloat.monitorArr[i].geometry.coordinates[1];
                  vote.gc = popFloat.monitorArr[i].geometry.coordinates[2];
                  vote.id = popFloat.monitorArr[i].geometry.id;
                  icon = popFloat.monitorArr[i].geometry.status;
                  params.data.push(vote);
                  monitor_FN(icon, vote);
              }
              
          });
          function monitor_FN(typeIcon, vote) {
              var image = document.createElement("img");
              if (typeIcon === "正常") {
                  image.src = "./Apps/img/图层 51.png";
              }
              else if (typeIcon === "故障") {
                  image.src = "./Apps/img/图层 53.png";
              }
              else if (typeIcon === "检修") {
                  image.src = "./Apps/img/图层 52.png";
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
                      name(canvas, vote);
                  }
              };
          }
          function name(canvas, value) {
              viewer.entities.add({
                  name: "视频监控",
                  id: value.id,
                  position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
                  billboard: {
                      name: value.id,
                      image: canvas,
                      scaleByDistance: new Cesium.NearFarScalar(150, 1, 15000000, 0.5),
                      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                      width: canvas.width,
                      height: canvas.height,
                  },
              });
          }
      },
      //处理地图鼠标点击事件
      clickHandler(){
        const that=this
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (click){
          const pickingEntity=viewer.scene.pick(click.position);
          if (pickingEntity !== undefined){
              if(pickingEntity.id !== undefined ){
                if (pickingEntity.id._id !== undefined) {
                  var index = Number(pickingEntity.id._id);
                  if (popFloat.monitorArr !== undefined){

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
                        that.checkMapMonitor(index);
                      }
                  }
                  //显示视频
                  that.videoIsShow=true
                  }
                }
              };
          }
  
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      //替换选中公告牌的样式
      checkMapMonitor(index){
        const that=this
        var type = popFloat.monitorArr[index].geometry.status;
        var radar = viewer.entities.getById(mapClick.czlArr[0]);
        var isTrue = viewer.entities.remove(radar);
        if (isTrue) {
          addLastTime(mapClick.czlArr[0]);
        }
        var image = document.createElement("img");
        if (type === "正常") {
          image.src = "./Apps/img/icons/map-spjk-1.png";
        } else if (type === "故障") {
          image.src = "./Apps/img/icons/map-spjk-3.png";
        } else if (type === "检修") {
          image.src = "./Apps/img/icons/map-spjk-2.png";
        }
        var vote = {};
        vote.lon = popFloat.monitorArr[index].geometry.coordinates[0];
        vote.lat = popFloat.monitorArr[index].geometry.coordinates[1];
        vote.gc = popFloat.monitorArr[index].geometry.coordinates[2];
        vote.id = popFloat.monitorArr[index].geometry.id;
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
          vote.lon = popFloat.monitorArr[index].geometry.coordinates[0];
          vote.lat = popFloat.monitorArr[index].geometry.coordinates[1];
          vote.gc = popFloat.monitorArr[index].geometry.coordinates[2];
          vote.id = popFloat.monitorArr[index].geometry.id;
          icon = popFloat.monitorArr[index].geometry.status;
          params.data.push(vote);
          monitor_FN(icon, vote);
          function monitor_FN(typeIcon, vote) {
            var image = document.createElement("img");
            if (typeIcon === "正常") {
              image.src = "./Apps/img/图层 51.png";
            } else if (typeIcon === "故障") {
              image.src = "./Apps/img/图层 53.png";
            } else if (typeIcon === "检修") {
              image.src = "./Apps/img/图层 52.png";
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
      }
    },
    beforeDestroy() {
        this.$store.dispatch("clearArrAll")
    },
}
</script>

<style lang="less" scoped>
    .view_container{
      width:9.5333rem;
      margin: 0.2rem auto 0;
      font-size: .5rem;
      .view_title{
        font-size: .35rem ;
        font-weight: normal;
      }
      .videocontainer{
        z-index: 8;
        position: fixed;
        top: 0;
        left:0;
        width: 100%;
        height: 100%;
        background-color:rgba(0, 0, 0, .7);
        display: flex;
        align-items: center;
        video{
          width: 100%;
        }
        .iconBox_close{
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          width: .64rem;
          height: .64rem;
          background: url(@/assets/images/close.png);
          background-size: contain;
        }
      }
      ul{
        margin: .2rem 0;
        padding-bottom: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: .1rem;
        li{
          flex: 1;
          width: 3.3867rem;
          display: grid;
          font-size: .3rem;
          grid-template-columns: 2fr 1fr;
          .previewImg{
            width: 2.9867rem;
            height: 1.68rem;
            background: url(@/assets/images/video.png) no-repeat;
            background-size: 100% 100%;
          }
          .info{
            img,.spot_Status{
              display: inline-block;
              vertical-align: middle;
            }
          } 
        }
      }
    }
</style>