<template>
  <div id="app">
      <!-- 地图组件 -->
      <MapModel></MapModel>
      <!-- 路由组件 -->
      <router-view></router-view>
      <!-- 导航栏组件 -->
      <Tabbar></Tabbar>  
  </div>
</template>
<script>
import Tabbar from '@/components/Tabbar';
import MapModel from './components/MapModel.vue';

export default {
  name: 'App',
  components: { Tabbar, MapModel }
}
</script>

<style lang="less">
html{
    background-color: rgb(8,21,45);
}
  body{
    background: url(@/assets/images/bg.png) repeat;
    background-size:100% auto;
  }
</style>
