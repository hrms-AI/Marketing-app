/**
 * API接口统一管理
 * 集中管理所有接口地址
 */
import http from './request.js'

/**
 * 用户相关接口
 */
export const userApi = {
  // 用户登录
  login: (data) => http.post('/api/auth/login', data),

  // 获取用户绑定的酒店信息
  getHotelInfo: (userId) => http.get(`/api/auth/user/hotel_info/${userId}`),
  
}

/**
 * 团队询价相关接口
 */
export const teamApi = {

}

/**


/**
 * 文件上传相关接口
 */
export const fileApi = {

}

/**
 * 通用接口
 */
export const commonApi = {

}

/**
 * 示例：如何使用这些API
 * 
 * 在页面中使用：
 * import { userApi, teamApi } from '@/utils/api.js'
 * 
 * // 登录
 * userApi.login({ username: 'test', password: '123456' })
 *   .then(res => {
 *     console.log('登录成功', res)
 *   })
 *   .catch(err => {
 *     console.log('登录失败', err)
 *   })
 * 
 * // 获取询价列表
 * teamApi.getInquiryList({ page: 1, size: 10 })
 *   .then(res => {
 *     console.log('获取列表成功', res)
 *   })
 */

// 默认导出所有API
export default {
  userApi,
  teamApi,
  fileApi,
  commonApi
}
