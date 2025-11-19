<template>
  <uv-modal 
    v-model="localVisible" 
    title="AI生成月度计划"
    confirm-text="开始生成"
    cancel-text="取消"
    @confirm="handleConfirm"
    @cancel="handleCancel">
    <view class="ai-generate-modal-content">
      <view class="ai-info-section">
        <view class="ai-icon">🤖</view>
        <view class="ai-description">
          <text class="ai-title">智能营销计划助手</text>
          <text class="ai-subtitle">基于酒店数据和市场趋势，为您生成专业的营销计划</text>
        </view>
      </view>
      
      <view class="generate-info">
        <view class="info-item">
          <text class="info-label">生成周期：</text>
          <text class="info-value">{{ year }}年{{ month }}月</text>
        </view>
        <view class="info-item">
          <text class="info-label">目标酒店：</text>
          <text class="info-value">{{ hotelName || '请选择酒店' }}</text>
        </view>
      </view>
      
      <view class="feature-list">
        <text class="feature-title">生成内容包括：</text>
        <view class="feature-item">
          <text class="feature-icon">📅</text>
          <text class="feature-text">营销日历规划</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🎯</text>
          <text class="feature-text">推广策略建议</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <text class="feature-text">预期效果分析</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💡</text>
          <text class="feature-text">创意内容方向</text>
        </view>
      </view>
      
      <view class="generate-tips">
        <text class="tips-text">💡 生成过程需要1-2分钟，请耐心等待</text>
      </view>
    </view>
  </uv-modal>
</template>

<script>
export default {
  name: 'AIGenerateModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    year: {
      type: [String, Number],
      default: ''
    },
    month: {
      type: [String, Number],
      default: ''
    },
    hotelName: {
      type: String,
      default: ''
    }
  },
  computed: {
    localVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) {
          this.$emit('cancel')
        }
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-generate-modal-content {
  padding: 20rpx;
}

.ai-info-section {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 32rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16rpx;
}

.ai-icon {
  font-size: 64rpx;
  line-height: 1;
}

.ai-description {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.ai-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}

.ai-subtitle {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.generate-info {
  margin-bottom: 32rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  
  &:not(:last-child) {
    border-bottom: 1rpx solid #e9ecef;
  }
}

.info-label {
  font-size: 26rpx;
  color: #666;
  min-width: 160rpx;
}

.info-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #296FB7;
}

.feature-list {
  margin-bottom: 24rpx;
}

.feature-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 0;
}

.feature-icon {
  font-size: 32rpx;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
}

.generate-tips {
  padding: 16rpx;
  background: #fff3cd;
  border-radius: 8rpx;
  border-left: 4rpx solid #ffc107;
}

.tips-text {
  font-size: 24rpx;
  color: #856404;
  line-height: 1.5;
}
</style>
