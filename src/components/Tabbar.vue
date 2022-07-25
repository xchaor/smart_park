<template>
    <!-- 底部导航栏 -->
  <div class="tabbar" >
    <ul >
        <li class="tabItem" @click="hideSubNav()" v-for="(item,index) in tabList" :key="index"><router-link replace active-class="active" :to='item.route'><span>{{item.name}}</span></router-link></li>
        <li class="tabItem" @click="showSubNav()"><router-link replace active-class="active" to='/basicfeature'><span>基础功能</span></router-link></li>
    </ul>
    <!-- 基础功能二级导航栏 -->
    <div class="nav_jcgn" ref="ref_nav_jcgn" v-show="isShow">
        <!-- 如果当前item被选中，则类名为selected -->
        <span :class="{selected:subCurrent==index}" v-for="(item,index) in jcgnList" :key="index" @click="change(index)" >{{item.title}} </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name:'Tabbar',
    data() {
        return {
            //主导航栏
            tabList:[
                {
                    name:'首页平台',
                    route:'/home'
                },
                {
                    name:'智能运维',
                    route:'/operation'
                },
                {
                    name:'视频监控',
                    route:'/cameras'
                },
                {
                    name:'人员监控',
                    route:'/personel'
                },
            ],
            //二级导航栏
            jcgnList:[
                {
                    title:'地图标签',
                    name:'MapMarker'
                },
                {
                    title:'属性查询',
                    name:'ElementQuery'
                },
                {
                    title:'地图量算',
                    name:'MapMeasure'
                },
                {
                    title:'路径漫游',
                    name:'RouteTravel'
                },
                {
                    title:'通视分析',
                    name:'VisibilityAnalysis'
                },
            ],
            tabCurrent:-1,
            subCurrent:-1
        }
    },
    computed:{
        //将isShow从store引入过来
        ...mapState(['isShow'])
    },
    mounted() {
        const liItem=document.getElementsByClassName("tabItem")
        // console.log(liItem);
        for(let i=0;i<liItem.length;i++){
            liItem[i].index=i;
            liItem[i].onclick=()=>{
                this.tabCurrent=liItem[i].index;
                
                this.$bus.$emit("getTabCurrent",this.tabCurrent)
            }
        }
       
    },
    methods: {
        change(index){
            viewer.entities.removeAll();
            //存储被选中的二级导航栏item的索引
            this.subCurrent=index
            // console.log(this.subCurrent);

            //基本功能二级导航栏编程式路由
            this.$router.push({
                name:this.jcgnList[index].name
            })
            if(index===2){
                this.$bus.$emit("showTools",true)
            }else{
                this.$bus.$emit("showTools",false)
            }
        },

        showSubNav(){
            this.$store.dispatch('showSubNav')
            //subCurrent初始化
            this.subCurrent=-1
            
        },
        hideSubNav(){
            this.$store.dispatch('hideSubNav')
            //subCurrent初始化
            this.subCurrent=-1
        }
    },
}

</script>

<style lang="less"  scoped>
    .tabbar{
        z-index: 4;
        position: fixed;
        left: 0;
        bottom:0;
        width: 100%;
        height:1rem ;
        background: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.7));
        ul{
            display: grid;
            width: 100%;
            height: 100%;
            grid-template-columns: repeat(5,1fr);
            align-items: center;
            justify-items: center;
            li{
                a{  display: block;
                    width: 100%;
                    height: 100%;
                    font-size:.4rem;
                    color: #355A91;
                    font-weight: 500;
                }
            }
        }
        .nav_jcgn{
            display: block;
            position: absolute;
            width: 100%;
            top: -0.8rem;
            // background-color: pink;
            display: grid;
            grid-template-columns: repeat(5,1fr);
            font-size: 0.359rem;
            span{
                color: #355A91;
                text-align: center;
            }
            .selected{
                color: #7CA7E9;
                font-weight: 800;
            }
        }
    }
    .active{
        span{
            color: #7CA7E9;
            font-weight: 800;
        }
    }
    
</style>