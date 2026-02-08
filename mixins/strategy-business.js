/**
 * 营销策略页面业务逻辑
 */
export default {
  data() {
    return {
      // 生成状态
      generating: false,
      
      // 弹窗显示状态
      showTaskModal: false,
      showAddModal: false,
      showAIGenerateModal: false,
      showActivityPlanModal: false,
      showMarketingDetailModal: false,
      
      // 选中的任务和日期
      selectedTask: null,
      selectedDate: null,
      selectedDateInfo: null,
      
      // 统计数据
      scheduledTasksCount: 0,
      pendingTasksCount: 0,
      publishedTasksCount: 0,
      
      // 新任务数据
      newTask: {
        typeIndex: 0,
        title: '',
        description: '',
        type: '',
        date: ''
      },
      
      // 活动策划数据
      activityPlan: {
        theme: '',
        target: '',
        activities: '',
        budget: '',
        expectedEffect: ''
      },
      
      // 营销详情数据
      marketingDetail: {
        date: '',
        price: 0,
        occupancy: 0,
        channels: [],
        content: [],
        feedback: []
      },
      
      // 任务类型选项
      taskTypes: ['抖音视频', '小红书图文', '朋友圈海报', '节假日活动', '特殊纪念日', '城市活动']
    }
  },
  
  methods: {
    // ========== 弹窗控制方法 ==========
    
    // 查看营销计划
    handleViewPlan() {
      console.log('业务逻辑：收到查看营销计划事件')
      console.log('当前年月:', this.selectedYear, this.selectedMonth)
      console.log('当前酒店ID:', this.selectedHotelId)

      // 跳转到营销计划详情页面，传递所有必要参数
      uni.navigateTo({
        url: `/pages/marketing-plan/index?hotelId=${this.selectedHotelId}&year=${this.selectedYear}&month=${this.selectedMonth}&hotelName=${encodeURIComponent(this.selectedHotelName || '当前酒店')}`
      })

      console.log('业务逻辑：已跳转到营销计划页面')
    },
    
    // 关闭任务详情弹窗
    closeTaskModal() {
      this.showTaskModal = false
      this.selectedTask = null
    },
    
    // 打开新增任务弹窗
    openAddModal() {
      this.showAddModal = true
    },
    
    // 关闭新增任务弹窗
    closeAddModal() {
      this.showAddModal = false
      this.newTask = {
        typeIndex: 0,
        title: '',
        description: '',
        type: '',
        date: ''
      }
    },
    
    // 关闭营销详情弹窗
    closeMarketingDetailModal() {
      this.showMarketingDetailModal = false
      this.selectedDateInfo = null
    },
    
    // 取消活动策划
    cancelActivityPlan() {
      this.showActivityPlanModal = false
      this.activityPlan = {
        theme: '',
        target: '',
        activities: '',
        budget: '',
        expectedEffect: ''
      }
    },
    
    // 取消AI生成
    cancelAIGenerate() {
      this.showAIGenerateModal = false
    },
    
    // ========== 数据更新方法 ==========
    
    // 更新新任务数据
    updateNewTask(task) {
      this.newTask = task
    },
    
    // 更新活动策划数据
    updateActivityPlan(plan) {
      this.activityPlan = plan
    },
    
    // ========== 任务操作方法 ==========
    
    // 处理日历组件的任务点击事件
    handleTaskClick(task) {
      this.selectedTask = task
      this.showTaskModal = true
    },
    
    // 预览任务内容
    previewContent() {
      uni.navigateTo({
        url: `/pages/content-preview/index?taskId=${this.selectedTask.id}`
      })
    },
    
    // 编辑任务
    editTask() {
      uni.navigateTo({
        url: `/pages/task-edit/index?taskId=${this.selectedTask.id}`
      })
    },
    
    // 打开AI对话
    openAIChat() {
      uni.navigateTo({
        url: `/pages/ai-chat/index?taskId=${this.selectedTask.id}`
      })
    },
    
    // 保存新增任务
    async saveNewTask() {
      if (!this.newTask.title.trim()) {
        uni.showToast({
          title: '请输入任务标题',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showToast({
          title: '任务创建成功',
          icon: 'success'
        })
        this.closeAddModal()
        this.loadMarketingStats()
      } catch (error) {
        uni.showToast({
          title: '创建任务失败',
          icon: 'none'
        })
      }
    },
    
    // ========== 营销详情方法 ==========
    
    // 查看推送渠道
    viewChannels() {
      uni.showModal({
        title: '推送渠道',
        content: this.marketingDetail.channels.join('\n'),
        showCancel: false,
        confirmText: '确定'
      })
    },
    
    // 查看营销内容
    viewContent() {
      uni.showModal({
        title: '营销内容',
        content: this.marketingDetail.content.join('\n'),
        showCancel: false,
        confirmText: '确定'
      })
    },
    
    // 查看客户反馈
    viewFeedback() {
      uni.showModal({
        title: '客户反馈',
        content: this.marketingDetail.feedback.join('\n'),
        showCancel: false,
        confirmText: '确定'
      })
    },
    
    // 处理日历组件的日期点击事件
    handleDateClick(dateInfo) {
      console.log('=== 父组件接收到date-click事件 ===')
      console.log('接收到的数据:', JSON.stringify(dateInfo, null, 2))
      
      uni.showToast({
        title: `接收到点击: ${dateInfo.day}日`,
        icon: 'success'
      })
      
      this.selectedDate = dateInfo
      this.showDateTasks(dateInfo)
    },
    
    // 显示指定日期的任务列表
    showDateTasks(dateInfo) {
      this.selectedDateInfo = dateInfo
      
      // Mock营销详情数据
      this.marketingDetail = {
        date: `${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`,
        price: dateInfo.price || 1200,
        occupancy: dateInfo.occ || 85,
        otb: dateInfo.otb || 72,
        channels: [
          '📱 抖音短视频 - 酒店美景展示',
          '📸 小红书图文 - 入住体验分享', 
          '💬 微信朋友圈 - 特价房型推广',
          '🌐 官方网站 - 直订优惠活动',
          '📺 OTA平台 - 联合营销推广'
        ],
        content: [
          '🌸 春季踏青优惠活动 - 连住2晚享8折',
          '🏠 豪华客房免费升级 - 限量20间',
          '🍽️ 美食节特色推广 - 赠送双人晚餐',
          '🎁 会员专享礼品 - 入住送伴手礼',
          '🚗 免费接送机服务 - 提前预约'
        ],
        feedback: [
          '⭐ 客户满意度: 92% (本月平均)',
          '📈 转化率: 8.5% (较上月+2.1%)',
          '🔄 复购率: 15% (会员复购率)',
          '💬 好评率: 96% (在线评价)',
          '📞 投诉率: 0.3% (服务投诉)'
        ]
      }
      
      this.showMarketingDetailModal = true
    },
    
    // ========== AI生成相关方法 ==========
    
    // 确认AI生成
    async confirmAIGenerate() {
      this.generating = true
      this.showAIGenerateModal = false
      
      try {
        uni.showLoading({ title: 'AI生成中...' })
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        uni.showToast({
          title: '月度计划生成成功',
          icon: 'success'
        })
        
        this.loadMarketingStats()
      } catch (error) {
        console.error('AI生成失败:', error)
        uni.showToast({
          title: 'AI生成失败，请重试',
          icon: 'none'
        })
      } finally {
        this.generating = false
        uni.hideLoading()
      }
    },
    
    // 生成下个月的营销计划
    async generateNextMonthPlan() {
      if (!this.activityPlan.theme.trim()) {
        uni.showToast({ title: '请填写活动主题', icon: 'none' })
        return
      }
      
      if (!this.activityPlan.target.trim()) {
        uni.showToast({ title: '请填写目标客群', icon: 'none' })
        return
      }
      
      if (!this.activityPlan.activities.trim()) {
        uni.showToast({ title: '请填写活动内容', icon: 'none' })
        return
      }
      
      this.generating = true
      this.showActivityPlanModal = false
      
      try {
        uni.showLoading({ title: '基于您的活动策划生成营销计划...' })
        await new Promise(resolve => setTimeout(resolve, 3500))
        
        uni.showToast({
          title: `${this.selectedMonth}月营销计划生成成功`,
          icon: 'success'
        })
        
        this.activityPlan = {
          theme: '',
          target: '',
          activities: '',
          budget: '',
          expectedEffect: ''
        }
        
        this.loadMarketingStats()
      } catch (error) {
        console.error('AI生成失败:', error)
        uni.showToast({
          title: 'AI生成失败，请重试',
          icon: 'none'
        })
      } finally {
        this.generating = false
        uni.hideLoading()
      }
    },
    
    // 加载营销计划统计数据
    async loadMarketingStats() {
      console.log('=== 开始加载营销计划统计 ===');

      // 如果没有酒店ID，跳过加载
      if (!this.selectedHotelId) {
        console.log('酒店ID为空，跳过统计加载');
        return;
      }

      try {
        const { userApi } = require('../../utils/api.js');

        // 调用API获取当前年月的营销计划数据
        const res = await userApi.getMarketingPlanList({
          hotel_id: String(this.selectedHotelId),
          year: String(this.selectedYear),
          month: String(this.selectedMonth),
          type: '0'
        });

        console.log('API返回数据:', res);

        // 初始化统计值
        let scheduledCount = 0;    // 排期任务（总任务数）
        let pendingCount = 0;      // 待审核 (approval_status=0)
        let publishedCount = 0;    // 已发布 (approval_status=1)

        // 处理日期对象格式数据 {"2026-02-01": [...], ...}
        if (res && typeof res === 'object' && !Array.isArray(res)) {
          const dateKeys = Object.keys(res);

          dateKeys.forEach(dateKey => {
            const plans = res[dateKey];
            if (Array.isArray(plans)) {
              plans.forEach(plan => {
                // 统计总任务数
                scheduledCount++;

                // 根据 approval_status 统计
                const approvalStatus = parseInt(plan.approval_status || 0);
                if (approvalStatus === 0) {
                  // 等待审核
                  pendingCount++;
                } else if (approvalStatus === 1) {
                  // 已审核（已发布）
                  publishedCount++;
                }
              });
            }
          });
        }

        // 更新统计数据
        this.scheduledTasksCount = scheduledCount;
        this.pendingTasksCount = pendingCount;
        this.publishedTasksCount = publishedCount;

        console.log('✅ 营销计划统计加载成功:', {
          排期任务: scheduledCount,
          待审核: pendingCount,
          已发布: publishedCount
        });

      } catch (error) {
        console.error('❌ 加载统计数据失败:', error);
        // 失败时使用默认值
        this.scheduledTasksCount = 0;
        this.pendingTasksCount = 0;
        this.publishedTasksCount = 0;
      }
    }
  }
}
