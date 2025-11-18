
<template>
  <view class="price-content">
    <!-- 酒店选择 -->
    <view class="home-hotel-select">
      <!-- 酒店选择区域 -->
      <view class="hotel-selection-area">
        <picker mode="selector" :range="hotelNames" :value="selectedHotelIndex" @change="onHotelChange">
          <view class="hotel-picker">
            <text class="hotel-value">{{ selectedHotelName || '请选择酒店' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
    </view>
    <!-- 策略标题 -->
    <view class="home-section-title">价格推荐策略</view>
    <!-- 日期选择与确认 -->
    <view class="home-date-row">
      <view class="date-picker-container">
        <picker mode="multiSelector" :range="dateRange" :value="[yearIndex, monthIndex]" @change="onDateChange">
          <view class="home-date-picker">{{ selectedYear }}年{{ selectedMonth }}月</view>
        </picker>
      </view>
      <button class="home-confirm-btn">确认执行</button>
    </view>

    <!-- 日历区块 -->
    <view class="home-calendar">
          <view class="home-calendar-header">
            <view v-for="(w, i) in weekDays" :key="i" class="home-calendar-week">{{ w }}</view>
          </view>
          <view class="home-calendar-body">
            <view v-for="(row, rowIdx) in calendarRows" :key="rowIdx" class="home-calendar-row">
              <view v-for="(cell, colIdx) in row" :key="colIdx" 
                    class="home-calendar-cell" 
                    :class="[cell.type, cell.current ? 'current-day' : '']"
                    @click="onCellClick(cell)">
                <view v-if="cell.day" class="cell-content">
                  <text v-if="cell.price" class="cell-price" :style="{color: getCellPriceColor(cell)}">¥{{ cell.price }}</text>
                  <text class="cell-day" :class="{'prev-month': cell.type === 'prev'}">{{ cell.day }}</text>
                  <view v-if="cell.occ && cell.otb" class="cell-legend">
                    <text class="cell-occ">{{ cell.occ }}%</text>
                    <text class="cell-split">|</text>
                    <text class="cell-otb">{{ cell.otb }}%</text>
                  </view>
                  <view v-else-if="cell.type === 'prev'" class="cell-legend-undefined">
                    <text class="undefined-text">undefined</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
    </view>

        <!-- 底部图例 -->
    <view class="home-legend">
          <view class="legend-item">
            <view class="legend-color past"></view>
            <text class="legend-text">已过日期OCC值</text>
          </view>
          <view class="legend-item">
            <view class="legend-color future"></view>
            <text class="legend-text">未过日期MOP值</text>
          </view>
          <view class="legend-item">
            <view class="legend-color otb"></view>
            <text class="legend-text">未过日期OTB值</text>
          </view>
    </view>
  </view>

</template>

<script>
import { userApi } from '../../utils/api'
export default {
  data() {
    return {
      // 酒店相关数据
      hotelList: [], // 完整的酒店数据
      hotelNames: [], // 酒店名称数组，用于picker组件
      selectedHotelIndex: 0, // 选中的酒店索引
      selectedHotelId: '', // 选中的酒店ID
      selectedHotelName: '', // 选中的酒店名称
      userInfo: null, // 用户信息
      
      // 价格策略相关数据
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      selectedYear: 2025,
      selectedMonth: 3,
      yearIndex: 25, // 2025年在年份数组中的索引（2000-2050年，2025是第25个）
      monthIndex: 2, // 3月在月份数组中的索引（从0开始，所以3月是索引2）
      dateRange: [
        // 年份范围：2000-2050
        Array.from({length: 51}, (_, i) => (2000 + i).toString()),
        // 月份范围：1-12
        ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      ],
      calendarRows: []
    }
  },
  mounted() {    
    try {
      // 初始化当前日期
      this.initCurrentDate();
      // 组件挂载时生成日历数据
      this.calendarRows = this.genCalendarRows();
      this.loadHotelInfo()
    } catch (error) {
      console.error('页面初始化错误:', error);
      // 确保页面不会因为错误而完全崩溃
      this.calendarRows = this.genCalendarRows();
    }
  },
  methods: {
    // 初始化当前日期
    initCurrentDate() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth() 返回0-11，需要+1
      
      // 设置当前年月
      this.selectedYear = currentYear;
      this.selectedMonth = currentMonth;
      
      // 计算在数组中的索引
      this.yearIndex = currentYear - 2000; // 2000年开始
      this.monthIndex = currentMonth - 1;   // 月份数组从0开始
      
      console.log('初始化当前日期:', {
        year: currentYear,
        month: currentMonth,
        yearIndex: this.yearIndex,
        monthIndex: this.monthIndex
      });
    },
    
    // 加载酒店信息
    async loadHotelInfo() {
      const userInfo = this.$utils.user.getUserInfo();
      this.userInfo = userInfo;
      // 尝试多种可能的ID字段
      const userId = userInfo?.id || userInfo?.userId || userInfo?.user_id;
      if (!userId) {
        console.error('本地存储Token:', this.$utils.user.getToken());
        uni.showToast({
          title: '用户信息不完整，请重新登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      try {
        uni.showLoading({
          title: '加载中...'
        });
        const res = await userApi.getHotelInfo(userId);
        if (res && res.data && res.data.hotel_list) {
          // 根据实际返回的数据结构处理酒店列表
          this.hotelList = res.data.hotel_list || [];
          // 生成酒店名称数组供picker使用，使用hotel_name字段
          this.hotelNames = this.hotelList.map(hotel => hotel.hotel_name);
          
          // 默认选择第一个酒店
          if (this.hotelList.length > 0) {
            this.selectedHotelIndex = 0;
            this.selectedHotelId = this.hotelList[0].hotel_id;
            this.selectedHotelName = this.hotelList[0].hotel_name;
          }
        } else {
          console.error('加载酒店信息失败 - 数据结构不正确:', res);
          console.error('期望的数据结构: res.data.hotel_list，实际收到:', res);
          uni.showToast({
            title: res?.message || '加载酒店信息失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载酒店信息异常:', error);
        uni.showToast({
          title: '加载酒店信息失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 处理酒店选择变化（picker组件事件）
    onHotelChange(e) {
      console.log('酒店选择事件触发:', e);
      const index = e.detail.value;
      console.log('选择的酒店索引:', index);
      
      this.selectedHotelIndex = index;
      
      if (this.hotelList[index]) {
        const selectedHotel = this.hotelList[index];
        this.selectedHotelId = selectedHotel.hotel_id;
        this.selectedHotelName = selectedHotel.hotel_name;
        
        // 保存选择的酒店到本地存储
        uni.setStorageSync('selectedHotel', selectedHotel);
        
        console.log('酒店选择变化:', selectedHotel);
        
        uni.showToast({
          title: `已选择：${selectedHotel.hotel_name}`,
          icon: 'success'
        });
      } else {
        console.error('未找到对应索引的酒店:', index, this.hotelList);
      }
    },
    
    // 日期选择器变化事件
    onDateChange(e) {
      const [yearIdx, monthIdx] = e.detail.value;
      this.yearIndex = yearIdx;
      this.monthIndex = monthIdx;
      this.selectedYear = 2000 + yearIdx;
      this.selectedMonth = monthIdx + 1;
      this.calendarRows = this.genCalendarRows();
    },
    
    // 价格策略相关方法
    getCellPriceColor(cell) {
      if (cell.current) return '#2196f3';
      if (cell.type === 'past') return '#ff9800';
      return '#4caf50';
    },
    
    // 日历单元格点击事件
    onCellClick(cell) {
      // 只有有效的日期才能点击
      if (cell.day && cell.type !== 'prev' && cell.type !== 'next') {
        // 构建完整的日期信息
        const cellData = {
          year: this.selectedYear,
          month: this.selectedMonth,
          day: cell.day,
          price: cell.price,
          occ: cell.occ,
          otb: cell.otb,
          type: cell.type,
          current: cell.current
        };
        
        // 跳转到策略执行页面
        uni.navigateTo({
          url: `/pages/strategy/strategy?date=${encodeURIComponent(JSON.stringify(cellData))}`
        });
      }
    },
  genCalendarRows() {
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    if (year === 2025 && month === 3) {
    // 2025年3月份的原始数据 - 35个单元格，7列5行
    return [
      // 第一行
      [ 
      {day:23, type:'prev'}, 
      {day:24, type:'prev'}, 
      {day:25, type:'prev'}, 
      {day:26, type:'prev'}, 
      {day:27, type:'prev'}, 
      {day:28, type:'prev'}, 
      {day:1, price:1297, occ:93, otb:77, type:'future'} 
      ],
      // 第二行
      [ 
      {day:2, price:1183, occ:89, otb:60, type:'future'}, 
      {day:3, price:855, occ:68, otb:72, type:'future'}, 
      {day:4, price:909, occ:77, otb:65, type:'future'}, 
      {day:5, price:1138, occ:68, otb:72, type:'current', current:true}, 
      {day:6, price:1022, occ:62, otb:75, type:'future'}, 
      {day:7, price:1021, occ:58, otb:72, type:'future'}, 
      {day:8, price:874, occ:77, otb:69, type:'future'} 
      ],
      // 第三行
      [ 
      {day:9, price:859, occ:87, otb:83, type:'future'}, 
      {day:10, price:902, occ:84, otb:73, type:'future'}, 
      {day:11, price:1088, occ:68, otb:60, type:'future'}, 
      {day:12, price:906, occ:81, otb:68, type:'future'}, 
      {day:13, price:1015, occ:76, otb:73, type:'future'}, 
      {day:14, price:892, occ:81, otb:68, type:'future'}, 
      {day:15, price:1156, occ:76, otb:73, type:'future'} 
      ],
      // 第四行
      [ 
      {day:16, price:978, occ:82, otb:75, type:'future'}, 
      {day:17, price:1089, occ:74, otb:69, type:'future'}, 
      {day:18, price:945, occ:88, otb:82, type:'future'}, 
      {day:19, price:1123, occ:71, otb:66, type:'future'}, 
      {day:20, price:867, occ:79, otb:71, type:'future'}, 
      {day:21, price:1034, occ:67, otb:58, type:'future'}, 
      {day:22, price:912, occ:85, otb:78, type:'future'} 
      ],
      // 第五行
      [ 
      {day:23, price:1087, occ:63, otb:52, type:'future'}, 
      {day:24, price:956, occ:76, otb:65, type:'future'}, 
      {day:25, price:1145, occ:69, otb:61, type:'future'}, 
      {day:26, price:889, occ:82, otb:74, type:'future'}, 
      {day:27, price:1078, occ:71, otb:67, type:'future'}, 
      {day:28, price:923, occ:87, otb:81, type:'future'}, 
      {day:29, price:1054, occ:64, otb:56, type:'future'} 
      ]
    ]
    } else {
    // 其他年月生成模拟数据，保持5行布局
    return this.generateMonthData(year, month);
    }
  },
  generateMonthData(year, month) {
    // 生成指定年月的模拟数据，保持5行布局
    const days = new Date(year, month, 0).getDate(); // 获取月份天数
    const firstDay = new Date(year, month - 1, 1).getDay(); // 获取第一天是周几
    
    // 获取当前日期信息
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const isCurrentMonth = (year === currentYear && month === currentMonth);
    
    const rows = [];
    let currentRow = [];
    
    // 获取上月天数
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate();
    
    // 填充上月末尾
    for (let i = 0; i < firstDay; i++) {
    currentRow.push({day: prevMonthDays - firstDay + i + 1, type: 'prev'});
    }
    
    // 填充当月
    for (let day = 1; day <= days; day++) {
    const price = Math.floor(Math.random() * 500 + 800);
    const occ = Math.floor(Math.random() * 40 + 60);
    const otb = Math.floor(Math.random() * 40 + 60);
    
    // 判断日期类型
    let type = 'future';
    let current = false;
    
    if (isCurrentMonth) {
      if (day === currentDay) {
      type = 'current';
      current = true;
      } else if (day < currentDay) {
      type = 'past';
      } else {
      type = 'future';
      }
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      type = 'past';
    } else {
      type = 'future';
    }
    
    currentRow.push({
      day,
      price,
      occ,
      otb,
      type,
      current
    });
    
    if (currentRow.length === 7) {
      rows.push(currentRow);
      currentRow = [];
    }
    }
    
    // 填充下月开头到满5行（35个单元格）
    let nextDay = 1;
    while (rows.length < 5) {
    while (currentRow.length < 7) {
      currentRow.push({day: nextDay++, type: 'next'});
    }
    rows.push(currentRow);
    currentRow = [];
    }
    
    return rows;
  }
  }
}
</script>

<style scoped>
.price-content {
  padding: 32rpx;
}

/* 主要内容区 */
.app-content {
  flex: 1;
  overflow-y: auto; /* 只有内容区域可滚动 */
  overflow-x: hidden;
  padding-top: 215rpx; /* 状态栏60rpx + 导航栏88rpx */
  padding-bottom: 140rpx; /* 底部导航栏120rpx + 间距20rpx */
  padding-left: 32rpx;
  padding-right: 32rpx;
  height: calc(100vh - 288rpx);
}

.section-content {
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 价格策略样式 */
.home-hotel-select {
  margin-bottom: 32rpx;
}

.hotel-selection-area {
  width: 100%;
  margin-bottom: 20rpx;
}

.hotel-picker {
  height: 80rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 2rpx solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
  position: relative;
}

.hotel-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  margin-right: 16rpx;
}

.hotel-value {
  flex: 1;
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
}

.picker-arrow {
  font-size: 20rpx;
  color: #bdbdbd;
  margin-left: 16rpx;
}

.home-section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
  margin: 0 0 20rpx 0;
}

.home-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin: 0 0 24rpx 0;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  background: #fff;
  border: 2rpx solid #e5e5e5;
  border-radius: 16rpx;
  padding: 0 20rpx;
  height: 80rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
}

.year-input {
  flex: 1;
  border: none;
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
  background: transparent;
  outline: none;
}

.year-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.month-picker {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 8rpx 16rpx;
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
  position: relative;
}


.date-picker-container {
  flex: 1;
}

.home-date-picker {
  background: #fff;
  border: 2rpx solid #e5e5e5;
  border-radius: 16rpx;
  padding: 0 32rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #222;
  font-weight: 500;
  box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
  position: relative;
}
.home-date-picker::after {
  content: '';
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 10rpx solid #bdbdbd;
}
.home-confirm-btn {
  background: #ff7d00;
  color: #fff;
  border-radius: 16rpx;
  height: 80rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  padding: 0 32rpx;
  margin-right: 0;
  box-shadow: 0 4rpx 16rpx 0 rgba(255,125,0,0.10);
}

.home-calendar {
  margin: 0;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx 0 rgba(0,0,0,0.08);
  padding: 20rpx;
}
.home-calendar-header {
  display: flex;
  justify-content: space-between;
  padding: 0 8rpx;
  margin-bottom: 12rpx;
}
.home-calendar-week {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}
.home-calendar-body {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.home-calendar-row {
  display: flex;
  gap: 4rpx;
}
.home-calendar-cell {
  flex: 1;
  min-height: 100rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.home-calendar-cell.future {
  background: #e8f5e9;
  border: 1rpx solid #4caf50;
}
.home-calendar-cell.past {
  background: #fff3e0;
  border: 1rpx solid #ff9800;
}
.home-calendar-cell.current-day {
  background: #1976d2 !important;
  border: 1rpx solid #1976d2 !important;
}
.home-calendar-cell.current-day .cell-content {
  color: #fff;
}
.home-calendar-cell.prev {
  background: #f5f5f5;
}
.home-calendar-cell.next {
  background: #f5f5f5;
}
.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 6rpx 2rpx;
}
.cell-price {
  font-size: 18rpx;
  font-weight: bold;
  color: #ff6b6b;
  line-height: 1;
  margin-bottom: 2rpx;
}
.cell-day {
  font-size: 28rpx;
  color: #222;
  margin: 2rpx 0;
  font-weight: 600;
  line-height: 1;
}
.current-day .cell-day {
  color: #fff;
}
.prev-month {
  color: #bdbdbd !important;
}
.cell-legend-undefined {
  display: flex;
  align-items: center;
  font-size: 14rpx;
  line-height: 1;
}
.undefined-text {
  color: #bdbdbd;
  font-size: 12rpx;
}
.cell-legend {
  display: flex;
  align-items: center;
  font-size: 14rpx;
  line-height: 1;
  margin-top: 1rpx;
}
.cell-occ {
  color: #ff7d00;
}
.cell-split {
  color: #bdbdbd;
  margin: 0 1rpx;
}
.cell-otb {
  color: #2196f3;
}
.current-day .cell-occ,
.current-day .cell-split,
.current-day .cell-otb {
  color: rgba(255,255,255,0.8);
}

.home-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32rpx;
  margin: 24rpx 0 0 0;
  padding: 16rpx;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
}
.legend-color.past {
  background: #9e9e9e;
}
.legend-color.future {
  background: #ff7d00;
}
.legend-color.otb {
  background: #2196f3;
}
.legend-text {
  font-size: 22rpx;
  color: #666;
}

/* 团队询价样式 */
.team-tabs {
  display: flex;
  gap: 24rpx;
  margin-bottom: 32rpx;
}
.tab-item {
  background: #f5f5f5;
  border-radius: 50rpx;
  padding: 16rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.tab-item.active {
  background: #ff7d00;
  box-shadow: 0 4rpx 16rpx rgba(255,125,0,0.3);
}
.tab-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}
.tab-item.active .tab-text {
  color: #fff;
  font-weight: 600;
}

.inquiry-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.inquiry-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
  border: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.inquiry-item.recent {
  border-left: 6rpx solid #ff7d00;
}
.inquiry-content {
  flex: 1;
  margin-right: 24rpx;
}
.inquiry-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}
.inquiry-time {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.time-text {
  font-size: 24rpx;
  color: #999;
}
.inquiry-item.recent .time-text {
  color: #ff7d00;
  font-weight: 500;
}

/* 报告样式 */
.report-tabs {
  display: flex;
  gap: 40rpx;
  margin-bottom: 32rpx;
  position: relative;
}
.report-tabs .tab-item {
  background: transparent;
  border-radius: 0;
  padding: 16rpx 0;
  position: relative;
}
.report-tabs .tab-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
}
.report-tabs .tab-text.active {
  color: #ff7d00;
  font-weight: 600;
}
.tab-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #ff7d00;
  border-radius: 2rpx;
}

.date-selector-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 32rpx;
}
.date-selector {
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}
.date-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.report-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
}
.report-placeholder {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.period-tabs {
  display: flex;
  gap: 20rpx;
  margin: 24rpx 0;
  justify-content: center;
}
.period-tab {
  background: #f5f5f5;
  border-radius: 24rpx;
  padding: 12rpx 32rpx;
}
.period-tab.active {
  background: #ff7d00;
}
.period-text {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}
.period-tab.active .period-text {
  color: #fff;
  font-weight: 600;
}

/* 悬浮按钮 */
.floating-btn {
  position: fixed;
  right: 32rpx;
  bottom: 160rpx;
  width: 100rpx;
  height: 100rpx;
  background: #ff7d00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(255,125,0,0.4);
  z-index: 50;
}
.float-icon {
  font-size: 40rpx;
  color: #fff;
}
</style>
