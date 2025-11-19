<template>
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
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MarketingCalendar',
  props: {
    hotelId: {
      type: String,
      default: ''
    },
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  },
  
  data() {
    return {
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      calendarRows: []
    }
  },
  
  watch: {
    year: {
      handler() {
        this.updateCalendar();
      },
      immediate: false
    },
    month: {
      handler() {
        this.updateCalendar();
      },
      immediate: false
    },
    hotelId: {
      handler() {
        this.updateCalendar();
      },
      immediate: false
    }
  },
  
  mounted() {
    console.log('营销日历组件已挂载', `年月: ${this.year}-${this.month}`);
    this.updateCalendar();
  },
  
  methods: {
    updateCalendar() {
      console.log(`更新日历: ${this.year}-${this.month}, 酒店: ${this.hotelId}`);
      this.calendarRows = this.genCalendarRows();
      console.log('日历数据已更新，酒店数据已重新生成');
    },
    
    getCellPriceColor(cell) {
      if (cell.current) return '#2196f3';
      if (cell.type === 'past') return '#ff9800';
      return '#4caf50';
    },

    onCellClick(cell) {
      console.log('=== 日历单元格被点击 ===');
      console.log('点击的单元格数据:', JSON.stringify(cell, null, 2));
      
      // 先尝试显示一个简单的提示
      uni.showToast({
        title: `点击了${cell.day || '空'}日`,
        icon: 'none'
      });
      
      if (cell.day) {
        const dateInfo = {
          year: this.year,
          month: this.month,
          day: cell.day,
          price: cell.price,
          occ: cell.occ,
          otb: cell.otb,
          type: cell.type,
          current: cell.current
        };
        console.log('准备触发date-click事件:', JSON.stringify(dateInfo, null, 2));
        this.$emit('date-click', dateInfo);
        console.log('date-click事件已发出');
      } else {
        console.log('单元格没有day属性，不触发事件');
      }
    },
    
    genCalendarRows() {
      console.log(`正在生成日历数据: ${this.year}年${this.month}月`);
      
      // 统一使用动态生成方法，不再硬编码特定月份
      const calendarData = this.generateMonthData(this.year, this.month);
      console.log('生成了日历数据，行数:', calendarData.length);
      return calendarData;
    },
    
    generateMonthData(year, month) {
      // 生成指定年月的模拟数据，保持6行布局
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
        const prevDay = prevMonthDays - firstDay + i + 1;
        const seed = this.getRandomSeed(this.hotelId, prevYear, prevMonth, prevDay);
        const price = this.generatePrice(seed);
        const occ = this.generateOccupancy(seed);
        const otb = this.generateOTB(seed, occ);
        
        currentRow.push({
          day: prevDay, 
          price: price,
          occ: occ,
          otb: otb,
          type: 'prev'
        });
      }

      // 填充当月
      for (let day = 1; day <= days; day++) {
        // 使用酒店ID、年月日生成固定的随机种子，确保同一酒店同一日期数据一致
        const seed = this.getRandomSeed(this.hotelId, year, month, day);
        const price = this.generatePrice(seed);
        const occ = this.generateOccupancy(seed);
        const otb = this.generateOTB(seed, occ);

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

      // 填充下月开头到满6行（42个单元格）
      let nextDay = 1;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      
      while (rows.length < 6) {
        while (currentRow.length < 7) {
          const seed = this.getRandomSeed(this.hotelId, nextYear, nextMonth, nextDay);
          const price = this.generatePrice(seed);
          const occ = this.generateOccupancy(seed);
          const otb = this.generateOTB(seed, occ);
          
          currentRow.push({
            day: nextDay++, 
            price: price,
            occ: occ,
            otb: otb,
            type: 'next'
          });
        }
        rows.push(currentRow);
        currentRow = [];
      }

      return rows;
    },

    // 生成基于多个参数的随机种子
    getRandomSeed(hotelId, year, month, day) {
      // 将酒店ID转换为数字
      let hotelSeed = 0;
      if (hotelId) {
        for (let i = 0; i < hotelId.length; i++) {
          hotelSeed += hotelId.charCodeAt(i);
        }
      }
      return hotelSeed + year * 10000 + month * 100 + day;
    },

    // 基于种子生成价格 (800-1300)
    generatePrice(seed) {
      const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280;
      return Math.floor(pseudoRandom * 500 + 800);
    },

    // 基于种子生成入住率 (55-95)
    generateOccupancy(seed) {
      const pseudoRandom = ((seed + 1000) * 9301 + 49297) % 233280 / 233280;
      return Math.floor(pseudoRandom * 40 + 55);
    },

    // 基于种子和入住率生成OTB (通常比入住率低5-15%)
    generateOTB(seed, occ) {
      const pseudoRandom = ((seed + 2000) * 9301 + 49297) % 233280 / 233280;
      const reduction = Math.floor(pseudoRandom * 15 + 5); // 5-20%的减少
      return Math.max(30, occ - reduction);
    }
  }
}
</script>

<style scoped>
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
</style>
