/**
 * 工具函数集合
 * 提供常用的辅助函数
 */
import { constants } from './config.js'

/**
 * 存储相关工具
 */
export const storage = {
  // 设置存储
  set(key, value) {
    try {
      uni.setStorageSync(key, JSON.stringify(value))
    } catch (error) {
      console.error('存储设置失败:', error)
    }
  },
  
  // 获取存储
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      if (!value) {
        return defaultValue
      }
      
      // 如果值已经是对象类型，直接返回
      if (typeof value === 'object') {
        return value
      }
      
      // 如果值是字符串，尝试解析JSON，如果解析失败则返回原字符串
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch (parseError) {
          // 如果JSON解析失败，说明这是一个普通字符串，直接返回
          return value
        }
      }
      
      return value
    } catch (error) {
      console.error('存储获取失败:', error)
      return defaultValue
    }
  },
  
  // 删除存储
  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('存储删除失败:', error)
    }
  },
  
  // 清空存储
  clear() {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('存储清空失败:', error)
    }
  }
}

/**
 * 用户相关工具
 */
export const user = {
  // 获取Token
  getToken() {
    return storage.get(constants.STORAGE_KEYS.TOKEN, '')
  },
  
  // 设置Token
  setToken(token) {
    // Token直接作为字符串存储，不需要JSON.stringify
    try {
      uni.setStorageSync(constants.STORAGE_KEYS.TOKEN, token)
    } catch (error) {
      console.error('Token设置失败:', error)
    }
  },
  
  // 清除Token
  clearToken() {
    storage.remove(constants.STORAGE_KEYS.TOKEN)
  },
  
  // 获取用户信息
  getUserInfo() {
    return storage.get(constants.STORAGE_KEYS.USER_INFO, {})
  },
  
  // 设置用户信息
  setUserInfo(userInfo) {
    storage.set(constants.STORAGE_KEYS.USER_INFO, userInfo)
  },
  
  // 清除用户信息
  clearUserInfo() {
    storage.remove(constants.STORAGE_KEYS.USER_INFO)
  },
  
  // 检查是否已登录
  isLoggedIn() {
    const token = this.getToken()
    return token && token.length > 0
  },
  
  // 登出
  logout() {
    this.clearToken()
    this.clearUserInfo()
    uni.reLaunch({
      url: constants.PAGE_PATHS.LOGIN
    })
  }
}

/**
 * 日期时间工具
 */
export const datetime = {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return ''
    
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
  },
  
  // 格式化时间戳
  formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    return this.formatDate(new Date(timestamp), format)
  },
  
  // 获取相对时间描述
  getRelativeTime(date) {
    const now = new Date()
    const target = new Date(date)
    const diff = now - target
    
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day
    const year = 365 * day
    
    if (diff < minute) {
      return '刚刚'
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`
    } else if (diff < week) {
      return `${Math.floor(diff / day)}天前`
    } else if (diff < month) {
      return `${Math.floor(diff / week)}周前`
    } else if (diff < year) {
      return `${Math.floor(diff / month)}个月前`
    } else {
      return `${Math.floor(diff / year)}年前`
    }
  },
  
  // 获取今天的日期范围
  getTodayRange() {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    return {
      start: start.getTime(),
      end: end.getTime() - 1
    }
  }
}

/**
 * 文件相关工具
 */
export const file = {
  // 获取文件扩展名
  getExtension(filename) {
    return filename.split('.').pop().toLowerCase()
  },
  
  // 检查是否为图片
  isImage(filename) {
    const ext = this.getExtension(filename)
    return constants.FILE_TYPES.IMAGE.includes(ext)
  },
  
  // 检查是否为视频
  isVideo(filename) {
    const ext = this.getExtension(filename)
    return constants.FILE_TYPES.VIDEO.includes(ext)
  },
  
  // 格式化文件大小
  formatSize(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },
  
  // 检查文件大小是否超限
  checkSize(fileSize, maxSize = constants.DEFAULT_CONFIG.MAX_FILE_SIZE) {
    return fileSize <= maxSize
  }
}

/**
 * 字符串工具
 */
export const string = {
  // 生成随机字符串
  random(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },
  
  // 截取字符串
  truncate(str, maxLength, suffix = '...') {
    if (!str || str.length <= maxLength) return str
    return str.substring(0, maxLength) + suffix
  },
  
  // 手机号脱敏
  maskPhone(phone) {
    if (!phone || phone.length !== 11) return phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },
  
  // 身份证脱敏
  maskIdCard(idCard) {
    if (!idCard) return idCard
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }
}

/**
 * 数字工具
 */
export const number = {
  // 格式化金额
  formatMoney(amount, decimals = 2) {
    if (isNaN(amount)) return '0.00'
    
    return Number(amount).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  },
  
  // 生成随机数
  random(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  
  // 保留小数位
  toFixed(num, decimals = 2) {
    return Number(num).toFixed(decimals)
  }
}

/**
 * 验证工具
 */
export const validate = {
  // 验证手机号
  phone(phone) {
    const reg = /^1[3-9]\d{9}$/
    return reg.test(phone)
  },
  
  // 验证邮箱
  email(email) {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return reg.test(email)
  },
  
  // 验证身份证
  idCard(idCard) {
    const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(idCard)
  },
  
  // 验证密码强度
  password(password) {
    // 至少8位，包含大小写字母、数字
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return reg.test(password)
  },
  
  // 验证URL
  url(url) {
    const reg = /^https?:\/\/.+/
    return reg.test(url)
  }
}

/**
 * 页面跳转工具
 */
export const navigation = {
  // 普通跳转
  navigateTo(url, params = {}) {
    const query = this.buildQuery(params)
    uni.navigateTo({
      url: query ? `${url}?${query}` : url
    })
  },
  
  // 重定向
  redirectTo(url, params = {}) {
    const query = this.buildQuery(params)
    uni.redirectTo({
      url: query ? `${url}?${query}` : url
    })
  },
  
  // 重新启动
  reLaunch(url, params = {}) {
    const query = this.buildQuery(params)
    uni.reLaunch({
      url: query ? `${url}?${query}` : url
    })
  },
  
  // 返回
  navigateBack(delta = 1) {
    uni.navigateBack({
      delta
    })
  },
  
  // 构建查询字符串
  buildQuery(params) {
    if (!params || Object.keys(params).length === 0) return ''
    
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
  }
}

/**
 * 设备信息工具
 */
export const device = {
  // 获取系统信息
  getSystemInfo() {
    return uni.getSystemInfoSync()
  },
  
  // 判断是否为iOS
  isIOS() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.platform === 'ios'
  },
  
  // 判断是否为Android
  isAndroid() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.platform === 'android'
  },
  
  // 获取状态栏高度
  getStatusBarHeight() {
    const systemInfo = this.getSystemInfo()
    return systemInfo.statusBarHeight || 0
  }
}

// 默认导出所有工具
export default {
  storage,
  user,
  datetime,
  file,
  string,
  number,
  validate,
  navigation,
  device
}
