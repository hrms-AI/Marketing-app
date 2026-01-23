<template>
  <view class="top-navbar" :style="{ top: statusBarHeight + 'px' }">
    <view class="nav-left" @click="handleBack">
      <text v-if="showBack" class="back-btn">❮</text>
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
      console.log('点击返回按钮')
      this.$emit('back');
      if (!this.$listeners.back) {
        // 获取当前页面栈
        const pages = getCurrentPages();

        // 如果页面栈大于1，正常返回
        if (pages.length > 1) {
          uni.navigateBack({
            delta: 1,
            fail: () => {
              console.log('navigateBack失败，尝试跳转到首页')
              this.goToHomePage();
            }
          });
        } else {
          // 如果页面栈只有1页，说明是首页或直接打开的页面，跳转到策略页
          console.log('页面栈只有1页，跳转到策略页')
          this.goToHomePage();
        }
      }
    },

    goToHomePage() {
      // 使用 reLaunch 清空页面栈并跳转到首页
      uni.reLaunch({
        url: '/pages/strategy/index',
        fail: (err) => {
          console.error('跳转首页失败:', err);
          // 如果 reLaunch 失败，尝试 redirectTo
          uni.redirectTo({
            url: '/pages/strategy/index'
          });
        }
      });
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
  justify-content: center;
  padding: 0 32rpx 0 32rpx;
  height: 88rpx;
  background: #f0f8ff;
}
.back-btn {
  font-size: 48rpx;
  color: #333;
  font-weight: 500;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 80rpx;
  cursor: pointer;
}
.nav-left {
  position: absolute;
  left: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
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
