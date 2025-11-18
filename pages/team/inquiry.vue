<template>
  <view class="inquiry-bg">
    <view class="inquiry-content">
      <!-- 标题 -->
      <view class="inquiry-title">{{ isViewMode ? '询价详情' : '团队报价信息' }}</view>
      
      <!-- 表单内容 -->
      <view class="form-section">
        <!-- 团队性质 -->
        <view class="form-item">
          <text class="form-label">团队性质</text>
          <picker v-if="!isViewMode" mode="selector" :range="teamTypeOptions" :value="teamTypeIndex" @change="onTeamTypeChange">
            <view class="form-picker">
              <text class="picker-text" :class="{'placeholder': teamTypeIndex === -1}">
                {{ teamTypeIndex === -1 ? '请选择' : teamTypeOptions[teamTypeIndex] }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <view v-else class="form-display">
            <text class="display-text">{{ teamTypeIndex !== -1 ? teamTypeOptions[teamTypeIndex] : '未填写' }}</text>
          </view>
        </view>

        <!-- 团队房间数 -->
        <view class="form-item">
          <text class="form-label">团队房间数</text>
          <input 
            v-if="!isViewMode"
            class="form-input" 
            placeholder="请输入房间数" 
            v-model="roomCount"
            type="number"
          />
          <view v-else class="form-display">
            <text class="display-text">{{ roomCount || '未填写' }}</text>
          </view>
        </view>

        <!-- 入住时间 -->
        <view class="form-item">
          <text class="form-label">入住时间</text>
          <view v-if="!isViewMode" class="date-range-picker">
            <picker mode="date" :value="checkInDate" @change="onCheckInChange">
              <view class="date-picker">
                <text class="date-icon">📅</text>
                <text class="date-text" :class="{'placeholder': !checkInDate}">
                  {{ checkInDate ? formatDate(checkInDate) : '入住时间' }}
                </text>
              </view>
            </picker>
            <text class="date-separator">—</text>
            <picker mode="date" :value="checkOutDate" @change="onCheckOutChange">
              <view class="date-picker">
                <text class="date-text" :class="{'placeholder': !checkOutDate}">
                  {{ checkOutDate ? formatDate(checkOutDate) : '离店时间' }}
                </text>
              </view>
            </picker>
          </view>
          <view v-else class="form-display">
            <text class="display-text">
              {{ checkInDate && checkOutDate ? `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}` : '未填写' }}
            </text>
          </view>
        </view>

        <!-- 会议人数 -->
        <view class="form-item">
          <text class="form-label">会议人数</text>
          <input 
            v-if="!isViewMode"
            class="form-input" 
            placeholder="请输入会议人数" 
            v-model="meetingCount"
            type="number"
          />
          <view v-else class="form-display">
            <text class="display-text">{{ meetingCount || '未填写' }}</text>
          </view>
        </view>

        <!-- 早餐人数 -->
        <view class="form-item">
          <text class="form-label">早餐人数</text>
          <input 
            v-if="!isViewMode"
            class="form-input" 
            placeholder="请输入早餐人数" 
            v-model="breakfastCount"
            type="number"
          />
          <view v-else class="form-display">
            <text class="display-text">{{ breakfastCount || '未填写' }}</text>
          </view>
        </view>

        <!-- 其他餐饮需求 -->
        <view class="form-item">
          <text class="form-label">其他餐饮需求</text>
          <textarea 
            v-if="!isViewMode"
            class="form-textarea" 
            placeholder="请输入其他餐饮需求" 
            v-model="otherDiningNeeds"
            maxlength="200"
          />
          <view v-else class="form-display">
            <text class="display-text">{{ otherDiningNeeds || '未填写' }}</text>
          </view>
        </view>

        <!-- 其他需求描述 -->
        <view class="form-item">
          <text class="form-label">其他需求描述</text>
          <textarea 
            v-if="!isViewMode"
            class="form-textarea" 
            placeholder="请输入其他需求描述" 
            v-model="otherRequirements"
            maxlength="200"
          />
          <view v-else class="form-display">
            <text class="display-text">{{ otherRequirements || '未填写' }}</text>
          </view>
        </view>
      </view>

      <!-- 确认按钮 -->
      <button v-if="!isViewMode" class="confirm-btn" @click="submitInquiry">确认</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mode: 'new', // new: 新建模式, view: 查看模式
      inquiryId: null,
      teamTypeOptions: ['商务团队', '旅游团队', '会议团队', '培训团队', '其他'],
      teamTypeIndex: -1,
      roomCount: '',
      checkInDate: '',
      checkOutDate: '',
      meetingCount: '',
      breakfastCount: '',
      otherDiningNeeds: '',
      otherRequirements: '',
      
      // 模拟的询价数据（实际项目中应该从后端获取）
      mockInquiryData: [
        {
          id: 0,
          teamType: '商务团队',
          roomCount: '5',
          checkInDate: '2025-08-20',
          checkOutDate: '2025-08-22',
          meetingCount: '20',
          breakfastCount: '20',
          otherDiningNeeds: '需要会议茶歇服务',
          otherRequirements: '需要投影设备和音响'
        },
        {
          id: 1,
          teamType: '旅游团队',
          roomCount: '8',
          checkInDate: '2025-08-25',
          checkOutDate: '2025-08-28',
          meetingCount: '0',
          breakfastCount: '16',
          otherDiningNeeds: '不需要',
          otherRequirements: '需要早餐打包服务'
        },
        {
          id: 2,
          teamType: '培训团队',
          roomCount: '12',
          checkInDate: '2025-03-10',
          checkOutDate: '2025-03-11',
          meetingCount: '30',
          breakfastCount: '24',
          otherDiningNeeds: '需要工作午餐',
          otherRequirements: '需要培训教室和设备'
        },
        {
          id: 3,
          teamType: '会议团队',
          roomCount: '6',
          checkInDate: '2025-03-09',
          checkOutDate: '2025-03-11',
          meetingCount: '15',
          breakfastCount: '12',
          otherDiningNeeds: '需要欢迎晚宴',
          otherRequirements: '需要商务中心服务'
        },
        {
          id: 4,
          teamType: '商务团队',
          roomCount: '4',
          checkInDate: '2025-03-07',
          checkOutDate: '2025-03-08',
          meetingCount: '10',
          breakfastCount: '8',
          otherDiningNeeds: '不需要',
          otherRequirements: '需要叫车服务'
        },
        {
          id: 5,
          teamType: '其他',
          roomCount: '10',
          checkInDate: '2025-03-07',
          checkOutDate: '2025-03-10',
          meetingCount: '25',
          breakfastCount: '20',
          otherDiningNeeds: '需要团建聚餐',
          otherRequirements: '需要娱乐设施使用'
        }
      ]
    }
  },
  computed: {
    isViewMode() {
      return this.mode === 'view';
    }
  },
  onLoad(option) {  
    // 获取页面参数
    this.mode = option.mode || 'new';
    this.inquiryId = option.id ? parseInt(option.id) : null;
    
    // 如果是查看模式，加载数据
    if (this.mode === 'view' && this.inquiryId !== null) {
      this.loadInquiryData();
    }
  },
  methods: {
    // 加载询价数据（查看模式）
    loadInquiryData() {
      const data = this.mockInquiryData.find(item => item.id === this.inquiryId);
      if (data) {
        this.teamTypeIndex = this.teamTypeOptions.indexOf(data.teamType);
        this.roomCount = data.roomCount;
        this.checkInDate = data.checkInDate;
        this.checkOutDate = data.checkOutDate;
        this.meetingCount = data.meetingCount;
        this.breakfastCount = data.breakfastCount;
        this.otherDiningNeeds = data.otherDiningNeeds;
        this.otherRequirements = data.otherRequirements;
      }
    },
    onTeamTypeChange(e) {
      if (!this.isViewMode) {
        this.teamTypeIndex = e.detail.value;
      }
    },
    onCheckInChange(e) {
      if (!this.isViewMode) {
        this.checkInDate = e.detail.value;
      }
    },
    onCheckOutChange(e) {
      if (!this.isViewMode) {
        this.checkOutDate = e.detail.value;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    },
    submitInquiry() {
      if (this.isViewMode) return;
      
      // 验证必填项
      if (this.teamTypeIndex === -1) {
        uni.showToast({
          title: '请选择团队性质',
          icon: 'none'
        });
        return;
      }
      
      if (!this.roomCount) {
        uni.showToast({
          title: '请输入房间数',
          icon: 'none'
        });
        return;
      }

      if (!this.checkInDate || !this.checkOutDate) {
        uni.showToast({
          title: '请选择入住时间',
          icon: 'none'
        });
        return;
      }

      // 提交询价信息
      uni.showToast({
        title: '询价提交成功',
        icon: 'success'
      });

      // 返回上一页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  }
}
</script>

<style scoped>
.inquiry-bg {
  min-height: 100vh;
  background: #f8f8f8;
  padding-top: 44rpx;
}

.inquiry-content {
  padding: 0 32rpx 120rpx 32rpx;
}

.inquiry-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 48rpx;
  text-align: center;
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  margin-bottom: 48rpx;
}

.form-item {
  margin-bottom: 48rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 32rpx;
  color: #222;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.form-picker {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 88rpx;
  box-sizing: border-box;
}

.picker-text {
  font-size: 28rpx;
  color: #222;
  flex: 1;
}

.picker-text.placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 20rpx;
  color: #999;
  margin-left: 16rpx;
}

.form-input {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  color: #222;
  border: none;
  min-height: 88rpx;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #999;
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.date-picker {
  flex: 1;
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  min-height: 88rpx;
  box-sizing: border-box;
}

.date-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.date-text {
  font-size: 28rpx;
  color: #222;
  flex: 1;
}

.date-text.placeholder {
  color: #999;
}

.date-separator {
  font-size: 28rpx;
  color: #999;
  font-weight: 500;
}

.form-textarea {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
  color: #222;
  border: none;
  min-height: 120rpx;
  box-sizing: border-box;
  resize: none;
}

.form-textarea::placeholder {
  color: #999;
}

.confirm-btn {
  width: 100%;
  background: #ff7d00;
  color: #fff;
  border-radius: 24rpx;
  height: 96rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  box-shadow: 0 8rpx 32rpx rgba(255, 125, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn:active {
  background: #e66a00;
}

/* 只读模式样式 */
.form-display {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  min-height: 88rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.display-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>
