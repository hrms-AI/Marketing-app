<template>
  <view class="bottom-tabbar">
    <view 
      v-for="(item, index) in tabs" 
      :key="index"
      class="tabbar-item" 
      :class="{'active': currentTab === item.key}"
      @click="handleTabClick(item)"
    >
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
      default: 'strategy'
    },
    tabs: {
      type: Array,
      default: () => [
        { key: 'strategy', label: '营销内容', path: '/pages/strategy/index' },
        { key: 'material', label: '营销素材', path: '/pages/team/index' },
        { key: 'report', label: '报告', path: '/pages/report/index' }
      ]
    }
  },
  methods: {
    handleTabClick(item) {
      // 如果点击的是当前tab,不做任何操作
      if (this.currentTab === item.key) {
        return;
      }
      
      // 触发父组件事件
      this.$emit('tab-change', item.key);
      
      // 小程序导航优化方案
      if (item.path) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentRoute = '/' + currentPage.route;
        
        // 如果已经在目标页面,不跳转
        if (currentRoute === item.path) {
          return;
        }
        
        // 检查目标页面是否在页面栈中
        let targetIndex = -1;
        for (let i = pages.length - 1; i >= 0; i--) {
          if ('/' + pages[i].route === item.path) {
            targetIndex = i;
            break;
          }
        }
        
        // 如果目标页面在栈中,返回到该页面
        if (targetIndex !== -1) {
          const delta = pages.length - 1 - targetIndex;
          uni.navigateBack({ delta });
        } else {
          // 否则使用 redirectTo 跳转(避免页面栈堆积)
          uni.redirectTo({ 
            url: item.path,
            fail: (err) => {
              console.error('redirectTo失败,尝试navigateTo:', err);
              uni.navigateTo({ url: item.path });
            }
          });
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bottom-tabbar {
  position: fixed !important;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99999 !important;
  height: 80rpx;
  background: #ffffff !important;
  -webkit-backdrop-filter: blur(10rpx);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
  cursor: pointer;
}

.tabbar-label {
  font-size: 26rpx;
  color: #999;
  font-weight: 400;
  transition: all 0.3s ease;
}

.active-label {
  color: #5dade2 !important;
  font-weight: 600 !important;
  font-size: 28rpx;
}
</style>
