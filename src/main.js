import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import axios from "axios";
import VueAxios from "vue-axios";
import GCAvatar from "@/components/others/GCAvatar";

Vue.component("GCAvatar",GCAvatar);

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import '@/assets/font-icon/iconfont.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
//配置ajax请求根路径
//axios.defaults.baseURL = "http://localhost:8080/";
//跨域请求携带Cookie等
axios.defaults.withCredentials = true;
Vue.use(VueAxios,axios);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
