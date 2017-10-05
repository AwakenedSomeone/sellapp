import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import goods from '../components/goods/goods';
import ratings from '../components/ratings/ratings';
import seller from '../components/seller/seller';
Vue.use(Router);
Vue.use(VueResource);
// 配置路由
export default new Router({
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'// 设置默认激活类名
});

