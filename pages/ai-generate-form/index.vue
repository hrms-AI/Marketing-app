<template>
  <view class="ai-form-container">
    <!-- 状态栏 -->
    <status-bar />
    
    <!-- 顶部导航栏 -->
    <top-navbar 
      title="AI生成月度计划" 
      :show-back="true"
      @back="handleBack"
    />

    <!-- 表单内容 -->
    <view class="form-content">
      <view class="form-header">
        <text class="form-title">下个月营销计划</text>
        <text class="form-subtitle">请填写相关信息，AI将为您生成专业的营销策划</text>
      </view>

      <view class="form-section">
        <!-- 目标月份 -->
        <view class="form-item">
          <text class="form-label">目标月份</text>
          <view class="form-picker" @click="showMonthPicker">
            <text class="picker-text">{{ selectedYear }}年{{ selectedMonth }}月</text>
            <text class="picker-arrow">▼</text>
          </view>
        </view>

        <!-- 酒店选择 -->
        <view class="form-item">
          <text class="form-label">选择酒店</text>
          <view class="form-picker" @click="showHotelPicker">
            <text class="picker-text">{{ selectedHotel || '请选择酒店' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </view>

        <!-- 营销目标 -->
        <view class="form-item">
          <text class="form-label">营销目标</text>
          <textarea 
            class="form-textarea" 
            v-model="formData.marketingGoal"
            placeholder="请描述您的营销目标，如：提升品牌知名度、增加入住率、推广特色服务等"
            maxlength="200"
          ></textarea>
        </view>

        <!-- 目标客群 -->
        <view class="form-item">
          <text class="form-label">目标客群</text>
          <view class="checkbox-group">
            <view 
              v-for="(group, index) in targetGroups" 
              :key="index"
              class="checkbox-item"
              :class="{'checked': formData.targetCustomers.includes(group.value)}"
              @click="toggleTargetGroup(group.value)"
            >
              <text class="checkbox-text">{{ group.label }}</text>
            </view>
          </view>
        </view>

        <!-- 预算范围 -->
        <view class="form-item">
          <text class="form-label">预算范围</text>
          <picker mode="selector" :range="budgetOptions" :value="budgetIndex" @change="onBudgetChange">
            <view class="form-picker">
              <text class="picker-text">{{ selectedBudget || '请选择预算范围' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 重点活动 -->
        <view class="form-item">
          <text class="form-label">重点活动或节日</text>
          <textarea 
            class="form-textarea" 
            v-model="formData.keyActivities"
            placeholder="请描述下个月的重点营销活动、节日庆典、特殊推广等"
            maxlength="300"
          ></textarea>
        </view>

        <!-- 营销渠道 -->
        <view class="form-item">
          <text class="form-label">营销渠道偏好</text>
          <view class="checkbox-group">
            <view 
              v-for="(channel, index) in marketingChannels" 
              :key="index"
              class="checkbox-item"
              :class="{'checked': formData.preferredChannels.includes(channel.value)}"
              @click="toggleChannel(channel.value)"
            >
              <text class="checkbox-text">{{ channel.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 生成按钮 -->
      <view class="form-actions">
        <button class="generate-btn" @click="generatePlan" :disabled="generating">
          <text class="btn-icon">{{ generating ? '⏳' : '✨' }}</text>
          <text class="btn-text">{{ generating ? 'AI生成中...' : '生成营销计划' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      generating: false,
      
      // 月份选择
      yearIndex: 0,
      monthIndex: 0,
      monthRange: [
        ['2025', '2026'],
        ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      ],
      
      // 酒店选择
      hotelIndex: 0,
      hotelNames: ['华美达酒店', '希尔顿酒店', '万豪酒店', '香格里拉酒店'],
      
      // 预算选择
      budgetIndex: -1,
      budgetOptions: ['1-5万', '5-10万', '10-20万', '20-50万', '50万以上'],
      
      // 表单数据
      formData: {
        marketingGoal: '',
        targetCustomers: [],
        keyActivities: '',
        preferredChannels: []
      },
      
      // 目标客群选项
      targetGroups: [
        { label: '商务客人', value: 'business' },
        { label: '休闲度假', value: 'leisure' },
        { label: '家庭出游', value: 'family' },
        { label: '情侣出行', value: 'couple' },
        { label: '团队建设', value: 'team' },
        { label: '会议客户', value: 'meeting' }
      ],
      
      // 营销渠道选项
      marketingChannels: [
        { label: '抖音短视频', value: 'douyin' },
        { label: '小红书图文', value: 'xiaohongshu' },
        { label: '微信朋友圈', value: 'wechat' },
        { label: '官方网站', value: 'website' },
        { label: '第三方平台', value: 'ota' },
        { label: '线下活动', value: 'offline' }
      ]
    }
  },
  
  computed: {
    selectedYear() {
      return '2025';
    },
    selectedMonth() {
      return '12';
    },
    selectedHotel() {
      return this.hotelIndex >= 0 ? this.hotelNames[this.hotelIndex] : '请选择酒店';
    }
  },
  
  mounted() {
    // 默认设置为下个月
    const now = new Date();
    const nextMonth = now.getMonth() + 2; // getMonth() 返回0-11，所以+2表示下个月
    const nextYear = nextMonth > 12 ? now.getFullYear() + 1 : now.getFullYear();
    const realNextMonth = nextMonth > 12 ? 1 : nextMonth;
    
    this.yearIndex = nextYear === 2025 ? 0 : 1;
    this.monthIndex = realNextMonth - 1;
  },
  
  methods: {
    handleBack() {
      uni.navigateBack();
    },
    
    showMonthPicker() {
      uni.showToast({
        title: '月份选择功能开发中',
        icon: 'none'
      });
    },
    
    showHotelPicker() {
      uni.showToast({
        title: '酒店选择功能开发中',
        icon: 'none'
      });
    },
    
    onBudgetChange(e) {
      this.budgetIndex = e.detail.value;
    },
    
    toggleTargetGroup(value) {
      const index = this.formData.targetCustomers.indexOf(value);
      if (index > -1) {
        this.formData.targetCustomers.splice(index, 1);
      } else {
        this.formData.targetCustomers.push(value);
      }
    },
    
    toggleChannel(value) {
      const index = this.formData.preferredChannels.indexOf(value);
      if (index > -1) {
        this.formData.preferredChannels.splice(index, 1);
      } else {
        this.formData.preferredChannels.push(value);
      }
    },
    
    async generatePlan() {
      // 验证表单
      if (!this.formData.marketingGoal.trim()) {
        uni.showToast({
          title: '请填写营销目标',
          icon: 'none'
        });
        return;
      }
      
      if (this.formData.targetCustomers.length === 0) {
        uni.showToast({
          title: '请选择目标客群',
          icon: 'none'
        });
        return;
      }
      
      this.generating = true;
      
      try {
        // 模拟AI生成过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 生成成功，返回主页面
        uni.showToast({
          title: '营销计划生成成功！',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
        
      } catch (error) {
        uni.showToast({
          title: '生成失败，请重试',
          icon: 'none'
        });
      } finally {
        this.generating = false;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ai-form-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
}

.form-content {
  padding: 200rpx 32rpx 60rpx;
}

.form-header {
  text-align: center;
  margin-bottom: 60rpx;
  
  .form-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #222;
    margin-bottom: 16rpx;
  }
  
  .form-subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
    line-height: 1.4;
  }
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 8rpx 32rpx 0 rgba(0,0,0,0.08);
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 20rpx;
}

.form-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  border: 2rpx solid #e5e5e5;
  
  .picker-text {
    font-size: 28rpx;
    color: #222;
    flex: 1;
  }
  
  .picker-arrow {
    font-size: 24rpx;
    color: #999;
  }
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx 24rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  border: 2rpx solid #e5e5e5;
  font-size: 28rpx;
  color: #222;
  line-height: 1.4;
  box-sizing: border-box;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.checkbox-item {
  padding: 16rpx 24rpx;
  background: #f8f8f8;
  border-radius: 40rpx;
  border: 2rpx solid #e5e5e5;
  transition: all 0.3s ease;
  
  &.checked {
    background: #e3f2fd;
    border-color: #2196f3;
    
    .checkbox-text {
      color: #2196f3;
      font-weight: 600;
    }
  }
}

.checkbox-text {
  font-size: 26rpx;
  color: #666;
}

.form-actions {
  padding: 0 32rpx;
}

.generate-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  
  &[disabled] {
    opacity: 0.6;
  }
  
  .btn-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }
  
  .btn-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
  }
}
</style>
