// Date formatting to a global form
function localeDateTimeFormatter(datetime, viewModel, ignoredate) {
    var julianDT = new Cesium.JulianDate();
    Cesium.JulianDate.addHours(datetime,8,julianDT)
    var gregorianDT= Cesium.JulianDate.toGregorianDate(julianDT)
    var objDT;
    if (ignoredate)
        objDT = '';
    else {
        objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day);
        objDT = gregorianDT.year  + '年' +objDT.toLocaleString("zh-cn", { month: "short" })+ gregorianDT.day + '日' ;
        if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
            return objDT;
        objDT += ' ';
    }
    return objDT + Cesium.sprintf("%02d:%02d:%02d", gregorianDT.hour, gregorianDT.minute, gregorianDT.second);
}

function localeTimeFormatter(time, viewModel) {
    return localeDateTimeFormatter(time, viewModel, true);
}
function initGlobel(){
    // 省略初始化.....
    // viewer.animation.viewModel.dateFormatter = DateTimeFormatter
    // viewer.animation.viewModel.timeFormatter = TimeFormatter
    // viewer.timeline.makeLabel = DateTimeFormatter
    //去除版权信息
    viewer._cesiumWidget._creditContainer.style.display = "none";

    viewer.animation.viewModel.dateFormatter = localeDateTimeFormatter
    viewer.animation.viewModel.timeFormatter = localeTimeFormatter
    viewer.timeline.makeLabel = function (time) { return localeDateTimeFormatter(time) }
}
function DateTimeFormatter(datetime, viewModel, ignoredate) {
    var julianDT = new Cesium.JulianDate()
    Cesium.JulianDate.addHours(datetime, 8, julianDT)
    var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT)
    var objDT
    if (ignoredate)
        objDT = ''
    else {
        objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day)
        objDT = gregorianDT.year + '年' + objDT.toLocaleString('zh-cn', { month: 'short' }) + gregorianDT.day + '日'
        if (viewModel || gregorianDT.hour + gregorianDT.minute === 0)
            return objDT
        objDT += ' '
    }
    return objDT + Cesium.sprintf('%02d:%02d:%02d', gregorianDT.hour, gregorianDT.minute, gregorianDT.second)
}

function TimeFormatter (time, viewModel) {
    return DateTimeFormatter(time, viewModel, true)
}

