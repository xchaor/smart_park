var popFloat = {
  attributesArr: undefined, // 智能运维
  warnNote: undefined, // 告警等级
  monitorArr: undefined, // 摄像头
  trackArr: undefined, //人员轨迹
  //循环加载智能告警
  warnIcon: function () {
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
  },
  // 告警等级
  editWranLeverHtml: function (x, y, index) {
    var shapeEditMenu = document.getElementById("warningDiv");
    shapeEditMenu.style.display = "block";
    shapeEditMenu.style.left = x + "px";
    shapeEditMenu.style.top = y + "px";
    popFloat.showWranLeverHtml(shapeEditMenu, index);
  },
  //获取NAME 遍历查询 告警等级
  showWranLeverHtml: function (shapeEditMenu, index) {
    var objTable = popFloat.warnNote[index];
    var start = objTable.properties.TIMESTART;
    var end = objTable.properties.TIMEEND;
    var cx = $.JTime.DateToTamp(end) - $.JTime.DateToTamp(start);
    var time = popFloat.formatSecond(cx);

    var strNum2 =
      '<div class="redBg">\n' +
      '\t<div class="redBg_title">\n' +
      "\t\t告警等级\n" +
      "\t</div>\n" +
      '\t<div class="redCont">\n' +
      "\t\t<span>告警等级：" +
      objTable.properties.LEVEL +
      "</span>\n" +
      "\t\t<span>告警信息：" +
      objTable.properties.NAME +
      "</span>\n" +
      "\t\t<span>告警开始时间：" +
      objTable.properties.TIMESTART +
      "</span>\n" +
      "\t\t<span>告警结束时间：" +
      objTable.properties.TIMEEND +
      "</span>\n" +
      "\t\t<span>告警持续时间：" +
      time.days +
      "天-" +
      time.hours +
      "小时-" +
      time.minutes +
      "分钟-" +
      time.seconds +
      "秒</span>\n" +
      "\t</div>\n" +
      "</div>";
    shapeEditMenu.innerHTML = strNum2;
  },
  // 智能告警 广告牌样式
  showBillboardWranLever: function (x, y, index) {
    var pick1 = new Cesium.Cartesian2(x, y);
    var cartesian = viewer.scene.globe.pick(
      viewer.camera.getPickRay(pick1),
      viewer.scene
    );
    var result = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    //  在这个里面调用生成字段的方法
    // viewer.selectedEntity.name

    var objTable = popFloat.warnNote[index];
    var start = objTable.properties.TIMESTART;
    var end = objTable.properties.TIMEEND;
    var cx = $.JTime.DateToTamp(end) - $.JTime.DateToTamp(start);
    var time = popFloat.formatSecond(cx);
    new Cesium.CesiumWallBillboard({
      viewer: viewer,
      center: {
        // 广告牌中心点
        longitude: objTable.geometry.coordinates[0],
        latitude: objTable.geometry.coordinates[1],
        height: objTable.geometry.coordinates[2],
      },
      width: 6, // 广告牌宽度
      height: 4, // 广告牌高度
      rotate: 180, // 正北顺时针角度
      content: `
            <style>
                .border-box{padding: 5px;width:calc(100% - 14px);height:calc(100% - 14px);background: rgba(1, 19, 67, 0.4);border: 2px solid rgb(0, 161, 255);border-radius: 8px;font-size: 12px;color: white;}
                .border-box::before {position: absolute;top: -2px;bottom: -2px;left: 2px;width: calc(100% - 4px);content: "";border-top: 2px solid rgb(1, 104, 134);border-bottom: 2px solid rgb(1, 104, 134);z-index: 0;}
                .border-box::after {position: absolute;top: 2px;right: -2px;left: -2px;height: calc(100% - 4px);content: "";border-right: 2px solid rgb(1, 104, 134);border-left: 2px solid rgb(1, 104, 134);z-index: 0;}
            </style>
        <div class="border-box">
            <div>告警等级：${objTable.properties.LEVEL}</div>
            <div>告警信息：${objTable.properties.NAME}</div>
            <div>告警开始时间：${objTable.properties.TIMESTART}</div>
            <div>告警结束时间：${objTable.properties.TIMEEND}</div>
            <div>告警持续时间：${time.days}天-${time.hours}小时-${time.minutes}分钟-${time.seconds}秒</div>
        </div>`,
    });
  },
  //循环加载定位坐标显示  智能运维
  addPosCoord: function () {
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
      } else if (typeIcon === "ludeng") {
        image.src = "./Apps/img/图层 42.png";
      } else if (typeIcon === "dici") {
        image.src = "./Apps/img/图层 44.png";
      } else if (typeIcon === "lajitong") {
        image.src = "./Apps/img/图层 45.png";
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
        id: value.type,
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
  // 广告牌样式
  showBillboardDevice: function (x, y) {
    var pick1 = new Cesium.Cartesian2(x, y);
    var cartesian = viewer.scene.globe.pick(
      viewer.camera.getPickRay(pick1),
      viewer.scene
    );
    var result = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    //  在这个里面调用生成字段的方法
    // viewer.selectedEntity.name
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
      new Cesium.CesiumWallBillboard({
        viewer: viewer,
        center: {
          // 广告牌中心点
          longitude: (result.longitude * 180) / Math.PI,
          latitude: (result.latitude * 180) / Math.PI,
          height: result.height + 5.1,
        },
        width: 7, // 广告牌宽度
        height: 5, // 广告牌高度
        rotate: 180, // 正北顺时针角度
        content: `
            <style>
                .border-box{padding: 5px;width:calc(100% - 14px);height:calc(100% - 14px);background: url("../../img/圆角矩形 8.png");;border: 2px solid rgb(0, 161, 255);border-radius: 8px;font-size: 12px;color: white;}
                .border-box::before {position: absolute;top: -2px;bottom: -2px;left: 2px;width: calc(100% - 4px);content: "";border-top: 2px solid rgb(1, 104, 134);border-bottom: 2px solid rgb(1, 104, 134);z-index: 0;}
                .border-box::after {position: absolute;top: 2px;right: -2px;left: -2px;height: calc(100% - 4px);content: "";border-right: 2px solid rgb(1, 104, 134);border-left: 2px solid rgb(1, 104, 134);z-index: 0;}
            </style>
        <div class="border-box">
            <div>设备识别码：${objTable.imei}</div>
            <div>设备类型：${objTable.equipmentType}</div>
            <div>事件编号：${objTable.eventId}</div>
            <div>事件名称：${objTable.eventName}</div>
            <div>详情编号：${objTable.eventDetailId}</div>
            <div>设备编号：${objTable.equipmentId}</div>
            <div>设备名称：${objTable.equipmentName}</div>
            <div>设备地址：${objTable.address}</div>
            <div>上报时间：${objTable.reportTime}</div>
        </div>`,
      });
    });
  },
  //   智能运维
  editHandlerSmart: function (x, y) {
    var shapeEditMenu = document.getElementById("apparatusDiv");
    shapeEditMenu.style.display = "block";
    shapeEditMenu.style.left = x + "px";
    shapeEditMenu.style.top = y + "px";
    popFloat.editHandlerSmartHtml(shapeEditMenu);
  },
  //获取NAME 遍历查询 智能运维
  editHandlerSmartHtml: function (shapeEditMenu) {
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
        "\t\t<span> 设备识别码：" +
        objTable.imei +
        "</span>\n" +
        "\t\t<span> \t\t设备类型：" +
        objTable.equipmentType +
        "</span>\n" +
        "\t\t<span> \t\t事件编号：" +
        objTable.eventId +
        "</span>\n" +
        "\t\t<span> \t\t事件名称：" +
        objTable.eventName +
        "</span>\n" +
        "\t\t<span> \t\t详情编号：" +
        objTable.equipmentId +
        "</span>\n" +
        "\t\t<span> \t\t设备名称：" +
        objTable.equipmentName +
        "</span>\n" +
        "\t\t<span> \t\t设备地址：" +
        objTable.address +
        "</span>\n" +
        "\t\t<span> \t\t上报时间：" +
        objTable.reportTime +
        "</span>\n" +
        "\t</div>";
      shapeEditMenu.innerHTML = textContent;
    });
  },
  //秒转换
  formatSecond: function (second) {
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
  // 摄像头
  addMonitor: function () {
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
  },
  //摄像头  选中移除逻辑
  checkMapMonitor: function (index) {
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
  },
  //告警 选中移除
  checkWarn: function (index) {
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
  //循环加载人员轨迹
  addTrackPoint: function () {
    var fileNum = 10;
    popFloat.trackArr = [];
    for (var i = 1; i <= fileNum; i++) {
      var url = "./Apps/model/czml/巡检路线" + i + ".json";
      $.getJSON(url, function (data) {
        var trackArrResult = data[1].position.cartographicDegrees;
        popFloat.trackArr.push(trackArrResult);
        // for(var i=0;i<trackArrResult.length;i+=4){
        //     popFloat.trackArr.push(trackArrResult.slice(i,i+4));
        // }
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
  // 人员轨迹 选中移除逻辑
  checkTrack: function (index) {
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
  // 历史轨迹样式
  editHandlerTrack: function (x, y, index, type) {
    var trackArrResult = popFloat.trackArr[Number(index) - 1];
    var vote = {};
    vote.lon = trackArrResult[1];
    vote.lat = trackArrResult[2];
    // var shapeEditMenu  = document.getElementById('mainFrame').contentWindow.document.getElementById('trackDiv')
    var shapeEditMenu = document.getElementById("trackDiv");
    shapeEditMenu.style.display = "block";
    shapeEditMenu.style.left = x + "px";
    shapeEditMenu.style.top = y + "px";
    shapeEditMenu.onclick = function () {
      //加入人员轨迹
      // var radar = viewer.entities.getById('track'+'_'+mapClick.NumberArr[1]+'_'+mapClick.professionArr[1]);
      viewer.entities.removeAll();
      shapeEditMenu.style.display = "none";
      peopleTrack(Number(index), type);
    };
    popFloat.editHandlerTrackHtml(shapeEditMenu);
  },
  //历史轨迹显示
  editHandlerTrackHtml: function (shapeEditMenu) {
    var strNum3 =
      '\t<div class="lsgj">\n' +
      '\t\t<div class="lsgj_Billboard">\n' +
      '\t\t\t<img src="./Apps/img/rwjk/组 2.png" alt="">\n' +
      "\t\t\t<h5>历史轨迹</h5>\n" +
      "\t\t</div>\n" +
      "\t</div>";
    shapeEditMenu.innerHTML = strNum3;
  },
  // 使用tab切换进行清空
  clearArrAll: function () {
    if (popFloat !== undefined) {
      popFloat.attributesArr = undefined;
      popFloat.warnNote = undefined;
      popFloat.monitorArr = undefined;
      popFloat.trackArr = undefined;
    }
    queryTools.znywLoc = undefined;
    queryTools.sxcx3dtitle = undefined;
    mapClick.czlArr = [];
    mapClick.warnArr = [];
    mapClick.NumberArr = [];
    mapClick.professionArr = [];
    $(".PlayChoose").hide();
    viewer.dataSources.removeAll();
    viewer.trackedEntity = undefined;
    viewer.entities.removeAll();
    //释放鼠标事件
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    document.getElementById("appDiv").style.cursor = "auto";
    ClearDis();
    var shapeEditMenuNum5 = document.getElementById("analysisConDiv");
    shapeEditMenuNum5.style.display = "none";
    $("#funcDiv").hide();
  },
  // 属性查询tab
  Click3dtile: function () {
    queryTools.sxcx3dtitle = "Apps/3dtitle/贝尔园区场景模型/";
  },
  editHandler3dtitle: function (x, y, lon, lat, height,mx,my) {
    var shapeEditMenu = document.getElementById("attributesDiv");
    shapeEditMenu.style.display = "block";
    shapeEditMenu.style.left = x + "px";
    shapeEditMenu.style.top = y + "px";
    popFloat.editHandler3dtitleHtml(shapeEditMenu, lon, lat, height);
    /* 监听试试鼠标拖动*/
    // var pick= new Cesium.Cartesian2(mx,my);
    // var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
    // var setPosition = function (cartesian) {
    // var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,cartesian)
    //   var left =position.x- shapeEditMenu.offsetWidth;
    //   var top =position.y- shapeEditMenu.offsetHeight;
    //   shapeEditMenu.style.left=   left + "px";
    //   shapeEditMenu.style.top=   top + "px";
    // };
    // viewer.scene.postRender.addEventListener(function () {
    //   setPosition(cartesian)
    // });
  },
  //获取NAME 遍历查询 告警等级
  editHandler3dtitleHtml: function (shapeEditMenu, lon, lat, height) {
    var strNum2 =
      '<div class="SxcxBg">\n' +
      '\t<div class="redBg_title">\n' +
      "\t\t属性信息\n" +
      "\t</div>\n" +
      '\t<div class="redCont"style="margin-top: 15px;">\n' +
      "\t\t<span>经度：" +
      lon +
      "</span>\n" +
      "\t\t<span>纬度：" +
      lat +
      "</span>\n" +
      "\t\t<span>高度：" +
      height.toFixed(2) +
      "米</span>\n" +
      "\t\t<span>ID：" +
      viewer.selectedEntity.name +
      "</span>\n" +
      "\t</div>\n" +
      "</div>";
    shapeEditMenu.innerHTML = strNum2;
  },
};
