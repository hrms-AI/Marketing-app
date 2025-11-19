<template>
  <view class="hotel-select-section">
    <picker mode="selector" :range="hotelNames" :value="selectedIndex" @change="handleChange">
      <view class="hotel-picker">
        <text class="hotel-icon">🏨</text>
        <text class="hotel-value">{{ selectedName || '请选择酒店' }}</text>
        <text class="picker-arrow">▼</text>
      </view>
    </picker>
  </view>
</template>

<script>
export default {
  name: 'HotelSelector',
  props: {
    hotelNames: {
      type: Array,
      default: () => []
    },
    selectedIndex: {
      type: Number,
      default: 0
    },
    selectedName: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-select-section {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.hotel-picker {
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .hotel-icon {
    font-size: 32rpx;
  }
  
  .hotel-value {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
  
  .picker-arrow {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
