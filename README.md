# 酒店营销管理系统

基于uni-app + Vue2开发的酒店营销管理微信小程序，提供营销任务管理、数据统计分析、多渠道内容发布等功能。

## 📋 项目概述

本系统为酒店行业提供全方位的营销管理解决方案，支持营销任务规划、执行跟踪、效果分析等完整营销流程。

### 🎯 主要功能

- **营销策略管理** - 制定和管理营销计划，任务分配和跟踪
- **营销日历** - 可视化营销任务安排，支持月度/日度视图
- **多渠道管理** - 统一管理微信、抖音、小红书等渠道内容
- **数据分析** - 实时统计营销效果，ROI分析和趋势预测
- **团队协作** - 任务分配、进度跟踪、协作沟通
- **素材管理** - 营销素材库，支持图片、视频、文档管理

## 🛠 技术栈

- **前端框架**: uni-app + Vue2
- **UI组件**: uv-ui
- **状态管理**: Vuex (可选)
- **网络请求**: 封装的HTTP请求库
- **构建工具**: HBuilderX
- **代码规范**: ESLint + Prettier

## 📱 支持平台

- [x] 微信小程序
- [x] H5
- [x] Android App
- [x] iOS App

## 🚀 快速开始

### 环境要求

- Node.js >= 14.x
- HBuilderX >= 3.0.0
- 微信开发者工具 (小程序开发)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/hrms-AI/Marketing-app.git
cd Marketing-app
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
```bash
# 复制配置文件
cp utils/config.example.js utils/config.js

# 编辑配置文件，设置API地址
vim utils/config.js
```

4. **运行项目**
```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

### 开发环境配置

编辑 `utils/config.js` 文件：

```javascript
const ENV_CONFIG = {
  development: {
    BASE_URL: 'http://your-api-domain.com',
    TIMEOUT: 15000,
    DEBUG: true
  }
}
```

## 📁 项目结构

```
Marketing-app/
├── components/          # 公共组件
│   ├── bottom-tabbar/   # 底部导航
│   ├── marketing-calendar/ # 营销日历
│   └── ...
├── pages/              # 页面文件
│   ├── strategy/       # 营销策略页
│   ├── team/          # 团队管理页
│   ├── material/      # 素材管理页
│   └── report/        # 数据报告页
├── utils/             # 工具函数
│   ├── request.js     # 网络请求封装
│   ├── api.js         # API接口定义
│   └── config.js      # 环境配置
├── services/          # 业务服务层
├── mixins/           # 混入文件
├── stores/           # 状态管理
├── types/            # TypeScript类型定义
├── docs/             # 项目文档
└── static/           # 静态资源
```

## 📖 文档

### API文档
- [📋 API接口文档](./docs/API接口文档.md) - 完整的后端API接口说明
- [🔧 API使用示例](./docs/API使用示例.md) - 前端调用API的实际示例
- [📊 前端数据结构说明](./docs/前端数据结构说明.md) - 详细的数据结构定义

### 开发文档
- [🏗 开发模型说明](./docs/development-model.md) - 项目架构和开发规范
- [🧭 底部导航配置](./docs/tabbar-setup.md) - 导航栏配置说明
- [🔧 网络请求使用指南](./utils/README.md) - HTTP请求封装使用说明

## 🔗 API接口概览

### 认证相关
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user/hotel_info/{userId}` - 获取用户酒店信息
- `POST /api/auth/refresh` - 刷新Token

### 营销管理
- `GET /api/marketing/plans` - 获取营销计划列表
- `POST /api/marketing/tasks` - 创建营销任务
- `PUT /api/marketing/tasks/{taskId}/status` - 更新任务状态
- `GET /api/marketing/tasks/{taskId}` - 获取任务详情

### 数据统计
- `GET /api/marketing/statistics/overview` - 营销数据概览
- `GET /api/marketing/statistics/channels` - 渠道分析数据

### 文件管理
- `POST /api/files/upload` - 文件上传
- `GET /api/files` - 获取文件列表

> 详细接口说明请查看 [API接口文档](./docs/API接口文档.md)

## 🎨 核心功能展示

### 1. 营销策略管理
- 📅 营销日历视图，直观展示任务安排
- ✅ 任务状态跟踪，支持多种状态切换
- 🎯 智能任务推荐和AI生成功能

### 2. 数据分析报告
- 📊 实时数据统计，多维度分析
- 📈 趋势图表展示，支持自定义时间范围
- 💰 ROI计算和成本效益分析

### 3. 多渠道管理
- 📱 微信、抖音、小红书等主流平台
- 🔄 内容同步发布，统一管理
- 📋 渠道效果对比分析

## 🔧 配置说明

### 环境配置
```javascript
// utils/config.js
export const config = {
  BASE_URL: 'http://172.16.4.176:5001',  // API基础地址
  TIMEOUT: 15000,                        // 请求超时时间
  DEBUG: true                            // 调试模式
}
```

### 页面路由配置
```json
// pages.json
{
  "pages": [
    {
      "path": "pages/strategy/index",
      "style": {
        "navigationBarTitleText": "营销策略"
      }
    }
  ]
}
```

## 🧪 测试

### 单元测试
```bash
npm run test:unit
```

### E2E测试
```bash
npm run test:e2e
```

## 📦 构建部署

### 小程序构建
```bash
npm run build:mp-weixin
```

### H5构建
```bash
npm run build:h5
```

### App构建
```bash
npm run build:app
```

## 🐛 常见问题

### 1. 网络请求失败
- 检查 `utils/config.js` 中的API地址配置
- 确认网络连接和服务器状态
- 查看控制台网络请求日志

### 2. 小程序授权问题
- 检查小程序配置文件中的域名白名单
- 确认用户授权状态
- 重新获取用户授权

### 3. 页面渲染异常
- 检查数据结构是否正确
- 查看组件生命周期调用顺序
- 使用调试工具检查数据流

## 🤝 贡献指南

1. Fork 项目到个人仓库
2. 创建功能分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送分支: `git push origin feature/AmazingFeature`
5. 提交 Pull Request

### 代码规范
- 使用ESLint进行代码检查
- 遵循Vue.js官方风格指南
- 组件名使用PascalCase命名
- 文件名使用kebab-case命名

## 📄 开源协议

本项目使用 [MIT License](LICENSE) 开源协议。

## 📞 联系方式

- **项目维护**: hrms-AI团队
- **技术支持**: dev@hotel-marketing.com
- **问题反馈**: [GitHub Issues](https://github.com/hrms-AI/Marketing-app/issues)

## 🔄 更新日志

### v1.0.0 (2025-12-05)
- ✨ 初始版本发布
- 🎉 完成核心功能开发
- 📚 完善项目文档
- 🚀 支持多平台构建

---

<p align="center">
  <strong>🌟 如果这个项目对您有帮助，请给个Star支持一下！</strong>
</p>
