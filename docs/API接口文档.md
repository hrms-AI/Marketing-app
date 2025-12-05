# 营销管理系统 API 接口文档

## 1. 文档概述

本文档描述了酒店营销管理系统的所有API接口，包括认证、用户管理、营销任务、数据统计等功能模块。

**项目信息**
- 项目名称：酒店营销管理系统
- 版本：v1.0.0
- 技术栈：uni-app + Vue2
- 基础URL：`http://172.16.4.176:5001`（开发环境）
- 文档更新时间：2025年12月5日

## 2. 通用说明

### 2.1 请求格式
- 请求协议：HTTP/HTTPS
- 请求方式：GET/POST/PUT/DELETE
- 请求头：`Content-Type: application/json`
- 认证方式：Bearer Token

### 2.2 响应格式
```json
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2025-12-05T10:30:00Z"
}
```

### 2.3 状态码说明
| HTTP状态码 | 业务码 | 说明 |
|-----------|--------|------|
| 200 | 200 | 请求成功 |
| 201 | 201 | 创建成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未授权/登录过期 |
| 403 | 403 | 无权限访问 |
| 404 | 404 | 资源不存在 |
| 500 | 500 | 服务器内部错误 |

### 2.4 请求头
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
User-Agent: Marketing-App/1.0.0
```

## 3. 认证相关接口

### 3.1 用户登录
**接口地址：** `POST /api/auth/login`

**请求参数：**
```json
{
  "account": "admin",
  "password": "123456",
  "loginType": "password"
}
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "message": "登录成功",
  "data": {
    "id": "12345",
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@hotel.com",
    "phone": "13800138000",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expireTime": "2025-12-06T10:30:00Z"
  }
}
```

### 3.2 获取用户酒店信息
**接口地址：** `GET /api/auth/user/hotel_info/{userId}`

**路径参数：**
- `userId`: 用户ID

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "hotelId": "hotel_001",
    "hotelName": "北京维景国际大酒店",
    "region": "北京市朝阳区",
    "address": "朝阳区建国门外大街2号",
    "contact": {
      "phone": "010-12345678",
      "email": "contact@hotel.com"
    },
    "status": "active"
  }
}
```

### 3.3 刷新Token
**接口地址：** `POST /api/auth/refresh`

**请求参数：**
```json
{
  "refreshToken": "refresh_token_here"
}
```

## 4. 营销计划接口

### 4.1 获取营销计划列表
**接口地址：** `GET /api/marketing/plans`

**查询参数：**
```
hotelId: string (必填) - 酒店ID
year: number (必填) - 年份，如2025
month: number (必填) - 月份，1-12
status: string (可选) - 任务状态筛选，all|completed|pending|inProgress
page: number (可选) - 页码，默认1
pageSize: number (可选) - 每页数量，默认30
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "summary": {
      "totalTasks": 144,
      "completedTasks": 78,
      "inProgressTasks": 3,
      "pendingTasks": 63
    },
    "dailyPlans": [
      {
        "day": "01",
        "date": "2025-12-01",
        "weekday": "周日",
        "tasks": [
          {
            "id": "task_001",
            "time": "09:00",
            "icon": "💬",
            "title": "客户咨询回复",
            "description": "及时回复各平台客户咨询，维护客户关系，推荐合适套餐",
            "status": "已完成",
            "statusClass": "completed",
            "channels": ["微信", "电话", "在线客服"],
            "priority": "high",
            "assignedTo": "张小明",
            "estimatedTime": 30,
            "actualTime": 25,
            "completedAt": "2025-12-01T09:25:00Z"
          }
        ],
        "taskCount": 4,
        "completionRate": 75
      }
    ],
    "metrics": [
      {
        "icon": "👀",
        "name": "品牌曝光量",
        "current": "8.5万",
        "target": "10万",
        "progress": 85,
        "unit": "次",
        "trend": "up"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 30,
      "total": 31,
      "hasNext": false
    }
  }
}
```

### 4.2 创建营销任务
**接口地址：** `POST /api/marketing/tasks`

**请求参数：**
```json
{
  "hotelId": "hotel_001",
  "date": "2025-12-06",
  "time": "10:00",
  "title": "抖音短视频发布",
  "description": "发布酒店美景展示视频，重点突出客房舒适度",
  "type": "抖音视频",
  "priority": "medium",
  "channels": ["抖音", "快手"],
  "assignedTo": "marketing_001",
  "estimatedTime": 60,
  "status": "待执行"
}
```

**响应数据：**
```json
{
  "code": 201,
  "success": true,
  "message": "任务创建成功",
  "data": {
    "taskId": "task_new_001",
    "createTime": "2025-12-05T10:30:00Z"
  }
}
```

### 4.3 更新任务状态
**接口地址：** `PUT /api/marketing/tasks/{taskId}/status`

**路径参数：**
- `taskId`: 任务ID

**请求参数：**
```json
{
  "status": "已完成",
  "actualTime": 45,
  "completedAt": "2025-12-05T11:15:00Z",
  "notes": "任务完成，效果良好"
}
```

### 4.4 获取任务详情
**接口地址：** `GET /api/marketing/tasks/{taskId}`

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "id": "task_001",
    "hotelId": "hotel_001",
    "date": "2025-12-01",
    "time": "09:00",
    "title": "客户咨询回复",
    "description": "及时回复各平台客户咨询，维护客户关系",
    "type": "客户服务",
    "status": "已完成",
    "priority": "high",
    "channels": ["微信", "电话"],
    "assignedTo": "张小明",
    "estimatedTime": 30,
    "actualTime": 25,
    "createdAt": "2025-11-30T18:00:00Z",
    "updatedAt": "2025-12-01T09:25:00Z",
    "completedAt": "2025-12-01T09:25:00Z",
    "feedback": [
      {
        "userId": "user_001",
        "userName": "李经理",
        "comment": "处理及时，客户反馈良好",
        "rating": 5,
        "createdAt": "2025-12-01T10:00:00Z"
      }
    ]
  }
}
```

## 5. 数据统计接口

### 5.1 获取营销数据概览
**接口地址：** `GET /api/marketing/statistics/overview`

**查询参数：**
```
hotelId: string (必填) - 酒店ID
startDate: string (必填) - 开始日期，格式：2025-12-01
endDate: string (必填) - 结束日期，格式：2025-12-31
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "taskStats": {
      "totalTasks": 144,
      "completedTasks": 78,
      "completionRate": 54.17,
      "pendingTasks": 63,
      "inProgressTasks": 3
    },
    "channelStats": {
      "wechat": {
        "name": "微信营销",
        "taskCount": 45,
        "completionRate": 80,
        "engagement": 1250
      },
      "douyin": {
        "name": "抖音营销",
        "taskCount": 32,
        "completionRate": 75,
        "engagement": 8500
      },
      "xiaohongshu": {
        "name": "小红书营销",
        "taskCount": 28,
        "completionRate": 68,
        "engagement": 3200
      }
    },
    "performanceMetrics": {
      "brandExposure": {
        "name": "品牌曝光量",
        "current": 85000,
        "target": 100000,
        "progress": 85,
        "unit": "次"
      },
      "inquiryConversion": {
        "name": "咨询转化量",
        "current": 156,
        "target": 200,
        "progress": 78,
        "unit": "人"
      },
      "occupancyRate": {
        "name": "实际入住量",
        "current": 89,
        "target": 120,
        "progress": 74,
        "unit": "间"
      },
      "roi": {
        "name": "营销ROI",
        "current": 3.2,
        "target": 4.0,
        "progress": 80,
        "unit": "倍"
      }
    }
  }
}
```

### 5.2 获取渠道分析数据
**接口地址：** `GET /api/marketing/statistics/channels`

**查询参数：**
```
hotelId: string (必填) - 酒店ID
dateRange: string (必填) - 日期范围，7d|30d|90d
channel: string (可选) - 指定渠道筛选
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "channels": [
      {
        "channelId": "wechat",
        "channelName": "微信营销",
        "taskCount": 45,
        "completedCount": 36,
        "completionRate": 80,
        "metrics": {
          "reach": 12500,
          "engagement": 1250,
          "conversion": 125,
          "cost": 2500,
          "roi": 2.8
        },
        "trending": "up"
      }
    ],
    "summary": {
      "totalReach": 85000,
      "totalEngagement": 8500,
      "totalConversion": 512,
      "totalCost": 15000,
      "averageROI": 3.2
    }
  }
}
```

## 6. 文件管理接口

### 6.1 文件上传
**接口地址：** `POST /api/files/upload`

**请求参数：**
- 采用multipart/form-data格式
- file: 文件内容
- type: 文件类型 (image|video|document)
- category: 文件分类 (marketing|template|report)

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "fileId": "file_001",
    "fileName": "marketing_video_001.mp4",
    "fileUrl": "https://cdn.example.com/files/marketing_video_001.mp4",
    "fileSize": 15728640,
    "mimeType": "video/mp4",
    "uploadTime": "2025-12-05T10:30:00Z"
  }
}
```

### 6.2 获取文件列表
**接口地址：** `GET /api/files`

**查询参数：**
```
type: string (可选) - 文件类型筛选
category: string (可选) - 文件分类筛选
page: number (可选) - 页码
pageSize: number (可选) - 每页数量
```

## 7. 报表接口

### 7.1 生成营销报表
**接口地址：** `POST /api/reports/marketing`

**请求参数：**
```json
{
  "hotelId": "hotel_001",
  "reportType": "monthly",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31",
  "includeChannels": ["wechat", "douyin", "xiaohongshu"],
  "metrics": ["exposure", "engagement", "conversion", "roi"]
}
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "reportId": "report_001",
    "reportUrl": "https://cdn.example.com/reports/marketing_202512.pdf",
    "status": "generated",
    "createdAt": "2025-12-05T10:30:00Z"
  }
}
```

## 8. 通知接口

### 8.1 获取消息通知
**接口地址：** `GET /api/notifications`

**查询参数：**
```
type: string (可选) - 通知类型，task|system|marketing
status: string (可选) - 已读状态，read|unread
page: number (可选) - 页码
```

**响应数据：**
```json
{
  "code": 200,
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notify_001",
        "type": "task",
        "title": "任务提醒",
        "content": "您有1个营销任务即将到期",
        "isRead": false,
        "createdAt": "2025-12-05T10:00:00Z",
        "relatedId": "task_001",
        "action": {
          "type": "navigate",
          "url": "/pages/task-detail/index?id=task_001"
        }
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 25
    }
  }
}
```

## 9. 错误处理

### 9.1 常见错误码
```json
{
  "code": 400,
  "success": false,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "hotelId",
      "message": "酒店ID不能为空"
    }
  ],
  "timestamp": "2025-12-05T10:30:00Z"
}
```

### 9.2 认证错误
```json
{
  "code": 401,
  "success": false,
  "message": "登录已过期，请重新登录",
  "timestamp": "2025-12-05T10:30:00Z"
}
```

## 10. 请求示例

### 10.1 JavaScript 示例
```javascript
// 使用项目中的封装方法
import { userApi } from '@/utils/api.js'

// 登录
const loginResult = await userApi.login({
  account: 'admin',
  password: '123456'
})

// 获取营销计划
const planResult = await this.$http.get('/api/marketing/plans', {
  hotelId: 'hotel_001',
  year: 2025,
  month: 12,
  status: 'all'
})
```

### 10.2 cURL 示例
```bash
# 登录
curl -X POST "http://172.16.4.176:5001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "account": "admin",
    "password": "123456"
  }'

# 获取营销计划
curl -X GET "http://172.16.4.176:5001/api/marketing/plans?hotelId=hotel_001&year=2025&month=12" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json"
```

## 11. 版本更新记录

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2025-12-05 | 初始版本，包含基础API接口 |

## 12. 联系方式

如有API使用问题，请联系：
- 开发团队：dev@hotel-marketing.com
- 技术支持：support@hotel-marketing.com

---

*本文档最后更新时间：2025年12月5日*
