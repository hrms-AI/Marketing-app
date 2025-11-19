<template>
  <view class="ai-generate-container">
    <view class="page-header">
      <view class="header-info">
        <text class="hotel-name">{{ hotelName }}</text>
        <text class="date-info">生成 {{ targetYear }}年{{ targetMonth }}月 营销计划</text>
      </view>
    </view>

    <view class="form-container">
      <view class="form-section">
        <view class="section-title">
          <text class="title-text">基本信息</text>
          <text class="title-desc">请填写酒店和活动的基本信息</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">酒店定位</text>
          <picker mode="selector" :range="hotelTypes" :value="hotelTypeIndex" @change="onHotelTypeChange">
            <view class="form-picker">
              <text class="picker-text" :class="{'placeholder': hotelTypeIndex === -1}">
                {{ hotelTypeIndex !== -1 ? hotelTypes[hotelTypeIndex] : '请选择酒店定位' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">目标客群</text>
          <picker mode="selector" :range="targetAudiences" :value="audienceIndex" @change="onAudienceChange">
            <view class="form-picker">
              <text class="picker-text" :class="{'placeholder': audienceIndex === -1}">
                {{ audienceIndex !== -1 ? targetAudiences[audienceIndex] : '请选择目标客群' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">营销预算</text>
          <input 
            class="form-input" 
            type="digit" 
            v-model="budget" 
            placeholder="请输入预算金额（元）"
            :maxlength="10"
          />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">
          <text class="title-text">活动策划</text>
          <text class="title-desc">描述您想要举办的活动和营销重点</text>
        </view>

        <view class="form-item">
          <text class="form-label">主要活动</text>
          <textarea 
            class="form-textarea" 
            v-model="mainActivity" 
            placeholder="请描述主要的营销活动，如：圣诞主题活动、年终促销、新年庆典等"
            :maxlength="500"
          />
          <view class="char-count">{{ mainActivity.length }}/500</view>
        </view>

        <view class="form-item">
          <text class="form-label">营销重点</text>
          <textarea 
            class="form-textarea" 
            v-model="marketingFocus" 
            placeholder="请描述营销重点，如：提升入住率、推广特色服务、增加客户复购等"
            :maxlength="300"
          />
          <view class="char-count">{{ marketingFocus.length }}/300</view>
        </view>

        <view class="form-item">
          <text class="form-label">特殊要求</text>
          <textarea 
            class="form-textarea" 
            v-model="specialRequirements" 
            placeholder="其他特殊要求或注意事项（选填）"
            :maxlength="200"
          />
          <view class="char-count">{{ specialRequirements.length }}/200</view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">
          <text class="title-text">营销渠道</text>
          <text class="title-desc">选择您希望使用的营销渠道</text>
        </view>

        <view class="checkbox-group">
          <view 
            v-for="(channel, index) in marketingChannels" 
            :key="index"
            class="checkbox-item"
            @click="toggleChannel(index)"
          >
            <view class="checkbox" :class="{'checked': channel.selected}">
              <text v-if="channel.selected" class="checkbox-icon">✓</text>
            </view>
            <text class="checkbox-label">{{ channel.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-actions">
      <button class="action-btn cancel-btn" @click="goBack">取消</button>
      <button class="action-btn generate-btn" @click="generatePlan" :disabled="generating">
        <text v-if="generating">生成中...</text>
        <text v-else>生成营销计划</text>
      </button>
    </view>

    <!-- 生成进度弹窗 -->
    <uv-modal 
      v-model="showProgressModal" 
      title="AI正在生成营销计划"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <view class="progress-content">
        <view class="progress-info">
          <text class="progress-text">{{ progressText }}</text>
          <view class="progress-bar">
            <view class="progress-fill" :style="{width: progress + '%'}"></view>
          </view>
          <text class="progress-percent">{{ progress }}%</text>
        </view>
      </view>
    </uv-modal>
  </view>
</template>

<script>
export default {
  name: 'AIGenerate',
  
  data() {
    return {
      hotelId: '',
      hotelName: '',
      targetYear: 2025,
      targetMonth: 12,
      
      // 表单数据
      hotelTypeIndex: -1,
      hotelTypes: ['豪华酒店', '商务酒店', '度假酒店', '精品酒店', '经济型酒店', '民宿客栈'],
      
      audienceIndex: -1,
      targetAudiences: ['商务客户', '休闲旅客', '情侣夫妻', '亲子家庭', '年轻群体', '高端客户'],
      
      budget: '',
      mainActivity: '',
      marketingFocus: '',
      specialRequirements: '',
      
      marketingChannels: [
        { name: '抖音短视频', selected: false },
        { name: '小红书图文', selected: false },
        { name: '朋友圈海报', selected: false },
        { name: '微信群推广', selected: false },
        { name: '线下活动', selected: false },
        { name: '合作推广', selected: false }
      ],
      
      // 生成状态
      generating: false,
      showProgressModal: false,
      progress: 0,
      progressText: '正在分析您的需求...'
    }
  },
  
  onLoad(options) {
    // 获取传递的参数
    if (options.hotelId) {
      this.hotelId = options.hotelId;
    }
    if (options.year) {
      this.targetYear = parseInt(options.year);
    }
    if (options.month) {
      this.targetMonth = parseInt(options.month);
    }
    
    // 设置酒店名称（这里可以根据hotelId查询真实酒店名称）
    this.hotelName = '示例酒店';
    
    // 检查是否为下个月
    this.validateTargetMonth();
  },
  
  methods: {
    validateTargetMonth() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      let nextMonth = currentMonth + 1;
      let nextYear = currentYear;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear = currentYear + 1;
      }
      
      if (this.targetYear !== nextYear || this.targetMonth !== nextMonth) {
        uni.showToast({
          title: `只能生成下个月（${nextYear}年${nextMonth}月）的计划`,
          icon: 'none',
          duration: 2000
        });
        
        // 2秒后返回
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      }
    },
    
    onHotelTypeChange(e) {
      this.hotelTypeIndex = e.detail.value;
    },
    
    onAudienceChange(e) {
      this.audienceIndex = e.detail.value;
    },
    
    toggleChannel(index) {
      this.marketingChannels[index].selected = !this.marketingChannels[index].selected;
    },
    
    validateForm() {
      if (this.hotelTypeIndex === -1) {
        uni.showToast({
          title: '请选择酒店定位',
          icon: 'none'
        });
        return false;
      }
      
      if (this.audienceIndex === -1) {
        uni.showToast({
          title: '请选择目标客群',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.budget.trim()) {
        uni.showToast({
          title: '请填写营销预算',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.mainActivity.trim()) {
        uni.showToast({
          title: '请填写主要活动内容',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.marketingFocus.trim()) {
        uni.showToast({
          title: '请填写营销重点',
          icon: 'none'
        });
        return false;
      }
      
      const selectedChannels = this.marketingChannels.filter(channel => channel.selected);
      if (selectedChannels.length === 0) {
        uni.showToast({
          title: '请至少选择一个营销渠道',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    
    async generatePlan() {
      if (!this.validateForm()) {
        return;
      }
      
      this.generating = true;
      this.showProgressModal = true;
      this.progress = 0;
      
      try {
        // 模拟AI生成过程
        await this.simulateGeneration();
        
        // 生成成功，返回到策略页面
        uni.showToast({
          title: '营销计划生成成功！',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
        
      } catch (error) {
        console.error('生成营销计划失败:', error);
        uni.showToast({
          title: '生成失败，请重试',
          icon: 'error'
        });
      } finally {
        this.generating = false;
        this.showProgressModal = false;
      }
    },
    
    async simulateGeneration() {
      const steps = [
        { text: '正在分析您的需求...', duration: 1000 },
        { text: '正在制定营销策略...', duration: 1500 },
        { text: '正在安排活动时间...', duration: 1000 },
        { text: '正在优化营销内容...', duration: 1200 },
        { text: '正在生成最终方案...', duration: 800 }
      ];
      
      let currentProgress = 0;
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        this.progressText = step.text;
        
        // 动画更新进度
        const targetProgress = ((i + 1) / steps.length) * 100;
        const progressStep = (targetProgress - currentProgress) / (step.duration / 50);
        
        while (currentProgress < targetProgress) {
          await new Promise(resolve => setTimeout(resolve, 50));
          currentProgress = Math.min(currentProgress + progressStep, targetProgress);
          this.progress = Math.round(currentProgress);
        }
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped lang="scss">
.ai-generate-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 32rpx;
  color: white;
  
  .header-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
  
  .hotel-name {
    font-size: 32rpx;
    font-weight: 600;
  }
  
  .date-info {
    font-size: 24rpx;
    opacity: 0.9;
  }
}

.form-container {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.form-section {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.06);
  
  .section-title {
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f0f0f0;
    
    .title-text {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .title-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.form-item {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .form-label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }
  
  .form-picker {
    height: 80rpx;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    
    .picker-text {
      font-size: 28rpx;
      color: #333;
      
      &.placeholder {
        color: #999;
      }
    }
    
    .picker-arrow {
      font-size: 20rpx;
      color: #666;
    }
  }
  
  .form-input {
    height: 80rpx;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333;
  }
  
  .form-textarea {
    min-height: 120rpx;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }
  
  .char-count {
    text-align: right;
    font-size: 22rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  
  .checkbox {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid #ddd;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    
    &.checked {
      background: #667eea;
      border-color: #667eea;
    }
    
    .checkbox-icon {
      font-size: 24rpx;
      color: white;
      font-weight: bold;
    }
  }
  
  .checkbox-label {
    font-size: 28rpx;
    color: #333;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 16rpx rgba(0,0,0,0.1);
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
  
  &.cancel-btn {
    background: #f8f9fa;
    color: #666;
  }
  
  &.generate-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:disabled {
      opacity: 0.6;
    }
  }
}

.progress-content {
  padding: 40rpx 0;
  text-align: center;
  
  .progress-info {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    align-items: center;
  }
  
  .progress-text {
    font-size: 28rpx;
    color: #333;
  }
  
  .progress-bar {
    width: 300rpx;
    height: 8rpx;
    background: #f0f0f0;
    border-radius: 4rpx;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 4rpx;
      transition: width 0.3s ease;
    }
  }
  
  .progress-percent {
    font-size: 24rpx;
    color: #666;
    font-weight: 600;
  }
}
</style>
