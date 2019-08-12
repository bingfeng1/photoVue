import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'

// 使用element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 使用自定义公共样式
import '@/assets/css/common.scss'

// 头像图片裁剪功能
import SlimCropper from 'vue-slim-cropper'
Vue.use(SlimCropper)

Vue.config.productionTip = false

// 配置ajax基础路由
axios.defaults.baseURL = 'http://localhost:3000';
Vue.prototype.$http = axios;

// 使用图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('@/assets/imgload/err.png'),
  loading: require('@/assets/imgload/loading.gif'),
  attempt: 3
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
