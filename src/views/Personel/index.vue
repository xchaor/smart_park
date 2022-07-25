<template>
  <div class="view_container">
    <ul>
      <li><i></i><span>员工</span></li>
      <li><i></i><span>访客</span></li>
      <li><i></i><span>安保</span></li>
    </ul>
    <div class="form ryjk_cx" style="display:none">
      <h4 >起始时间:</h4>
      <van-cell is-link @click="showStartDatePicker=!showStartDatePicker">{{this.formatTime(this.startDate)}}</van-cell>
      <van-popup v-model="showStartDatePicker" position="bottom"  :style="{ height: '30%' }">
        <van-datetime-picker
            :value="startDate"
            type="datetime"
            title="选择完整时间"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onConfirm1"
            @cancel="onCancel1"
          />
      </van-popup>

      <h4>结束时间:</h4>
      
      <van-cell is-link @click="showEndDatePicker=!showEndDatePicker">{{this.formatTime(this.endDate)}}</van-cell>
      <van-popup v-model="showEndDatePicker" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        :value="endDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm2"
        @cancel="onCancel2"
      />
      </van-popup>
      <van-button type="info" id="cxbtn">查询</van-button>
      
    </div>
    
  </div>
</template>
<script>
import * as Cesium from 'cesium';
export default {
    data() {
        return {
          minDate: new Date(2000, 0, 1),
          maxDate: new Date(2025, 10, 1),
          startDate: new Date(2020,11,11,10,0,0),
          endDate:new Date(2020,11,11,12,0,0),
          showStartDatePicker: false,
          showEndDatePicker: false,
        }
    },
    mounted(){
        console.log("人员组件初始化");
        //初始化弹窗
        shapeEditMenu.style = `
        position:absolute;
        left:-24px;
        top:38px;
        width:1.6rem;
        height:1.1rem;
        background:#153251;
        font-size:10px;
        padding:5px;
        z-index:7;
        border:1px solid #0976C1`
        ;
        shapeEditMenu.innerHTML=
        '\t<div class="lsgj">\n' +
        '\t\t<div class="lsgj_Billboard">\n' +
        '\t\t\t<img src="./Apps/img/rwjk/组 2.png" alt="">\n' +
        "\t\t\t<h5>历史轨迹</h5>\n" +
        "\t\t</div>\n" +
        "\t</div>";
      shapeEditMenu.style.display = "none";
      //人员公告牌
      this.addTrackPoint()
      
      this.clickHandler()
    },

    methods: {
      onConfirm1(value){
        this.startDate=value
        this.showStartDatePicker= false
      },
      onCancel1(){
        this.showStartDatePicker= false
      },
      onConfirm2(value){
        this.endDate=value
        this.showEndDatePicker= false
      },
      onCancel2(){
        this.showEndDatePicker= false
      },
      showPopup() {
        this.show = true;
      },
      //new Date()数据格式化
      formatTime(date){
        let year=date.getFullYear()
        let month=date.getMonth()+1 
        if (month<10) {
          month="0"+month;
        }
        let dateN=date.getDate()
        if (dateN<10) {
          dateN="0"+dateN;
        }
        let hour=date.getHours()
        if (hour<10) {
          hour="0"+hour;
        }
        let minute=date.getMinutes()
        if (minute<10) {
          minute="0"+minute;
        }
        let second=date.getSeconds()
        if (second<10) { 
          second="0"+second;
        }
        return `${year}-${month}-${dateN} ${hour}:${minute}:${second}`
      },
      //人员公告牌
      addTrackPoint(){
        var fileNum = 10;
        popFloat.trackArr =[];
        for (var i = 1; i <= fileNum; i++) {
          var url = "./Apps/model/czml/巡检路线" + i + ".json";
          $.getJSON(url, function (data) {
            var trackArrResult = data[1].position.cartographicDegrees;
            popFloat.trackArr.push(trackArrResult);
            var icon;
            var vote = {};
            vote.lon = trackArrResult[1]; 
            vote.lat = trackArrResult[2];
            vote.gc = trackArrResult[3];
            vote.id = data[1].id;
            icon = data[1].name;
            TrackPoint(icon, vote);
            
          });
        }
        function TrackPoint(icon, vote) {
          var image = document.createElement("img");
          if (icon === "员工") {
            image.src = "./Apps/img/rwjk/图层 56.png";
          } else if (icon === "访客") {
            image.src = "./Apps/img/rwjk/图层 57.png";
          } else if (icon === "安保") {
            image.src = "./Apps/img/rwjk/abry.png";
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
              name(canvas, vote, icon);
            }
          };
        }
        function name(canvas, value, icon) {
          viewer.entities.add({
            id: value.id + "_" + icon,
            position: Cesium.Cartesian3.fromDegrees(value.lon, value.lat, value.gc),
            billboard: {
              image: canvas,
              scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              width: canvas.width,
              height: canvas.height,
            },
          });
        }
      },
      //处理点击事件
      clickHandler(){
        const that=this
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement){
          const pickingEntity=viewer.scene.pick(movement.position);
          if (pickingEntity !== undefined){
            if(pickingEntity.id !== undefined ){
              var index = Number(pickingEntity.id._id);
              if(popFloat.trackArr !== undefined){

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
                      that.checkTrack(NumberPro);
                      that.editHandlerTrack(
                        movement.position.x - 60,
                        movement.position.y - 80,
                        NumberPro,
                        profession
                      );
                    }
                }

              }
              

            };
          }
  
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      },
      checkTrack(index) {
        // 移除上次点击的
        var radar = viewer.entities.getById(
          "track" + "_" + mapClick.NumberArr[0] + "_" + mapClick.professionArr[0]
        );
        var isTrue = viewer.entities.remove(radar);
        if (isTrue) {
          checkLastTrack(mapClick.NumberArr[0]);
        }
        // 数组索引对应-1 添加这次点击的加上圆环
        var currentUrl = "./Apps/model/czml/巡检路线" + index + ".json";
        $.getJSON(currentUrl, function (data) {
          var trackArrResult = data[1].position.cartographicDegrees;
          var icon;
          var vote = {};
          vote.lon = trackArrResult[1];
          vote.lat = trackArrResult[2];
          vote.gc = trackArrResult[3];
          vote.id = data[1].id;
          icon = data[1].name;
          TrackPoint(icon, vote);
          function TrackPoint(icon, vote) {
            var image = document.createElement("img");
            if (icon === "员工") {
              image.src = "./Apps/img/icons/map-ryjk-1.png";
            } else if (icon === "访客") {
              image.src = "./Apps/img/icons/map-ryjk-2.png";
            } else if (icon === "安保") {
              image.src = "./Apps/img/icons/map-ryjk-3.png";
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
                name(canvas, vote, icon);
              }
            };
          }
          function name(canvas, value, icon) {
            viewer.entities.add({
              id: value.id + "_" + icon,
              position: Cesium.Cartesian3.fromDegrees(
                value.lon,
                value.lat,
                value.gc
              ),
              billboard: {
                image: canvas,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                width: canvas.width,
                height: canvas.height,
              },
            });
          }
        });
        //上次点击 还原
        function checkLastTrack(index) {
          var lastUrl = "./Apps/model/czml/巡检路线" + index + ".json";
          $.getJSON(lastUrl, function (data) {
            var trackArrResult = data[1].position.cartographicDegrees;
            var icon;
            var vote = {};
            vote.lon = trackArrResult[1];
            vote.lat = trackArrResult[2];
            vote.gc = trackArrResult[3];
            vote.id = data[1].id;
            icon = data[1].name;
            TrackPoint(icon, vote);
            function TrackPoint(icon, vote) {
              var image = document.createElement("img");
              if (icon === "员工") {
                image.src = "./Apps/img/rwjk/图层 56.png";
              } else if (icon === "访客") {
                image.src = "./Apps/img/rwjk/图层 57.png";
              } else if (icon === "安保") {
                image.src = "./Apps/img/rwjk/abry.png";
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
                  name(canvas, vote, icon);
                }
              };
            }
            function name(canvas, value, icon) {
              viewer.entities.add({
                id: value.id + "_" + icon,
                position: Cesium.Cartesian3.fromDegrees(
                  value.lon,
                  value.lat,
                  value.gc
                ),
                billboard: {
                  image: canvas,
                  scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  width: canvas.width,
                  height: canvas.height,
                },
              });
            }
          });
        }
      },
      // 历史轨迹弹窗样式
      editHandlerTrack(x, y, index, type) {
        console.log("人员组件editHandlerTrack()被调用了");
        const that=this
        var trackArrResult = popFloat.trackArr[Number(index) - 1];
        var vote = {};
        vote.lon = trackArrResult[1];
        vote.lat = trackArrResult[2];
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        shapeEditMenu.onclick = function () {
          //加入人员轨迹
          viewer.entities.removeAll();
          shapeEditMenu.style.display = "none";
          that.peopleTrack(Number(index), type);
        };
      },
      peopleTrack(i, t) {
        const that=this
        var url = "./Apps/model/czml/巡检路线" + i + ".json";
        var dronePromise;
        var flyNumber;
        var type;
        flyNumber = i;
        type = t;
        // var drone;
        $.getJSON(url, function (data) {
          dronePromise = viewer.dataSources
            .add(Cesium.CzmlDataSource.load(data))
            .then(function (ds) {
              viewer.trackedEntity = ds.entities.getById("track_" + flyNumber);
              var colorStyle;
              if (type === "员工") {
                colorStyle = Cesium.Color.fromBytes(0, 255, 191, 255);
              } else if (type === "访客") {
                colorStyle = Cesium.Color.fromBytes(0, 120, 255, 255);
              } else if (type === "安保") {
                colorStyle = Cesium.Color.fromBytes(255, 135, 0, 255);
              }
              viewer.trackedEntity.path.material._color._value = colorStyle;
              // viewer.trackedEntity.orientation =new  Cesium.VelocityOrientationProperty(viewer.trackedEntity.position);
              viewer.trackedEntity.billboard.horizontalOrigin =
                Cesium.HorizontalOrigin.TOP;
              viewer.trackedEntity.billboard.verticalOrigin =
                Cesium.VerticalOrigin.BOTTOM;
            });
          $(".ryjk_cx").show();

        });
        //查询按钮
        document.getElementById("cxbtn").onclick = function () {
          var startTime = that.formatTime(that.startDate).replace(" ", "T") + "Z";
          var stopTime = that.formatTime(that.endDate).replace(" ", "T") + "Z";
          viewer.clock.startTime = Cesium.JulianDate.fromIso8601(startTime);
          viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(stopTime);
          viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
          viewer.clock.shouldAnimate = true;
        };

      },
    },
    beforeDestroy(){
      console.log("人员组件被销毁");
      this.$store.dispatch("clearArrAll")
    }
}
</script>

<style lang="less" scoped>
    .view_container{
      width:9.5333rem ;
      margin: 0.2rem auto 0;
      font-size: .4rem;
      
      ul{
        font-size: 0.4rem;
        padding: .1rem;
        li{
          margin-bottom: .2rem;
          i{
            display: inline-block;
            width: .5rem;
            height: .5rem;
            background-size: 100% auto;
            margin-right: .3rem
          }
          
          i,span{
            vertical-align: middle;
          }
        }
        :nth-child(1) i{
          background: url(@/assets/images/员工icon.png);
          background-size: contain;
        }
        :nth-child(2) i{
          background: url(@/assets/images/访客icon.png);
          background-size: contain;
        }
        :nth-child(3) i{
          background: url(@/assets/images/安保icon.png);
          background-size: contain;
        }
      };
      .form{
        padding-bottom: 1rem;
      }

    }
</style>