/**
 * API接口统一管理
 * 基于后端 OpenAPI 3.0.2 规范设计
 * 服务器地址: http://115.190.97.154:7000
 * 遵循小程序接口规范，去掉接口注释
 */
import http from './request.js'

/**
 * 用户端接口模块 (前缀: /api/u/)
 * 专门为普通用户提供的接口功能
 */
export const userApi = {
  /**
   * 获取酒店列表（分页）
   * POST /api/u/hotel/list
   */
  getHotelList: (data = {}) => {
    const params = {
      page: data.page || 1,
      limit: data.limit || 10,
      keyword: data.keyword || ''
    }
    console.log('API层 - 调用获取酒店列表接口:', params)
    return http.post('/api/u/hotel/list', params)
  },

  /**
   * 获取酒店详情
   * GET /api/u/query_hotel_all
   */
  getHotelAll: () => {
    console.log('API层 - 调用获取酒店详情接口: GET /api/u/query_hotel_all')
    return http.get('/api/u/query_hotel_all')
  },

  /**
   * 获取酒店素材列表
   * GET /api/u/query_hotel_material_list
   */
  getHotelMaterialList: (data) => {
    console.log('API层 - 调用获取酒店素材列表接口:', data)
    return http.get('/api/u/query_hotel_material_list', data)
  },

  /**
   * 批量删除酒店素材
   * GET /api/u/batch_delete_hotel_material
   */
  batchDeleteHotelMaterial: (data) => {
    console.log('API层 - 调用批量删除酒店素材接口:', data)
    return http.get('/api/u/batch_delete_hotel_material', data)
  },

  /**
   * 获取酒店日历营销计划
   * GET /api/u/calender_marketing
   */
  getCalenderMarketing: (params) => {
    console.log('API层 - 调用获取日历营销计划接口:', params)
    return http.get('/api/u/calender_marketing', params)
  },

  /**
   * 获取酒店素材列表（分页）
   * POST /api/u/material/list
   */
  getMaterialList: (data = {}) => {
    const params = {
      page: data.page || 1,
      limit: data.limit || 10,
      hotel_id: data.hotel_id,
      type: data.type || '', // image-图片，video-视频，text-文本
      keyword: data.keyword || ''
    }
    console.log('API层 - 调用获取素材列表接口:', params)
    return http.post('/api/u/material/list', params)
  },

  /**
   * 获取酒店素材详情
   * GET /api/u/material/info
   */
  getMaterialInfo: (data) => {
    console.log('API层 - 调用获取素材详情接口:', data)
    return http.get('/api/u/material/info', data)
  },

  /**
   * 获取营销计划列表
   * POST /api/u/marketing_plan/list
   */
  getMarketingPlanList: (data = {}) => {
    const params = {
      hotel_id: String(data.hotel_id || '0'),
      year: String(data.year || '0'),
      month: String(data.month || '0'),
      type: String(data.type || '0')
    }
    console.log('API层 - 调用获取营销计划列表接口:', params)
    return http.post('/api/u/marketing_plan/list', params)
  }
}

/**
 * 账户管理接口模块
 */
export const accountApi = {
  /**
   * 账户登录
   * POST /api/account/login
   */
  login: (data) => {
    const loginData = {
      username: data.username,
      password: data.password
    }
    console.log('API层 - 调用登录接口:', loginData)
    return http.post('/api/account/login', loginData)
  },

  /**
   * 微信一键登录（获取code后查询用户信息）
   * GET /api/account/wechat_user_info
   */
  wechatUserInfo: (params) => {
    console.log('API层 - 获取微信用户信息:', params)
    return http.get('/api/account/wechat_user_info', params)
  },

  /**
   * 微信用户注册
   * POST /api/account/wechat_register
   */
  wechatRegister: (data) => {
    console.log('API层 - 微信用户注册:', data)
    return http.post('/api/account/wechat_register', data)
  },

  /**
   * 账户登录
   * POST /api/account/login
   */
  accountLogin: (data) => {
    return http.post('/api/account/login', data)
  },

  /**
   * 账户注册
   * POST /api/account/register
   */
  register: (data) => {
    return http.post('/api/account/register', data)
  },

  /**
   * 获取用户信息
   * GET /api/account/user_info
   */
  getUserInfo: () => {
    return http.get('/api/account/user_info')
  },

  /**
   * 账户登出
   * POST /api/account/logout
   */
  logout: () => {
    return http.post('/api/account/logout')
  }
}

/**
 * 管理端 - 酒店管理接口模块 (前缀: /api/m/hotel/)
 */
export const hotelApi = {
  /**
   * 查询酒店列表
   * GET /api/m/hotel/query_list
   */
  queryList: (params) => {
    console.log('API层 - 调用酒店列表查询接口:', params)
    return http.get('/api/m/hotel/query_list', params)
  },

  /**
   * 创建酒店
   * POST /api/m/hotel/create
   */
  create: (data) => {
    console.log('API层 - 调用创建酒店接口:', data)
    return http.post('/api/m/hotel/create', data)
  },

  /**
   * 更新酒店信息
   * PUT /api/m/hotel/update
   */
  update: (data) => {
    console.log('API层 - 调用更新酒店接口:', data)
    return http.put('/api/m/hotel/update', data)
  },

  /**
   * 删除酒店
   * DELETE /api/m/hotel/delete
   */
  delete: (data) => {
    console.log('API层 - 调用删除酒店接口:', data)
    return http.delete('/api/m/hotel/delete', data)
  }
}

/**
 * 管理端 - 素材管理接口模块 (前缀: /api/m/material/)
 */
export const materialApi = {
  /**
   * 查询素材列表
   * GET /api/m/material/query_list
   */
  queryList: (params) => {
    console.log('API层 - 调用素材列表查询接口:', params)
    return http.get('/api/m/material/query_list', params)
  },

  /**
   * 创建素材
   * POST /api/m/material/create
   */
  create: (data) => {
    console.log('API层 - 调用创建素材接口:', data)
    return http.post('/api/m/material/create', data)
  },

  /**
   * 更新素材信息
   * PUT /api/m/material/update
   */
  update: (data) => {
    console.log('API层 - 调用更新素材接口:', data)
    return http.put('/api/m/material/update', data)
  },

  /**
   * 删除素材
   * DELETE /api/m/material/delete
   */
  delete: (data) => {
    console.log('API层 - 调用删除素材接口:', data)
    return http.delete('/api/m/material/delete', data)
  }
}

/**
 * 管理端 - 酒店管理员接口模块 (前缀: /api/m/hotel_admin/)
 */
export const hotelAdminApi = {
  /**
   * 查询酒店管理员列表
   * GET /api/m/hotel_admin/query_list
   */
  queryList: (params) => {
    return http.get('/api/m/hotel_admin/query_list', params)
  },

  /**
   * 创建酒店管理员
   * POST /api/m/hotel_admin/create
   */
  create: (data) => {
    return http.post('/api/m/hotel_admin/create', data)
  },

  /**
   * 更新酒店管理员
   * PUT /api/m/hotel_admin/update
   */
  update: (data) => {
    return http.put('/api/m/hotel_admin/update', data)
  },

  /**
   * 删除酒店管理员
   * DELETE /api/m/hotel_admin/delete
   */
  delete: (data) => {
    return http.delete('/api/m/hotel_admin/delete', data)
  }
}

/**
 * 管理端 - 微信用户管理接口模块 (前缀: /api/m/wechat_user/)
 */
export const wechatUserApi = {
  /**
   * 查询微信用户列表
   * GET /api/m/wechat_user/query_list
   */
  queryList: (params) => {
    return http.get('/api/m/wechat_user/query_list', params)
  },

  /**
   * 创建微信用户
   * POST /api/m/wechat_user/create
   */
  create: (data) => {
    return http.post('/api/m/wechat_user/create', data)
  },

  /**
   * 更新微信用户信息
   * PUT /api/m/wechat_user/update
   */
  update: (data) => {
    return http.put('/api/m/wechat_user/update', data)
  },

  /**
   * 删除微信用户
   * DELETE /api/m/wechat_user/delete
   */
  delete: (data) => {
    return http.delete('/api/m/wechat_user/delete', data)
  }
}

/**
 * 管理端 - 日历计划管理接口模块 (前缀: /api/m/calendar_plan/)
 */
export const calendarPlanApi = {
  /**
   * 查询日历计划列表
   * GET /api/m/calendar_plan/query_list
   */
  queryList: (params) => {
    return http.get('/api/m/calendar_plan/query_list', params)
  },

  /**
   * 创建日历计划
   * POST /api/m/calendar_plan/create
   */
  create: (data) => {
    return http.post('/api/m/calendar_plan/create', data)
  },

  /**
   * 更新日历计划
   * PUT /api/m/calendar_plan/update
   */
  update: (data) => {
    return http.put('/api/m/calendar_plan/update', data)
  },

  /**
   * 删除日历计划
   * DELETE /api/m/calendar_plan/delete
   */
  delete: (data) => {
    return http.delete('/api/m/calendar_plan/delete', data)
  }
}

/**
 * 公共接口模块
 */
export const publicApi = {
  /**
   * 编辑器文件上传
   * POST /api/m/public/editor_upload_file
   */
  editorUploadFile: (file) => http.upload('/api/m/public/editor_upload_file', file),
  
  /**
   * 通用文件上传
   * POST /api/m/public/upload_file
   */
  uploadFile: (file) => http.upload('/api/m/public/upload_file', file),
}

/**
 * 默认导出所有API模块
 */
export default {
  userApi,
  accountApi,
  hotelApi,
  materialApi,
  hotelAdminApi,
  wechatUserApi,
  calendarPlanApi,
  publicApi
}
