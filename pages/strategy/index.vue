
<template>
  <view class="app-container">
    <!-- 状态栏 -->
    <status-bar />
    
    <!-- 顶部导航栏 -->
    <top-navbar 
      title="营销计划" 
      :show-back="false"
      :show-logo="true"
    />

    <!-- 主要内容区 -->
    <view class="app-content">
      <!-- 酒店选择区域 -->
      <hotel-selector
        :hotel-names="hotelNames"
        :selected-index="selectedHotelIndex"
        :selected-name="selectedHotelName"
        @change="onHotelChange"
      />

      <!-- 功能操作区域 -->
      <strategy-actions
        :year="selectedYear"
        :month="selectedMonth"
        :year-index="yearIndex"
        :month-index="monthIndex"
        :date-range="dateRange"
        :generating="generating"
        :scheduled-count="scheduledTasksCount"
        :pending-count="pendingTasksCount"
        :published-count="publishedTasksCount"
        @date-change="onDateChange"
        @ai-generate="handleAIGenerate"
        @view-plan="handleViewPlan"
      />

      <!-- 营销日历组件 -->
      <view class="calendar-section">
        <marketing-calendar 
          :hotel-id="selectedHotelId"
          :year="selectedYear"
          :month="selectedMonth"
          @date-click="handleDateClick"
          @task-click="handleTaskClick"
          @ai-generate="handleAIGenerate"
          @manual-add="openAddModal"
        />
      </view>

      <!-- 图例说明 -->
      <marketing-legend />
    </view>

    <!-- 任务详情弹窗 -->
    <task-detail-modal
      :visible="showTaskModal"
      :task="selectedTask"
      @close="closeTaskModal"
      @preview="previewContent"
      @edit="editTask"
      @chat="openAIChat"
    />

    <!-- 新增任务弹窗 -->
    <add-task-modal
      :visible="showAddModal"
      :task="newTask"
      :task-types="taskTypes"
      @update:task="updateNewTask"
      @confirm="saveNewTask"
      @cancel="closeAddModal"
    />

    <!-- AI生成月度计划弹窗 -->
    <ai-generate-modal
      :visible="showAIGenerateModal"
      :year="selectedYear"
      :month="selectedMonth"
      :hotel-name="selectedHotelName"
      @confirm="confirmAIGenerate"
      @cancel="cancelAIGenerate"
    />

    <!-- 活动策划弹窗 -->
    <activity-plan-modal
      :visible="showActivityPlanModal"
      :year="selectedYear"
      :month="selectedMonth"
      :plan="activityPlan"
      @update:plan="updateActivityPlan"
      @confirm="generateNextMonthPlan"
      @cancel="cancelActivityPlan"
    />

    <!-- 营销详情弹窗组件 -->
    <marketing-detail-modal
      :visible="showMarketingDetailModal"
      :date-info="selectedDateInfo"
      :detail="marketingDetail"
      @close="closeMarketingDetailModal"
      @view-channels="viewChannels"
      @view-content="viewContent"
      @view-feedback="viewFeedback"
    />

    <!-- 底部导航栏 -->
    <bottom-tabbar 
      :current-tab="'strategy'"
      @tab-change="handleTabChange"
    />
  </view>
</template>

<script>
import { userApi } from '../../utils/api'
import MarketingDetailModal from '../../components/marketing-detail-modal/index.vue'
import AIGenerateModal from '../../components/ai-generate-modal/index.vue'
import ActivityPlanModal from '../../components/activity-plan-modal/index.vue'
import TaskDetailModal from '../../components/task-detail-modal/index.vue'
import AddTaskModal from '../../components/add-task-modal/index.vue'
import HotelSelector from '../../components/hotel-selector/index.vue'
import StrategyActions from '../../components/strategy-actions/index.vue'
import MarketingLegend from '../../components/marketing-legend/index.vue'

// Mixins
import HotelManager from '../../mixins/hotel-manager.js'
import DateManager from '../../mixins/date-manager.js'
import StrategyBusiness from '../../mixins/strategy-business.js'

export default {
  mixins: [HotelManager, DateManager, StrategyBusiness],
  
  components: {
    MarketingDetailModal,
    AIGenerateModal,
    ActivityPlanModal,
    TaskDetailModal,
    AddTaskModal,
    HotelSelector,
    StrategyActions,
    MarketingLegend
  },
  data() {
    return {
      // 营销计划数据（页面特有数据）
      marketingPlans: []
    }
  },
  mounted() {    
    try {
      // 检查登录状态
      const token = this.$utils?.user?.getToken ? this.$utils.user.getToken() : uni.getStorageSync('token');
      if (!token) {
        uni.reLaunch({
          url: '/pages/login/index'
        });
        return;
      }
      
      // 初始化当前日期
      this.initCurrentDate();
      // 加载酒店信息
      this.loadHotelInfo();
      // 加载营销计划统计
      this.loadMarketingStats();
    } catch (error) {
      console.error('页面初始化错误:', error);
    }
  },
  methods: {
    // 底部导航切换处理
    handleTabChange(tabKey) {
      console.log('切换到:', tabKey)
    }
  }
}
</script>

<style scoped lang="scss">
// SCSS 变量定义
$primary-color: #296FB7;
$secondary-color: #ff7d00;
$text-color: #222;
$text-light: #666;
$text-lighter: #999;
$border-color: #e5e5e5;
$shadow-light: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
$shadow-medium: 0 4rpx 20rpx rgba(0,0,0,0.06);
$shadow-heavy: 0 8rpx 32rpx 0 rgba(0,0,0,0.08);
$border-radius: 16rpx;
$border-radius-large: 24rpx;

/* 应用容器 */
.app-container {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 主要内容区 */
.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 215rpx 32rpx 120rpx; /* 状态栏+导航栏 内容间距 底部导航 */
  height: calc(100vh - 335rpx);
  
  .section-content {
    width: 100%;
    animation: fadeIn 0.3s ease-in-out;
  }
}

.price-content {
  padding: 32rpx;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 酒店选择模块 */
.home-hotel-select {
  margin-bottom: 32rpx;
  
  .hotel-selection-area {
    width: 100%;
    margin-bottom: 20rpx;
  }
  
  .hotel-picker {
    height: 80rpx;
    background: #fff;
    border-radius: $border-radius;
    border: 2rpx solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    box-shadow: $shadow-light;
    position: relative;
    
    .hotel-label {
      font-size: 28rpx;
      color: $text-light;
      font-weight: 500;
      margin-right: 16rpx;
    }
    
    .hotel-value {
      flex: 1;
      font-size: 28rpx;
      color: $text-color;
      font-weight: 500;
    }
    
    .picker-arrow {
      font-size: 20rpx;
      color: #bdbdbd;
      margin-left: 16rpx;
    }
  }
}

/* 标题与日期选择模块 */
.home-section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-color;
  margin: 0 0 20rpx 0;
}

.home-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin: 0 0 24rpx 0;
  
  .date-input-group {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex: 1;
    background: #fff;
    border: 2rpx solid $border-color;
    border-radius: $border-radius;
    padding: 0 20rpx;
    height: 80rpx;
    box-shadow: $shadow-light;
    
    .year-input {
      flex: 1;
      border: none;
      font-size: 28rpx;
      color: $text-color;
      font-weight: 500;
      background: transparent;
      outline: none;
    }
    
    .year-text {
      font-size: 28rpx;
      color: $text-light;
      font-weight: 500;
    }
  }
  
  .month-picker {
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 8rpx 16rpx;
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
    position: relative;
  }
}

/* 日期选择器 */
.date-picker-container {
  flex: 1;
}

.home-date-picker {
  background: #fff;
  border: 2rpx solid $border-color;
  border-radius: $border-radius;
  padding: 0 32rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: $text-color;
  font-weight: 500;
  box-shadow: $shadow-light;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 8rpx solid transparent;
    border-right: 8rpx solid transparent;
    border-top: 10rpx solid #bdbdbd;
  }
}

.home-confirm-btn {
  background: $primary-color;
  color: #fff;
  border-radius: $border-radius;
  height: 80rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  padding: 0 32rpx;
  margin-right: 0;
  box-shadow: 0 4rpx 16rpx 0 rgba(41,111,183,0.10);
}

/* 日历组件 */
.home-calendar {
  margin: 0;
  background: #fff;
  border-radius: $border-radius-large;
  box-shadow: $shadow-heavy;
  padding: 20rpx;
  
  &-header {
    display: flex;
    justify-content: space-between;
    padding: 0 8rpx;
    margin-bottom: 12rpx;
  }
  
  &-week {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    color: $text-lighter;
    font-weight: 500;
  }
  
  &-body {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }
  
  &-row {
    display: flex;
    gap: 4rpx;
  }
  
  &-cell {
    flex: 1;
    min-height: 100rpx;
    background: #f8f8f8;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &.future {
      background: #e8f5e9;
      border: 1rpx solid #4caf50;
    }
    
    &.past {
      background: #f0f8ff;
      border: 1rpx solid #5dade2;
    }
    
    &.current-day {
      background: #1976d2 !important;
      border: 1rpx solid #1976d2 !important;
      
      .cell-content {
        color: #fff;
      }
      
      .cell-occ,
      .cell-split,
      .cell-otb {
        color: rgba(255,255,255,0.8);
      }
    }
    
    &.prev,
    &.next {
      background: #f5f5f5;
    }
  }
}
/* 日历单元格内容 */
.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 6rpx 2rpx;
}

.cell-price {
  font-size: 18rpx;
  font-weight: bold;
  color: #ff6b6b;
  line-height: 1;
  margin-bottom: 2rpx;
}

.cell-day {
  font-size: 28rpx;
  color: $text-color;
  margin: 2rpx 0;
  font-weight: 600;
  line-height: 1;
  
  &.prev-month {
    color: #bdbdbd !important;
  }
}

.cell-legend {
  display: flex;
  align-items: center;
  font-size: 14rpx;
  line-height: 1;
  margin-top: 1rpx;
  
  &-undefined {
    display: flex;
    align-items: center;
    font-size: 14rpx;
    line-height: 1;
    
    .undefined-text {
      color: #bdbdbd;
      font-size: 12rpx;
    }
  }
}

.cell-occ {
  color: #9e9e9e;
}

.cell-split {
  color: #bdbdbd;
  margin: 0 1rpx;
}

.cell-otb {
  color: #2196f3;
}

/* 图例组件 */
.home-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32rpx;
  margin: 24rpx 0 0 0;
  padding: 16rpx;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
  
  .legend-color {
    width: 24rpx;
    height: 24rpx;
    border-radius: 4rpx;
    
    &.past {
      background: #9e9e9e;
    }
    
    &.future {
      background: $secondary-color;
    }
    
    &.otb {
      background: #2196f3;
    }
  }
  
  .legend-text {
    font-size: 22rpx;
    color: $text-light;
  }
}

/* 团队询价模块 */
.team-tabs {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
  
  .tab-item {
    background: #f5f5f5;
    border-radius: 50rpx;
    padding: 16rpx 40rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    &.active {
      background: $secondary-color;
      box-shadow: 0 4rpx 16rpx rgba(255,125,0,0.3);
      
      .tab-text {
        color: #fff;
        font-weight: 600;
      }
    }
    
    .tab-text {
      font-size: 28rpx;
      color: $text-light;
      font-weight: 500;
    }
  }
}

.inquiry-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.inquiry-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: $shadow-medium;
  border: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  &.recent {
    border-left: 6rpx solid $secondary-color;
    
    .time-text {
      color: $secondary-color;
      font-weight: 500;
    }
  }
}

.inquiry-content {
  flex: 1;
  margin-right: 24rpx;
}

.inquiry-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.inquiry-time {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.time-text {
  font-size: 24rpx;
  color: $text-lighter;
}

/* 报告模块 */
.report-tabs {
  display: flex;
  gap: 40rpx;
  margin-bottom: 32rpx;
  position: relative;
  
  .tab-item {
    background: transparent;
    border-radius: 0;
    padding: 16rpx 0;
    position: relative;
    
    .tab-text {
      font-size: 32rpx;
      color: $text-light;
      font-weight: 500;
      
      &.active {
        color: $secondary-color;
        font-weight: 600;
      }
    }
  }
  
  .tab-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: $secondary-color;
    border-radius: 2rpx;
  }
}

.date-selector-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;
  
  .date-selector {
    background: #f5f5f5;
    border-radius: $border-radius;
    padding: 16rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    flex: 1;
    
    .date-text {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }
}

.report-section {
  background: #fff;
  border-radius: $border-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-medium;
  
  .report-placeholder {
    font-size: 28rpx;
    color: $text-light;
    line-height: 1.6;
  }
}

/* 营销计划页面样式 */
.hotel-select-section {
  background: #fff;
  border-radius: $border-radius;
  margin-bottom: 24rpx;
  box-shadow: $shadow-light;
}

.hotel-picker {
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .hotel-icon {
    font-size: 32rpx;
  }
  
  .hotel-value {
    flex: 1;
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
  }
  
  .picker-arrow {
    font-size: 24rpx;
    color: $text-light;
  }
}

.action-section {
  background: #fff;
  border-radius: $border-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-light;
}

.date-selector {
  margin-bottom: 24rpx;
  
  .date-picker {
    background: #f5f5f5;
    border-radius: $border-radius;
    padding: 24rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    
    .date-icon {
      font-size: 32rpx;
    }
    
    .date-text {
      flex: 1;
      font-size: 28rpx;
      color: $text-color;
      font-weight: 500;
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: $text-light;
    }
  }
}

.ai-action-area {
  margin-bottom: 32rpx;
  
  .ai-generate-btn {
    width: 100%;
    background: linear-gradient(135deg, $primary-color 0%, #4a8bc2 100%);
    color: #fff;
    border: none;
    border-radius: $border-radius;
    padding: 2rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    box-shadow: 0 8rpx 24rpx rgba(41, 111, 183, 0.3);
    
    &:disabled {
      opacity: 0.7;
    }
    
    .btn-icon {
      font-size: 36rpx;
    }
    
    .btn-text {
      font-size: 32rpx;
      font-weight: 600;
    }
  }
}

.stats-row {
  display: flex;
  gap: 32rpx;
  
  .stat-item {
    flex: 1;
    text-align: center;
    
    .stat-number {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: $primary-color;
      line-height: 1;
      margin-bottom: 8rpx;
    }
    
    .stat-label {
      font-size: 24rpx;
      color: $text-light;
    }
  }
}

.calendar-section {
  margin-bottom: 24rpx;
}

.legend-section {
  background: #fff;
  border-radius: $border-radius;
  padding: 32rpx;
  box-shadow: $shadow-light;
  
  .legend-title {
    margin-bottom: 24rpx;
    
    .legend-text {
      font-size: 28rpx;
      color: $text-color;
      font-weight: 600;
    }
  }
  
  .legend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      
      .legend-dot {
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        flex-shrink: 0;
        
        &.douyin {
          background: #ff0050;
        }
        
        &.xiaohongshu {
          background: #ff2442;
        }
        
        &.pengyouquan {
          background: #07c160;
        }
        
        &.holiday {
          background: #ffa726;
        }
        
        &.special {
          background: #29b6f6;
        }
        
        &.city {
          background: #9c27b0;
        }
      }
      
      .legend-label {
        font-size: 24rpx;
        color: $text-light;
      }
    }
  }
}

/* 弹窗样式 */
.task-modal-content,
.add-modal-content {
  padding: 32rpx;
}

.form-item {
  margin-bottom: 32rpx;
  
  .form-label {
    display: block;
    font-size: 28rpx;
    color: $text-color;
    font-weight: 500;
    margin-bottom: 16rpx;
  }
  
  .form-picker {
    background: #f5f5f5;
    border-radius: $border-radius;
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .picker-text {
      font-size: 28rpx;
      color: $text-color;
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: $text-light;
    }
  }
  
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 24rpx;
    border-radius: $border-radius;
    background: #f5f5f5;
    border: none;
    font-size: 28rpx;
    color: $text-color;
    
    &::placeholder {
      color: $text-lighter;
    }
  }
  
  .form-textarea {
    min-height: 120rpx;
    resize: none;
  }
}

/* ===== 营销计划专用样式 ===== */

/* 日历区域 */
.calendar-section {
  margin-bottom: 24rpx;
}
</style>
