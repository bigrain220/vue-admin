// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/index.js'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import mavonEditor from 'mavon-editor'
import VueCodeMirror from 'vue-codemirror-lite'
import 'element-ui/lib/theme-chalk/index.css'
import util from './api/util.js'
import { Message } from 'element-ui';

Vue.config.productionTip = false

if(util.changHost().indexOf('g3wei')>0){
// 线上
router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
        if(util.getCookie('ad_auth') == null){
          if(window.configFlag == true){//如果是第一次进入
            window.configFlag = false;
            next({
              path:'/login',
              // query: {redirect: to.fullPath}  //// 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
          }else{
            Message.success('抱歉，你还没有登录请重新登录');
            next({
              path:'/login',
            })
          }
        }else{
          next();
        }
        next();
    }else{
        next();
    }
});
}

Vue.use(ElementUI , VueQuillEditor , mavonEditor , VueCodeMirror);

new Vue({
  el: '#app',
  data() {return {value: ''}},
  router,
  template: '<App/>',
  components: { App },
  beforeCreate:function(){

  }
})
