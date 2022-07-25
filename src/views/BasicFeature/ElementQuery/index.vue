<template>
  <div class="main_container">
    <h4 class="title">属性查询 ATTRIBUTE QUERY </h4>
    <div class="tag">
      点击地图开始查询属性
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
    mounted() {
      this.Click3dtile(),
      this.clickHandler()
    },
    methods: {
      Click3dtile(){
        queryTools.sxcx3dtitle="/apps/3dtitle/贝尔园区场景模型/"
      },
      clickHandler(){
        //弹窗初始化
        shapeEditMenu.style = `
          position:absolute;
          left:-24px;
          top:38px;
          width:170px;
          height:90px;
          background:#153251;
          font-size:10px;
          padding:5px;
          border:1px solid #0976C1`
          ;
        shapeEditMenu.style.display = "none";
        const that=this
        // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (click){
          const pickingEntity=viewer.scene.pick(click.position);
          console.log(pickingEntity);
          if (pickingEntity !== undefined){
            if(pickingEntity.tileset!==undefined){
              //点击智能运维3dtile模型时调用editHandlerSmart()
              if(pickingEntity.tileset._basePath === queryTools.sxcx3dtitle){
                //  第一种方式
                var pick1 = new Cesium.Cartesian2(
                  click.position.x,
                  click.position.y
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
                var ellipsoid = viewer.scene.globe.ellipsoid;
                var height = ellipsoid.cartesianToCartographic(viewer.camera.position)
                  .height;
                that.editHandler3dtitle(
                  click.position.x - 318,
                  click.position.y - 242,
                  lon,
                  lat,
                  height,
                  click.position.x,
                  click.position.y
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
                //蓝色
                // pickingEntity.color = Cesium.Color.fromBytes(124,167,233, 255);
                
              }
            }
          }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK)
        console.log("点击处理clickHandler()被调用");
      },  
      editHandler3dtitle(x, y, lon, lat, height,mx,my) {
        const that=this
        const cesiumContainer=document.querySelector("#cesiumContainer")
        cesiumContainer.appendChild(shapeEditMenu)
        console.log();
        shapeEditMenu.style.display = "block";
        shapeEditMenu.style.left = x + "px";
        shapeEditMenu.style.top = y + "px";
        that.editHandler3dtitleHtml(shapeEditMenu, lon, lat, height);
        /* 监听试试鼠标拖动*/
        var pick= new Cesium.Cartesian2(mx,my);
        var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
        var setPosition = function (cartesian) {
        var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,cartesian)
          var left =position.x- shapeEditMenu.offsetWidth;
          var top =position.y- shapeEditMenu.offsetHeight;
          shapeEditMenu.style.left=   left + "px";
          shapeEditMenu.style.top=   top + "px";
        };
        viewer.scene.postRender.addEventListener(function () {
          setPosition(cartesian)
        });
      },
      editHandler3dtitleHtml: function (shapeEditMenu, lon, lat, height) {
        console.log("公告牌被调用");
        var strNum2 =
          '<div class="SxcxBg">\n' +
          '\t<div class="redBg_title">\n' +
          "\t\t属性信息\n" +
          "\t</div>\n" +
          "\t\t<p>经度：" +
          lon +
          "</p>\n" +
          "\t\t<p>纬度：" +
          lat +
          "</p>\n" +
          "\t\t<p>高度：" +
          height.toFixed(2) +
          "米</p>\n" +
          "\t\t<p>ID：" +
          viewer.selectedEntity.name +
          "</p>\n" +
          "\t</div>\n" +
          "</div>";
        shapeEditMenu.innerHTML = strNum2;
      },
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
    .tag{
      font-size: .7rem;
    }
  }
</style>