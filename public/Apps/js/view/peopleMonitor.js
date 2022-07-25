function peopleTrack(i, t) {
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

    layui.use("laydate", function () {
      var laydate = layui.laydate;
      var time = data[0].clock.interval;
      var min = time.split("/")[0].replace("T", " ").replace("Z", "");
      var max = time.split("/")[1].replace("T", " ").replace("Z", "");

      //执行一个laydate实例
      laydate.render({
        elem: "#test1", //指定元素
        theme: "#393D49",
        type: "datetime",
        value: min,
        min: min,
        max: max,
      });
      laydate.render({
        elem: "#test1-1", //指定元素
        theme: "#393D49",
        type: "datetime",
        value: max,
        min: min,
        max: max,
      });
    });
    $(".ryjk_cx").show();
  });

  document.getElementById("cxbtn").onclick = function () {
    var aTime = $("#test1").val();
    var bTime = $("#test1-1").val();
    var startTime = aTime.replace(" ", "T") + "Z";
    var stopTime = bTime.replace(" ", "T") + "Z";
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601(startTime);
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(stopTime);
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
    viewer.clock.shouldAnimate = true;
  };
  // viewer.clock.shouldAnimate = true; // default
  // viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
  // viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
}

