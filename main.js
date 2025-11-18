
import Vue from 'vue'
// import uvUI from '@climblee/uv-ui';
// import uView from 'uview-ui';
import App from './App'
import http from './utils/request.js'
import api from './utils/api.js'
import utils from './utils/utils.js'

// Vue.use(uvUI);
// Vue.use(uView);

// 将请求工具挂载到Vue原型上，方便全局使用
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$utils = utils

// #ifndef VUE3
Vue.config.productionTip = false
App.mpType = 'app'

try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) { }

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif