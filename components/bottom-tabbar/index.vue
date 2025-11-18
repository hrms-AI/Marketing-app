<template>
  <view class="bottom-tabbar">
    <view 
      v-for="(item, index) in tabs" 
      :key="index"
      class="tabbar-item" 
      :class="{'active': currentTab === item.key}"
      @click="handleTabClick(item)"
    >
      <view class="tabbar-icon" :class="{'active-icon': currentTab === item.key}">
        <text class="icon-text" :class="{'active-text': currentTab === item.key}">{{ item.icon }}</text>
      </view>
      <text class="tabbar-label" :class="{'active-label': currentTab === item.key}">{{ item.label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BottomTabbar',
  props: {
    currentTab: {
      type: String,
      default: 'price'
    },
    tabs: {
      type: Array,
      default: () => [
        { key: 'strategy', label: '价格策略', icon: '📊', path: '/pages/index/index' },
        { key: 'material', label: '素材', icon: '�️', path: '/pages/material/index' },
        { key: 'report', label: '报告', icon: '📋', path: '/pages/report/index' }
      ]
    }
  },
  methods: {
    handleTabClick(item) {
      // 总是触发事件
      this.$emit('tab-change', item.key);
      
      // 阻止默认的页面跳转行为，让父组件处理
      // 不再执行任何页面跳转逻辑
    }
  }
}
</script>

<style scoped>
.bottom-tabbar {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx 0;
}
.tabbar-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
}
.active-icon {
  background: #ff7d00 !important;
}
.icon-text {
  font-size: 24rpx;
  color: #999;
}
.active-text {
  color: #fff !important;
}
.tabbar-label {
  font-size: 22rpx;
  color: #999;
  font-weight: 400;
}
.active-label {
  color: #ff7d00 !important;
  font-weight: 600 !important;
}
</style>
