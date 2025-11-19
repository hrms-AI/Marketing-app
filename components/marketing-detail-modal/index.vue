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
          <!-- 数据卡片 -->
          <view class="data-cards">
            <view class="data-card price-card">
              <view class="card-icon-bg">
                <text class="card-icon">💰</text>
              </view>
              <view class="card-info">
                <text class="card-label">房价</text>
                <text class="card-value">¥{{ detail.price }}</text>
              </view>
            </view>
            
            <view class="data-card occupancy-card">
              <view class="card-icon-bg">
                <text class="card-icon">🏨</text>
              </view>
              <view class="card-info">
                <text class="card-label">入住率</text>
                <text class="card-value">{{ detail.occupancy }}%</text>
              </view>
            </view>
            
            <view class="data-card otb-card">
              <view class="card-icon-bg">
                <text class="card-icon">📈</text>
              </view>
              <view class="card-info">
                <text class="card-label">出房率</text>
                <text class="card-value">{{ detail.otb }}%</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 营销管理滚动区域 -->
        <view class="action-section">
          <text class="action-title">营销管理</text>
          <view class="action-buttons">
            <button class="action-btn channels-btn" @click="handleViewChannels">
              <view class="btn-content">
                <view class="btn-icon-wrapper">
                  <text class="btn-icon">📱</text>
                </view>
                <view class="btn-info">
                  <text class="btn-title">推送渠道</text>
                  <text class="btn-desc">查看营销渠道详情</text>
                </view>
                <text class="btn-arrow">→</text>
              </view>
            </button>
            
            <button class="action-btn content-btn" @click="handleViewContent">
              <view class="btn-content">
                <view class="btn-icon-wrapper">
                  <text class="btn-icon">📝</text>
                </view>
                <view class="btn-info">
                  <text class="btn-title">营销内容</text>
                  <text class="btn-desc">查看推广内容素材</text>
                </view>
                <text class="btn-arrow">→</text>
              </view>
            </button>
            
            <button class="action-btn feedback-btn" @click="handleViewFeedback">
              <view class="btn-content">
                <view class="btn-icon-wrapper">
                  <text class="btn-icon">💬</text>
                </view>
                <view class="btn-info">
                  <text class="btn-title">客户反馈</text>
                  <text class="btn-desc">查看用户反馈数据</text>
                </view>
                <text class="btn-arrow">→</text>
              </view>
            </button>
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
  padding: 24rpx 24rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.data-card {
  background: white;
  border-radius: 12rpx;
  padding: 16rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #f0f0f0;
  
  &:active {
    transform: scale(0.98);
    background: #f8f9fa;
  }
}

.price-card .card-icon-bg {
  background: linear-gradient(135deg, #ff7d00 0%, #e66a00 100%);
}

.occupancy-card .card-icon-bg {
  background: linear-gradient(135deg, #296FB7 0%, #1e5a96 100%);
}

.otb-card .card-icon-bg {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.card-icon-bg {
  width: 48rpx;
  height: 48rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 24rpx;
  color: white;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.card-label {
  font-size: 20rpx;
  color: #666;
}

.card-value {
  font-size: 26rpx;
  font-weight: 700;
  color: #333;
}

.action-section {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx 24rpx;
  
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 4rpx;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 2rpx;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2rpx;
    
    &:hover {
      background: #999;
    }
  }
}

.action-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 12rpx;
  border-left: 4rpx solid #296FB7;
  display: block;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.action-btn {
  background: white;
  border: 1rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 0;
  
  &:active {
    background: #f8f9fa;
  }
}

.btn-content {
  display: flex;
  align-items: center;
  padding: 16rpx;
  gap: 14rpx;
}

.btn-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.channels-btn .btn-icon-wrapper {
  background: linear-gradient(135deg, #ff7d00 0%, #e66a00 100%);
}

.content-btn .btn-icon-wrapper {
  background: linear-gradient(135deg, #296FB7 0%, #1e5a96 100%);
}

.feedback-btn .btn-icon-wrapper {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.btn-icon {
  font-size: 24rpx;
  color: white;
}

.btn-info {
  flex: 1;
  text-align: left;
}

.btn-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 4rpx;
  display: block;
}

.btn-desc {
  font-size: 20rpx;
  color: #999;
  display: block;
}

.btn-arrow {
  font-size: 22rpx;
  color: #ccc;
}

.action-btn:active .btn-arrow {
  color: #296FB7;
}
</style>
