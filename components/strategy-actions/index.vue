<template>
  <view class="action-section">
    <!-- 月份选择器 -->
    <view class="date-selector">
      <picker mode="multiSelector" :range="dateRange" :value="[yearIndex, monthIndex]" @change="handleDateChange">
        <view class="date-picker">
          <text class="date-icon">📅</text>
          <text class="date-text">{{ year }}年{{ month }}月</text>
          <text class="picker-arrow">▼</text>
        </view>
      </picker>
    </view>

    <!-- AI生成按钮 -->
    <view class="ai-action-area">
      <button class="ai-generate-btn" @click="handleGenerate" :disabled="generating">
        <text class="btn-icon">{{ generating ? '⏳' : '✨' }}</text>
        <text class="btn-text">{{ generating ? '生成中...' : 'AI一键生成下月度营销计划' }}</text>
      </button>
      
      <!-- 查看本月度营销计划按钮 -->
      <button class="view-plan-btn" @click="handleViewPlan">
        <text class="btn-icon">📋</text>
        <text class="btn-text">查看本月度营销计划</text>
      </button>
    </view>

    <!-- 统计信息 -->
    <marketing-stats
      :scheduled-count="scheduledCount"
      :pending-count="pendingCount"
      :published-count="publishedCount"
    />
  </view>
</template>

<script>
import MarketingStats from '../marketing-stats/index.vue'

export default {
  name: 'StrategyActions',
  components: {
    MarketingStats
  },
  props: {
    year: {
      type: [String, Number],
      default: ''
    },
    month: {
      type: [String, Number],
      default: ''
    },
    yearIndex: {
      type: Number,
      default: 0
    },
    monthIndex: {
      type: Number,
      default: 0
    },
    dateRange: {
      type: Array,
      default: () => [[], []]
    },
    generating: {
      type: Boolean,
      default: false
    },
    scheduledCount: {
      type: Number,
      default: 0
    },
    pendingCount: {
      type: Number,
      default: 0
    },
    publishedCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    privateCustomerCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleDateChange(e) {
      this.$emit('date-change', e)
    },
    handleGenerate() {
      this.$emit('ai-generate')
    },
    handleViewPlan() {
      this.$emit('view-plan')
    }
  }
}
</script>

<style lang="scss" scoped>
.action-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.date-selector {
  margin-bottom: 24rpx;
}

.date-picker {
  background: #f5f5f5;
  border-radius: 12rpx;
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
    color: #333;
    font-weight: 500;
  }
  
  .picker-arrow {
    font-size: 24rpx;
    color: #999;
  }
}

.ai-action-area {
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ai-generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #296FB7 0%, #4A90E2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(41, 111, 183, 0.3);
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.7;
    transform: none;
  }
  
  &:active {
    transform: translateY(2rpx);
  }
  
  .btn-icon {
    font-size: 36rpx;
  }
  
  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
  }
}

.view-plan-btn {
  width: 100%;
  background: #fff;
  color: #296FB7;
  border: 2rpx solid #296FB7;
  border-radius: 12rpx;
  padding: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    background: #f0f8ff;
  }
  
  .btn-icon {
    font-size: 32rpx;
  }
  
  .btn-text {
    font-size: 28rpx;
    font-weight: 500;
  }
}
</style>
