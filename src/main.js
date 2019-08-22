import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

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

// 设置开头的
import { setUserInfo } from '@/assets/js/common'

// 配置ajax基础路由
axios.defaults.baseURL = 'http://localhost:3000';
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    // 设置一个带有token的axios
    let $http_token = axios.create()
    setUserInfo($http_token)
    Vue.prototype.$http_token = $http_token
  },
}).$mount('#app')
