/**
 * 网络请求封装
 * 符合uni-app规范的HTTP请求工具
 * 
 * 🚀 当前运行模式：纯前端模式
 * 📝 说明：所有网络请求功能保留但不会发送真实请求
 * 💡 数据来源：本地 mock 数据和组件内部状态
 */
import { config, constants } from './config.js'

// 基础配置
const BASE_URL = config.BASE_URL
const TIMEOUT = config.TIMEOUT

// 请求状态码
const HTTP_STATUS = constants.HTTP_STATUS

/**
 * 请求封装类
 */
class Request {
  constructor() {
    this.baseURL = BASE_URL
    this.timeout = TIMEOUT
    this.header = {
      'Content-Type': 'application/json'
    }
  }

  /**
   * 设置基础URL
   * @param {String} baseURL 
   */
  setBaseURL(baseURL) {
    this.baseURL = baseURL
  }

  /**
   * 设置请求头
   * @param {Object} header 
   */
  setHeader(header) {
    this.header = { ...this.header, ...header }
  }

  /**
   * 获取Token
   */
  getToken() {
    try {
      const token = uni.getStorageSync(constants.STORAGE_KEYS.TOKEN)
      
      // 直接返回token字符串，不需要JSON解析
      if (token && typeof token === 'string') {
        return token
      }
      
      // 如果token是JSON格式的字符串，尝试解析
      if (token && typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
        try {
          return JSON.parse(token)
        } catch (parseError) {
          return token
        }
      }
      
      return token || ''
    } catch (error) {
      console.error('Token获取失败:', error)
      return ''
    }
  }

  /**
   * 请求拦截器 - 请求前处理
   * @param {Object} config 请求配置
   */
  requestInterceptor(config) {
    console.log('请求拦截器 - 原始config:', config)
    
    // 显示加载提示
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    // 定义不需要token的接口列表
    const noTokenApis = [
      '/api/account/login',           // 原始登录接口
      '/api/account/wechat_login',    // 小程序登录接口
      '/api/account/register',        // 注册接口
      '/api/auth/forgot',             // 忘记密码接口
      '/api/public'                   // 公共接口前缀
    ]

    // 检查当前请求是否需要token
    const needsToken = !noTokenApis.some(api => {
      // 对于 /api/public，使用包含匹配（前缀匹配）
      if (api === '/api/public') {
        return config.url.includes(api)
      }
      // 对于具体的登录接口，使用精确匹配或路径匹配
      return config.url === api || config.url.startsWith(api + '?')
    })

    console.log('是否需要token:', needsToken, 'URL:', config.url)

    // 只有需要token的接口才添加token到请求头
    if (needsToken) {
      const token = this.getToken()
      if (token) {
        config.header = {
          ...config.header,
          'Authorization': `Bearer ${token}`
        }
      } else {
        console.warn('需要token但未找到token:', config.url)
      }
    }

    // 处理请求URL - 修复URL拼接问题
    if (config.url && config.url.indexOf('http') !== 0) {
      // 确保baseURL不为空，并正确拼接URL
      const baseURL = this.baseURL || BASE_URL
      console.log('BASE_URL:', baseURL)
      if (baseURL) {
        config.url = baseURL + config.url
      } else {
        console.error('BASE_URL未配置，请检查config.js文件')
        uni.hideLoading()
        throw new Error('BASE_URL未配置')
      }
    }

    console.log('请求拦截器 - 最终URL:', config.url)
    console.log('请求拦截器 - 最终config:', config)
    
    return config
  }

  /**
   * 响应拦截器 - 响应后处理
   * @param {Object} response 响应数据
   */
  responseInterceptor(response) {
    console.log('响应拦截器 - 原始响应:', response)
    
    // 隐藏加载提示
    uni.hideLoading()

    const { statusCode, data } = response

    // HTTP状态码检查
    if (statusCode === HTTP_STATUS.SUCCESS) {
      console.log('响应拦截器 - HTTP状态码200，数据:', data)

      // 检查业务状态码 - 兼容多种状态码格式
      const isSuccess = (data && (data.code === 200 || data.code === 0))

      if (isSuccess) {
        console.log('响应拦截器 - 业务成功，检查是否为登录接口')

        // 检查是否为登录接口返回token
        if (data.data && data.data.token) {
          console.log('响应拦截器 - 检测到登录token:', data.data.token)

          // 自动存储token
          uni.setStorageSync(constants.STORAGE_KEYS.TOKEN, data.data.token)

          // 构造并存储用户信息
          const userInfo = {
            id: data.data.id || 'unknown',
            username: data.data.username || 'unknown',
            role: data.data.role || 'user',
            email: data.data.email || '',
            phone: data.data.phone || '',
            nickname: data.data.nickname || '',
            token: data.data.token
          }
          uni.setStorageSync(constants.STORAGE_KEYS.USER_INFO, userInfo)

          // 返回token给调用者
          return Promise.resolve(data.data.token)
        }

        // 其他成功的业务接口，返回data部分
        return Promise.resolve(data.data || data)
      } else if (data && data.code && data.code !== 200 && data.code !== 0) {
        // 业务逻辑错误
        console.error('响应拦截器 - 业务错误:', data)
        return Promise.reject(data)
      } else {
        // 其他情况，直接返回数据
        return Promise.resolve(data)
      }
    } else {
      // HTTP状态码错误
      console.error('响应拦截器 - HTTP错误:', statusCode, data)
      return Promise.reject(response)
    }
  }

  /**
   * 处理HTTP状态码错误
   * @param {Number} statusCode 
   */
  handleHttpError(statusCode) {
    let message = '网络异常，请稍后重试'
    let shouldRedirectToLogin = false
    
    // 检查当前页面
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const isLoginPage = currentPage && currentPage.route && 
                       (currentPage.route.includes('/login') || currentPage.route.includes('/pages/login'))
    
    switch (statusCode) {
      case HTTP_STATUS.UNAUTHORIZED:
        if (isLoginPage) {
          // 在登录页面的401错误，说明账号密码错误
          message = '账号或密码错误，请重新输入'
        } else {
          // 非登录页面的401错误，说明token过期
          message = '登录已过期，请重新登录'
          shouldRedirectToLogin = true
        }
        break
      case HTTP_STATUS.FORBIDDEN:
        message = '没有权限访问'
        break
      case HTTP_STATUS.NOT_FOUND:
        message = '请求的资源不存在'
        break
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message = '服务器内部错误'
        break
      default:
        message = `网络错误：${statusCode}`
    }

    // 显示错误提示
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2500
    })

    // 如果需要跳转到登录页
    if (shouldRedirectToLogin) {
      // 清除token并跳转到登录页
      uni.removeStorageSync(constants.STORAGE_KEYS.TOKEN)
      uni.removeStorageSync(constants.STORAGE_KEYS.USER_INFO)
      
      setTimeout(() => {
        uni.reLaunch({
          url: constants.PAGE_PATHS.LOGIN
        })
      }, 2500)
    }
  }

  /**
   * 处理业务逻辑错误
   * @param {Object} data 
   */
  handleBusinessError(data) {
    const message = data.message || data.msg || '请求失败'
    // 检查是否为token过期相关的业务错误
    const tokenExpiredCodes = [401, 402, 'TOKEN_EXPIRED', 'UNAUTHORIZED']
    const isTokenExpired = tokenExpiredCodes.includes(data.code) || 
                          tokenExpiredCodes.includes(data.status) ||
                          message.includes('token') ||
                          message.includes('登录') ||
                          message.includes('过期') ||
                          message.includes('unauthorized')
    
    if (isTokenExpired) {
      console.log('Token过期，清除本地数据并跳转登录页')
      // 清除token和用户信息
      uni.removeStorageSync(constants.STORAGE_KEYS.TOKEN)
      uni.removeStorageSync(constants.STORAGE_KEYS.USER_INFO)
      
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
      
      // 延迟跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: constants.PAGE_PATHS.LOGIN
        })
      }, 2000)
    } else {
      uni.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    }
  }

  /**
   * 处理网络错误
   * @param {Object} error 
   */
  handleNetworkError(error) {
    let message = '网络连接失败'
    
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        message = '请求超时，请重试'
      } else if (error.errMsg.includes('fail')) {
        message = '网络请求失败，请检查网络连接'
      }
    }
    
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  }

  /**
   * 核心请求方法
   * @param {Object} options 请求配置
   */
  request(options) {
    return new Promise((resolve, reject) => {
      // 默认配置
      const config = {
        method: 'GET',
        timeout: this.timeout,
        header: this.header,
        ...options
      }

      try {
        // 请求拦截器处理
        const processedConfig = this.requestInterceptor(config)

        // 发起请求
        uni.request({
          ...processedConfig,
          success: (response) => {
            this.responseInterceptor(response)
              .then(resolve)
              .catch(reject)
          },
          fail: (error) => {
            // 隐藏加载提示
            uni.hideLoading()
            console.error('请求失败:', error)
            console.error('请求URL:', processedConfig.url)
            
            // 处理网络错误
            this.handleNetworkError(error)
            reject(error)
          },
          complete: () => {
            // 请求完成后的处理
          }
        })
      } catch (error) {
        // 处理请求拦截器中的错误（如未登录）
        console.error('请求拦截器错误:', error)
        reject(error)
      }
    })
  }

  /**
   * GET请求
   * @param {String} url 
   * @param {Object} params 
   * @param {Object} options 
   */
  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options
    })
  }

  /**
   * POST请求
   * @param {String} url 
   * @param {Object} data 
   * @param {Object} options 
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   * @param {String} url 
   * @param {Object} data 
   * @param {Object} options 
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   * @param {String} url 
   * @param {Object} params 
   * @param {Object} options 
   */
  delete(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data: params,
      ...options
    })
  }
}

// 创建请求实例
const http = new Request()

// 导出实例
export default http
