<template>
  <view class="legend-section">
    <view class="legend-title">
      <text class="legend-text">营销任务类型</text>
    </view>
    <view class="legend-grid">
      <view class="legend-item">
        <view class="legend-dot douyin"></view>
        <text class="legend-label">抖音视频</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot xiaohongshu"></view>
        <text class="legend-label">小红书图文</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot pengyouquan"></view>
        <text class="legend-label">朋友圈海报</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot holiday"></view>
        <text class="legend-label">节假日活动</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot special"></view>
        <text class="legend-label">特殊纪念日</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot city"></view>
        <text class="legend-label">城市活动</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MarketingLegend'
}
</script>

<style lang="scss" scoped>
.legend-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.legend-title {
  margin-bottom: 24rpx;
  
  .legend-text {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
  }
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

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
    color: #999;
  }
}
</style>
