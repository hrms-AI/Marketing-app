<template>
  <view class="home-navbar-fixed">
    <view>
        <image class="home-logo" :src="logo" mode="aspectFit" />
        <text class="home-title">{{ title }}</text>
    </view>
    <view class="home-navbar-right">
      <text v-if="showBtn" class="home-navbar-btn" @click="$emit('btnClick')">{{ btnText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HomeNavbar',
  props: {
    logo: {
      type: String,
      default: '/static/logo.png'
    },
    title: {
      type: String,
      default: '中旅集团'
    },
    btnText: {
      type: String,
      default: '首页'
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    iconSvg: {
      type: String,
      default: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#fff"/><circle cx="20" cy="20" r="12" fill="#f5f5f5"/><circle cx="20" cy="20" r="6" fill="#ff7d00"/></svg>`
    }
  }
}
</script>

<style scoped>
.home-navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 120rpx;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  z-index: 100;
  box-sizing: border-box;
}
.home-logo {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #fff;
  margin-right: 16rpx;
}
.home-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
}
.home-navbar-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.home-navbar-btn {
  font-size: 28rpx;
  color: #222;
  padding: 8rpx 32rpx;
  margin-right: 8rpx;
}
.home-navbar-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
