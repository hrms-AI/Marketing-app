<template>
  <uv-modal 
    v-model="localVisible" 
    title="提交活动策划"
    :show-cancel-button="true"
    confirm-text="生成营销计划"
    cancel-text="取消"
    @confirm="handleConfirm"
    @cancel="handleCancel">
    <view class="activity-plan-content">
      <view class="plan-header">
        <text class="plan-title">{{ year }}年{{ month }}月活动策划</text>
        <text class="plan-subtitle">请详细描述您的活动策划，AI将基于这些信息生成完整的营销计划</text>
      </view>
      
      <view class="plan-form">
        <view class="form-group">
          <text class="form-label">*活动主题</text>
          <uv-input 
            v-model="localPlan.theme" 
            placeholder="请输入活动主题，如：春季踏青优惠活动"
            maxlength="50"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">*目标客群</text>
          <uv-input 
            v-model="localPlan.target" 
            placeholder="请描述目标客群，如：年轻情侣、亲子家庭"
            maxlength="100"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">*活动内容</text>
          <uv-textarea 
            v-model="localPlan.activities" 
            placeholder="请详细描述活动内容和流程，包括优惠政策、特色服务等"
            :maxlength="500"
            :rows="4"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">预算范围</text>
          <uv-input 
            v-model="localPlan.budget" 
            placeholder="预估活动预算，如：5-10万元（可选）"
            maxlength="50"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">期望效果</text>
          <uv-textarea 
            v-model="localPlan.expectedEffect" 
            placeholder="描述期望达到的效果，如：提升入住率20%（可选）"
            :maxlength="200"
            :rows="3"
          />
        </view>
      </view>
      
      <view class="plan-tips">
        <text class="tips-icon">💡</text>
        <text class="tips-text">信息越详细，AI生成的营销计划越精准有效</text>
      </view>
    </view>
  </uv-modal>
</template>

<script>
export default {
  name: 'ActivityPlanModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    year: {
      type: [String, Number],
      default: ''
    },
    month: {
      type: [String, Number],
      default: ''
    },
    plan: {
      type: Object,
      default: () => ({
        theme: '',
        target: '',
        activities: '',
        budget: '',
        expectedEffect: ''
      })
    }
  },
  computed: {
    localVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) {
          this.$emit('cancel')
        }
      }
    },
    localPlan: {
      get() {
        return this.plan
      },
      set(val) {
        this.$emit('update:plan', val)
      }
    }
  },
  methods: {
    handleConfirm() {
      // 验证必填项
      if (!this.localPlan.theme) {
        uni.showToast({
          title: '请填写活动主题',
          icon: 'none'
        })
        return
      }
      if (!this.localPlan.target) {
        uni.showToast({
          title: '请填写目标客群',
          icon: 'none'
        })
        return
      }
      if (!this.localPlan.activities) {
        uni.showToast({
          title: '请填写活动内容',
          icon: 'none'
        })
        return
      }
      this.$emit('confirm', this.localPlan)
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-plan-content {
  padding: 20rpx;
  max-height: 70vh;
  overflow-y: auto;
}

.plan-header {
  margin-bottom: 32rpx;
  text-align: center;
}

.plan-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 12rpx;
}

.plan-subtitle {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

.plan-form {
  margin-bottom: 24rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
  
  &::before {
    content: '*';
    color: #ff4d4f;
    margin-right: 4rpx;
  }
}

.plan-tips {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background: #f0f9ff;
  border-radius: 8rpx;
  border-left: 4rpx solid #296FB7;
}

.tips-icon {
  font-size: 28rpx;
}

.tips-text {
  flex: 1;
  font-size: 24rpx;
  color: #1e5a96;
  line-height: 1.5;
}
</style>
