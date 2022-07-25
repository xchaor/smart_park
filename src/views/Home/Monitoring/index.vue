<template>
<div class="main_container">
            <h4 class="title">重点监控 KEY MONITORING</h4>
            <div class="chart">
              <div class="view_port"><img src="@/assets/images/video.png" alt=""></div>
              <div class="view_port"><img src="@/assets/images/video.png" alt=""></div>
              <div class="view_port"><img src="@/assets/images/video.png" alt=""></div>
              <div class="view_port"><img src="@/assets/images/video.png" alt=""></div>
          </div>
</div>
  
</template>

<script>
export default {
    data() {
        return {

        }
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
        .chart{
        width: 100%;
        height: 100%;
        padding: .1333rem;
        display: grid;
        grid-template-columns:1fr 1fr;
        justify-items: center;
        align-items: top;
        justify-content: space-between;
        gap:.1rem;
        .view_port{
          img{
            width: 4.2933rem;
          }
        }
        }
     }

</style>