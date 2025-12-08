
/**
 * 应用主入口文件
 * 
 * 🚀 当前模式：纯前端演示模式
 * 📝 说明：所有后端接口已注释，使用本地模拟数据
 * 💡 数据来源：组件内部 mock 数据 + 本地存储
 * 
 * 🔧 生产环境部署时需要：
 * 1. 取消注释 utils/api.js 中的接口
 * 2. 配置正确的后端 API 地址
 * 3. 更新 utils/config.js 中的配置
 */

import Vue from 'vue'
// import uvUI from '@climblee/uv-ui';
// import uView from 'uview-ui';
import App from './App'
import http from './utils/request.js'  // 网络请求工具（当前注释了实际请求）
import api from './utils/api.js'       // API接口管理（当前为注释状态）
import utils from './utils/utils.js'   // 通用工具函数

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