/**
 * API接口统一管理
 * 集中管理所有接口地址
 * 注意：当前为纯前端模式，所有后端接口已注释
 */
// import http from './request.js'

/**
 * 用户相关接口
 * 当前注释掉，使用本地存储模拟
 */
export const userApi = {
  // 用户登录 - 已注释，使用本地模拟
  // login: (data) => http.post('/api/auth/login', data),

  // 获取用户绑定的酒店信息 - 已注释，使用本地模拟
  // getHotelInfo: (userId) => http.get(`/api/auth/user/hotel_info/${userId}`),
  
}

/**
 * 团队相关接口
 * 当前注释掉，使用本地数据模拟
 */
export const teamApi = {
  // 获取团队成员列表 - 已注释
  // getTeamMembers: () => http.get('/api/team/members'),
  
  // 获取营销任务列表 - 已注释
  // getMarketingTasks: (params) => http.get('/api/marketing/tasks', params),
}

/**
 * 营销策略相关接口
 * 当前注释掉，使用本地数据模拟
 */
export const strategyApi = {
  // 获取营销计划 - 已注释
  // getMarketingPlans: (params) => http.get('/api/strategy/plans', params),
  
  // AI生成营销计划 - 已注释
  // generateMarketingPlan: (data) => http.post('/api/strategy/ai-generate', data),
}

/**
 * 素材管理相关接口
 * 当前注释掉，使用本地数据模拟
 */
export const materialApi = {
  // 获取素材列表 - 已注释
  // getMaterialList: (params) => http.get('/api/materials', params),
  
  // 上传素材 - 已注释
  // uploadMaterial: (file) => http.upload('/api/materials/upload', file),
}

/**
 * 文件上传相关接口
 * 当前注释掉，使用本地模拟
 */
export const fileApi = {
  // 通用文件上传 - 已注释
  // upload: (file) => http.upload('/api/files/upload', file),
}

/**
 * 通用接口
 * 当前注释掉，使用本地数据模拟
 */
export const commonApi = {
  // 获取配置信息 - 已注释
  // getConfig: () => http.get('/api/common/config'),
  
  // 获取字典数据 - 已注释
  // getDictData: (type) => http.get(`/api/common/dict/${type}`),
}

/**
 * 纯前端模式说明
 * 
 * 当前项目运行在纯前端模式，所有后端接口已注释
 * 数据通过以下方式模拟：
 * - 用户登录：使用 uni.setStorageSync('token', 'mock_token')
 * - 数据获取：使用组件内的 mock 数据
 * - 文件上传：使用本地文件选择器模拟
 * 
 * 示例：模拟API调用
 * 
 * // 模拟登录成功
 * const mockLogin = (data) => {
 *   return new Promise((resolve) => {
 *     setTimeout(() => {
 *       uni.setStorageSync('token', 'mock_token_' + Date.now())
 *       resolve({ code: 200, message: '登录成功', data: { userId: 'user_123' } })
 *     }, 1000)
 *   })
 * }
 * 
 * // 模拟获取数据
 * const mockGetData = () => {
 *   return new Promise((resolve) => {
 *     setTimeout(() => {
 *       resolve({ code: 200, data: [{ id: 1, name: '示例数据' }] })
 *     }, 500)
 *   })
 * }
 */

// 默认导出所有API（当前为注释状态）
export default {
  userApi,
  teamApi,
  strategyApi,
  materialApi,
  fileApi,
  commonApi
}
