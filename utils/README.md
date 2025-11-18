# uni-app 网络请求封装使用说明

## 概述

本项目提供了一套完整的uni-app网络请求封装方案，包含请求拦截、响应处理、错误统一处理、文件上传下载等功能。

## 文件结构

```
utils/
├── config.js          # 环境配置文件
├── request.js         # 网络请求封装
├── api.js            # API接口管理
├── utils.js          # 工具函数集合
└── request-example.js # 使用示例
```

## 特性

- ✅ 统一的请求/响应拦截器
- ✅ 自动Token管理
- ✅ 统一错误处理和提示
- ✅ 环境配置管理
- ✅ 文件上传/下载支持
- ✅ 请求加载状态管理
- ✅ TypeScript友好
- ✅ Promise/async-await支持

## 快速开始

### 1. 配置环境

编辑 `utils/config.js` 文件，设置你的API地址：

```javascript
const ENV_CONFIG = {
  development: {
    BASE_URL: 'https://dev-api.yourapp.com',
    TIMEOUT: 15000,
    DEBUG: true
  },
  production: {
    BASE_URL: 'https://api.yourapp.com',
    TIMEOUT: 10000,
    DEBUG: false
  }
}
```

### 2. 定义API接口

在 `utils/api.js` 中定义你的接口：

```javascript
export const userApi = {
  login: (data) => http.post('/user/login', data),
  getUserInfo: () => http.get('/user/info'),
  updateProfile: (data) => http.put('/user/profile', data)
}
```

### 3. 在页面中使用

```javascript
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  
  async onLoad() {
    await this.login()
    await this.getUserInfo()
  },
  
  methods: {
    // 方式一：使用预定义的API
    async login() {
      try {
        const res = await this.$api.userApi.login({
          username: 'test',
          password: '123456'
        })
        
        // 保存token
        this.$utils.user.setToken(res.data.token)
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
      } catch (error) {
        // 错误已经在拦截器中处理，这里可以做额外处理
        console.log('登录失败:', error)
      }
    },
    
    // 方式二：直接使用$http
    async getUserInfo() {
      try {
        const res = await this.$http.get('/user/info')
        this.userInfo = res.data
      } catch (error) {
        console.log('获取用户信息失败:', error)
      }
    }
  }
}
```

## API文档

### Request类方法

#### 基础请求方法

- `get(url, params, options)` - GET请求
- `post(url, data, options)` - POST请求
- `put(url, data, options)` - PUT请求
- `delete(url, params, options)` - DELETE请求

#### 文件操作方法

- `upload(url, filePath, formData, options)` - 文件上传
- `download(url, options)` - 文件下载

#### 配置方法

- `setBaseURL(baseURL)` - 设置基础URL
- `setHeader(header)` - 设置请求头

### 工具函数

#### 存储工具 ($utils.storage)

```javascript
this.$utils.storage.set('key', value)     // 设置存储
this.$utils.storage.get('key', default)  // 获取存储
this.$utils.storage.remove('key')        // 删除存储
this.$utils.storage.clear()              // 清空存储
```

#### 用户工具 ($utils.user)

```javascript
this.$utils.user.getToken()              // 获取Token
this.$utils.user.setToken(token)         // 设置Token
this.$utils.user.getUserInfo()           // 获取用户信息
this.$utils.user.isLoggedIn()            // 检查登录状态
this.$utils.user.logout()                // 登出
```

#### 日期工具 ($utils.datetime)

```javascript
this.$utils.datetime.formatDate(date, 'YYYY-MM-DD')  // 格式化日期
this.$utils.datetime.getRelativeTime(date)           // 相对时间
this.$utils.datetime.getTodayRange()                 // 今天时间范围
```

#### 验证工具 ($utils.validate)

```javascript
this.$utils.validate.phone(phone)        // 验证手机号
this.$utils.validate.email(email)        // 验证邮箱
this.$utils.validate.password(password)  // 验证密码
```

#### 导航工具 ($utils.navigation)

```javascript
this.$utils.navigation.navigateTo('/pages/detail', { id: 1 })
this.$utils.navigation.redirectTo('/pages/login')
this.$utils.navigation.navigateBack(2)
```

## 高级用法

### 自定义请求拦截器

```javascript
// 在request.js中修改requestInterceptor方法
requestInterceptor(config) {
  // 自定义逻辑
  config.header['Custom-Header'] = 'custom-value'
  return config
}
```

### 自定义响应拦截器

```javascript
// 在request.js中修改responseInterceptor方法
responseInterceptor(response) {
  const { data } = response
  
  // 自定义业务逻辑判断
  if (data.success) {
    return Promise.resolve(data)
  } else {
    return Promise.reject(data)
  }
}
```

### 文件上传示例

```javascript
async uploadAvatar() {
  try {
    // 选择图片
    const chooseResult = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed']
    })
    
    const filePath = chooseResult.tempFilePaths[0]
    
    // 上传文件
    const result = await this.$api.fileApi.uploadFile(filePath, {
      type: 'avatar'
    })
    
    console.log('上传成功:', result)
  } catch (error) {
    console.log('上传失败:', error)
  }
}
```

### 批量请求

```javascript
async loadPageData() {
  try {
    // 并发请求多个接口
    const [userInfo, orderList, messageCount] = await Promise.all([
      this.$api.userApi.getUserInfo(),
      this.$api.orderApi.getOrderList({ page: 1 }),
      this.$api.messageApi.getUnreadCount()
    ])
    
    // 处理数据
    this.userInfo = userInfo.data
    this.orderList = orderList.data.list
    this.messageCount = messageCount.data.count
  } catch (error) {
    console.log('加载页面数据失败:', error)
  }
}
```

## 错误处理

系统自动处理以下错误类型：

1. **网络错误** - 显示"网络连接失败"提示
2. **HTTP状态码错误** - 根据状态码显示相应提示
3. **业务逻辑错误** - 显示服务器返回的错误信息
4. **Token过期** - 自动清除token并跳转到登录页

## 注意事项

1. **Token管理**: 系统会自动在请求头中添加token，确保后端接口支持`Authorization: Bearer ${token}`的认证方式

2. **错误提示**: 所有错误都会自动显示toast提示，无需手动处理

3. **加载状态**: 请求时会自动显示loading，完成后自动隐藏

4. **环境配置**: 记得根据实际情况修改`config.js`中的API地址

5. **跨域问题**: 在HBuilderX中配置manifest.json的域名白名单

## 常见问题

### Q: 如何禁用某个请求的loading提示？

A: 在请求选项中设置`showLoading: false`：

```javascript
const res = await this.$http.get('/api/data', {}, { showLoading: false })
```

### Q: 如何自定义错误处理？

A: 可以在catch中进行额外处理：

```javascript
try {
  const res = await this.$api.userApi.login(data)
} catch (error) {
  if (error.code === 1001) {
    // 自定义处理逻辑
  }
}
```

### Q: 如何修改默认的超时时间？

A: 修改`config.js`中的`TIMEOUT`配置，或在单个请求中指定：

```javascript
const res = await this.$http.get('/api/data', {}, { timeout: 30000 })
```

## 更新日志

- v1.0.0 - 初始版本，包含基础请求封装
- v1.1.0 - 添加文件上传下载功能
- v1.2.0 - 添加工具函数集合
- v1.3.0 - 添加环境配置管理
