import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import router from '@/router'
import store from '@/store'
//引入全局css样式
import'@/utils/normalize.css'
import'@/utils/global.css'
//引入flexiblejs自适应
import'@/utils/index'
//引入vant组件库
import { DatetimePicker,Button ,Popup,Swipe, SwipeItem  } from 'vant';
Vue.use(DatetimePicker,Button,Popup,Swipe,SwipeItem  );
//引入echart库
import * as echarts from 'echarts';
Vue.prototype.$echarts=echarts
// 引入JQuery库
import $ from 'jquery'
Vue.prototype.$ = $

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus=this
  },
  router,
  //注册仓库，组件实例的身上会多一个属性$store
  store
}).$mount('#app')
