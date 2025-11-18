<template>
  <view class="top-navbar">
    <view class="nav-left">
      <text v-if="showBack" class="back-btn" @click="handleBack">‹</text>
      <image v-else-if="showLogo" class="nav-logo" src="/static/logo.png" mode="aspectFit" />
    </view>
    <view class="nav-title">{{ title }}</view>
  </view>
</template>

<script>
export default {
  name: 'TopNavbar',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showBack: {
      type: Boolean,
      default: false
    },
    showLogo: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleBack() {
      this.$emit('back');
      if (!this.$listeners.back) {
        uni.navigateBack();
      }
    }
  }
}
</script>

<style scoped>
.top-navbar {
  position: fixed;
  top: 60rpx; /* 状态栏高度 */
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38rpx 32rpx 0 32rpx;
  height: 88rpx;
  background: rgba(255, 246, 240, 0.95);
  backdrop-filter: blur(10rpx);
}
.back-btn {
  font-size: 54rpx;
  color: #000;
  font-weight: 300;
  width: 60rpx;
  text-align: left;
}
.nav-left {
  width: 60rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.nav-logo {
  width: 54rpx;
  height: 54rpx;
  border-radius: 14rpx;
}
.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #000;
  flex: 1;
  text-align: center;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  width: 60rpx;
  justify-content: flex-end;
}
.nav-dots {
  font-size: 28rpx;
  color: #000;
}
.nav-target {
  font-size: 28rpx;
  color: #000;
}
</style>
