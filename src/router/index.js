import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
import UserManage from '@/components/UserManage'
import MuManage from '@/components/MuManage'
import ColorManage from '@/components/colorManage'
import IndustryManage from '@/components/industryManage'
import DomainManage from '@/components/DomainManage'
import SeoManage from '@/components/SeoManage'
import ApiManage from '@/components/ApiManage'
import Login from '@/components/login'
import AddModule from '@/components/common/addModule'
import UserLang from '@/components/userLanguage'
import LangManage from '@/components/LangManage'
import MinAppManage from '@/components/MinAppManage'

Vue.use(Router)

export default new Router({
 routes : [
    {
        path:'/login',
        component:Login,
    },
    {
      path: '/admin',
      component:Home,
      children: [
      	//     {
        //         path:'/',
        //         component:UserManage
        //     },
            {
               path:'UserManage',
               component:UserManage,
               meta: {requireAuth: true}
            },
            {
               path:'UserLang',
               component:UserLang,
               meta: {requireAuth: true}
            },
            {
               path:'LangManage',
               component:LangManage,
               meta: {requireAuth: true}
            },
            {
               path:'DomainManage',
               component:DomainManage,
               meta: {requireAuth: true}
            },
            {
                path:'SeoManage',
                component:SeoManage,
                meta: {requireAuth: true}
             },
             {
               path:'ApiManage',
               component:ApiManage,
               meta: {requireAuth: true}
            },
            {
                path:'MuManage',
                component:MuManage,
                meta: {requireAuth: true}
            },
            {
                path:'ColorManage',
                component:ColorManage,
                meta: {requireAuth: true}
            },
            {
                path:'IndustryManage',
                component:IndustryManage,
                meta: {requireAuth: true}
            },
            {
                path:'AddModule',
                component:AddModule,
                meta: {requireAuth: true}
            }, 
            {
                path:'MinAppManage',
                component:MinAppManage,
                meta: {requireAuth: true}
            },

            // {
            //     path: 'QuillEditor',
            //     component:QuillEditor,
            //     meta: {requireAuth: true}
            // },
            // {
            //     path: 'MavonEditor',
            //     component:MavonEditor,
            //     meta: {requireAuth: true}
            // },
            // {
            //     path: 'CodeMirror',
            //     component:CodeMirror,
            //     meta: {requireAuth: true}
            // }
      ]
    },
    {
        path:'/',
        // component:Login
        redirect: '/admin/UserManage'
    },
    {//没有找到正确路径的时候去/admin/UserManage组件
        path:"*",
        redirect:'/admin/UserManage'
    }
  ]
})
