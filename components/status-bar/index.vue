<template>
  <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
</template>

<script>
export default {
  name: 'StatusBar',
  data() {
    return {
      statusBarHeight: 44 // 默认状态栏高度
    }
  },
  mounted() {
    // 获取系统信息中的状态栏高度
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight || 44
  }
}
</script>

<style scoped>
.status-bar {
  width: 100%;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
