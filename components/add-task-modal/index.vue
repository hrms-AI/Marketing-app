<template>
  <uv-modal 
    v-model="localVisible" 
    title="新增营销任务"
    :show-cancel-button="true"
    confirm-text="保存"
    cancel-text="取消"
    @confirm="handleConfirm"
    @cancel="handleCancel">
    <view class="add-modal-content">
      <view class="form-item">
        <text class="form-label">任务类型</text>
        <picker mode="selector" :range="taskTypes" :value="localTask.typeIndex" @change="onTaskTypeChange">
          <view class="form-picker">
            <text class="picker-text">{{ taskTypes[localTask.typeIndex] || '请选择' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">任务标题</text>
        <input class="form-input" v-model="localTask.title" placeholder="请输入任务标题" />
      </view>
      <view class="form-item">
        <text class="form-label">任务描述</text>
        <textarea class="form-textarea" v-model="localTask.description" placeholder="请输入任务描述"></textarea>
      </view>
    </view>
  </uv-modal>
</template>

<script>
export default {
  name: 'AddTaskModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: () => ({
        typeIndex: 0,
        title: '',
        description: ''
      })
    },
    taskTypes: {
      type: Array,
      default: () => ['抖音视频', '小红书图文', '朋友圈海报', '节假日活动', '特殊纪念日', '城市活动']
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
    localTask: {
      get() {
        return this.task
      },
      set(val) {
        this.$emit('update:task', val)
      }
    }
  },
  methods: {
    onTaskTypeChange(e) {
      const typeIndex = e.detail.value
      this.$emit('update:task', {
        ...this.localTask,
        typeIndex
      })
    },
    handleConfirm() {
      // 验证必填项
      if (!this.localTask.title) {
        uni.showToast({
          title: '请输入任务标题',
          icon: 'none'
        })
        return
      }
      if (!this.localTask.description) {
        uni.showToast({
          title: '请输入任务描述',
          icon: 'none'
        })
        return
      }
      this.$emit('confirm', this.localTask)
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-modal-content {
  padding: 20rpx;
}

.form-item {
  margin-bottom: 24rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.form-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
}

.picker-text {
  font-size: 26rpx;
  color: #333;
}

.picker-arrow {
  font-size: 20rpx;
  color: #999;
}

.form-input {
  width: 100%;
  padding: 16rpx;
  font-size: 26rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
}

.form-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 16rpx;
  font-size: 26rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
}
</style>
