<template>
  <view class="marketing-plan-container">
    <!-- 状态栏 -->
    <status-bar />
    
    <!-- 顶部导航栏 -->
    <top-navbar 
      :title="`${year}年${month}月营销计划`"
      :show-back="true"
      :show-logo="false"
      @back="handleBack"
    />

    <!-- 主要内容区 -->
    <view class="app-content">
      <view class="plan-page">
        <!-- 酒店信息卡片 -->
        <view class="hotel-info-card">
          <view class="hotel-icon">🏨</view>
          <view class="hotel-details">
            <text class="hotel-name">{{ hotelName }}</text>
            <text class="plan-period">{{ year }}年{{ month }}月营销计划</text>
          </view>
          <view class="plan-status">
            <text class="status-text">执行中</text>
          </view>
        </view>

        <!-- 计划概览 -->
        <view class="plan-overview">
          <view class="overview-title">计划概览</view>
          <view class="overview-stats">
            <view class="stat-item">
              <text class="stat-number">{{ planData.totalTasks }}</text>
              <text class="stat-label">总任务数</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ planData.completedTasks }}</text>
              <text class="stat-label">已完成</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ planData.inProgressTasks }}</text>
              <text class="stat-label">进行中</text>
            </view>
            <view class="stat-item">
              <text class="stat-number">{{ planData.pendingTasks }}</text>
              <text class="stat-label">待开始</text>
            </view>
          </view>
        </view>

        <!-- 每日营销计划 -->
        <view class="daily-plans-section">
          <view class="section-title">
            <text class="title-text">{{ year }}年{{ month }}月营销计划</text>
            <text class="title-count">({{ getTotalDailyTasks() }}项任务)</text>
          </view>
          
          <view class="daily-plans-list">
            <view 
              v-for="(dayPlan, index) in (planData.dailyPlans || [])" 
              :key="index"
              class="daily-plan-item"
            >
              <!-- 日期头部 -->
              <view class="day-header">
                <view class="date-info">
                  <text class="day-number">{{ dayPlan.day }}</text>
                  <text class="weekday">{{ dayPlan.weekday }}</text>
                </view>
                <view class="date-full">
                  <text class="date-text">{{ year }}年{{ month }}月{{ dayPlan.day }}日</text>
                  <text class="task-count">{{ (dayPlan.tasks && dayPlan.tasks.length) || 0 }}项任务</text>
                </view>
              </view>
              
              <!-- 当日任务列表 -->
              <view class="day-tasks">
                <view 
                  v-for="(task, taskIndex) in (dayPlan.tasks || [])"
                  :key="taskIndex"
                  class="task-item"
                  @click.stop="handleTaskClick(task)"
                >
                  <view class="task-time">{{ task.time }}</view>
                  <view class="task-content">
                    <view class="task-header">
                      <text class="task-icon">{{ task.icon }}</text>
                      <text class="task-title">{{ task.title }}</text>
                      <view class="task-status" :class="task.statusClass">
                        <text class="status-text">{{ task.status }}</text>
                      </view>
                    </view>
                    <text class="task-desc">{{ task.description }}</text>
                    <view class="task-channels" v-if="task.channels && task.channels.length > 0">
                      <text class="channel-label">渠道：</text>
                      <text 
                        v-for="(channel, chIndex) in task.channels"
                        :key="chIndex"
                        class="channel-tag"
                      >{{ channel }}</text>
                    </view>
                  </view>
                </view>
                
                <!-- 无任务提示 -->
                <view v-if="!dayPlan.tasks || dayPlan.tasks.length === 0" class="no-tasks">
                  <text class="no-tasks-text">今日无营销任务</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 关键指标 -->
        <view class="metrics-section">
          <view class="section-title">
            <text class="title-text">关键指标</text>
          </view>
          
          <view class="metrics-grid">
            <view 
              v-for="(metric, index) in planData.metrics"
              :key="index"
              class="metric-card"
            >
              <view class="metric-icon">{{ metric.icon }}</view>
              <view class="metric-info">
                <text class="metric-name">{{ metric.name }}</text>
                <text class="metric-value">{{ metric.current }} / {{ metric.target }}</text>
                <view class="metric-progress">
                  <view 
                    class="progress-bar" 
                    :style="{ width: metric.progress + '%' }"
                  ></view>
                </view>
                <text class="metric-rate">完成率 {{ metric.progress }}%</text>
              </view>
            </view>
          </view>
        </view>
        </view>
        
        <!-- 加载提示 -->
        <view v-if="loading" class="loading-container">
          <text class="loading-text">正在加载营销计划数据...</text>
        </view>
      </view>
    </view>
  </template><script>
export default {
  name: 'MarketingPlan',
  data() {
    return {
      hotelId: '',
      hotelName: '未知酒店',
      year: '2025',
      month: '11',
      loading: false,
      planData: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        dailyPlans: [],
        metrics: []
      }
    }
  },
  
  onLoad(options) {
    // 获取传递的参数
    if (options.hotelId) {
      this.hotelId = options.hotelId;
    }
    if (options.year) {
      this.year = options.year;
    }
    if (options.month) {
      this.month = options.month;
    }
    if (options.hotelName) {
      this.hotelName = decodeURIComponent(options.hotelName);
    }
    
    // 加载营销计划数据
    this.loadPlanData();
  },
  
  methods: {
    handleBack() {
      uni.navigateBack();
    },
    
    // 加载营销计划数据 (Mock 数据)
    loadPlanData() {
        console.log('=== 开始加载营销计划数据 ===');
        
        // 先生成每日计划
        const dailyPlans = this.generateDailyPlans();
        
        console.log('生成的dailyPlans:', dailyPlans);
        console.log('dailyPlans数量:', dailyPlans.length);
        
        // 计算实际的任务统计
        let totalTasks = 0;
        let completedTasks = 0;
        let inProgressTasks = 0;
        let pendingTasks = 0;
        
        dailyPlans.forEach((day, index) => {
          if (day && day.tasks && Array.isArray(day.tasks)) {
            console.log(`第${index + 1}天任务数:`, day.tasks.length);
            day.tasks.forEach(task => {
              totalTasks++;
              if (task.status === '已完成') {
                completedTasks++;
              } else if (task.status === '进行中') {
                inProgressTasks++;
              } else {
                pendingTasks++;
              }
            });
          } else {
            console.warn(`第${index + 1}天的数据异常:`, day);
          }
        });
        
        console.log('任务统计 - 总数:', totalTasks, '已完成:', completedTasks, '进行中:', inProgressTasks, '待开始:', pendingTasks);
        
        this.planData = {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          
          dailyPlans,
          
          metrics: [
            {
              icon: '👀',
              name: '品牌曝光量',
              current: '8.5万',
              target: '10万',
              progress: 85
            },
            {
              icon: '📞',
              name: '咨询转化量',
              current: '156',
              target: '200',
              progress: 78
            },
            {
              icon: '🏨',
              name: '实际入住量',
              current: '89',
              target: '120',
              progress: 74
            },
            {
              icon: '💰',
              name: '营销ROI',
              current: '3.2',
              target: '4.0',
              progress: 80
            }
          ]
        };
        
      // 调试输出
      console.log('planData loaded:', this.planData);
      console.log('dailyPlans length:', this.planData.dailyPlans ? this.planData.dailyPlans.length : 'null');
      console.log('total tasks:', this.getTotalDailyTasks());
    },
    
    // 生成每日营销计划
    generateDailyPlans() {
      const year = parseInt(this.year);
      const month = parseInt(this.month);
      const daysInMonth = this.getDaysInMonth(year, month);
      const dailyPlans = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const weekday = this.getWeekday(year, month, day);
        const tasks = this.generateDailyTasks(day, weekday);
        
        dailyPlans.push({
          day: day.toString().padStart(2, '0'),
          weekday,
          tasks
        });
        
        // 调试输出前3天的数据
        if (day <= 3) {
          console.log(`Day ${day} (${weekday}):`, tasks.length, 'tasks');
        }
      }
      
      console.log('Generated dailyPlans:', dailyPlans.length, 'days');
      return dailyPlans;
    },
    
    // 获取月份天数
    getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    },
    
    // 获取星期几
    getWeekday(year, month, day) {
      const date = new Date(year, month - 1, day);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[date.getDay()];
    },
    
    // 生成每日任务
    generateDailyTasks(day, weekday) {
      const tasks = [];
      
      try {
        const dayNum = parseInt(day);
        
        if (isNaN(dayNum)) {
          console.error('Invalid day number:', day);
          return tasks;
        }
      
        // 每日基础任务：客户服务与回复
        tasks.push({
          time: '09:00',
          icon: '💬',
          title: '客户咨询回复',
          description: '及时回复各平台客户咨询，维护客户关系，推荐合适套餐',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['微信', '电话', '在线客服']
        });
      
      // 每周一：社交媒体内容规划
      if (weekday === '周一') {
        tasks.push({
          time: '10:00',
          icon: '📅',
          title: '本周社交媒体内容规划',
          description: '制定本周抖音、小红书、微信朋友圈的内容发布计划',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['抖音', '小红书', '微信']
        });
        
        tasks.push({
          time: '15:30',
          icon: '📊',
          title: '上周营销数据分析',
          description: '分析上周各渠道营销效果，总结经验优化策略',
          status: dayNum < 19 ? '已完成' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : 'pending',
          channels: ['数据分析']
        });
      }
      
      // 每周二：抖音短视频发布
      if (weekday === '周二') {
        tasks.push({
          time: '11:30',
          icon: '📱',
          title: '抖音短视频发布',
          description: '发布酒店特色短视频，展示房间装修和服务亮点',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['抖音', '快手']
        });
        
        tasks.push({
          time: '16:00',
          icon: '🎬',
          title: '视频内容互动维护',
          description: '回复短视频评论，与用户互动，提升视频热度',
          status: dayNum < 19 ? '已完成' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : 'pending',
          channels: ['抖音', '快手']
        });
      }
      
      // 每周三：小红书图文推广
      if (weekday === '周三') {
        tasks.push({
          time: '10:30',
          icon: '📖',
          title: '小红书图文发布',
          description: '发布酒店美图和入住体验分享，重点突出酒店特色和周边景点',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['小红书', '微博']
        });
        
        tasks.push({
          time: '14:30',
          icon: '📷',
          title: '酒店美图拍摄',
          description: '拍摄酒店房间、餐厅、lobby等区域的高质量照片',
          status: dayNum < 19 ? '已完成' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : 'pending',
          channels: ['摄影素材']
        });
      }
      
      // 每周四：抖音短视频发布
      if (weekday === '周四') {
        tasks.push({
          time: '11:00',
          icon: '📱',
          title: '抖音短视频发布',
          description: '发布客户入住体验视频或酒店周边景点介绍',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['抖音', '快手']
        });
        
        tasks.push({
          time: '17:00',
          icon: '🎯',
          title: '精准推广投放',
          description: '调整抖音、小红书付费推广策略，优化投放效果',
          status: dayNum < 19 ? '已完成' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : 'pending',
          channels: ['付费推广']
        });
      }
      
      // 每周五：小红书图文推广
      if (weekday === '周五') {
        tasks.push({
          time: '10:00',
          icon: '📖',
          title: '小红书种草笔记',
          description: '发布酒店周末活动和特色服务介绍，吸引周末客流',
          status: dayNum < 19 ? '已完成' : dayNum === 19 ? '进行中' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : dayNum === 19 ? 'in-progress' : 'pending',
          channels: ['小红书', '微博']
        });
        
        tasks.push({
          time: '15:00',
          icon: '📈',
          title: '本周营销总结',
          description: '总结本周营销成果，准备周末活动推广素材',
          status: dayNum < 19 ? '已完成' : '待执行',
          statusClass: dayNum < 19 ? 'completed' : 'pending',
          channels: ['内部总结']
        });
      }
      

      
      // 周末特别任务
      if (weekday === '周六') {
        tasks.push({
          time: '10:00',
          icon: '🎉',
          title: '周末特惠活动推广',
          description: '推广周末特价房型和套餐，增加周末入住率',
          status: dayNum <= 19 ? '已完成' : dayNum === 20 ? '进行中' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : dayNum === 20 ? 'in-progress' : 'pending',
          channels: ['微信群', '朋友圈', '抖音']
        });
        
        tasks.push({
          time: '14:00',
          icon: '👨‍👩‍👧‍👦',
          title: '亲子套餐推广',
          description: '针对家庭客户推出周末亲子套餐，包含儿童免费政策',
          status: dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : 'pending',
          channels: ['微信群', '小红书']
        });
        
        tasks.push({
          time: '20:00',
          icon: '🎨',
          title: '朋友圈活动推广',
          description: '发布精美海报和优惠活动信息，鼓励客户分享转发',
          status: dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : 'pending',
          channels: ['微信朋友圈', '微信群']
        });
      }
      
      if (weekday === '周日') {
        tasks.push({
          time: '11:00',
          icon: '☕',
          title: '客户关怀活动',
          description: '推送温馨提醒和下周预订优惠，维护客户粘性',
          status: dayNum <= 19 ? '已完成' : dayNum === 20 ? '进行中' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : dayNum === 20 ? 'in-progress' : 'pending',
          channels: ['微信', '短信', '电话']
        });
        
        tasks.push({
          time: '16:00',
          icon: '📋',
          title: '下周营销计划制定',
          description: '制定下周详细营销计划，安排内容发布时间',
          status: dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : 'pending',
          channels: ['内部规划']
        });
        
        tasks.push({
          time: '20:00',
          icon: '🎨',
          title: '朋友圈活动推广',
          description: '发布精美海报和优惠活动信息，鼓励客户分享转发',
          status: dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : 'pending',
          channels: ['微信朋友圈', '微信群']
        });
      }
      
      // 每日数据监控（每3天一次）
      if (dayNum % 3 === 0) {
        tasks.push({
          time: '18:00',
          icon: '📊',
          title: '营销数据监控',
          description: '监控各渠道数据表现，及时调整营销策略',
          status: dayNum <= 19 ? '已完成' : dayNum === 20 ? '进行中' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : dayNum === 20 ? 'in-progress' : 'pending',
          channels: ['数据分析']
        });
      }
      
      // VIP客户维护（每2天一次）
      if (dayNum % 2 === 1) {
        tasks.push({
          time: '21:00',
          icon: '🤝',
          title: 'VIP客户维护',
          description: '联系VIP客户，了解需求并提供个性化服务',
          status: dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum <= 19 ? 'completed' : 'pending',
          channels: ['电话', '微信']
        });
      }
      
      // 特定日期的特殊活动
      if (dayNum === 11) { // 双11活动
        tasks.push({
          time: '00:01',
          icon: '🛒',
          title: '双11特惠活动启动',
          description: '启动双11住宿特惠活动，限时抢购优惠房型',
          status: '已完成',
          statusClass: 'completed',
          channels: ['全渠道']
        });
        
        tasks.push({
          time: '12:00',
          icon: '🎁',
          title: '限时秒杀活动',
          description: '推出双十一限时秒杀房型，提升预订转化率',
          status: '已完成',
          statusClass: 'completed',
          channels: ['微信', '抖音']
        });
        
        tasks.push({
          time: '20:00',
          icon: '📱',
          title: '双11直播带货',
          description: '开展酒店房型直播介绍，实时互动答疑促成预订',
          status: '已完成',
          statusClass: 'completed',
          channels: ['抖音直播', '小红书直播']
        });
      }
      
      if (dayNum === 15) { // 月中总结
        tasks.push({
          time: '11:00',
          icon: '📊',
          title: '月中营销效果分析',
          description: '分析前半月营销数据，调整后续营销策略',
          status: '已完成',
          statusClass: 'completed',
          channels: ['内部分析']
        });
      }
      
      // 感恩节周期活动 (20-28号)
      if (dayNum >= 20 && dayNum <= 28) {
        tasks.push({
          time: '13:00',
          icon: '🦃',
          title: '感恩节主题营销',
          description: '准备感恩节主题内容，推出感恩回馈客户活动',
          status: dayNum === 19 ? '进行中' : dayNum <= 19 ? '已完成' : '待执行',
          statusClass: dayNum === 19 ? 'in-progress' : dayNum <= 19 ? 'completed' : 'pending',
          channels: ['微信', '小红书']
        });
      }
      
      if (dayNum === 22) { // 小雪节气
        tasks.push({
          time: '10:00',
          icon: '❄️',
          title: '小雪节气温暖营销',
          description: '结合小雪节气，推广酒店温暖服务和冬季特色',
          status: '待执行',
          statusClass: 'pending',
          channels: ['小红书', '抖音']
        });
      }
      
      if (dayNum === 25) { // 圣诞预热
        tasks.push({
          time: '15:00',
          icon: '🎄',
          title: '圣诞活动预热',
          description: '开始预热圣诞主题活动，发布圣诞套餐预订信息',
          status: '待执行',
          statusClass: 'pending',
          channels: ['全渠道']
        });
      }
      
      if (dayNum === 28) { // 感恩节高潮
        tasks.push({
          time: '14:00',
          icon: '🙏',
          title: '感恩节客户答谢',
          description: '举办线上感恩节客户答谢活动，发放专属优惠券',
          status: '待执行',
          statusClass: 'pending',
          channels: ['微信群', '小程序']
        });
      }
      
      if (dayNum === 30) { // 月末总结
        tasks.push({
          time: '17:00',
          icon: '📈',
          title: '月度营销总结',
          description: '整理本月营销数据，制作月度报告，规划下月营销重点',
          status: '待执行',
          statusClass: 'pending',
          channels: ['内部总结']
        });
      }
      
      } catch (error) {
        console.error('生成每日任务出错:', error);
      }
      
      return tasks;
    },
    
    // 获取每日任务总数
    getTotalDailyTasks() {
      try {
        if (!this.planData || !this.planData.dailyPlans || !Array.isArray(this.planData.dailyPlans)) {
          return 0;
        }
        return this.planData.dailyPlans.reduce((total, day) => {
          return total + (day && day.tasks && Array.isArray(day.tasks) ? day.tasks.length : 0);
        }, 0);
      } catch (error) {
        console.error('getTotalDailyTasks error:', error);
        return 0;
      }
    },
    
    // 处理任务点击
    handleTaskClick(task) {
      console.log('任务被点击:', task);
      this.viewTaskDetail(task);
    },
    
    // 查看任务详情
    viewTaskDetail(task) {
      if (!task) {
        console.warn('任务对象为空');
        return;
      }
      
      try {
        const channels = (task.channels && task.channels.length > 0) ? task.channels.join('、') : '无';
        
        uni.showModal({
          title: task.title || '任务详情',
          content: `时间：${task.time || '未设置'}\n描述：${task.description || '无描述'}\n渠道：${channels}\n状态：${task.status || '未知'}`,
          showCancel: false,
          confirmText: '知道了'
        });
      } catch (error) {
        console.error('显示任务详情出错:', error);
        uni.showToast({
          title: '查看详情失败',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.marketing-plan-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
}

.app-content {
  padding-top: 215rpx; /* 状态栏60rpx + 导航栏88rpx + 间距67rpx */
  padding-bottom: 40rpx;
  min-height: calc(100vh - 215rpx);
}

.plan-page {
  padding: 32rpx;
}

/* 酒店信息卡片 */
.hotel-info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  
  .hotel-icon {
    font-size: 48rpx;
    margin-right: 24rpx;
  }
  
  .hotel-details {
    flex: 1;
    
    .hotel-name {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .plan-period {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .plan-status {
    .status-text {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-size: 24rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
    }
  }
}

/* 计划概览 */
.plan-overview {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  
  .overview-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .overview-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 48rpx;
        font-weight: 700;
        color: #296FB7;
        margin-bottom: 8rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

/* 每日营销计划 */
.daily-plans-section {
  margin-bottom: 32rpx;
  
  .section-title {
    display: flex;
    align-items: baseline;
    margin-bottom: 24rpx;
    
    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    
    .title-count {
      font-size: 24rpx;
      color: #666;
      margin-left: 8rpx;
    }
  }
  
  .daily-plans-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .daily-plan-item {
      background: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .day-header {
        background: linear-gradient(135deg, #296FB7 0%, #4A90E2 100%);
        color: #fff;
        padding: 20rpx 24rpx;
        display: flex;
        align-items: center;
        
        .date-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 24rpx;
          
          .day-number {
            font-size: 36rpx;
            font-weight: 700;
            line-height: 1;
          }
          
          .weekday {
            font-size: 20rpx;
            opacity: 0.9;
            margin-top: 4rpx;
          }
        }
        
        .date-full {
          flex: 1;
          
          .date-text {
            display: block;
            font-size: 28rpx;
            font-weight: 600;
            margin-bottom: 4rpx;
          }
          
          .task-count {
            font-size: 22rpx;
            opacity: 0.8;
          }
        }
      }
      
      .day-tasks {
        padding: 20rpx 24rpx 24rpx;
        
        .task-item {
          display: flex;
          align-items: flex-start;
          padding: 16rpx 0;
          border-bottom: 1rpx solid #f5f5f5;
          transition: all 0.3s ease;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:active {
            background: #f8f9fa;
            transform: scale(0.98);
          }
          
          .task-time {
            font-size: 24rpx;
            color: #296FB7;
            font-weight: 600;
            min-width: 80rpx;
            margin-right: 16rpx;
            margin-top: 4rpx;
          }
          
          .task-content {
            flex: 1;
            
            .task-header {
              display: flex;
              align-items: center;
              margin-bottom: 8rpx;
              
              .task-icon {
                font-size: 24rpx;
                margin-right: 8rpx;
              }
              
              .task-title {
                flex: 1;
                font-size: 26rpx;
                font-weight: 600;
                color: #333;
                margin-right: 12rpx;
              }
              
              .task-status {
                padding: 4rpx 8rpx;
                border-radius: 8rpx;
                font-size: 18rpx;
                
                .status-text {
                  font-weight: 500;
                }
                
                &.completed {
                  background: #d1fae5;
                  color: #059669;
                }
                
                &.in-progress {
                  background: #dbeafe;
                  color: #2563eb;
                }
                
                &.pending {
                  background: #fef3c7;
                  color: #d97706;
                }
              }
            }
            
            .task-desc {
              font-size: 22rpx;
              color: #666;
              line-height: 1.4;
              margin-bottom: 8rpx;
            }
            
            .task-channels {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 8rpx;
              
              .channel-label {
                font-size: 20rpx;
                color: #999;
              }
              
              .channel-tag {
                background: #f0f8ff;
                color: #296FB7;
                font-size: 18rpx;
                padding: 2rpx 8rpx;
                border-radius: 6rpx;
                border: 1rpx solid #e3f2fd;
              }
            }
          }
        }
        
        .no-tasks {
          text-align: center;
          padding: 40rpx 0;
          
          .no-tasks-text {
            font-size: 24rpx;
            color: #ccc;
          }
        }
      }
    }
  }
}

/* 关键指标 */
.metrics-section {
  .section-title {
    margin-bottom: 24rpx;
    
    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
    
    .metric-card {
      background: #fff;
      border-radius: 16rpx;
      padding: 24rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .metric-icon {
        font-size: 32rpx;
        margin-bottom: 16rpx;
      }
      
      .metric-info {
        .metric-name {
          display: block;
          font-size: 24rpx;
          color: #666;
          margin-bottom: 8rpx;
        }
        
        .metric-value {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 12rpx;
        }
        
        .metric-progress {
          height: 6rpx;
          background: #f0f0f0;
          border-radius: 3rpx;
          overflow: hidden;
          margin-bottom: 8rpx;
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(135deg, #296FB7 0%, #4A90E2 100%);
            transition: width 0.3s ease;
          }
        }
        
        .metric-rate {
          font-size: 20rpx;
          color: #296FB7;
        }
      }
    }
  }
}

/* 加载提示 */
.loading-container {
  padding: 60rpx 20rpx;
  text-align: center;
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
}
</style>
