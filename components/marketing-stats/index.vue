<template>
  <view class="stats-container">
    <!-- 第一行：任务相关统计 -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-number">{{ scheduledCount }}</text>
        <text class="stat-label">已排期任务</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ pendingCount }}</text>
        <text class="stat-label">待审核</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ publishedCount }}</text>
        <text class="stat-label">已发布</text>
      </view>
    </view>
    
    <!-- 第二行：营销效果统计 -->
  
  </view>
</template>

<script>
export default {
  name: 'MarketingStats',
  props: {
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
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.stats-row {
  display: flex;
  gap: 32rpx;
}

.stat-item {
  flex: 1;
  text-align: center;
  
  &.stat-placeholder {
    visibility: hidden; // 占位符，不显示但保持布局
  }
  
  .stat-number {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: #296FB7;
    line-height: 1;
    margin-bottom: 8rpx;
  }
  
  .stat-label {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
