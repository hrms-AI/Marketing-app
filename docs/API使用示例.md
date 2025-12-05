# API 使用示例文档

## 1. 项目中的API使用方式

本项目使用了统一的HTTP请求封装，所有API调用都通过以下方式进行：

### 1.1 导入方式
```javascript
// 方式一：使用全局挂载的$http
this.$http.get('/api/endpoint')

// 方式二：导入具体的API方法
import { userApi, marketingApi } from '@/utils/api.js'

// 方式三：直接导入http实例
import http from '@/utils/request.js'
```

## 2. 认证相关API使用示例

### 2.1 用户登录
```javascript
// pages/login/index.vue
export default {
  methods: {
    async handleLogin() {
      try {
        // 使用预定义的API方法
        const result = await this.$api.userApi.login({
          account: this.loginForm.account,
          password: this.loginForm.password
        });
        
        // Token会自动存储在响应拦截器中
        console.log('登录成功:', result);
        
        // 跳转到主页面
        uni.reLaunch({
          url: '/pages/strategy/index'
        });
        
      } catch (error) {
        console.error('登录失败:', error);
        // 错误提示已在请求拦截器中处理
      }
    }
  }
}
```

### 2.2 获取用户酒店信息
```javascript
// mixins/hotel-manager.js
export default {
  methods: {
    async loadHotelInfo() {
      try {
        const userId = this.$utils?.user?.getCurrentUserId();
        if (!userId) return;
        
        const result = await this.$api.userApi.getHotelInfo(userId);
        
        this.hotelInfo = result.data;
        this.selectedHotelId = result.data.hotelId;
        
        // 保存到本地存储
        uni.setStorageSync('hotelInfo', result.data);
        
      } catch (error) {
        console.error('获取酒店信息失败:', error);
        // 使用默认酒店信息
        this.setDefaultHotel();
      }
    }
  }
}
```

## 3. 营销计划API使用示例

### 3.1 获取营销计划列表
```javascript
// pages/marketing-plan/index.vue
export default {
  data() {
    return {
      planData: null,
      loading: false,
      selectedFilter: 'all'
    }
  },
  
  methods: {
    async loadPlanData() {
      this.loading = true;
      
      try {
        const params = {
          hotelId: this.hotelId,
          year: this.year,
          month: this.month,
          status: this.selectedFilter
        };
        
        // 调用营销计划API
        const response = await this.$http.get('/api/marketing/plans', params);
        
        // 处理响应数据
        this.planData = {
          totalTasks: response.data.summary.totalTasks,
          completedTasks: response.data.summary.completedTasks,
          inProgressTasks: response.data.summary.inProgressTasks,
          pendingTasks: response.data.summary.pendingTasks,
          dailyPlans: response.data.dailyPlans,
          metrics: response.data.metrics
        };
        
        console.log('营销计划加载完成:', this.planData);
        
      } catch (error) {
        console.error('加载营销计划失败:', error);
        // 如果API失败，使用Mock数据
        this.loadMockData();
      } finally {
        this.loading = false;
      }
    },
    
    // 备用Mock数据加载方法
    loadMockData() {
      const dailyPlans = this.generateDailyPlans();
      // ... Mock数据处理逻辑
    }
  }
}
```

### 3.2 创建营销任务
```javascript
// components/add-task-modal/index.vue
export default {
  methods: {
    async submitTask() {
      // 验证表单数据
      if (!this.validateForm()) {
        return;
      }
      
      try {
        const taskData = {
          hotelId: this.hotelId,
          date: this.taskForm.date,
          time: this.taskForm.time,
          title: this.taskForm.title,
          description: this.taskForm.description,
          type: this.taskForm.type,
          priority: this.taskForm.priority || 'medium',
          channels: this.taskForm.channels || [],
          assignedTo: this.taskForm.assignedTo,
          estimatedTime: this.taskForm.estimatedTime
        };
        
        const response = await this.$http.post('/api/marketing/tasks', taskData);
        
        uni.showToast({
          title: '任务创建成功',
          icon: 'success'
        });
        
        // 通知父组件刷新数据
        this.$emit('task-created', response.data);
        
        // 关闭弹窗
        this.closeModal();
        
      } catch (error) {
        console.error('创建任务失败:', error);
        uni.showToast({
          title: '创建失败，请重试',
          icon: 'error'
        });
      }
    }
  }
}
```

### 3.3 更新任务状态
```javascript
// pages/strategy/index.vue
export default {
  methods: {
    async updateTaskStatus(taskId, newStatus) {
      try {
        const updateData = {
          status: newStatus,
          actualTime: 45, // 实际耗时
          completedAt: new Date().toISOString(),
          notes: '任务顺利完成'
        };
        
        await this.$http.put(`/api/marketing/tasks/${taskId}/status`, updateData);
        
        uni.showToast({
          title: '状态更新成功',
          icon: 'success'
        });
        
        // 刷新页面数据
        this.refreshData();
        
      } catch (error) {
        console.error('更新任务状态失败:', error);
      }
    },
    
    async handleTaskComplete(task) {
      // 确认对话框
      const result = await uni.showModal({
        title: '确认完成',
        content: `确定要将任务"${task.title}"标记为已完成吗？`,
        confirmText: '确定',
        cancelText: '取消'
      });
      
      if (result.confirm) {
        await this.updateTaskStatus(task.id, '已完成');
      }
    }
  }
}
```

## 4. 统计数据API使用示例

### 4.1 获取营销数据概览
```javascript
// pages/report/index.vue
export default {
  data() {
    return {
      statsData: null,
      dateRange: '30d'
    }
  },
  
  methods: {
    async loadStatistics() {
      try {
        const params = {
          hotelId: this.selectedHotelId,
          startDate: this.getStartDate(),
          endDate: this.getEndDate()
        };
        
        const response = await this.$http.get('/api/marketing/statistics/overview', params);
        
        this.statsData = response.data;
        
        // 更新页面显示的统计卡片
        this.updateStatsCards();
        
      } catch (error) {
        console.error('获取统计数据失败:', error);
        // 使用默认数据
        this.setDefaultStats();
      }
    },
    
    updateStatsCards() {
      if (!this.statsData) return;
      
      // 更新统计卡片数据
      this.statsCards = [
        {
          title: '总浏览量',
          value: this.formatNumber(this.statsData.performanceMetrics.brandExposure.current),
          change: '+12.5%',
          trend: 'up'
        },
        {
          title: '转化客户',
          value: this.statsData.performanceMetrics.inquiryConversion.current,
          change: '+8.3%',
          trend: 'up'
        }
        // ... 更多统计项
      ];
    }
  }
}
```

### 4.2 获取渠道分析数据
```javascript
// components/channel-analysis/index.vue
export default {
  methods: {
    async loadChannelData() {
      try {
        const params = {
          hotelId: this.hotelId,
          dateRange: this.selectedDateRange,
          channel: this.selectedChannel
        };
        
        const response = await this.$http.get('/api/marketing/statistics/channels', params);
        
        // 处理渠道数据
        this.channelData = response.data.channels.map(channel => ({
          name: channel.channelName,
          taskCount: channel.taskCount,
          completionRate: channel.completionRate,
          engagement: channel.metrics.engagement,
          roi: channel.metrics.roi,
          trending: channel.trending
        }));
        
        // 更新图表数据
        this.updateCharts();
        
      } catch (error) {
        console.error('获取渠道数据失败:', error);
      }
    },
    
    updateCharts() {
      // 更新图表组件数据
      this.chartOptions = {
        categories: this.channelData.map(item => item.name),
        series: [
          {
            name: '任务完成率',
            data: this.channelData.map(item => item.completionRate)
          },
          {
            name: 'ROI',
            data: this.channelData.map(item => item.roi)
          }
        ]
      };
    }
  }
}
```

## 5. 文件上传API使用示例

### 5.1 图片上传
```javascript
// components/image-uploader/index.vue
export default {
  methods: {
    async uploadImage() {
      try {
        // 选择图片
        const chooseResult = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        });
        
        const tempFilePath = chooseResult.tempFilePaths[0];
        
        // 显示上传进度
        uni.showLoading({
          title: '上传中...'
        });
        
        // 上传文件
        const uploadResult = await uni.uploadFile({
          url: `${this.$config.BASE_URL}/api/files/upload`,
          filePath: tempFilePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${this.$utils.user.getToken()}`
          },
          formData: {
            type: 'image',
            category: 'marketing'
          }
        });
        
        const response = JSON.parse(uploadResult.data);
        
        if (response.success) {
          uni.showToast({
            title: '上传成功',
            icon: 'success'
          });
          
          // 返回文件信息
          this.$emit('upload-success', response.data);
        }
        
      } catch (error) {
        console.error('上传失败:', error);
        uni.showToast({
          title: '上传失败',
          icon: 'error'
        });
      } finally {
        uni.hideLoading();
      }
    }
  }
}
```

## 6. 错误处理最佳实践

### 6.1 统一错误处理
```javascript
// utils/request.js - 响应拦截器
responseInterceptor(response) {
  const { statusCode, data } = response;
  
  if (statusCode === 200) {
    // 成功响应处理
    if (data && data.success) {
      return Promise.resolve(data);
    } else {
      // 业务错误处理
      this.handleBusinessError(data);
      return Promise.reject(data);
    }
  } else {
    // HTTP错误处理
    this.handleHttpError(statusCode);
    return Promise.reject({
      statusCode,
      message: '网络请求失败'
    });
  }
}
```

### 6.2 页面级错误处理
```javascript
// pages/strategy/index.vue
export default {
  methods: {
    async loadData() {
      try {
        await this.loadHotelInfo();
        await this.loadMarketingData();
        await this.loadStatistics();
        
      } catch (error) {
        console.error('数据加载失败:', error);
        
        // 显示错误页面或重试按钮
        this.showErrorState = true;
        this.errorMessage = this.getErrorMessage(error);
      }
    },
    
    getErrorMessage(error) {
      if (error.statusCode === 401) {
        return '登录已过期，请重新登录';
      } else if (error.statusCode === 403) {
        return '您没有权限访问此数据';
      } else if (error.statusCode >= 500) {
        return '服务器错误，请稍后重试';
      } else {
        return error.message || '网络连接失败';
      }
    },
    
    async retryLoad() {
      this.showErrorState = false;
      await this.loadData();
    }
  }
}
```

## 7. 缓存和离线处理

### 7.1 数据缓存策略
```javascript
// utils/cache-manager.js
export class CacheManager {
  static async getCachedData(key, apiCall, ttl = 5 * 60 * 1000) {
    const cacheKey = `cache_${key}`;
    const cached = uni.getStorageSync(cacheKey);
    
    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    try {
      // 调用API获取新数据
      const data = await apiCall();
      
      // 存储到缓存
      uni.setStorageSync(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
      
    } catch (error) {
      // API失败时返回缓存数据
      if (cached) {
        console.warn('API调用失败，使用缓存数据');
        return cached.data;
      }
      throw error;
    }
  }
}
```

### 7.2 在组件中使用缓存
```javascript
// pages/strategy/index.vue
export default {
  methods: {
    async loadMarketingData() {
      const cacheKey = `marketing_${this.hotelId}_${this.selectedYear}_${this.selectedMonth}`;
      
      try {
        const data = await CacheManager.getCachedData(
          cacheKey,
          () => this.$http.get('/api/marketing/plans', {
            hotelId: this.hotelId,
            year: this.selectedYear,
            month: this.selectedMonth
          }),
          10 * 60 * 1000 // 10分钟缓存
        );
        
        this.marketingData = data;
        
      } catch (error) {
        console.error('加载营销数据失败:', error);
        // 使用本地Mock数据作为降级方案
        this.loadMockMarketingData();
      }
    }
  }
}
```

## 8. 实时数据更新

### 8.1 定时刷新
```javascript
// mixins/auto-refresh.js
export default {
  data() {
    return {
      refreshTimer: null,
      refreshInterval: 30000 // 30秒
    };
  },
  
  mounted() {
    this.startAutoRefresh();
  },
  
  beforeDestroy() {
    this.stopAutoRefresh();
  },
  
  methods: {
    startAutoRefresh() {
      if (this.refreshTimer) return;
      
      this.refreshTimer = setInterval(() => {
        this.refreshData();
      }, this.refreshInterval);
    },
    
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    
    async refreshData() {
      try {
        // 静默刷新数据
        await this.loadLatestData();
      } catch (error) {
        console.warn('自动刷新失败:', error);
      }
    }
  }
}
```

---

以上示例展示了在营销管理系统中如何正确使用各种API接口，包括错误处理、缓存策略和实时更新等最佳实践。
