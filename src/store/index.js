import Vue from 'vue'
import Vuex from 'vuex'
import * as Cesium from 'cesium';
Vue.use(Vuex);
const state={
    //判断二级导航栏是否显示的变量
    isShow:false
};
const mutations={
    //显示与隐藏二级导航栏
    SHOWSUBNAV(state){
        state.isShow=true
    },
    HIDESUBNAV(state){
        state.isShow=false
    }
};
const actions={
    showSubNav({commit}){
        commit('SHOWSUBNAV')
    },
    hideSubNav({commit}){
        commit('HIDESUBNAV')
    },
    clearArrAll(){
        console.log("全部清空");
        if (popFloat !== undefined) {
        popFloat.attributesArr = undefined;
        popFloat.warnNote = undefined;
        popFloat.monitorArr = undefined;
        popFloat.trackArr = undefined;
        }
        queryTools.znywLoc = undefined;
        queryTools.sxcx3dtitle = undefined;
        mapClick.czlArr = [];
        mapClick.warnArr = [];
        mapClick.NumberArr = [];
        mapClick.professionArr = [];
        viewer.dataSources.removeAll();
        viewer.trackedEntity = undefined;
        viewer.entities.removeAll();
        //释放鼠标事件
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        if(window.shapeEditMenu != undefined){
            shapeEditMenu.style.display = "none";
        }
        if(window.alertShapeEditMenu != undefined){
            alertShapeEditMenu.style.display = "none";
        }
        if(window.personelShapeEditMenu != undefined){
            personelShapeEditMenu.style.display = "none";
        }
    },
};
const getters={

}


export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});