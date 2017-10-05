// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import './common/stylus/index.styl';

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue()// 事件分发接口，初始化后所有组件都可以用
  }
});
// router.push('/goods');// 初始显示为goods页面
