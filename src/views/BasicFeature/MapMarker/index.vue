<template>
  <div class="main_container">
    <h4 class="title">地图书签 MAP BOOKMARK</h4>
    <div class="createMarker">
        <label for="viewSpot">视点名称</label><input id="viewSpot"  type="text" placeholder="请输入视点名称" v-model="viewPointName"><button @click="add(viewPointName)">+新建书签</button>
    </div>
    <div class="markerTable">
        <table>
            <thead>
                <tr>
                    <th>序号</th> <th>名称</th> <th>创建时间</th> <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in viewPointArray" :key="index"  >
                    <td @click="flyTo(item)">{{item.guid}}</td> 
                    <td @click="flyTo(item)">{{item.name}}</td> 
                    <td @click="flyTo(item)">{{item.createDate}}</td> 
                    <td>
                        <div class="icons">
                            <img src="@/assets/images/editicon.png" alt="" @click="renameViewPointBtn(viewPointName,item.createDate)">
                            <img src="@/assets/images/deleteicon.png" alt="" @click="deleteViewPointBtn(item.createDate)">
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script>
import flyToPoint from '@/js/view/viewPointManagement'
export default {
    data() {
        return {
            viewPointArray : [
                {
                    "createDate": "2022-07-02 15:06:37",
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
                    "createDate": "2022-07-03 15:06:51",
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
                    "createDate": "2022-07-05 15:07:28",
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
                    "createDate": "2022-07-05 15:08:36",
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
            ],
            viewPointName:''
        }
    },
    mounted() {
        
    },
    methods: {
        flyTo(data){
            flyToPoint(data)
        },
        add(pointName){
            if(pointName == "" || pointName == null){
                pointName = "未命名视点";
            }
            const viewPointData={
                "createDate":this.formatDate(new Date()),
                // "createDate":"2020-12-23 15:06:37",
                "guid":this.viewPointArray.length+1,
                "name":pointName,
                "camera":[
                    {"name":"position", x:viewer.camera.position.x , y:viewer.camera.position.y , z:viewer.camera.position.z },
                    {"name":"direction", x:viewer.camera.direction.x , y:viewer.camera.direction.y , z:viewer.camera.direction.z},
                    {"name":"up", x:viewer.camera.up.x , y:viewer.camera.up.y , z:viewer.camera.up.z },
                    {"name":"right", x:viewer.camera.heading , y:viewer.camera.pitch , z:viewer.camera.roll}
                ]
            }
            this.viewPointArray.push(viewPointData)
            this.viewPointName=''
        },
        //日期格式转为日期标准字符串：2018-11-30 00:00:00
        formatDate(nd){
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
        },
        deleteViewPointBtn(createDate){
            if(confirm('是否确定删除此视点')){
                this.viewPointArray=this.viewPointArray.filter((viewPoint)=>{
                    return viewPoint.createDate !==createDate
                })
            }
        },
        renameViewPointBtn(newPointName,createDate){
            if(newPointName == "" || newPointName == null){
                newPointName = "未命名视点";
            }
            for(var i = 0; i < this.viewPointArray.length; i++) {
            if (this.viewPointArray[i].createDate ===createDate) {
                this.viewPointArray[i].name = newPointName;
            }
            this.viewPointName=''
        }
        }
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
        .createMarker{
            display: grid;
            grid-template-columns: 1fr 1.5fr 1fr;
            font-size: .4rem;
            padding: .2rem;
            label{
                vertical-align: middle;
            }
            input{
                border: 1px solid #0078FF;
                background-color: rgba(1, 1, 1, .2);
                border-radius: 0;
            }
            button{
                background-color: #0078FF;
            }
            label,button{
                text-align: center;
            }
        }
        .markerTable{
            font-size: .2667rem;
            padding-bottom: 2rem;
            table{
                border-collapse: collapse;
                border-spacing: 0;
                width: 100%;
                text-align: center;
                tr{
                    height: .7rem;
                }
                thead{
                    background-color: rgba(37,139,255,.5);
                }
                tbody tr{
                    border-bottom: 1px solid rgb(37,139,255);
                    .icons{
                        display: flex;
                        justify-content:space-around ;
                    }
                } 
            }
        }
    }
</style>