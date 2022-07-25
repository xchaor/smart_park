<template>
    <div class="main_container">
            <h4 class="title">车辆统计 VEHICLE STATISTICS</h4>
            <div class="chart">
                <div class="parking">
                    <div class="left">
                        <i></i><span>已停车辆数量</span>
                    </div>
                    <div class="right">
                        <span>{{getVehicleSum}}</span>
                        <span>{{vehicleCount.parkingSpots}}</span>
                    </div>
                </div>
                <div class='vehicles'>
                    <div>{{'剩余车位数\n'+getExtraParks}}</div>
                    <div>{{'员工车辆数\n'+vehicleCount.staffVehicle}}</div>
                    <div>{{'访客车位数\n'+vehicleCount.visitorVehicle}}</div>
                </div>
        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            vehicleCount:{
                parkingSpots:4210,
                staffVehicle:2010,
                visitorVehicle:298
            }
        }
    },
    computed:{
        getVehicleSum(){
            return this.vehicleCount.staffVehicle+this.vehicleCount.visitorVehicle
        },
        getExtraParks(){
            return this.vehicleCount.parkingSpots-this.vehicleCount.staffVehicle-this.vehicleCount.visitorVehicle
        }
    }
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
        .parking{
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: .2rem .5rem;
            height: 1.5rem;
            background:linear-gradient(rgba(0,0,0,0),rgba(37,139,255,.5));
            font-size: .4rem;
            .left{
                i{  
                display: inline-block;
                width: 1rem;
                height: 1rem;
                background: url(@/assets/images/parkingicon.png);
                background-size: 100% auto;
                margin-right: .3rem
                };
                i,span{
                    vertical-align: middle;
                }
            };
            .right{
                display: grid;
                span{
                    text-align: center;
                };
                :nth-child(1){
                    font-size: .45rem;
                    color: #E57900;
                    border-bottom: 3px solid rgba(2,27,47,.5) ;
                };
                :nth-child(2){
                    font-size: .3rem;
                    color: #D6D7D8;
                }
            }
        }
        .vehicles{
            margin-top: .5rem;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            font-size: 0.5rem;
            padding: .1rem;
            div{
                text-align: center;
            }
        }
    }
     }
    
</style>