var queryTools = {
  InternetThings: undefined,//加载物联网设备
  znywLoc: undefined,//物联网设备url地址
  sxcx3dtitle: undefined,//贝尔园区url地址
  isClick: true,//点击次数
};
var viewer,handler,canvas,scene;


$(function () {
  // let osm = new Cesium.UrlTemplateImageryProvider({
  //     url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  // });
/*解决刷新报错问题*/
  jQuery.browser = {};
  (function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
      jQuery.browser.msie = true;
      jQuery.browser.version = RegExp.$1;
    }
  })();
  /*初始化加载配置 */
  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MTg3YzE3YS1iMDYwLTQzOTgtYjBlMy0zNGQ1YWFiYjUyYTUiLCJpZCI6MzU2MTYsImlhdCI6MTYwMjI5NDQyNn0.v2Vmni9Y3GmEpa__QXHBTcChOw2fzCuSuMsBz2UIGYg";

  viewer = new Cesium.Viewer("appDiv", {
    // imageryProvider: osm,
    infoBox: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=13c73c2f430e97a4e5b1f768bef733a0",
      layer: "tdtBasicLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
      show: false
    }),
    // terrainProvider : Cesium.createWorldTerrain()

    // terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
    //   url:
    //       "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
    // }),
    // imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
    //   url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    // }),
    // terrainProvider:Cesium.createWorldTerrain(),
  });
  //汉化时间  
  // initGlobel()

  /*解决抗锯齿 */
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio;
  }
  /*加载贝尔园区场景模型 */
  var tileset = new Cesium.Cesium3DTileset({
    url: "./Apps/3dtitle/贝尔园区场景模型/tileset.json",
  });
  tileset.readyPromise
    .then(function (tileset) {
      viewer.scene.primitives.add(tileset);
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
          0.0,
          -0.5,
          tileset.boundingSphere.radius * 2.0
        )
      );
      $.getJSON("./Apps/model/水面坐标.json", function (data) {
        var result = data;
        var o = [];
        for (var i = 0; i < result.length; i++) {
          for (var j = 0; j < result[i].length; j++) {
            if (j <= 1) {
              o.push((result[i][j] * 180) / Math.PI);
            } else {
              o.push(result[i][j]);
            }
          }
        }
        var primitive1 = new Cesium.Primitive(
          new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                  Cesium.Cartesian3.fromDegreesArrayHeights(o)
                ),
                height: 0.85,
                perPositionHeight: false,
              }),
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
              material: new Cesium.Material({
                fabric: {
                  type: "Water",
                  uniforms: {
                    normalMap: "./Apps/img/waterNormals.jpg",
                    frequency: 1000.0,
                    animationSpeed: 0.01,
                    amplitude: 10.0,
                  },
                },
              }),
              vertexShaderSource: `
        attribute vec3 position3DHigh;
        attribute vec3 position3DLow;
        attribute vec2 st;
        attribute float batchId;
        varying vec3 v_positionMC;
        varying vec3 v_positionEC;
        varying vec2 v_st;
        void main()
        {
            vec4 p = czm_computePosition();
            v_positionMC = position3DHigh + position3DLow;
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            v_st = st;
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
        }
        `,
              fragmentShaderSource: `
        varying vec3 v_positionMC;
        varying vec3 v_positionEC;
        varying vec2 v_st;
        void main()
        {
            czm_materialInput materialInput;
            vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));
            #ifdef FACE_FORWARD
                normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
            #endif
            materialInput.s = v_st.s;
            materialInput.st = v_st;
            materialInput.str = vec3(v_st, 0.0);
            materialInput.normalEC = normalEC;
            materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);
            vec3 positionToEyeEC = -v_positionEC;
            materialInput.positionToEyeEC = positionToEyeEC;
            czm_material material = czm_getMaterial(materialInput);
            #ifdef FLAT
                gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
            #else
                gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
            #endif
            gl_FragColor.a=0.7;
        }
        `,
            }),
            show: true,
          })
        );
        viewer.scene.primitives.add(primitive1);
      });

      getScript(['./Apps/js/app/mapCLick.js'], function () {});
      //添加管道
      // $.get("Apps/js/Pipeline/entityPipeline.js", function () {});

    })
    .otherwise(function (error) {
      console.log(error);
    });
  /*加载物联网设备 */
  queryTools.InternetThings = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({ url: "Apps/model/物联网设备/tileset.json" })
  );
  viewer.scene.primitives.add(queryTools.InternetThings);

  /*隐藏版权信息*/
  viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
  viewer.scene.skyAtmosphere.show = false; // 关闭大气层
  // viewer.scene.globe.depthTestAgainstTerrain=true;    // 地面以下不可见（高程遮挡）
  scene = viewer.scene;

  /*整体颜色变黑*/
  // var stages = viewer.scene.postProcessStages;
  // viewer.scene.brightness =  viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
  // viewer.scene.brightness.enabled = true;
  // viewer.scene.brightness.uniforms.brightness = Number(0.5);

  /*隐藏时间线控件*/
  viewer.timeline.container.style.display = "none"; //隐藏时间线控件

  /*加载dom元素*/
  docHTML();
  layui.use("form", function () {
    var form = layui.form;
  });
});

/*时间轴上显示 的转换*/
function timeFN() {
  var today_time = new Date(); // 获取当前时间
  let time2 = formatDate(today_time); // 时间转换

  function formatDate(datetime) {
    // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
    var year = datetime.getFullYear(),
      month = ("0" + (datetime.getMonth() + 1)).slice(-2),
      date = ("0" + datetime.getDate()).slice(-2),
      hour = ("0" + datetime.getHours()).slice(-2),
      minute = ("0" + datetime.getMinutes()).slice(-2),
      second = ("0" + datetime.getSeconds()).slice(-2);
    // 拼接
    $(".nav-time h1").text(hour + ":" + minute + ":" + second);
    $(".nav-time p").text(
      year + "-" + month + "-" + date + getWeek(year + "-" + month + "-" + date)
    );
  }
  setTimeout("timeFN();", 1000);
}
function getWeek(dateString) {
  var dateArray = dateString.split("-");
  var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
  return "星期" + "日一二三四五六".charAt(date.getDay());
}
function getScript(obj, callback) {
  var arr = obj,
      timeout,
      str = typeof obj === 'string';
  function add() {
    var script = document.createElement("script");
    header = document.getElementsByTagName("head")[0];
    script.src = str ? obj : arr[0];
    script.type = "text/javascript";
    if (str) {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback && callback();
          }
        };
      } else {
        script.onload = function () {
          callback && callback();
        };
      }
    } else {
      if (arr.length >= 1) {
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              arr.shift();
              timeout = setTimeout(add, 1);
            }
          };
        } else {
          script.onload = function () {
            arr.shift();
            timeout = setTimeout(add, 1);
          };
        }
      } else {
        clearTimeout(timeout);
        callback && callback();
      }
    }
    header.appendChild(script);
  }
  add();
}
/*加载页面上dom元素*/
function docHTML() {
  //添加首页加载元素\

  getScript(['./Apps/js/module/portal.js'], function () {
    $(document.body).append(portalHTML);
    PeopleChat();
    MoneyChat();
    MoveChat();
    MoveChatNum();
    // tab 切换
    $("#navigation  span").click(function () {
      if (queryTools.isClick) {
        popFloat.clearArrAll();
        queryTools.isClick = false;
        //事件
        var i = $(this).index(); //下标第一种写法
        let text = $(this).text();
        if (i === 1 || i === 2 || i === 3) {
          $(this).addClass("select").siblings().removeClass("select");
          $("#navigation  span:eq(0)").removeClass("select_first");
          $("#navigation  span:eq(4)").removeClass("select_last");
          viewer.entities.removeAll();
        } else if (i === 0) {
          $(this)
            .addClass("select_first")
            .removeClass("#navigation span:first-child");
          $(this).siblings().removeClass("select");
          $("#navigation  span:eq(4)").removeClass("select_last");
          viewer.entities.removeAll();
        } else {
          $(this)
            .addClass("select_last")
            .removeClass("#navigation span:last-child");
          $(this).siblings().removeClass("select");
          $("#navigation  span:eq(0)").removeClass("select_first");
          viewer.entities.removeAll();
        }
        switch (text) {
          case '平台首页':
            $(".ryjk").hide(1000);
            $(".ryjk_cx").hide();
            $(".smartYW").hide(1000);
            $("#spjk").hide(1000);
            $("#ptsy").show(1000);
            $("#jcgn").hide(1000);
            break;
          case '智能运维':
            $(".ryjk").hide(1000);
            $(".ryjk_cx").hide();
            $("#ptsy").hide(1000);
            $("#spjk").hide(1000);
            $(".smartYW").show(1000);
            $("#jcgn").hide(1000);
            //循环加载定位坐标显示
            popFloat.addPosCoord();
            break;
          case '视频监控':
            $(".ryjk").hide(1000);
            $(".ryjk_cx").hide();
            $("#ptsy").hide(1000);
            $(".smartYW").hide(1000);
            $("#spjk").show(1000);
            $("#jcgn").hide(1000);
            popFloat.addMonitor();
            break;
          case '人员监控':
            // var iframe = document.getElementById('mainFrame');
            // var ifr_document = iframe.contentWindow.document;
            // ifr_document.getElementsByClassName('ryjk')[0].style.display = "block";
            $(".ryjk").show(1000);
            $(".ryjk_cx").hide();
            $("#ptsy").hide(1000);
            $(".smartYW").hide(1000);
            $("#spjk").hide(1000);
            $("#jcgn").hide(1000);
            popFloat.addTrackPoint();
            break;
          case '基础功能':
            $(".ryjk").hide(1000);
            $(".ryjk_cx").hide();
            $("#ptsy").hide(1000);
            $(".smartYW").hide(1000);
            $("#spjk").hide(1000);
            $("#jcgn").show();
            break;
        }
        ViewTab(i);
        //定时器
        setTimeout(function () {
          queryTools.isClick = true;
        }, 1000); //一秒内不能重复点击
      } else {
        return false;
      }
    });
    $(".warn_bg").click(function () {
      //增加标注点
      popFloat.clearArrAll();
      ViewTab(5)
      popFloat.warnIcon();
    });
    $("#jcgn  span").click(function () {
      if (queryTools.isClick) {
        queryTools.isClick = false;
        //事件
        var i = $(this).index(); //下标第一种写法
        $(this).addClass("select_jcgn").siblings().removeClass("select_jcgn");
        popFloat.clearArrAll();
        //地图测量
        let measure = new Cesium.Measure(viewer)
        let clampToGround = true
        let text = $(this).text();
        switch (text) {
          case '地图书签':
            $("#funcSpan").text(name);
            $("#funcDiv").slideDown();
            addViewPointManagementHtml();
            break;
          case '属性查询':
            popFloat.Click3dtile();
            break;
          case '地图量算':
            measure.drawAreaMeasureGraphics({ clampToGround: clampToGround, callback: () => { } }); break;
            break;
          case '路径漫游':
            $("#funcSpan").text(name);
            $("#funcDiv").slideDown();
            // addViewFlyModeHtml();
            addViewFlyManagementHtml();
            break;
          case '通视分析':
            addlineSightHTML();
            break;
        }
        //定时器
        setTimeout(function () {
          queryTools.isClick = true;
        }, 1000); //一秒内不能重复点击
      } else {
        return false;
      }
    });
    /*天气配置*/
    WIDGET = {
      CONFIG: {
        layout: 1,
        width: "250",
        height: "130",
        background: 5,
        dataColor: "FFFFFF",
        aqiColor: "FFFFFF",
        borderRadius: 5,
        city: "CN101010100",
        modules: "10",
        key: "0d6676a68e4942d096584486878119b9",
      },
    };
    timeFN();
  });
  /*添加智能运维*/

  getScript(['./Apps/js/module/moreSmart.js'], function () {
    $(document.body).append(moreSmart);
  });
  /*添加视屏监控*/

  getScript(['./Apps/js/module/videoSurveillance.js'],function () {
    $(document.body).append(videoSurveillanceHtml);
    //视频播放
    var nextControl = new Super.NextControl(); // 实例化“下一个”按钮控件
    var Dbspeen = new Super.Dbspeen(); // 倍速控件
    var fullScreenControl = new Super.FullScreenControl(); // 实例化“全屏”控件
    var video = new Super.Svideo("videoContainer", {
      source: new Super.VideoSource({
        // 引入视频资源
        src:
          "./Apps/img/video/jiankongvideo.mp4",
      }),
      leftControls: [nextControl], // 控件栏左槽插入控件
      rightControls: [Dbspeen, fullScreenControl], // 控件栏右槽插入控件
    });
    video.addEventListener("change", (event) => {
      // 监听video各属性变化
      //  console.log(event)
    });
    nextControl.addEventListener("click", () => {
      // 监听“下一个”按钮控件点击事件
      alert("click next menu !!!");
    });
    fullScreenControl.addEventListener("fullscreen", () => {
      // 监听进入全屏
      console.log("is fullscreen !!!");
    });
    fullScreenControl.addEventListener("cancelfullscreen", () => {
      // 监听退出全屏
      console.log("cancel fullscreen !!!");
    });
    $(".close_monitor").click(function () {
      $(".monitorVideoPlay").hide();
      $(".PlayChoose").hide();
    });
  });

  /* 人员轨迹*/

  getScript(['./Apps/js/module/humanTrack.js'], function () {

    $(document.body).append(hunmanTrackHTML);
  });

  //iframe方式加载
  // $(document.body).append('<iframe src="./Apps/js/module/humanTrack.html" width="100%" height="100%" frameborder="no" border="0"  scrolling="no" allowtransparency="yes" style="position: absolute;top: 0; pointer-events: none;" id="mainFrame" ></iframe>');
  // document.getElementById('mainFrame').onload=function(){
  // }
}
