<template>
  <view class="page-container">
    <!-- 固定头部 -->
    <view class="header-fixed">
      <!-- 状态栏 -->
      <status-bar />
      
      <!-- 顶部导航栏 -->
      <top-navbar 
        title="报告" 
        :show-back="false"
        :show-logo="false"
      />
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view class="main-content" scroll-y="true">
      <view class="report-bg">
    <view class="report-content">
      <!-- 数据统计卡片区域 -->
      <view class="stats-grid">
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line orange"></view>
            <text class="label-text">浏览量</text>
          </view>
          <text class="stats-number">{{ statsData.viewCount.toLocaleString() }}</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line blue"></view>
            <text class="label-text">加私客户</text>
          </view>
          <text class="stats-number">{{ statsData.privateCustomer }}</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line orange"></view>
            <text class="label-text">企微客户</text>
          </view>
          <text class="stats-number">{{ statsData.wechatCustomer }}</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line blue"></view>
            <text class="label-text">卡券发放</text>
          </view>
          <text class="stats-number">{{ statsData.couponIssued }}</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line orange"></view>
            <text class="label-text">核销总数</text>
          </view>
          <text class="stats-number">{{ statsData.couponUsed }}</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line blue"></view>
            <text class="label-text">复购销售</text>
          </view>
          <text class="stats-number">{{ statsData.repeatSales }}</text>
        </view>
      </view>

      <!-- 日期选择器 -->
      <view class="date-row">
        <picker mode="selector" :range="yearMonthOptions" :value="yearMonthIndex" @change="onYearMonthChange">
          <view class="date-picker">
            <text class="date-text">{{ yearMonthOptions[yearMonthIndex] }}</text>
            <text class="dropdown-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 周报月报切换 -->
      <view class="period-tabs">
        <view class="period-tab" :class="{'active': activePeriod === 'week'}" @click="switchPeriod('week')">
          <text class="period-text">周报</text>
        </view>
        <view class="period-tab" :class="{'active': activePeriod === 'month'}" @click="switchPeriod('month')">
          <text class="period-text">月报</text>
        </view>
      </view>

      <!-- 报告内容列表 -->
      <view class="report-list">
        <view class="report-item" v-for="(item, index) in reportList" :key="index">
          <text class="report-text">{{ item }}</text>
        </view>
      </view>

        </view>
      </view>
    </scroll-view>

    <!-- 固定底部 -->
    <view class="footer-fixed">
      <bottom-tabbar 
        :current-tab="'report'"
        @tab-change="handleTabChange"
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentSection: 'report',
      activeTab: 'marketing',
      activePeriod: 'week',
      yearMonthOptions: ['2025/01', '2025/02', '2025/03', '2025/04', '2025/05', '2025/06', '2025/07', '2025/08', '2025/09', '2025/10', '2025/11', '2025/12'],
      yearMonthIndex: 10, // 2025/11 (当前月)
      
      // 统计数据
      statsData: {
        viewCount: 1247,      // 浏览量
        privateCustomer: 89,  // 加私客户
        wechatCustomer: 20,   // 企微客户
        couponIssued: 15,     // 卡券发放
        couponUsed: 30,       // 核销总数
        repeatSales: 47       // 复购销售
      },
      
      // 报告内容列表
      reportList: [
      ]
    }
  },
  mounted() {
    // 检查登录状态
    const token = this.$utils?.user?.getToken ? this.$utils.user.getToken() : uni.getStorageSync('token');
    if (!token) {
      // 未登录，重定向到登录页
      uni.reLaunch({
        url: '/pages/login/index'
      });
      return;
    }
    
    // 加载初始统计数据
    this.loadStatsData();
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    switchPeriod(period) {
      this.activePeriod = period;
    },
    onYearMonthChange(e) {
      this.yearMonthIndex = e.detail.value;
      this.loadStatsData();
    },
    
    // 加载统计数据
    loadStatsData() {
      // 模拟根据选择的年月加载不同的统计数据
      const selectedYearMonth = this.yearMonthOptions[this.yearMonthIndex];
      console.log('加载统计数据:', selectedYearMonth);
      
      // 生成模拟数据（实际项目中这里应该调用API）
      this.statsData = {
        viewCount: Math.floor(Math.random() * 2000) + 800,     // 浏览量 800-2800
        privateCustomer: Math.floor(Math.random() * 100) + 50, // 加私客户 50-150
        wechatCustomer: Math.floor(Math.random() * 50) + 10,   // 企微客户 10-60
        couponIssued: Math.floor(Math.random() * 30) + 10,     // 卡券发放 10-40
        couponUsed: Math.floor(Math.random() * 40) + 20,       // 核销总数 20-60
        repeatSales: Math.floor(Math.random() * 60) + 30       // 复购销售 30-90
      };
    },
    
    // 底部导航切换处理(由 bottom-tabbar 组件处理跳转)
    handleTabChange(tabKey) {
      // 跳转逻辑已在 bottom-tabbar 组件中处理,这里只需要接收事件
      console.log('切换到:', tabKey);
    }
  }
}
</script>

<style scoped>
/* 页面容器 */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f7fa;
}

/* 固定头部 */
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f4f7fa;
}

/* 可滚动内容区 */
.main-content {
  position: fixed;
  top: 200rpx;
  bottom: 120rpx;
  left: 0;
  right: 0;
  padding: 0 24rpx;
  box-sizing: border-box;
}

/* 固定底部 */
.footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.report-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 60%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.report-content {
  flex: 1;
  overflow-y: auto;
  padding: 32rpx;
  padding-bottom: 140rpx;
}

/* Tab切换 */
.report-tabs {
  display: flex;
  margin-bottom: 40rpx;
  position: relative;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  position: relative;
}
.tab-text {
  font-size: 32rpx;
  color: #999;
  font-weight: 400;
}
.tab-text.active {
  color: #5dade2;
  font-weight: 600;
}
.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background: #5dade2;
  border-radius: 3rpx;
}

/* 数据统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin-bottom: 40rpx;
}
.stats-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.stats-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.label-line {
  width: 8rpx;
  height: 32rpx;
  border-radius: 4rpx;
}
.label-line.orange {
  background: #5dade2;
}
.label-line.blue {
  background: #2196f3;
}
.label-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 400;
}
.stats-number {
  font-size: 48rpx;
  color: #333;
  font-weight: 600;
  line-height: 1;
}

/* 日期选择器 */
.date-row {
  margin-bottom: 32rpx;
}
.date-picker {
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.date-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.dropdown-arrow {
  font-size: 20rpx;
  color: #999;
}

/* 周报月报切换 */
.period-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 32rpx;
  background: #fff;
  border-radius: 50rpx;
  padding: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.period-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 46rpx;
  transition: all 0.3s ease;
}
.period-tab.active {
  background: #5dade2;
}
.period-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 400;
}
.period-tab.active .period-text {
  color: #fff;
  font-weight: 500;
}

/* 报告内容列表 */
.report-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.report-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.report-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>
