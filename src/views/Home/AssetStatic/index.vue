<template>
<div class="main_container">
    <h4 class="title">资产统计 ASSET STATISTICS</h4>
    <div class="charts" ref="ref_asset">
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            assetInstance:null,
            data:[
                {
                    name:'房屋空间',
                    value:3600
                },
                {
                    name:'电子设备',
                    value:2711
                },
                {
                    name:'生产设备',
                    value:3548
                },
                {
                    name:'办公设备',
                    value:4362
                },
            ],
        }
    },
    //接受父组件传来的轮播图页码
    props:['current'],
    //页面挂载后初始化echarts
    mounted() {
        this.initChart()
    },
    methods: {
        initChart(){
            this.assetInstance=this.$echarts.init(this.$refs.ref_asset)
        },
        //配置柱状图样式和数据
        updateChart(){
            const name=this.data.map((item)=>{
              return item.name
            })
            const value=this.data.map((item)=>{
              return item.value
            })
            const option={
                    grid:{
                      left: '3%',
                      right: '4%',
                      bottom: '5%',
                      top:'15%',
                      containLabel: true
                    },
                    xAxis:{
                      type:'category',
                      data:name,
                      axisLabel:{
                        color:'#E9F2F3',
                      },
                      axisLine:{
                        lineStyle:{
                          color:'#206489'
                        }
                      },
                    },
                    yAxis:{
                      type:'value',
                      name:'单位:万元',
                      nameTextStyle:{
                        color:'#fff'
                      },
                      axisLine:{
                        show:true,
                        lineStyle:{
                          color:'#206489'
                        }
                      },
                      axisLabel:{
                        color:'#E9F2F3'
                      },
                      splitLine:{
                        lineStyle:{
                          color:'#072651'
                        }
                      }

                    },
                    series:[
                      {
                        name:'资产统计',
                        type:'bar',
                        data:value,
                        barWidth:'16px',
                        itemStyle: {
                            color:function(params){
                            const colorList=['#E97B00','#0068DC','#00B789','#F40000']
                            let colorItem=colorList[params.dataIndex]
                            return colorItem
                          },
                        },
                        label: {
                          show: true,
                          position: 'top',
                          color:'#fff'
                        },
                      }
                    ] 
                        };
                    this.assetInstance.setOption(option)
        }
    },
    watch:{
      //监视页码变化，如页码为5则重新载入柱状图
      current:{
        handler(newValue){
            if (newValue===5) {
                this.assetInstance.clear()
                this.updateChart()
            }else{
                this.assetInstance.clear()
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
        }
    }
    .charts{
        width: 100%;
        height: 94%;
    }
</style>