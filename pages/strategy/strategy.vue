<template>
  <view class="strategy-page">
    <!-- 策略内容区 -->
    <view class="strategy-content">

      <!-- 图表区域 -->
      <view class="chart-container">
        <!-- 图表切换按钮 -->
          <view class="control-buttons">
            <view 
              class="control-btn" 
              :class="{active: chartType === 'line'}"
              @click="switchChartType('line')"
            >
              <text class="iconfont">📈</text>
            </view>
            <view 
              class="control-btn" 
              :class="{active: chartType === 'column'}"
              @click="switchChartType('column')"
            >
              <text class="iconfont">📊</text>
            </view>
          </view>

        
        <view class="chart-area">
          <!-- 使用qiun-data-charts图表组件 -->
          <qiun-data-charts 
            :type="chartType"
            :opts="chartOpts"
            :canvas2d="true"
            :chartData="chartData"
            @getIndex="handleChartClick"
            />
        </view>
      </view>
    </view>

    <!-- 底部标签页 -->
    <view class="bottom-tabs">
      <view class="bottom-tab active">
        <text class="tab-text">90天策略</text>
      </view>
      <view class="bottom-tab">
        <text class="tab-text">归因分析</text>
      </view>
      <view class="bottom-tab" @click="showPriceChangeModal">
        <text class="tab-text">价格更改</text>
      </view>
    </view>

    <!-- 价格更改弹框 -->
    <view class="modal-overlay" v-if="showPriceModal" @click="closePriceModal">
      <view class="modal-content" @click.stop>
        <!-- 弹框标题 -->
        <view class="modal-header">
          <text class="modal-title">价格更改</text>
          <view class="close-btn" @click="closePriceModal">
            <text class="close-icon">✕</text>
          </view>
        </view>

        <!-- 系统推荐价格 -->
        <view class="recommend-price">
          <text class="recommend-text">系统推荐价格: </text>
          <text class="price-value">¥888</text>
        </view>

        <!-- 自定义价格输入 -->
        <view class="input-section">
          <text class="input-label">自定义价格</text>
          <input 
            class="price-input" 
            type="number" 
            placeholder="XXXXX" 
            v-model="customPrice"
          />
        </view>

        <!-- 价格选择下拉 -->
        <view class="select-section">
          <text class="select-label">价格</text>
          <picker 
            :value="priceSelectIndex" 
            :range="priceOptions" 
            @change="onPriceChange"
            class="price-picker"
          >
            <view class="picker-display">
              <text class="picker-text">{{priceOptions[priceSelectIndex] || '请选择'}}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 保存按钮 -->
        <view class="save-btn" @click="savePriceChange">
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      selectedCell: null,
      chartType: 'line', // 当前图表类型
      showPriceModal: false, // 价格更改弹框显示状态
      customPrice: '', // 自定义价格
      priceSelectIndex: 0, // 价格选择索引
      priceOptions: ['¥688', '¥788', '¥888', '¥988', '¥1088'], // 价格选项
      // 图表配置
      chartOpts: {
        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,10,0,15],
        enableScroll: false,
        legend: {
          show: true,
          position: "bottom",
          float: "left", // 改为左对齐
          padding: 8,
          margin: 10,
          fontSize: 12,
          fontColor: "#666666",
          itemGap: 20, // 增加间距
          lineHeight: 18,
          wrap: true, // 允许换行
          maxWidth: 120 // 设置每个图例项的最大宽度
        },
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "hollow"
          },
          column: {
            type: "group",
            width: 30,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08
          }
        }
      },
      // 图表数据
      chartData: {
        categories: ["12.10", "12.15", "12.20", "12.25", "01.01", "01.05", "01.10"],
        series: [
          {
            name: "推荐BAR价格",
            data: [450, 520, 480, 620, 580, 650, 700]
          },
          {
            name: "竞争酒店1", 
            data: [0, 320, 300, 380, 360, 400, 420]
          },
          {
            name: "竞争酒店2",
            data: [680, 750, 720, 820, 780, 850, 900]
          },
          {
            name: "竞争酒店4",
            data: [520, 580, 550, 680, 640, 720, 760]
          }
        ]
      }
    }
  },
  onLoad(options) {
    // 接收传递的日期参数
    if (options.date) {
      this.selectedCell = JSON.parse(decodeURIComponent(options.date));
    }
    
    // 延迟一点时间确保组件完全加载
    setTimeout(() => {
      this.$forceUpdate();
    }, 500);
  },
  mounted() {
    console.log('策略页面已挂载');
  },
  methods: {
    executeStrategy() {
      uni.showToast({
        title: '策略执行成功',
        icon: 'success'
      });
    },
    switchChartType(type) {
      this.chartType = type;
      // 添加触觉反馈
      uni.vibrateShort();
      
      // 强制更新图表
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 显示价格更改弹框
    showPriceChangeModal() {
      this.showPriceModal = true;
      uni.vibrateShort();
    },
    // 关闭价格更改弹框
    closePriceModal() {
      this.showPriceModal = false;
    },
    // 价格选择器变化
    onPriceChange(e) {
      this.priceSelectIndex = e.detail.value;
    },
    // 保存价格更改
    savePriceChange() {
      if (!this.customPrice && this.priceSelectIndex === 0) {
        uni.showToast({
          title: '请输入价格或选择价格',
          icon: 'none'
        });
        return;
      }
      
      const finalPrice = this.customPrice || this.priceOptions[this.priceSelectIndex];
      
      uni.showToast({
        title: `价格已更改为 ${finalPrice}`,
        icon: 'success'
      });
      
      // 关闭弹框
      this.closePriceModal();
      
      // 清空输入
      this.customPrice = '';
      this.priceSelectIndex = 0;
    },
    handleChartClick(index) {
      console.log('图表点击事件:', index);
      if (index && index.currentIndex !== undefined) {
        // 添加触觉反馈
        uni.vibrateShort();
        
        uni.showToast({
          title: `点击了数据点`,
          icon: 'none',
          duration: 1500
        });
      }
    }
  }
}
</script>

<style scoped>
.strategy-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 策略内容区 */
.strategy-content {
  flex: 1;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  margin-top: 20rpx;
  padding: 20rpx 32rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 策略类型选择 */
.strategy-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.tab-item {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  text-align: center;
  background: #f5f5f5;
}

.tab-item.active {
  background: #ff7d00;
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

/* 图表容器 */
.chart-container {
  background: #fff;
  border-radius: 20rpx;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 图表区域 */
.chart-area {
  width: 100%;
  height: 800rpx;
}

/* 底部标签页 */
.bottom-tabs {
  display: flex;
  background: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.bottom-tab {
  flex: 1;
  padding: 32rpx 16rpx;
  text-align: center;
}

.bottom-tab.active {
  border-top: 4rpx solid #ff7d00;
}

.bottom-tab .tab-text {
  font-size: 26rpx;
  color: #666;
}

.bottom-tab.active .tab-text {
  color: #ff7d00;
  font-weight: 600;
}
.control-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20rpx;
  gap: 10rpx;
}

.control-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.control-btn.active {
  background: #ff7d00;
  border-color: #ff7d00;
}

.control-btn .iconfont {
  font-size: 32rpx;
  color: #666;
}

.control-btn.active .iconfont {
  color: #fff;
}

/* 价格更改弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin: 0 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
}

.close-icon {
  font-size: 24rpx;
  color: #666;
}

.recommend-price {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 20rpx;
}

.recommend-text {
  font-size: 28rpx;
  color: #333;
}

.price-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #ff7d00;
  margin-left: 10rpx;
}

.input-section, .select-section {
  margin-bottom: 40rpx;
}

.input-label, .select-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.price-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #f9f9f9;
  box-sizing: border-box;
}

.price-input:focus {
  border-color: #ff7d00;
  background: #fff;
}

.price-picker {
  width: 100%;
}

.picker-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  background: #f9f9f9;
  box-sizing: border-box;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 20rpx;
  color: #999;
}

.save-btn {
  width: 100%;
  height: 80rpx;
  background: #ff7d00;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
}

.save-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}
</style>
