<template>
  <div class="main_container">
    <h4 class="title">人员统计 PERSONNEL STATISTICS</h4>
    <div class="charts" ref="ref_personnel">
    </div>
  </div>
</template>

<script>

export default {
    data() {
        return {
            personnelInstance:null,
            personnel_statistics_data:[
                {
                    name:'员工',
                    value:3367
                },
                {
                    name:'访客',
                    value:1459
                },{
                    name:'安保',
                    value:6398
                },
            ],
        }
    },
    props:['current'],
    computed:{
        getSum(){
            let sum=0
            for(let i=0;i<this.personnel_statistics_data.length;i++){
                sum+=this.personnel_statistics_data[i].value
            }
            return sum
        }
    },
    mounted() {
        this.initChart()
        this.updateChart()
    },
    methods: {
        initChart(){
            this.personnelInstance=this.$echarts.init(this.$refs.ref_personnel)
        },
        updateChart(){
            const option={
                color:['#00C997','#0076FB','#FE8600'],
                title:{
                    text:`总人员数量\n${this.getSum}`,
                    textAlign:'center',
                    textStyle:{
                        color:'#fff',
                        fontSize:12,
                    },
                    left:'34.2%',
                    top:'42%',
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 60,
                    bottom: 20,  
                    itemGap:50,
                    formatter: function(name) {
                        // 获取legend显示内容
                        let data = option.series[0].data;
                        let total = 0;
                        let tarValue = 0;
                        for (let i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                tarValue = data[i].value;
                            }
                        }
                        let p = (tarValue / total * 100).toFixed(2);
                        return name + ' ' + p + '%';
                    },
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [
                    {
                    name: 'personnel statistics',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['35%', '45%'],
                    avoidLabelOverlap: false,
                    zlevel:1,
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                        show: false,
                        fontSize: '40',
                        fontWeight: 'bold'
                        }
                    },
                    data: this.personnel_statistics_data
                    }
                ]
            };
            this.personnelInstance.setOption(option)
        },
    },
    watch:{
      current:{
        handler(newValue){
            if (newValue===0) {
                this.personnelInstance.clear()
                this.updateChart()
            }else{
                this.personnelInstance.clear()
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
        height: 100%;
    }
</style>