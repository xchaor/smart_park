/*********************************
 * 作    者：RuiGIS
 * 创建日期：2018年12月18日‏‎14:21:33
 * 描    述：视点管理
 * 注意事项：
 * 修改日期：
 *********************************/

/*
The camera is defined by a position, orientation, and view frustum.
相机由位置、方向和视锥来定义。
The orientation forms an orthonormal basis with a view, up and right = view x up unit vectors.
方向形成了视图的正交基础，通过 view up 和 right，其中 right = view x up

指北参数参考
position    {x: -4.395467240252303e-11, y: 2.2283988352808098e-9, z: 36356752.31424518}
direction   {x: 5.579817758925759e-18, y: -2.828836780127022e-16, z: -1}
right   {x: -0.9998055233121945, y: -0.019720942026916058, z: -1.5638551148424355e-31}
up  {x: 0.019720942026916058, y: -0.9998055233121945, z: 2.8293870299449564e-16}
frustum = {
    aspectRatio:0.9544008483563097,
    far:10000000000,
    fov:1.0471975511965976,
    near:0.1,
    xOffset:0,
    yOffset:0,
}

frustum是默认视锥体定义，不变
发现只需要 position direction right up 可准确视角
*/
/*
视点数组
*/
var viewPointArray = [];
//cameraUse存储直接信息，camera存储方便数据库处理的格式
viewPointArray = [
    {
        "createDate": "2020-12-23 15:06:37",
        "guid": 1,
        "name": "主视角",
        "camera": [
            {
                "name": "position",
                "x": -2860332.749037736,
                "y": 4647974.354122533,
                "z": 3290120.167669924
            },
            {
                "name": "direction",
                "x": 0.2947832384593607,
                "y": 0.19010564717943956,
                "z": -0.9364628584380154
            },
            {
                "name": "up",
                "x": -0.3506891517221309,
                "y": 0.9331503028238961,
                "z": 0.07904195850359014
            },
            {
                "name": "right",
                "x": 3.55271191725529,
                "y": -0.5001288515567719,
                "z": 6.281832655417258
            }
        ],
        "cameraUse": {
            "1": {
                "x": 3.55271191725529,
                "y": -0.5001288515567719,
                "z": 6.281832655417258
            }
        }
    },
    {
        "createDate": "2020-12-23 15:06:51",
        "guid": 2,
        "name": "侧面",
        "camera": [
            {
                "name": "position",
                "x": -2860192.1590962117,
                "y": 4648348.298639654,
                "z": 3289536.0281834453
            },
            {
                "name": "direction",
                "x": -0.09421790120843149,
                "y": -0.7694742325961886,
                "z": 0.631690107934567
            },
            {
                "name": "up",
                "x": -0.47594888486792936,
                "y": 0.592118864664766,
                "z": 0.6502829454176722
            },
            {
                "name": "right",
                "x": 0.5149559225380482,
                "y": -0.19154098851179535,
                "z": 0.0014928513612790795
            }
        ],
        "cameraUse": {
            "2": {
                "x": 0.5149559225380482,
                "y": -0.19154098851179535,
                "z": 0.0014928513612790795
            }
        }
    },
    {
        "createDate": "2020-12-23 15:07:28",
        "guid": 3,
        "name": "门口",
        "camera": [
            {
                "name": "position",
                "x": -2860232.48757479,
                "y": 4648003.604541197,
                "z": 3289812.1003417834
            },
            {
                "name": "direction",
                "x": 0.7982267854889015,
                "y": 0.5728173909030784,
                "z": -0.1863175665551836
            },
            {
                "name": "up",
                "x": -0.41986558609838315,
                "y": 0.7508974833696297,
                "z": 0.5097703983946282
            },
            {
                "name": "right",
                "x": 4.515643893101931,
                "y": -0.03724883677001589,
                "z": 6.280266325819543
            }
        ],
        "cameraUse": {
            "3": {
                "x": 4.515643893101931,
                "y": -0.03724883677001589,
                "z": 6.280266325819543
            }
        }
    },
    {
        "createDate": "2020-12-23 15:08:36",
        "guid": 4,
        "name": "鸟瞰",
        "camera": [
            {
                "name": "position",
                "x": -2860497.2597352625,
                "y": 4648447.425231509,
                "z": 3290077.3903143983
            },
            {
                "name": "direction",
                "x": 0.4451647192229298,
                "y": -0.7263594806702818,
                "z": -0.5236700083063464
            },
            {
                "name": "up",
                "x": -0.419364417040824,
                "y": 0.3475988406619264,
                "z": -0.8386349215782126
            },
            {
                "name": "right",
                "x": 2.9656975736031534,
                "y": -1.5648814800150528,
                "z": 0
            }
        ],
        "cameraUse": {
            "4": {
                "x": 2.9656975736031534,
                "y": -1.5648814800150528,
                "z": 0
            }
        }
    },
    {
        "createDate": "2020-12-23 15:08:43",
        "guid": 5,
        "name": "水面",
        "camera": [
            {
                "name": "position",
                "x": -2860296.457439772,
                "y": 4648051.177703553,
                "z": 3289866.3079465386
            },
            {
                "name": "direction",
                "x": 0.43362494288891934,
                "y": -0.7190519770470459,
                "z": -0.5430779531607925
            },
            {
                "name": "up",
                "x": -0.4751825524551617,
                "y": 0.32960463725885003,
                "z": -0.8158200322005212
            },
            {
                "name": "right",
                "x": 2.9074042219801437,
                "y": -1.541154343648293,
                "z": 0
            }
        ],
        "cameraUse": {
            "5": {
                "x": 2.9074042219801437,
                "y": -1.541154343648293,
                "z": 0
            }
        }
    }
]

var defaultPageSize = 15;    //默认页码条目数

//初始化书签管理页面内容
function addViewPointManagementHtml() {
    var htmlStr = '';
    htmlStr=htmlStr+" <div class=\"zz_bg_right\">";
    htmlStr=htmlStr+"<div class=\"mapBookMask\" style='pointer-events: painted;'>";
    htmlStr=htmlStr+"	<div class=\"plcH4\" style='margin-top: 30px;'>";
    htmlStr=htmlStr+"		<h4>地图书签</h4>";
    htmlStr=htmlStr+"		<p>MAP BOOKMARK</p>";
    htmlStr=htmlStr+"		<img src=\"./Apps/img/人员统计.png\" alt=\"\">";
    htmlStr=htmlStr+"	</div>";
    htmlStr=htmlStr+"	<div class=\"addBookMask\">";
    htmlStr=htmlStr+"		<h5>视点名称：</h5>";
    htmlStr=htmlStr+"		<div style=\"margin-left: 10px;float: left\">";
    htmlStr=htmlStr+"			<input type=\"text\" name=\"title\"  id=\"pointName\"  lay-verify=\"title\" autocomplete=\"off\" placeholder=\"请输入视点名称\" class=\"layui-input\" style=\"height: 40px;\">";
    htmlStr=htmlStr+"		</div>";
    htmlStr=htmlStr+"		<div class=\"addBookBtn\">";
    htmlStr=htmlStr+"			<img src=\"./Apps/img/jcgn/圆角矩形 1 拷贝.png\" alt=\"\">";
    htmlStr=htmlStr+"			<p id=\"addViewPointBtn\">新建书签</p>";
    htmlStr=htmlStr+"		</div>";
    htmlStr=htmlStr+"	</div>";
    htmlStr=htmlStr+"</div>";
    htmlStr=htmlStr+"</div>";

    //htmlStr += '</div><div style="width: 95%;height: 500px;margin-top: 10px; background-color: #EFEFEF; color: black;">';
    htmlStr += '<div id="tableDiv" class="_tableDiv"  style=""><table id="viewPointTable"></table></div>';
    //清空功能面板
    $("#funcContent").empty();
    //初始化面板内容
    $(htmlStr).appendTo("#funcContent");

    //表单初始化
    initViewPointGrid();
    //获取所有条目信息
    getAllViewPoints("");
    //添加第一页表单数据
    loadViewPointGrid(viewPointArray, 1, defaultPageSize);

    //查询按钮
    $("#searchViewPointBtn").click(function(e) {
        var pointName = $("#pointName").val().trim();
        if(pointName == "" || pointName == null){
            loadViewPointGrid(viewPointArray, 1, defaultPageSize);
        }
        else{
            var filterviewPointArray = [];
            for(var i=0;i<viewPointArray.length;i++){
                if(viewPointArray[i].name.indexOf(pointName)!=-1){
                    filterviewPointArray.push(viewPointArray[i])
                }
            }
            $("#pointName").val("");
            loadViewPointGrid(filterviewPointArray, 1, defaultPageSize);
        }
    });


    //添加按钮
    $("#addViewPointBtn").click(function(e) {
        var pointName = $("#pointName").val().trim();
        if(pointName == "" || pointName == null){
            //sAlert("错误提示", "添加视点时视点名称需要非空且不重复！");
            //return;
            pointName = "未命名视点";
        }

        var d = new Date();
        var viewPointData = {
            "createDate":formatDate(d),
            "guid":viewPointArray.length+1,
            "name":pointName,
            "camera":[
                {"name":"position", x:viewer.camera.position.x , y:viewer.camera.position.y , z:viewer.camera.position.z },
                {"name":"direction", x:viewer.camera.direction.x , y:viewer.camera.direction.y , z:viewer.camera.direction.z},
                {"name":"up", x:viewer.camera.up.x , y:viewer.camera.up.y , z:viewer.camera.up.z },
                {"name":"right", x:viewer.camera.heading , y:viewer.camera.pitch , z:viewer.camera.roll}
            ]
        }
            viewPointArray.push(viewPointData)
            $("#pointName").val("");
            getAllViewPoints("");
            //重载表单数据
            loadViewPointGrid(viewPointArray, 1, defaultPageSize);
        //}
    });
}


/*获取所有视点*/
function getAllViewPoints(name){
    for(var i=0;i<viewPointArray.length;i++){
        var cameraUse={};
        for(var j=0;j<Object.values(viewPointArray[i].camera).length;j++){
            cameraUse[viewPointArray[i].guid] = {x:Object.values(viewPointArray[i].camera)[j].x ,y:Object.values(viewPointArray[i].camera)[j].y ,z:Object.values(viewPointArray[i].camera)[j].z };
        }
        viewPointArray[i].cameraUse = cameraUse;
    }
}


/*表单初始化*/
function initViewPointGrid(){
    $("#viewPointTable").datagrid({
        width: 500,
        // rownumbers: true,
        singleSelect: true,
        fitColumns:true,//宽度自适应
        pagination: false,
        nowrap:false,//允许换行
        columns: [[
            {
                field: 'guid',
                title: '序号',
                align: 'center',
                width: 40
            },
            {
                field: 'name',
                title: '名称',
                align: 'center',
                width: 100
            }, {
                field: 'createDate',
                // field: 'createTime',
                title: '创建时间',
                align: 'center',
                width: 120
            }, {
                title: '操作',
                align: 'center',
                field:'cz',
                width: 40,
                formatter:function(value,row,index){
                    return "<img style='margin-right: 10px'   width='' onclick='renameViewPointBtn(&apos;" + JSON.stringify(row) + "&apos;)' height='' src='./Apps/img/jcgn/图层%2038.png'>" +
                        "<img   width='' height='' onclick='deleteViewPointBtn(&apos;" + JSON.stringify(row) + "&apos;)' src='./Apps/img/jcgn/图层%2039.png'>" ;
                }
            }
         ]],
        onRowContextMenu: function(e, rowIndex, rowData) {
            e.preventDefault(); // 禁止右键菜单
        },
        //双击定位
        onDblClickRow: function(rowIndex, rowData) {
            flyToPoint(rowData);
            //console.log(viewPointArray[0])
        }
    });
}

//删除按钮
function deleteViewPointBtn(row) {deleteViewPointBtn
    //判断是否选中行
    if (row){
        for(var i = 0; i < viewPointArray.length; i++) {
            if (JSON.stringify(viewPointArray[i]) ===row) {
                viewPointArray.splice(i, 1);
            }
        }
        getAllViewPoints("");
        //重载表单数据
        loadViewPointGrid(viewPointArray, 1, defaultPageSize);
    }
    else{
        sAlert("错误提示", "请先选中需要编辑的视点条目！");
    }
};

//更名按钮
function renameViewPointBtn(row) {
    //判断是否选中行
    if (row){
        var pointName = $("#pointName").val().trim();
        var index;
        for(var i = 0; i < viewPointArray.length; i++) {
            if (JSON.stringify(viewPointArray[i]) ===row) {
                index =i
                viewPointArray[i].name = pointName;
            }
        }
        if(pointName == "" || pointName == null){
            viewPointArray[index].name = '未命名视点';
        }
        $("#pointName").val("");
        //sAlert("提示", "视点名称更新成功！");
        getAllViewPoints("");
        //重载表单数据
        loadViewPointGrid(viewPointArray, 1, defaultPageSize);
        //}
    }
    else{
        sAlert("错误提示", "请先选中需要编辑的视点条目！");
    }
};

/*相机设置到该点*/
function flyToPoint(rowData){
    viewer.camera.flyTo({
        destination : {x:rowData.camera[0].x, y:rowData.camera[0].y, z:rowData.camera[0].z},
        orientation : {
            heading : rowData.camera[3].x,
            pitch :rowData.camera[3].y,
            roll :rowData.camera[3].z
        }
    });
}
/*
数据填充
总体数据集合、当前页码、每页条目数
*/
function loadViewPointGrid(data, pageNum, pageSize) {
    if(data==null||data.length==0){
        $("#tableDiv").hide();
        return;
    }
    else{

        if($("#tableDiv").is(":hidden")==true){
           $("#tableDiv").show();
        }
    }
    //var pn = pageNum || 1;
    //var ps = pageSize || tblPageSize;
    $("#viewPointTable").datagrid('loading');
    if (data == null) {
        $("#viewPointTable").datagrid('loadData', {
            total: 0,
            rows: []
        });
    } else {
        //实际当页加载的数据
        var thisDate = [];
        //考虑最后一页是否满载
        var lastNum = data.length;
        if(lastNum > pageNum*pageSize) lastNum = pageNum*pageSize;
        for(var i=(pageNum-1)*pageSize;i<lastNum;i++){
            thisDate.push(data[i])
        }
        $("#viewPointTable").datagrid('loadData', {
            total: thisDate.length,
            rows: thisDate
        });
    }

    $("#viewPointTable").datagrid('loaded');
    $("#viewPointTable").datagrid('getPager').pagination('loaded');

    //分页机制
    var p = $("#viewPointTable").datagrid('getPager');
    p.pagination({
        total: data.length, //总的记录数
        pageSize: defaultPageSize, //每页显示的大小
        showPageList: false,
        showRefresh: false,
        beforePageText: '',
        afterPageText: '/{pages}',
        displayMsg: '',
        onSelectPage: function(pageNumber, pageSize) {
            loadViewPointGrid(data, pageNumber, pageSize);
        }
    });
};

//日期格式转为日期标准字符串：2018-11-30 00:00:00
function formatDate(nd){
    var y = nd.getFullYear();
    var m = nd.getMonth()+1;
    var d = nd.getDate();
    var hh = nd.getHours();
    var mm = nd.getMinutes();
    var ss = nd.getSeconds();
    if(m <= 9) m = "0"+m;
    if(d <= 9) d = "0"+d;
    if(hh<= 9) hh = "0"+hh;
    if(mm<= 9) mm = "0"+mm;
    if(ss<= 9) ss = "0"+ss;
    var date = y+"-"+m+"-"+d+" "+hh+":"+mm+":"+ss;    //结束时间 2016-04-07 13:34:15
    return date;
}

export default flyToPoint
