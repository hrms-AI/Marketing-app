# 营销管理系统开发模型 (UniApp + Vue2)

## 项目概述
基于 uni-app + Vue2 的跨平台营销管理系统，支持价格策略、素材管理、团队询价、报告分析等核心业务功能。

## 技术栈
- **框架**: uni-app + Vue 2.7.16
- **UI组件**: uview-ui 2.0.38 + @climblee/uv-ui 1.1.20
- **样式**: Less 4.4.0 + uni.scss
- **图表**: qiun-data-charts
- **状态管理**: Vuex (如需要)

## 项目架构模型

### 1. 三层架构设计
```
┌─────────────────────────────────────────┐
│                UI 层 (Vue Pages)        │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │   pages/    │  │    components/      │ │
│  │  ├─login/   │  │  ├─status-bar/     │ │
│  │  ├─main/    │  │  ├─top-navbar/     │ │
│  │  ├─strategy/│  │  ├─bottom-tabbar/  │ │
│  │  ├─team/    │  │  ├─price-strategy/ │ │
│  │  └─report/  │  │  └─ui/            │ │
│  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────┤
│              逻辑层 (Composables)        │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │ composables/│  │      hooks/         │ │
│  │  ├─useAuth  │  │  ├─useFileUpload   │ │
│  │  ├─useChart │  │  ├─useMaterial     │ │
│  │  ├─useData  │  │  └─useStrategy     │ │
│  │  └─useUI    │  │                    │ │
│  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────┤
│              服务层 (Services)           │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │  services/  │  │      utils/         │ │
│  │  ├─api/     │  │  ├─request.js      │ │
│  │  ├─auth/    │  │  ├─format.js       │ │
│  │  ├─upload/  │  │  ├─validate.js     │ │
│  │  └─chart/   │  │  └─storage.js      │ │
│  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. 核心业务模块

#### 2.1 用户认证模块 (pages/login/)
```javascript
// 职责：用户登录、权限验证、会话管理
// 组件：login-form
// 服务：auth-service
// 状态：user-store
```

#### 2.2 价格策略模块 (pages/strategy/)
```javascript
// 职责：90天策略分析、归因分析、价格更改
// 组件：price-strategy, qiun-data-charts
// 服务：strategy-service, chart-service
// 数据：图表配置、价格历史、推荐算法
```

#### 2.3 素材管理模块 (pages/team/)
```javascript
// 职责：图片/视频/文档素材管理、批量操作
// 组件：material-grid, upload-area
// 服务：upload-service, file-service
// 功能：多类型上传、编辑模式、批量删除
```

#### 2.4 团队询价模块 (pages/team/inquiry)
```javascript
// 职责：团队询价表单、历史记录
// 组件：team-inquiry
// 服务：inquiry-service
// 数据：询价表单、历史记录
```

#### 2.5 报告分析模块 (pages/report/)
```javascript
// 职责：收益报告、数据可视化
// 组件：revenue-report
// 服务：report-service
// 数据：统计数据、图表配置
```

### 3. 组件设计规范

#### 3.1 全局组件 (components/)
```
status-bar/          # 状态栏适配
top-navbar/          # 顶部导航栏
bottom-tabbar/       # 底部标签栏
hotel-dropdown/      # 酒店选择下拉
ui/                  # 通用UI组件
ui-button/           # 自定义按钮
```

#### 3.2 业务组件
```
price-strategy/      # 价格策略图表
team-inquiry/        # 团队询价表单
revenue-report/      # 收益报告
login-form/          # 登录表单
```

### 4. 文件组织规范

#### 4.1 页面结构
```vue
<template>
  <view class="page-container">
    <!-- 页面内容 -->
  </view>
</template>

<script>
export default {
  name: 'PageName',
  data() {
    return {
      // 页面状态
    }
  },
  mounted() {
    // 页面初始化
  },
  methods: {
    // 页面方法
  }
}
</script>

<style lang="less" scoped>
// 页面样式
</style>
```

#### 4.2 组件结构
```
component-name/
├── index.vue        # 主组件文件
├── types.js         # 类型定义 (如需要)
└── config.js        # 配置常量 (如需要)
```

### 5. 样式设计系统

#### 5.1 色彩体系
```scss
// 主色调 - 橙色系
$primary-color: #ff7d00;
$primary-light: #bf6a00;
$primary-bg: #fff8f2;
$primary-content: #ffeee6;

// 功能色
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #ff4757;

// 中性色
$text-primary: #333;
$text-secondary: #666;
$text-disabled: #999;
$bg-primary: #fff;
$bg-secondary: #f5f5f5;
$border-color: #e0e0e0;
```

#### 5.2 尺寸系统 (rpx)
```scss
// 间距
$space-xs: 8rpx;
$space-sm: 16rpx;
$space-md: 24rpx;
$space-lg: 32rpx;
$space-xl: 48rpx;

// 字体
$font-xs: 20rpx;
$font-sm: 24rpx;
$font-md: 28rpx;
$font-lg: 32rpx;
$font-xl: 36rpx;

// 圆角
$radius-sm: 8rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
```

### 6. 状态管理模型

#### 6.1 状态分层
```javascript
// 组件内状态 (data)
- 表单输入状态
- UI控制状态 (loading, visible)
- 临时计算状态

// 页面级状态 (页面data + props)
- 页面业务数据
- 页面间传参

// 全局状态 (如需Vuex)
- 用户认证信息
- 应用配置信息
- 跨页面共享数据
```

### 7. 网络请求模型

#### 7.1 请求封装
```javascript
// utils/request.js
const request = (options) => {
  return uni.request({
    url: baseURL + options.url,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    }
  })
}
```

#### 7.2 API服务
```javascript
// services/api/
auth.js          # 认证相关API
strategy.js      # 策略相关API
material.js      # 素材相关API
report.js        # 报告相关API
```

### 8. 文件上传模型

#### 8.1 多类型上传支持
```javascript
// 图片上传: uni.chooseImage
// 视频上传: uni.chooseVideo
// 文件上传: uni.chooseFile (备用方案)
// 支持格式: jpg, png, mp4, pdf, doc, xls等
```

### 9. 跨端兼容策略

#### 9.1 组件使用
```vue
<!-- 推荐 -->
<view class="container">
  <text class="title">标题</text>
</view>

<!-- 避免 -->
<div class="container">
  <span class="title">标题</span>
</div>
```

#### 9.2 样式适配
```scss
/* 使用rpx单位 */
.container {
  padding: 32rpx;
  font-size: 28rpx;
}

/* 状态栏安全区域 */
.status-bar {
  height: var(--status-bar-height);
}
```

### 10. 性能优化模型

#### 10.1 代码分割
```json
// 分包配置
"subPackages": [{
  "root": "modules/advanced",
  "pages": ["analytics", "settings"]
}]
```

#### 10.2 资源优化
- 图片压缩 < 100KB
- 组件懒加载
- 数据缓存策略
- 滚动性能优化 (虚拟滚动)

### 11. 开发工作流

#### 11.1 开发规范
1. 遵循 `.rules.md` 规范
2. 组件先设计后开发
3. API先定义后实现
4. 样式使用设计系统token
5. 代码评审后合并

#### 11.2 测试策略
- 功能测试：各端基本功能
- 兼容性测试：iOS/Android/H5
- 性能测试：启动速度、内存占用
- 用户体验测试：交互流畅度

### 12. 部署发布模型

#### 12.1 构建配置
```javascript
// vue.config.js
module.exports = {
  transpileDependencies: ['uview-ui'],
  chainWebpack: config => {
    // 性能优化配置
  }
}
```

#### 12.2 发布流程
1. 代码构建 -> 2. 测试验证 -> 3. 打包发布 -> 4. 版本管理

---

## 总结

该开发模型基于当前项目的实际架构和业务需求设计，遵循 uni-app 最佳实践，确保代码质量、开发效率和跨端兼容性。开发团队应严格遵循此模型进行开发，保持代码一致性和可维护性。
