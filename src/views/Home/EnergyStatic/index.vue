<template>
  <div class="main_container">
            <h4 class="title">能耗统计 ENERGY CONSUMPTION STATISTICS</h4>
            <div class="chart">
                <div class="thisMonthCost">
                  <div class="left"><i></i><span>本月总耗电</span></div>
                  <div class="right"><span>{{this.energyCostThismonth+'KW'}}</span></div>
                </div>
                <div class="rings">
                  <div class="month2month" ref="ref_month2month"></div>
                  <div class="year2year" ref="ref_year2year"></div>
                </div>
            </div>
  </div>
    
</template>

<script>
export default {
    data() {
        return {
          energyCostThismonth:162.4,
          energyCostLastmonth:162.4/0.724,
          energyCostLastYearThisMonth:162.4/0.5533,
          //echart的dom对象
          month2monthInstance:null,
          year2yearInstance:null
        }
    },
    //获取轮播图页码
    props:['current'],

    computed:{
      //计算同比百分数
      year2year(){
        let percent=(Math.round(this.energyCostThismonth/this.energyCostLastYearThisMonth*10000))/100
        return percent
      },
      //计算环比百分数
      month2month(){
        let percent=(Math.round(this.energyCostThismonth/this.energyCostLastmonth*10000))/100
        return percent
      }
    },
    //挂载完成时初始化和配置echarts
    mounted() {
        this.initChart()
        this.updateChart()
    },
    methods: {
      //初始化eharts环图
      initChart(){
            this.month2monthInstance=this.$echarts.init(this.$refs.ref_month2month)
            this.year2yearInstance=this.$echarts.init(this.$refs.ref_year2year)
      },
      //配置同比环图设置
      updateChart(){
         const option = {
          title: {
            text: this.year2year+'%',
            textStyle: {
                color: '#559BF4',
                fontSize: '.45rem'
            },
            x: 'center',
            y: 'center',
            subtext: '月耗电同比',
            subtextStyle: {
                color: '#fff',
                fontSize: '.37rem'
            },
            itemGap:10,
          },
          angleAxis: {
              max: 100,
              clockwise: true, // 逆时针
              // 隐藏刻度线
              show: false
          },
          radiusAxis: {
              type: 'category',
              show: true,
              axisLabel: {
                  show: false,
              },
              axisLine: {
                  show: false,

              },
              axisTick: {
                  show: false
              },
          },
          polar: {
              center: ['50%', '50%'],
              radius: '130%' //图形大小
          },
          //环形柱状图
          series: [{
              stack: '测试',
              type: 'bar',
              data:  [this.year2year],
              showBackground: true,
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 15,
              silent: true,
              itemStyle: {
                opacity: 1,
                color:'#24E5F0',
              },
          }, 
          //环形底色
          {
              stack: '测试',
              type: 'bar',
              data:  [0],
              showBackground: true,
              backgroundStyle: {
                  color: '#173164',
              },
              coordinateSystem: 'polar',
          }
          ]
      };
        this.month2monthInstance.setOption(option)
        //将同比环图配置信息复制给环比环图，并更改响应配置和数据
        const option2=option
        option2.title.text=this.month2month+'%'
        option2.title.subtext='月耗电环比'
        option2.series[0].data=[this.month2month]
        option2.series[0].itemStyle.color='#00B88A'
        this.year2yearInstance.setOption(option2)
        
      }
    } ,
    //监视轮播图解码，当轮播图切换到此页时重新初始化echarts
    watch:{
      current:{
        handler(newValue){
            if (newValue===4) {
                this.month2monthInstance.clear()
                this.year2yearInstance.clear()
                this.updateChart()
            }else{
                this.month2monthInstance.clear()
                this.year2yearInstance.clear()
            }
        }
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

      padding: .1333rem;
        .thisMonthCost{
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: .2rem .5rem;
            height: 1.5rem;
            background:linear-gradient(rgba(0,0,0,0),rgba(255,135,0,1));
            font-size: .4rem;
            .left{
                i{  
                display: inline-block;
                width: 1rem;
                height: 1rem;
                background: url(@/assets/images/energyicon.png);
                background-size: 100% auto;
                margin-right: .3rem
                };
                i,span{
                    vertical-align: middle;
                }
            };
            .right{
              position: relative;
              span{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: .5rem;
                display: block;
                color: #0069E0;
                font-size: .7rem;
                margin: 0 auto;
              }
            }
        }
        .rings{
          display: grid;
          width: 100%;
          height: 5.6rem;
          // background-color: pink;
          padding: .1rem;
          grid-template-columns: 1fr 1fr; 
        }
      }
  }
</style>