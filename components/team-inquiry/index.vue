<template>
  <view class="team-inquiry">
    <!-- 团队状态 -->
    <view class="team-status">
      <view class="status-card">
        <view class="status-title">团队成员</view>
        <view class="status-value">15人</view>
      </view>
      <view class="status-card">
        <view class="status-title">在线人数</view>
        <view class="status-value">12人</view>
      </view>
    </view>

    <!-- 询价列表 -->
    <view class="inquiry-list">
      <view class="inquiry-item">
        <view class="inquiry-header">
          <view class="user-avatar">👤</view>
          <view class="user-info">
            <view class="user-name">张明</view>
            <view class="inquiry-time">2分钟前</view>
          </view>
          <view class="inquiry-status pending">待处理</view>
        </view>
        <view class="inquiry-content">
          客户询问产品A的批量价格，数量1000件
        </view>
      </view>

      <view class="inquiry-item">
        <view class="inquiry-header">
          <view class="user-avatar">👤</view>
          <view class="user-info">
            <view class="user-name">李华</view>
            <view class="inquiry-time">5分钟前</view>
          </view>
          <view class="inquiry-status processing">处理中</view>
        </view>
        <view class="inquiry-content">
          VIP客户咨询新品价格政策
        </view>
      </view>

      <view class="inquiry-item">
        <view class="inquiry-header">
          <view class="user-avatar">👤</view>
          <view class="user-info">
            <view class="user-name">王强</view>
            <view class="inquiry-time">10分钟前</view>
          </view>
          <view class="inquiry-status completed">已完成</view>
        </view>
        <view class="inquiry-content">
          季度合作价格已确认并发送
        </view>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="quick-actions">
      <view class="action-btn">
        <view class="action-icon">📝</view>
        <view class="action-text">新建询价</view>
      </view>
      <view class="action-btn">
        <view class="action-icon">👥</view>
        <view class="action-text">团队管理</view>
      </view>
      <view class="action-btn">
        <view class="action-icon">⚙️</view>
        <view class="action-text">设置</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TeamInquiry'
}
</script>

<style scoped>
.team-inquiry {
  padding: 32rpx;
}

/* 团队状态 */
.team-status {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}
.status-card {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.status-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
}
.status-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #ff7d00;
}

/* 询价列表 */
.inquiry-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.inquiry-item {
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}
.inquiry-item:last-child {
  border-bottom: none;
}
.inquiry-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.user-avatar {
  width: 64rpx;
  height: 64rpx;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  font-size: 32rpx;
}
.user-info {
  flex: 1;
}
.user-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.inquiry-time {
  font-size: 24rpx;
  color: #999;
}
.inquiry-status {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-weight: 500;
}
.inquiry-status.pending {
  background: #fff3cd;
  color: #856404;
}
.inquiry-status.processing {
  background: #cce5ff;
  color: #0066cc;
}
.inquiry-status.completed {
  background: #d4edda;
  color: #155724;
}
.inquiry-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-left: 80rpx;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  gap: 24rpx;
}
.action-btn {
  flex: 1;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.04);
}
.action-icon {
  font-size: 40rpx;
  margin-bottom: 12rpx;
}
.action-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
</style>
