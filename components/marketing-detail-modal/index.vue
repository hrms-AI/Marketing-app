<template>
  <view v-if="visible" class="modal-overlay" @click="handleClose">
    <view class="marketing-detail-popup" @click.stop="">
      <!-- 弹窗头部 -->
      <view class="popup-header">
        <view class="header-content">
          <view class="header-icon">📊</view>
          <view class="header-text">
            <text class="popup-title">营销详情</text>
            <text class="popup-subtitle">Marketing Details</text>
          </view>
        </view>
        <button class="close-btn" @click="handleClose">
          <text class="close-icon">✕</text>
        </button>
      </view>
      
      <view class="marketing-detail-content">
        <!-- 日期和数据展示 -->
        <view v-if="dateInfo" class="detail-header">
          <!-- 可滑动数据卡片 -->
          <scroll-view 
            class="data-cards-scroll" 
            scroll-x="true"
            show-scrollbar="false"
          >
            <view class="data-cards-container">
              <view 
                v-for="(item, index) in dataCards" 
                :key="index"
                class="data-card"
                :class="`${item.type}-card`"
              >
                <view class="card-icon-bg">
                  <text class="card-icon">{{ item.icon }}</text>
                </view>
                <view class="card-info">
                  <text class="card-label">{{ item.label }}</text>
                  <text class="card-value">{{ item.value }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
          
          <!-- 滑动提示 -->
          <view class="scroll-hint">
            <text class="hint-text">← 左右滑动查看更多数据 →</text>
          </view>
        </view>
        
        <!-- 今日营销概览 -->
        <view class="action-section">
          <text class="action-title">今日营销概览</text>
          
          <!-- 营销内容 -->
          <view class="marketing-section">
            <view class="section-header">
              <text class="section-icon">📝</text>
              <text class="section-title">营销内容</text>
              <text class="section-count">{{ todayContent.length }}条</text>
            </view>
            <view class="content-list">
              <view 
                v-for="(content, index) in todayContent" 
                :key="index"
                class="content-item"
              >
                <view class="content-icon">{{ content.icon }}</view>
                <view class="content-info">
                  <text class="content-title">{{ content.title }}</text>
                  <text class="content-desc">{{ content.desc }}</text>
                </view>
                <view class="content-status" :class="content.statusClass">
                  <text class="status-text">{{ content.status }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 营销渠道 -->
          <view class="marketing-section">
            <view class="section-header">
              <text class="section-icon">📱</text>
              <text class="section-title">营销渠道</text>
              <text class="section-count">{{ activeChannels.length }}个活跃</text>
            </view>
            <view class="channel-list">
              <view 
                v-for="(channel, index) in activeChannels" 
                :key="index"
                class="channel-item"
              >
                <view class="channel-icon">{{ channel.icon }}</view>
                <view class="channel-info">
                  <text class="channel-name">{{ channel.name }}</text>
                  <text class="channel-stats">{{ channel.stats }}</text>
                </view>
                <view class="channel-indicator" :class="channel.status">
                  <text class="indicator-dot"></text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 营销任务状态 -->
          <view class="marketing-section">
            <view class="section-header">
              <text class="section-icon">📋</text>
              <text class="section-title">营销任务状态</text>
              <text class="section-count">{{ todayTasks.total }}项任务</text>
            </view>
            <view class="task-status-overview">
              <view 
                v-for="(taskStatus, index) in taskStatusList" 
                :key="index"
                class="task-status-item"
                :class="taskStatus.type"
              >
                <text class="task-status-count">{{ taskStatus.count }}</text>
                <text class="task-status-label">{{ taskStatus.label }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MarketingDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dateInfo: {
      type: Object,
      default: () => null
    },
    detail: {
      type: Object,
      default: () => ({
        price: 0,
        occupancy: 0,
        otb: 0
      })
    }
  },
  computed: {
    // 数据卡片配置
    dataCards() {
      return [
        {
          type: 'price',
          icon: '💰',
          label: '房价',
          value: `¥${this.detail.price || 0}`
        },
        {
          type: 'occupancy',
          icon: '🏨',
          label: '入住率',
          value: `${this.detail.occupancy || 0}%`
        },
        {
          type: 'otb',
          icon: '📈',
          label: '出房率',
          value: `${this.detail.otb || 0}%`
        },
        {
          type: 'coupon',
          icon: '🎫',
          label: '卡券核销',
          value: `${this.detail.couponUsed || 32}张`
        },
        {
          type: 'views',
          icon: '👀',
          label: '浏览量',
          value: this.detail.pageViews || '1.2K'
        },
        {
          type: 'wechat',
          icon: '💬',
          label: '加私',
          value: `${this.detail.wechatAdds || 48}人`
        }
      ];
    },
    
    // 今日营销内容
    todayContent() {
      return [
        {
          icon: '📱',
          title: '抖音短视频发布',
          desc: '酒店特色房型展示视频',
          status: '已发布',
          statusClass: 'published'
        },
        {
          icon: '📖',
          title: '小红书图文推广',
          desc: '周末特惠活动宣传',
          status: '进行中',
          statusClass: 'active'
        },
        {
          icon: '💬',
          title: '微信朋友圈营销',
          desc: '客户好评分享转发',
          status: '待发布',
          statusClass: 'pending'
        }
      ];
    },
    
    // 活跃营销渠道
    activeChannels() {
      return [
        {
          icon: '📱',
          name: '抖音',
          stats: '今日曝光 2.3K',
          status: 'active'
        },
        {
          icon: '📖',
          name: '小红书',
          stats: '今日点赞 156',
          status: 'active'
        },
        {
          icon: '💬',
          name: '微信',
          stats: '今日咨询 28人',
          status: 'active'
        },
        {
          icon: '�',
          name: '快手',
          stats: '暂无数据',
          status: 'inactive'
        }
      ];
    },
    
    // 今日任务统计
    todayTasks() {
      return {
        total: 8,
        completed: 3,
        active: 2,
        pending: 3
      };
    },
    
    // 任务状态列表
    taskStatusList() {
      return [
        {
          type: 'completed',
          count: this.todayTasks.completed,
          label: '已完成'
        },
        {
          type: 'active',
          count: this.todayTasks.active,
          label: '进行中'
        },
        {
          type: 'pending',
          count: this.todayTasks.pending,
          label: '待开始'
        }
      ];
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleViewChannels() {
      this.$emit('view-channels');
    },
    handleViewContent() {
      this.$emit('view-content');
    },
    handleViewFeedback() {
      this.$emit('view-feedback');
    },
    handleViewAnalytics() {
      this.$emit('view-analytics');
    }
  }
};
</script>

<style scoped lang="scss">
/* 营销详情弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  animation: overlayIn 0.3s ease-out;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.marketing-detail-popup {
  width: 680rpx;
  max-width: 92vw;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  background: linear-gradient(135deg, #296FB7 0%, #1e5a96 100%);
  color: white;
  padding: 40rpx 32rpx;
  position: relative;
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }
  
  .header-icon {
    width: 64rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
  }
  
  .header-text {
    flex: 1;
  }
  
  .popup-title {
    font-size: 36rpx;
    font-weight: 700;
    margin-bottom: 8rpx;
    display: block;
  }
  
  .popup-subtitle {
    font-size: 24rpx;
    opacity: 0.85;
    display: block;
  }
  
  .close-btn {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:active {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .close-icon {
      font-size: 32rpx;
      color: white;
      font-weight: 600;
    }
  }
}

.marketing-detail-content {
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  overflow: hidden;
}

.detail-header {
  flex-shrink: 0;
  padding: 32rpx 0 24rpx;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
}

/* 横向滚动容器 */
.data-cards-scroll {
  width: 100%;
  padding: 0 32rpx;
  box-sizing: border-box;
  /* 确保滚动行为正常 */
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-cards-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 24rpx 0;
  gap: 32rpx;
  /* 确保容器宽度足够，强制滚动 */
  width: max-content;
  min-width: 100%;
}

.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 240rpx; /* 增加宽度从180rpx到240rpx */
  height: 200rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 20rpx; /* 增加左右内边距 */
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.07);
  border: 1rpx solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  gap: 12rpx;
  
  &:active {
    transform: scale(0.96);
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }
  
  &::before, &::after {
    display: none; /* 移除之前复杂但效果不佳的伪元素 */
  }
}

.price-card {
  &::before {
    background: linear-gradient(90deg, #ff7d00 0%, #ff9a3e 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #ff7d00 0%, #ff9a3e 100%);
  }
  
  .card-value {
    color: #ff7d00;
  }
}

.occupancy-card {
  &::before {
    background: linear-gradient(90deg, #296FB7 0%, #4A90E2 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #296FB7 0%, #4A90E2 100%);
  }
  
  .card-value {
    color: #296FB7;
  }
}

.otb-card {
  &::before {
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  }
  
  .card-value {
    color: #10b981;
  }
}

.coupon-card {

  &::before {
    background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  }
  
  .card-value {
    color: #f59e0b;
  }
}

.views-card {
  &::before {
    background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  }
  
  .card-value {
    color: #8b5cf6;
  }
}

.wechat-card {
  &::before {
    background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%);
  }
  
  .card-icon-bg {
    background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
  }
  
  .card-value {
    color: #06b6d4;
  }
}

.card-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.12);
  position: relative;
}

.card-icon {
  font-size: 44rpx;
  line-height: 1;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.card-label {
  font-size: 24rpx;
  color: #475569;
  font-weight: 600;
  line-height: 1.3;
}

.card-value {
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1.2;
}

/* 滑动提示 */
.scroll-hint {
  text-align: center;
  padding: 20rpx 0 16rpx; /* 增加上方间距 */
}

.hint-text {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 600;
  opacity: 0.7;
  letter-spacing: 1rpx;
}

.action-section {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx;
  background: linear-gradient(180deg, #f8fafe 0%, #fff 100%);
}

.action-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
  margin-bottom: 20rpx;
  padding-left: 12rpx;
  border-left: 4rpx solid #296FB7;
  display: block;
}

/* 营销模块样式 */
.marketing-section {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1rpx solid #e2e8f0;
  
  .section-icon {
    font-size: 36rpx;
    margin-right: 16rpx;
  }
  
  .section-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: 600;
    color: #334155;
  }
  
  .section-count {
    font-size: 24rpx;
    color: #64748b;
    background: rgba(41, 111, 183, 0.1);
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-weight: 500;
  }
}

/* 营销内容列表 */
.content-list {
  padding: 24rpx 32rpx;
}

.content-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  .content-icon {
    font-size: 32rpx;
    margin-right: 20rpx;
  }
  
  .content-info {
    flex: 1;
    
    .content-title {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8rpx;
    }
    
    .content-desc {
      font-size: 24rpx;
      color: #64748b;
    }
  }
  
  .content-status {
    padding: 8rpx 16rpx;
    border-radius: 16rpx;
    font-size: 22rpx;
    font-weight: 500;
    
    &.published {
      background: #dcfce7;
      color: #166534;
    }
    
    &.active {
      background: #dbeafe;
      color: #1d4ed8;
    }
    
    &.pending {
      background: #fef3c7;
      color: #92400e;
    }
  }
}

/* 营销渠道列表 */
.channel-list {
  padding: 24rpx 32rpx;
}

.channel-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  .channel-icon {
    font-size: 32rpx;
    margin-right: 20rpx;
  }
  
  .channel-info {
    flex: 1;
    
    .channel-name {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8rpx;
    }
    
    .channel-stats {
      font-size: 24rpx;
      color: #64748b;
    }
  }
  
  .channel-indicator {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    margin-left: 16rpx;
    
    &.active {
      background: #10b981;
      box-shadow: 0 0 8rpx rgba(16, 185, 129, 0.4);
    }
    
    &.inactive {
      background: #cbd5e1;
    }
  }
}

/* 任务状态概览 */
.task-status-overview {
  display: flex;
  padding: 32rpx;
  gap: 24rpx;
}

.task-status-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
  border-radius: 16rpx;
  
  .task-status-count {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    margin-bottom: 8rpx;
  }
  
  .task-status-label {
    font-size: 24rpx;
    font-weight: 500;
  }
  
  &.completed {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    
    .task-status-count {
      color: #166534;
    }
    
    .task-status-label {
      color: #15803d;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    
    .task-status-count {
      color: #1d4ed8;
    }
    
    .task-status-label {
      color: #2563eb;
    }
  }
  
  &.pending {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    
    .task-status-count {
      color: #92400e;
    }
    
    .task-status-label {
      color: #d97706;
    }
  }
}




</style>
