<template>
  <view class="material-page">
    <view class="material-content">
      <!-- 页面标题 -->
      <view class="page-title">
        <text class="title-text">营销素材</text>
      </view>
      
      <!-- 素材分类 -->
      <view class="category-tabs">
        <view class="category-tab active">
          <text class="category-text">图片素材</text>
        </view>
        <view class="category-tab">
          <text class="category-text">视频素材</text>
        </view>
        <view class="category-tab">
          <text class="category-text">文案模板</text>
        </view>
      </view>
      
      <!-- 素材网格 -->
      <view class="material-grid">
        <view class="material-item" v-for="i in 6" :key="i">
          <view class="material-placeholder">
            <text class="placeholder-text">素材 {{i}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.material-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #e3f2fd 0%, #fff 50%);
  position: relative;
  overflow: hidden;
}

.material-content {
  padding: 32rpx;
  padding-bottom: 140rpx;
}

.page-title {
  margin-bottom: 40rpx;
}

.title-text {
  font-size: 48rpx;
  color: #333;
  font-weight: 600;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 46rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;
}

.category-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 46rpx;
  transition: all 0.3s ease;
}

.category-tab.active {
  background: #42a5f5;
}

.category-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 400;
}

.category-tab.active .category-text {
  color: #fff;
  font-weight: 500;
}

/* 素材网格 */
.material-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.material-item {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.material-placeholder {
  height: 300rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 28rpx;
  color: #999;
}
</style>
