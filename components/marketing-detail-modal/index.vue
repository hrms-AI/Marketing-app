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
        
        <!-- 营销管理网格区域 -->
        <view class="action-section">
          <text class="action-title">营销管理</text>
          
          <!-- 网格布局 -->
          <view class="management-grid">
            <view 
              v-for="(card, index) in managementCards" 
              :key="index"
              class="management-card"
              :class="`${card.type}-card`"
              @click="card.handler"
            >
              <view class="card-gradient">
                <view class="card-icon-large">{{ card.icon }}</view>
                <view class="card-badge">{{ card.badge }}</view>
              </view>
              <view class="card-body">
                <text class="card-title">{{ card.title }}</text>
                <text class="card-subtitle">{{ card.subtitle }}</text>
                <view class="card-stats">
                  <view class="stat-item">
                    <text class="stat-label">{{ card.stat1.label }}</text>
                    <text class="stat-value">{{ card.stat1.value }}</text>
                  </view>
                  <view class="stat-divider"></view>
                  <view class="stat-item">
                    <text class="stat-label">{{ card.stat2.label }}</text>
                    <text class="stat-value">{{ card.stat2.value }}</text>
                  </view>
                </view>
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
    
    // 营销管理卡片配置
    managementCards() {
      return [
        {
          type: 'channels',
          icon: '📱',
          badge: '6个渠道',
          title: '推送渠道',
          subtitle: 'Channel Management',
          stat1: {
            label: '覆盖率',
            value: this.detail.channelCoverage || '85%'
          },
          stat2: {
            label: '活跃度',
            value: this.detail.channelActive || '92%'
          },
          handler: this.handleViewChannels
        },
        {
          type: 'content',
          icon: '📝',
          badge: '12条内容',
          title: '营销内容',
          subtitle: 'Content Library',
          stat1: {
            label: '点击率',
            value: this.detail.contentClick || '78%'
          },
          stat2: {
            label: '转化率',
            value: this.detail.contentConversion || '45%'
          },
          handler: this.handleViewContent
        },
        {
          type: 'feedback',
          icon: '💬',
          badge: '28条反馈',
          title: '客户反馈',
          subtitle: 'User Feedback',
          stat1: {
            label: '满意度',
            value: `${this.detail.satisfaction || '4.5'}★`
          },
          stat2: {
            label: '回复率',
            value: this.detail.replyRate || '96%'
          },
          handler: this.handleViewFeedback
        },
        {
          type: 'analytics',
          icon: '📊',
          badge: '实时',
          title: '数据分析',
          subtitle: 'Data Analytics',
          stat1: {
            label: '访问量',
            value: this.detail.visits || '1.2K'
          },
          stat2: {
            label: '增长率',
            value: this.detail.growth || '+15%'
          },
          handler: this.handleViewAnalytics
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
}

.data-cards-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 24rpx 0;
  gap: 24rpx;
}

.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 180rpx;
  height: 200rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 16rpx;
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
  padding: 20rpx 0 16rpx;
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

/* 网格布局 */
.management-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
  padding: 32rpx 40rpx;
  background: #f8fafc;
}

/* 管理卡片 */
.management-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.06), 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1rpx solid rgba(0, 0, 0, 0.04);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }
  
  &:active {
    transform: translateY(-6rpx) scale(0.98);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12), 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    
    &::after {
      opacity: 1;
    }
  }
}

.card-gradient {
  height: 140rpx;
  padding: 24rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

/* 不同卡片的渐变色 */
.channels-card .card-gradient {
  background: linear-gradient(135deg, #ff7d00 0%, #ff9a3e 100%);
}

.content-card .card-gradient {
  background: linear-gradient(135deg, #296FB7 0%, #4A90E2 100%);
}

.feedback-card .card-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
}

.analytics-card .card-gradient {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.card-icon-large {
  font-size: 56rpx;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.25));
}

.card-badge {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10rpx);
  color: white;
  font-size: 22rpx;
  font-weight: 700;
  padding: 8rpx 16rpx;
  border-radius: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.4);
  align-self: flex-start;
  letter-spacing: 0.5rpx;
}

.card-body {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6rpx;
  letter-spacing: 0.5rpx;
  line-height: 1.4;
}

.card-subtitle {
  font-size: 24rpx;
  color: #64748b;
  margin-bottom: 20rpx;
  text-transform: uppercase;
  letter-spacing: 1rpx;
  font-weight: 600;
  opacity: 0.85;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f1f5f9;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5rpx;
  text-align: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 900;
  color: #296FB7;
  letter-spacing: -0.5rpx;
  text-align: center;
  line-height: 1.2;
}

.stat-divider {
  width: 1rpx;
  height: 32rpx;
  background: #e9ecef;
}

/* 移除旧的按钮样式 */
.action-buttons,
.action-btn,
.btn-content,
.btn-icon-wrapper,
.btn-icon,
.btn-info,
.btn-title,
.btn-desc,
.btn-arrow {
  display: none;
}
</style>
