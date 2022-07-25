<template>
  <div class="view_container">
    <div class="feature_container">
        <!-- vant-ui轮播图组件 -->
       <van-swipe class="my-swipe"  autoplay="4000" indicator-color="white" @change="onChange">
            <!-- 父组件向子组件传参 -->
            <van-swipe-item><Personnel :current="current"></Personnel></van-swipe-item>
            <van-swipe-item><Vehicle></Vehicle></van-swipe-item>
            <van-swipe-item><SmartAlert></SmartAlert></van-swipe-item>
            <van-swipe-item><Monitoring></Monitoring></van-swipe-item>
            <!-- 父组件向子组件传参 -->
            <van-swipe-item><EnergyStatic :current="current"></EnergyStatic></van-swipe-item>
            <van-swipe-item><AssetStatic :current="current"></AssetStatic></van-swipe-item>
        </van-swipe>
    </div>
  </div>
</template>

<script>
//引入轮播图展示的功能组件
import Personnel from '@/views/Home/PersonnelStatic/index.vue'
import Vehicle from '@/views/Home/VehicleStatic'
import SmartAlert from '@/views/Home/SmartAlert'
import Monitoring from '@/views/Home/Monitoring'
import EnergyStatic from '@/views/Home/EnergyStatic'
import AssetStatic from '@/views/Home/AssetStatic'
export default {
    data() {
        return {
            //轮播图当前所在页索引
            current: 0,
        }
    },
    components:{
        Personnel,Vehicle,SmartAlert,Monitoring,EnergyStatic,AssetStatic
    },
    //将当前页索引保存在此组件中
    methods: {
        onChange(index){
            this.current=index
        }
    },
    beforeDestroy() {
        this.$store.dispatch("clearArrAll")
    },
}
</script>

<style lang="less" scoped>
    .view_container{
        width:9.5333rem ;
        margin: 0.2rem auto 0;
        padding-bottom: .5rem;
        .feature_container{
            width: 100%;
            .my-swipe .van-swipe-item {
                height: 8rem;
            }
        }
    }
    
</style>