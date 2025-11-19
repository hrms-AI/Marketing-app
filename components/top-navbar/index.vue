<template>
  <view class="top-navbar" :style="{ top: statusBarHeight + 'px' }">
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
  data() {
    return {
      statusBarHeight: 44 // 默认状态栏高度
    }
  },
  mounted() {
    // 获取系统信息中的状态栏高度
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 44
    console.log('导航栏获取状态栏高度:', this.statusBarHeight)
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

<style scoped lang="scss">
.top-navbar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38rpx 32rpx 0 32rpx;
  height: 88rpx;
  background: #f0f8ff;
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
