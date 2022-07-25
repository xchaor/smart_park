import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Operation from '@/views/Operation'
import Cameras from '@/views/Cameras'
import Personel from '@/views/Personel'
import BasicFeature from '@/views/BasicFeature'
import MapMarker from '@/views/BasicFeature/MapMarker'
import ElementQuery from '@/views/BasicFeature/ElementQuery'
import MapMeasure from '@/views/BasicFeature/MapMeasure'
import RouteTravel from '@/views/BasicFeature/RouteTravel'
import VisibilityAnalysis from '@/views/BasicFeature/VisibilityAnalysis'

const router = new VueRouter({
    routes:[
        {
            path:'/home',
            component:Home,
            name:'Home'
        },
        {
            path:'/operation',
            component:Operation,
            name:'Operation'
        },
        {
            path:'/cameras',
            component:Cameras,
            name:'Cameras'
        },
        {
            path:'/personel',
            component:Personel,
            name:'Personel'
        },
        {
            path:'/basicFeature',
            component:BasicFeature,
            name:'BasicFeature',
            children:[
                {
                    path:'mapmarker',
                    component:MapMarker,
                    name:'MapMarker'
                },
                {
                    path:'elementQuery',
                    component:ElementQuery,
                    name:'ElementQuery'
                },
                {
                    path:'mapMeasure',
                    component:MapMeasure,
                    name:'MapMeasure'
                },
                {
                    path:'routeTravel',
                    component:RouteTravel,
                    name:'RouteTravel'
                },
                {
                    path:'visibilityAnalysis',
                    component:VisibilityAnalysis,
                    name:'VisibilityAnalysis'
                },
            ]
        },
        
        {
            path:'/',
            redirect:'Home'
        },

    ]
})

const VueRouterPush = router.push
router.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router