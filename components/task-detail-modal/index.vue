<template>
  <uv-modal 
    v-model="localVisible" 
    title="营销任务详情"
    :show-cancel-button="false"
    confirm-text="关闭"
    @confirm="handleClose">
    <view class="task-modal-content">
      <view v-if="task" class="task-details">
        <view class="task-header">
          <text class="task-date">{{ formatDate(task.date) }}</text>
          <view class="task-status" :class="task.status">
            {{ getStatusText(task.status) }}
          </view>
        </view>
        <view class="task-info">
          <text class="task-title">{{ task.title }}</text>
          <text class="task-type">{{ getTaskTypeText(task.type) }}</text>
          <text class="task-description">{{ task.description }}</text>
        </view>
        <view class="task-actions">
          <button class="action-btn preview" @click="handlePreview">预览内容</button>
          <button class="action-btn edit" @click="handleEdit">编辑任务</button>
          <button class="action-btn chat" @click="handleChat">AI对话</button>
        </view>
      </view>
    </view>
  </uv-modal>
</template>

<script>
export default {
  name: 'TaskDetailModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: null
    }
  },
  computed: {
    localVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) {
          this.$emit('close')
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        published: '已发布',
        draft: '草稿'
      }
      return statusMap[status] || status
    },
    getTaskTypeText(type) {
      const typeMap = {
        douyin: '抖音视频',
        xiaohongshu: '小红书图文',
        pengyouquan: '朋友圈海报',
        holiday: '节假日活动',
        special: '特殊纪念日',
        city: '城市活动'
      }
      return typeMap[type] || type
    },
    handleClose() {
      this.$emit('close')
    },
    handlePreview() {
      this.$emit('preview', this.task)
    },
    handleEdit() {
      this.$emit('edit', this.task)
    },
    handleChat() {
      this.$emit('chat', this.task)
    }
  }
}
</script>

<style lang="scss" scoped>
.task-modal-content {
  padding: 20rpx;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #e9ecef;
}

.task-date {
  font-size: 28rpx;
  font-weight: 600;
  color: #296FB7;
}

.task-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }
  
  &.approved {
    background: #d4edda;
    color: #155724;
  }
  
  &.rejected {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.published {
    background: #d1ecf1;
    color: #0c5460;
  }
  
  &.draft {
    background: #e2e3e5;
    color: #383d41;
  }
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.task-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}

.task-type {
  font-size: 24rpx;
  color: #666;
  padding: 4rpx 12rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  display: inline-block;
  align-self: flex-start;
}

.task-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.task-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding-top: 16rpx;
}

.action-btn {
  padding: 16rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  
  &.preview {
    background: linear-gradient(135deg, #296FB7 0%, #1e5a96 100%);
    color: white;
    
    &:active {
      opacity: 0.9;
    }
  }
  
  &.edit {
    background: linear-gradient(135deg, #ff7d00 0%, #e66a00 100%);
    color: white;
    
    &:active {
      opacity: 0.9;
    }
  }
  
  &.chat {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:active {
      opacity: 0.9;
    }
  }
}
</style>
