<template>
  <view class="price-strategy">
    <!-- 价格卡片 -->
    <view class="price-card">
      <view class="price-title">当前价格</view>
      <view class="price-value">¥1,2569</view>
      <view class="price-trend positive">+2.3%</view>
    </view>

    <!-- 策略信息 -->
    <view class="strategy-list">
      <view class="strategy-item">
        <view class="strategy-icon">📈</view>
        <view class="strategy-content">
          <view class="strategy-name">自动调价策略</view>
          <view class="strategy-desc">基于市场波动自动调整</view>
        </view>
      </view>
      
      <view class="strategy-item">
        <view class="strategy-icon">⚡</view>
        <view class="strategy-content">
          <view class="strategy-name">快速响应模式</view>
          <view class="strategy-desc">5分钟内响应市场变化</view>
        </view>
      </view>
      
      <view class="strategy-item">
        <view class="strategy-icon">🎯</view>
        <view class="strategy-content">
          <view class="strategy-name">目标价格设定</view>
          <view class="strategy-desc">设置理想价格范围</view>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-btns">
      <view class="btn-secondary">暂停策略</view>
      <view class="btn-primary">调整策略</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PriceStrategy'
}
</script>

<style scoped lang="scss">
.price-strategy {
  padding: 32rpx;
}

/* 价格卡片 */
.price-card {
  background: linear-gradient(135deg, #ff7d00 0%, #ff9500 100%);
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
  text-align: center;
  color: #fff;
}
.price-title {
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 16rpx;
}
.price-value {
  font-size: 64rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}
.price-trend {
  font-size: 32rpx;
  font-weight: 600;
}
.price-trend.positive {
  color: #4ade80;
}

/* 策略列表 */
.strategy-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.strategy-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}
.strategy-item:last-child {
  border-bottom: none;
}
.strategy-icon {
  width: 80rpx;
  height: 80rpx;
  font-size: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff6f0;
  border-radius: 16rpx;
  margin-right: 24rpx;
}
.strategy-content {
  flex: 1;
}
.strategy-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}
.strategy-desc {
  font-size: 28rpx;
  color: #666;
}

/* 操作按钮 */
.action-btns {
  display: flex;
  gap: 24rpx;
}
.btn-secondary, .btn-primary {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
}
.btn-secondary {
  background: #f5f5f5;
  color: #666;
}
.btn-primary {
  background: #ff7d00;
  color: #fff;
}
</style>
