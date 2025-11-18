<template>
  <view class="report-bg">
    <view class="report-content">
      <!-- Tab切换 -->
      <view class="report-tabs">
        <view class="tab-item" @click="switchTab('marketing')">
          <text class="tab-text" :class="{'active': activeTab === 'marketing'}">营销报告</text>
          <view v-if="activeTab === 'marketing'" class="tab-underline"></view>
        </view>
        <view class="tab-item" @click="switchTab('revenue')">
          <text class="tab-text" :class="{'active': activeTab === 'revenue'}">收益报告</text>
          <view v-if="activeTab === 'revenue'" class="tab-underline"></view>
        </view>
      </view>

      <!-- 数据统计卡片区域 -->
      <view class="stats-grid">
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line orange"></view>
            <text class="label-text">企微客户</text>
          </view>
          <text class="stats-number">20</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line blue"></view>
            <text class="label-text">卡券发放</text>
          </view>
          <text class="stats-number">15</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line orange"></view>
            <text class="label-text">核销总数</text>
          </view>
          <text class="stats-number">30</text>
        </view>
        
        <view class="stats-card">
          <view class="stats-label">
            <view class="label-line blue"></view>
            <text class="label-text">复购销售</text>
          </view>
          <text class="stats-number">47</text>
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
</template>

<script>
export default {
  data() {
    return {
      currentSection: 'report',
      activeTab: 'marketing',
      activePeriod: 'week',
      yearMonthOptions: ['2025/01', '2025/02', '2025/03', '2025/04', '2025/05', '2025/06', '2025/07', '2025/08', '2025/09', '2025/10', '2025/11', '2025/12'],
      yearMonthIndex: 2, // 2025/03
      
      // 报告内容列表
      reportList: [
        '报告内容报告内容报告内容报告内容报告内容报告内容...',
        '报告内容报告内容报告内容报告内容报告内容报告内容...',
        '报告内容报告内容报告内容报告内容报告内容报告内容...',
        '报告内容报告内容报告内容报告内容报告内容报告内容'
      ]
    }
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
    }
  }
}
</script>

<style scoped>
.report-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #e3f2fd 0%, #fff 50%);
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
  color: #42a5f5;
  font-weight: 600;
}
.tab-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background: #42a5f5;
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
  background: #42a5f5;
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
  background: #42a5f5;
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
