/**
 * 环境配置文件
 * 管理不同环境下的API配置
 */

// 环境类型
const ENV_TYPE = {
  DEV: 'development',    // 开发环境
  TEST: 'test',         // 测试环境
  PROD: 'production'    // 生产环境
}

// 当前环境（可以通过编译时替换或手动修改）
const CURRENT_ENV = ENV_TYPE.DEV

// 不同环境的配置
const ENV_CONFIG = {
  [ENV_TYPE.DEV]: {
    BASE_URL: 'http://localhost:5001',
    TIMEOUT: 15000,
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  [ENV_TYPE.TEST]: {
    BASE_URL: 'https://test-api.example.com',
    TIMEOUT: 12000,
    DEBUG: true,
    LOG_LEVEL: 'info'
  },
  [ENV_TYPE.PROD]: {
    BASE_URL: 'https://api.example.com',
    TIMEOUT: 10000,
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
}

// 获取当前环境配置
const getCurrentConfig = () => {
  return ENV_CONFIG[CURRENT_ENV] || ENV_CONFIG[ENV_TYPE.DEV]
}

// 导出配置
export const config = getCurrentConfig()

// 导出环境信息
export const env = {
  isDev: CURRENT_ENV === ENV_TYPE.DEV,
  isTest: CURRENT_ENV === ENV_TYPE.TEST,
  isProd: CURRENT_ENV === ENV_TYPE.PROD,
  current: CURRENT_ENV
}

// 导出常量
export const constants = {
  // 存储键名
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_INFO: 'userInfo',
    APP_CONFIG: 'appConfig',
    THEME: 'theme'
  },
  
  // 页面路径
  PAGE_PATHS: {
    LOGIN: '/pages/login/index',
    INDEX: '/pages/index/index',
    TEAM: '/pages/team/index',
    REPORT: '/pages/report/index'
  },
  
  // HTTP状态码
  HTTP_STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // 业务状态码
  BUSINESS_CODE: {
    SUCCESS: 200,
    FAIL: 400,
    UNAUTHORIZED: 401,
    TOKEN_EXPIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  },
  
  // 文件类型
  FILE_TYPES: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    VIDEO: ['mp4', 'avi', 'mov', 'wmv'],
    DOCUMENT: ['doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx']
  },
  
  // 默认配置
  DEFAULT_CONFIG: {
    PAGE_SIZE: 10,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    CACHE_TIME: 5 * 60 * 1000, // 5分钟
    RETRY_TIMES: 3
  }
}

export default {
  config,
  env,
  constants
}
