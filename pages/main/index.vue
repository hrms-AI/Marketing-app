<template>
  <view class="app-container">
    <!-- 状态栏 -->
    <status-bar />
    
    <!-- 公共顶部导航栏 -->
    <top-navbar 
      :title="getPageTitle()" 
      :show-back="currentSection !== 'strategy'"
      :show-logo="currentSection === 'strategy'"
      @back="handleBack"
    />

    <!-- 动态内容区域 -->
    <view class="app-content">
      <!-- 策略内容 -->
      <view v-if="currentSection === 'strategy'" class="section-content">
        <price-index />
      </view>

      <!-- 素材内容 -->
      <view v-if="currentSection === 'material'" class="section-content">
        <team-index /> <!-- 如有 material-index 组件请替换此处 -->
      </view>

      <!-- 报告内容 -->
      <view v-if="currentSection === 'report'" class="section-content">
        <report-index />
      </view>
    </view>

    <!-- 公共底部导航栏 -->
    <bottom-tabbar 
      :current-tab="currentSection"
      @tab-change="switchSection"
    />

    <!-- 悬浮按钮 -->
    <view class="floating-btn">
      <view class="float-icon">👤</view>
    </view>
  </view>
</template>

<script>
import PriceIndex from '../index/index.vue'
import TeamIndex from '../team/index.vue'
import ReportIndex from '../report/index.vue'


export default {
  components: {
    PriceIndex,
    TeamIndex,
    ReportIndex
  },
  data() {
    return {
      currentSection: 'strategy', // 当前显示的页面：strategy, material, report
      // 酒店相关数据
      hotelList: [],
      selectedHotelId: null,
      userInfo: null,
      // 这些数据将通过props传递给子组件或由子组件自己管理
      monthOptions: ['2025年1月', '2025年2月', '2025年3月', '2025年4月', '2025年5月', '2025年6月', '2025年7月', '2025年8月', '2025年9月', '2025年10月', '2025年11月', '2025年12月'],
      monthIndex: 2,
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      calendarRows: [],
      // 报告相关数据
      activeTab: 'marketing',
      activePeriod: 'week',
      yearMonthOptions: ['2025/01', '2025/02', '2025/03', '2025/04', '2025/05', '2025/06', '2025/07', '2025/08', '2025/09', '2025/10', '2025/11', '2025/12'],
      yearMonthIndex: 2,
      dayOptions: ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一'],
      dayIndex: 0
    };
  },
  mounted() {
    // 只做业务初始化，不做token主动校验，token校验统一交由request.js处理
    this.userInfo = this.$utils.user.getUserInfo();
    this.loadHotelInfo();
  },
  methods: {
    switchSection(sectionKey) {
      console.log('Switching to section:', sectionKey);
      this.currentSection = sectionKey;
    },
    getPageTitle() {
      const titles = {
        'strategy': '价格策略',
        'material': '素材',
        'report': '报告'
      };
      return titles[this.currentSection] || '价格策略';
    },
    handleBack() {
      if (this.currentSection !== 'strategy') {
        this.currentSection = 'strategy';
      } else {
        uni.navigateBack();
      }
    },
    
    // 添加支持子组件的方法
    onMonthChange(e) {
      this.monthIndex = e.detail.value;
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    switchPeriod(period) {
      this.activePeriod = period;
    },
    onYearMonthChange(e) {
      this.yearMonthIndex = e.detail.value;
    },
    onDayChange(e) {
      this.dayIndex = e.detail.value;
    },
    // 酒店信息加载方法，只做业务处理，token校验交由request.js统一处理
    loadHotelInfo() {
      const userInfo = this.$utils.user.getUserInfo();
      // 尝试多种可能的ID字段
      const userId = userInfo?.id || userInfo?.userId || userInfo?.user_id;
      
      if (!userId) {
        console.error('Main页面用户ID不存在，完整用户信息:', userInfo);
        console.error('本地存储Token:', this.$utils.user.getToken());
        uni.showToast({
          title: '用户信息不完整，请重新登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      uni.showLoading({ title: '加载酒店信息...' });
      // 请求酒店信息接口
      this.$api.userApi.getHotelInfo(userId)
        .then(res => {
          if (res.success && res.data) {
            this.hotelList = res.data.hotels || [];
            this.selectedHotelId = res.data.defaultHotelId || (this.hotelList[0] && this.hotelList[0].id) || null;
            uni.showToast({ title: '酒店信息加载成功', icon: 'success', duration: 1200 });
          } else {
            uni.showToast({ title: res.message || '酒店信息加载失败', icon: 'none', duration: 2000 });
          }
        })
        .catch(err => {
          console.error('酒店信息接口异常:', err);
          uni.showToast({ title: '酒店信息请求异常', icon: 'none', duration: 2000 });
        })
        .finally(() => {
          uni.hideLoading();
        });
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #fff6f0 0%, #fff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 内容区 */
.app-content {
  flex: 1;
  padding-top: 168rpx; /* 状态栏60rpx + 导航栏88rpx + 间距20rpx */
  padding-bottom: 140rpx; /* 底部导航栏120rpx + 间距20rpx */
}

.section-content {
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
}

.floating-btn {
  position: fixed;
  right: 32rpx;
  bottom: 170rpx;
  width: 60rpx;
  height: 60rpx;
  background: #ff7d00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(255,125,0,0.4);
  z-index: 50;
}
.float-icon {
  font-size: 20rpx;
  color: #fff;
}
</style>
