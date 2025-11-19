<template>
  <view class="app-container">
    <status-bar />
    <top-navbar title="营销日历" :show-back="false" :show-logo="true" />

    <view class="app-content">
      <view class="hotel-select-section">
        <view class="hotel-selection-area">
          <picker mode="selector" :range="hotelNames" :value="selectedHotelIndex" @change="onHotelChange">
            <view class="hotel-picker">
              <text class="hotel-icon">🏨</text>
              <text class="hotel-value">{{ selectedHotelName || '请选择酒店' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>
      
      <marketing-calendar :hotelId="selectedHotelId" />
    </view>

    <bottom-tabbar :current-tab="'strategy'" @tab-change="handleTabChange" />
  </view>
</template>

<script>
import { userApi } from '../../utils/api'

export default {
  data() {
    return {
      hotelList: [],
      hotelNames: [],
      selectedHotelIndex: 0,
      selectedHotelId: '',
      selectedHotelName: ''
    }
  },
  mounted() {
    try {
      const token = this.$utils?.user?.getToken ? this.$utils.user.getToken() : uni.getStorageSync('token');
      if (!token) {
        uni.reLaunch({ url: '/pages/login/index' });
        return;
      }
      this.loadHotelInfo();
    } catch (error) {
      console.error('页面初始化错误:', error);
    }
  },
  methods: {
    async loadHotelInfo() {
      const userInfo = this.$utils.user.getUserInfo();
      const userId = userInfo?.id || userInfo?.userId || userInfo?.user_id;
      
      if (!userId) {
        uni.showToast({
          title: '用户信息不完整',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      try {
        uni.showLoading({ title: '加载中...' });
        const res = await userApi.getHotelInfo(userId);
        
        if (res && res.data && res.data.hotel_list) {
          this.hotelList = res.data.hotel_list || [];
          this.hotelNames = this.hotelList.map(hotel => hotel.hotel_name);
          
          if (this.hotelList.length > 0) {
            this.selectedHotelIndex = 0;
            this.selectedHotelId = this.hotelList[0].hotel_id;
            this.selectedHotelName = this.hotelList[0].hotel_name;
          }
        }
        
        uni.hideLoading();
      } catch (error) {
        console.error('加载酒店信息失败:', error);
        uni.hideLoading();
        uni.showToast({
          title: '加载酒店信息失败',
          icon: 'none',
          duration: 2000
        });
      }
    },
    
    onHotelChange(e) {
      this.selectedHotelIndex = e.detail.value;
      const hotel = this.hotelList[this.selectedHotelIndex];
      if (hotel) {
        this.selectedHotelId = hotel.hotel_id;
        this.selectedHotelName = hotel.hotel_name;
        console.log('选中酒店:', this.selectedHotelName, this.selectedHotelId);
      }
    },
    
    handleTabChange(tabKey) {
      console.log('切换到:', tabKey);
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 215rpx 32rpx 140rpx;
}

.hotel-select-section {
  margin-bottom: 32rpx;
  
  .hotel-selection-area {
    width: 100%;
  }
  
  .hotel-picker {
    height: 88rpx;
    background: #fff;
    border-radius: 16rpx;
    border: 2rpx solid #e5e5e5;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.04);
    
    .hotel-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }
    
    .hotel-value {
      flex: 1;
      font-size: 30rpx;
      color: #222;
      font-weight: 500;
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
