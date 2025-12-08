<template>
  <view class="app-container">
    <!-- 状态栏 -->
    <status-bar />
    
    <!-- 顶部导航栏 -->
    <top-navbar 
      title="素材" 
      :show-back="false"
      :show-logo="false"
    />

    <!-- 主要内容区 -->
    <view class="app-content">
      <view class="material-page">
    <!-- 顶部tab栏 -->
    <view class="material-tabs">
      <view class="tab-item" :class="{'active': activeTab === 'image'}" @click="switchTab('image')">
        <text class="tab-text">图片素材</text>
        <view v-if="activeTab === 'image'" class="tab-underline"></view>
      </view>
      <view class="tab-item" :class="{'active': activeTab === 'video'}" @click="switchTab('video')">
        <text class="tab-text">视频素材</text>
        <view v-if="activeTab === 'video'" class="tab-underline"></view>
      </view>
      <view class="tab-item" :class="{'active': activeTab === 'finished'}" @click="switchTab('finished')">
        <text class="tab-text">成品库</text>
        <view v-if="activeTab === 'finished'" class="tab-underline"></view>
      </view>
    </view>

    <!-- 添加区 -->
    <view class="add-section" v-if="activeTab !== 'finished'">
      <view class="add-title">添加</view>
      <view class="add-upload" @click="uploadMaterial">
        <view class="upload-icon">{{ uploadIcon }}</view>
        <view class="upload-text">{{ uploadText }}</view>
      </view>
    </view>

    <!-- 成品库说明区 -->
    <view class="finished-info-section" v-if="activeTab === 'finished'">
      <view class="finished-title">成品库</view>
      <view class="finished-desc">展示营销素材的完成状态和待执行任务</view>
    </view>

    <!-- 素材库和日期选择器 -->
    <view class="material-lib-row">
      <view class="lib-title">素材库</view>
      <view class="action-buttons" v-if="!isEditMode">
        <picker mode="date" :value="selectedDate" @change="onDateChange">
          <view class="date-picker">
            <text class="date-icon">📅</text>
            <text class="date-text">{{ selectedDate || '选择时间' }}</text>
          </view>
        </picker>
        <view class="edit-btn" @click="enterEditMode">
          <text class="edit-text">编辑</text>
        </view>
      </view>
      <!-- 编辑模式下的删除按钮 -->
      <view class="edit-actions" v-if="isEditMode">
        <view class="cancel-btn" @click="exitEditMode">
          <text class="cancel-text">取消</text>
        </view>
        <view class="delete-btn" v-if="selectedItems.length > 0" @click="deleteSelected">
          <text class="delete-text">删除({{ selectedItems.length }})</text>
        </view>
      </view>
    </view>

    <!-- 成品库双区域布局 -->
    <view v-if="activeTab === 'finished'" class="finished-content">
      <!-- 已完成区域 -->
      <view class="finished-section">
        <view class="section-header">
          <view class="header-left">
            <text class="section-icon">✅</text>
            <text class="section-title">已完成</text>
          </view>
          <text class="section-count">{{ completedItems.length }}项</text>
        </view>
        <view class="section-grid">
          <view 
            v-for="(item, index) in completedItems" 
            :key="item.id"
            class="finished-item completed-item"
            :class="{'selected': selectedItems.includes(item.id), 'edit-mode': isEditMode}"
            @click="handleItemClick(item.id)"
          >
            <view class="item-content">
              <text class="item-icon">🎨</text>
              <text class="item-title">{{ item.title }}</text>
              <text class="item-status completed-status">{{ item.status }}</text>
            </view>
            <!-- 选中状态指示器 -->
            <view v-if="selectedItems.includes(item.id)" class="select-indicator">
              <view class="edit-icon-wrapper">
                <text class="edit-icon">✎</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 待执行区域 -->
      <view class="finished-section">
        <view class="section-header">
          <view class="header-left">
            <text class="section-icon">⏳</text>
            <text class="section-title">待执行</text>
          </view>
          <text class="section-count">{{ pendingItems.length }}项</text>
        </view>
        <view class="section-grid">
          <view 
            v-for="(item, index) in pendingItems" 
            :key="item.id"
            class="finished-item pending-item"
            :class="{'selected': selectedItems.includes(item.id), 'edit-mode': isEditMode}"
            @click="handleItemClick(item.id)"
          >
            <view class="item-content">
              <text class="item-icon">📋</text>
              <text class="item-title">{{ item.title }}</text>
              <text class="item-status pending-status">{{ item.status }}</text>
            </view>
            <!-- 选中状态指示器 -->
            <view v-if="selectedItems.includes(item.id)" class="select-indicator">
              <view class="edit-icon-wrapper">
                <text class="edit-icon">✎</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 底部渐变遮罩 -->
      <view class="bottom-mask"></view>
    </view>

    <!-- 九宫格素材库（图片和视频） -->
    <view v-else class="material-content">
      <view class="material-grid">
        <view 
          v-for="(item, index) in currentMaterialData" 
          :key="item.id" 
          class="material-item"
          :class="{'selected': selectedItems.includes(item.id), 'edit-mode': isEditMode}"
          @click="handleItemClick(item.id)"
        >
          <!-- 不同类型素材的内容展示 -->
          <view class="material-content-inner">
            <view v-if="activeTab === 'image'" class="image-placeholder">
              <text class="material-type-icon">🖼️</text>
            </view>
            <view v-else-if="activeTab === 'video'" class="video-placeholder">
              <text class="material-type-icon">▶️</text>
            </view>
          </view>
          
          <!-- 选中状态指示器 - 右下角编辑图标 -->
          <view v-if="selectedItems.includes(item.id)" class="select-indicator">
            <view class="edit-icon-wrapper">
              <text class="edit-icon">✎</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部渐变遮罩 -->
      <view class="bottom-mask"></view>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <bottom-tabbar 
      :current-tab="'material'"
      @tab-change="handleTabChange"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'image',
      selectedDate: '',
      selectedItems: [], // 选中的素材项
      isEditMode: false, // 编辑模式状态
      isDestroyed: false, // 组件是否已销毁
      // 不同类型素材的数据
      materialData: {
        image: [], // 图片素材数据
        video: [], // 视频素材数据  
        finished: [] // 成品库数据（包含已完成和待执行）
      }
    }
  },
  mounted() {
    // 检查登录状态
    const token = this.$utils?.user?.getToken ? this.$utils.user.getToken() : uni.getStorageSync('token');
    if (!token) {
      // 未登录，重定向到登录页
      uni.reLaunch({
        url: '/pages/login/index'
      });
      return;
    }
    
    // 初始化一些示例数据
    this.initSampleData();
  },
  beforeDestroy() {
    // 标记组件已销毁，防止异步操作继续执行
    this.isDestroyed = true;
  },
  onUnload() {
    // uni-app 页面卸载时也需要标记
    this.isDestroyed = true;
  },
  computed: {
    // 当前标签页的素材数据
    currentMaterialData() {
      return this.materialData[this.activeTab] || [];
    },
    // 当前标签页的素材数量
    currentMaterialCount() {
      return this.currentMaterialData.length;
    },
    // 已完成的素材
    completedItems() {
      return this.materialData.finished.filter(item => item.category === 'completed');
    },
    // 待执行的素材
    pendingItems() {
      return this.materialData.finished.filter(item => item.category === 'pending');
    },
    // 上传区域的提示文字
    uploadText() {
      switch(this.activeTab) {
        case 'image': return '上传图片';
        case 'video': return '上传视频';  
        case 'finished': return '仅展示'; // 成品库不允许上传
        default: return '点击上传';
      }
    },
    // 上传区域的图标
    uploadIcon() {
      switch(this.activeTab) {
        case 'image': return '📷';
        case 'video': return '🎬';
        case 'finished': return '🎨'; // 成品库图标
        default: return '📷';
      }
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
      // 切换tab时清空选中状态和退出编辑模式
      this.selectedItems = [];
      this.isEditMode = false;
    },
    uploadMaterial() {
      const currentTab = this.activeTab;
      
      // 成品库不允许上传
      if (currentTab === 'finished') {
        uni.showToast({ title: '成品库仅用于展示', icon: 'none' });
        return;
      }
      
      if (currentTab === 'image') {
        // 上传图片
        this.uploadImages();
      } else if (currentTab === 'video') {
        // 上传视频
        this.uploadVideos();
      }
    },
    
    // 上传图片
    uploadImages() {
      uni.chooseImage({
        count: 9, // 最多可以选择9张图片
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          uni.showLoading({ title: '上传中...' });
          
          // 这里可以批量上传图片到服务器
          // 模拟上传过程
          setTimeout(() => {
            // 检查组件是否已销毁
            if (this.isDestroyed) return;
            
            // 将上传的图片添加到数据中
            tempFilePaths.forEach(path => {
              this.materialData.image.push({
                id: Date.now() + Math.random(),
                type: 'image',
                url: path,
                uploadTime: new Date().toLocaleString()
              });
            });
            
            uni.hideLoading();
            uni.showToast({
              title: `成功上传${tempFilePaths.length}张图片`,
              icon: 'success'
            });
          }, 1000);
        },
        fail: () => {
          uni.showToast({ title: '取消上传', icon: 'none' });
        }
      });
    },
    
    // 上传视频
    uploadVideos() {
      // 提示用户可以多次选择视频
      uni.showModal({
        title: '上传视频',
        content: '可以逐个选择多个视频进行上传',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.selectSingleVideo();
          }
        }
      });
    },
    
    // 选择单个视频（可以多次调用来上传多个视频）
    selectSingleVideo() {
      uni.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60, // 最长60秒
        camera: 'back',
        success: (res) => {
          uni.showLoading({ title: '上传中...' });
          
          // 模拟上传过程
          setTimeout(() => {
            // 检查组件是否已销毁
            if (this.isDestroyed) return;
            
            this.materialData.video.push({
              id: Date.now(),
              type: 'video',
              url: res.tempFilePath,
              duration: res.duration,
              uploadTime: new Date().toLocaleString()
            });
            
            uni.hideLoading();
            uni.showToast({
              title: '视频上传成功',
              icon: 'success'
            });
            
            // 询问是否继续上传更多视频
            uni.showModal({
              title: '继续上传',
              content: '是否继续上传更多视频？',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  this.selectSingleVideo();
                }
              }
            });
          }, 1500);
        },
        fail: () => {
          uni.showToast({ title: '取消上传', icon: 'none' });
        }
      });
    },
    
    onDateChange(e) {
      this.selectedDate = e.detail.value;
    },
    // 进入编辑模式
    enterEditMode() {
      this.isEditMode = true;
      this.selectedItems = []; // 清空之前的选中状态
    },
    // 退出编辑模式
    exitEditMode() {
      this.isEditMode = false;
      this.selectedItems = []; // 清空选中状态
    },
    // 处理图片点击事件
    handleItemClick(itemId) {
      // 只有在编辑模式下才能选择图片
      if (this.isEditMode) {
        this.toggleSelectItem(itemId);
      }
    },
    toggleSelectItem(itemId) {
      const itemIndex = this.selectedItems.indexOf(itemId);
      if (itemIndex > -1) {
        // 如果已选中，则取消选中
        this.selectedItems.splice(itemIndex, 1);
      } else {
        // 如果未选中，则添加到选中列表
        this.selectedItems.push(itemId);
      }
    },
    deleteSelected() {
      if (this.selectedItems.length === 0) return;
      
      uni.showModal({
        title: '确认删除',
        content: `确定要删除选中的 ${this.selectedItems.length} 个素材吗？`,
        success: (res) => {
          if (res.confirm) {
            // 从当前数据中删除选中的素材
            this.selectedItems.forEach(itemId => {
              const index = this.materialData[this.activeTab].findIndex(item => item.id === itemId);
              if (index > -1) {
                this.materialData[this.activeTab].splice(index, 1);
              }
            });
            
            uni.showToast({
              title: `已删除 ${this.selectedItems.length} 个素材`,
              icon: 'success'
            });
            this.selectedItems = [];
            // 删除完成后退出编辑模式
            this.exitEditMode();
          }
        }
      });
    },
    
    // 初始化示例数据
    initSampleData() {
      // 图片素材示例数据
      for(let i = 1; i <= 8; i++) {
        this.materialData.image.push({
          id: i,
          type: 'image',
          url: '',
          uploadTime: '2024-08-12'
        });
      }
      
      // 视频素材示例数据  
      for(let i = 1; i <= 5; i++) {
        this.materialData.video.push({
          id: i,
          type: 'video',
          url: '',
          duration: 30,
          uploadTime: '2024-08-12'
        });
      }
      
      // 成品库示例数据（包含已完成和待执行）
      // 已完成素材
      for(let i = 1; i <= 8; i++) {
        this.materialData.finished.push({
          id: `completed_${i}`,
          type: 'finished',
          title: `营销方案_${i}`,
          category: 'completed', // 用category区分已完成和待执行
          status: '已完成',
          createTime: '2024-12-06',
          completedDate: '2024-12-05'
        });
      }
      
      // 待执行素材
      for(let i = 1; i <= 6; i++) {
        this.materialData.finished.push({
          id: `pending_${i}`,
          type: 'finished',
          title: `营销任务_${i}`,
          category: 'pending', // 用category区分已完成和待执行
          status: i % 2 === 0 ? '待审核' : '进行中',
          createTime: '2024-12-06',
          deadline: '2024-12-15'
        });
      }
    },

    
    // 底部导航切换处理(由 bottom-tabbar 组件处理跳转)
    handleTabChange(tabKey) {
      // 跳转逻辑已在 bottom-tabbar 组件中处理,这里只需要接收事件
      console.log('切换到:', tabKey);
    }
  }
}
</script>

<style lang="less" scoped>
/* 应用容器 */
.app-container {
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 主要内容区 */
.app-content {
  flex: 1;
  overflow: hidden; /* 禁止整体滚动 */
  padding-top: 215rpx; /* 状态栏60rpx + 导航栏88rpx + 间距67rpx */
  padding-bottom: 140rpx; /* 底部导航栏120rpx + 间距20rpx */
  height: calc(100vh - 355rpx);
}

/* 全局隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 页面整体 */
.material-page {
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 60%);
  height: 100%;
  padding: 32rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 顶部tab栏 */
  .material-tabs {
    display: flex;
    align-items: flex-end;
    margin-bottom: 32rpx;
    width: 100%;

    .tab-item {
      flex: 1; /* 平分宽度 */
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
      position: relative;
      padding-bottom: 8rpx;
      text-align: center; /* 文字居中 */

      &.active {
        color: #5dade2;
      }

      .tab-underline {
        position: absolute;
        left: 50%;
        bottom: -8rpx;
        width: 60rpx;
        height: 6rpx;
        background: #5dade2;
        border-radius: 3rpx;
        transform: translateX(-50%); /* 居中对齐 */
      }

      .tab-text {
        font-size: 32rpx;
      }
    }
  }

  /* 添加区 */
  .add-section {
    display: flex;
    align-items: center;
    gap: 32rpx;
    margin-bottom: 32rpx;

    .add-title {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
    }

    .add-upload {
      width: 160rpx;
      height: 160rpx;
      border: 2rpx dashed #5dade2;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      background: #fff;

      .upload-icon {
        font-size: 48rpx;
        color: #5dade2;
      }

      .upload-text {
        font-size: 28rpx;
        color: #5dade2;
      }
    }
  }

    /* 成品库说明区 */
  .finished-info-section {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 32rpx;
    padding: 32rpx;
    background: #f0f8ff;
    border-radius: 24rpx;
    border-left: 6rpx solid #5dade2;

    .finished-title {
      font-size: 36rpx;
      color: #296FB7;
      font-weight: 600;
    }

    .finished-desc {
      font-size: 28rpx;
      color: #666;
      opacity: 0.8;
    }
  }

  /* 素材库和日期选择器 */
  .material-lib-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .lib-title {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 16rpx;
    }

    .date-picker {
      display: flex;
      align-items: center;
      gap: 8rpx;
      background: #fff;
      border: 2rpx solid #5dade2;
      border-radius: 16rpx;
      padding: 8rpx 24rpx;

      .date-icon {
        font-size: 28rpx;
        color: #5dade2;
      }

      .date-text {
        font-size: 28rpx;
        color: #333;
      }
    }

    .edit-btn {
      background: #5dade2;
      border-radius: 16rpx;
      padding: 8rpx 24rpx;

      .edit-text {
        font-size: 28rpx;
        color: #fff;
      }
    }

    .edit-actions {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .cancel-btn {
        background: #fff;
        border: 2rpx solid #5dade2;
        border-radius: 16rpx;
        padding: 8rpx 24rpx;

        .cancel-text {
          font-size: 28rpx;
          color: #5dade2;
        }
      }

      .delete-btn {
        background: #ff4757;
        border-radius: 16rpx;
        padding: 8rpx 24rpx;

        .delete-text {
          font-size: 28rpx;
          color: #fff;
        }
      }
    }
  }

  /* 内容区滚动容器 */
  .material-content {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 和 Edge */
    -webkit-overflow-scrolling: touch; /* iOS 流畅滚动 */
    padding: 0 4rpx; /* 添加左右内边距防止边框被裁切 */
    /* 确保占用剩余空间 */
    min-height: 0; /* 允许 flex 子元素收缩 */
    
    /* 九宫格素材库 */
    .material-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40rpx; /* 增加间距以确保边框完全显示 */
      padding: 8rpx; /* 添加内边距防止边框被裁切 */
      padding-bottom: 80rpx; /* 增加底部内边距 */

      .material-item {
        width: 100%;
        height: 180rpx;
        background: #fff;
        border-radius: 24rpx;
        position: relative;
        transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
        border: 3rpx solid transparent;
        overflow: hidden;
        box-sizing: border-box; /* 确保边框包含在尺寸内 */

        /* 素材内容区域 */
        .material-content-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 20rpx;
          overflow: hidden;

          .image-placeholder, .video-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f8ff;
          }

          .file-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f0f8ff;
            padding: 16rpx;

            .file-name {
              font-size: 20rpx;
              color: #666;
              text-align: center;
              margin-top: 8rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
            }
          }

          .completed-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f0f9ff;
            padding: 16rpx;

            .completed-name {
              font-size: 20rpx;
              color: #065f46;
              text-align: center;
              margin-top: 8rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              font-weight: 500;
            }

            .completed-status {
              font-size: 18rpx;
              color: #059669;
              text-align: center;
              margin-top: 4rpx;
              background: #d1fae5;
              padding: 2rpx 8rpx;
              border-radius: 8rpx;
            }
          }

          .pending-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fef3c7;
            padding: 16rpx;

            .pending-name {
              font-size: 20rpx;
              color: #92400e;
              text-align: center;
              margin-top: 8rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              font-weight: 500;
            }

            .pending-status {
              font-size: 18rpx;
              color: #d97706;
              text-align: center;
              margin-top: 4rpx;
              background: #fed7aa;
              padding: 2rpx 8rpx;
              border-radius: 8rpx;
            }
          }

          .material-type-icon {
            font-size: 48rpx;
            color: #5dade2;
            opacity: 0.7;
          }
        }

        /* 非编辑模式下的样式 */
        &:not(.edit-mode) {
          opacity: 1;
        }

        /* 编辑模式下的视觉提示 */
        &.edit-mode {
          cursor: pointer;
          
          &:not(.selected) {
            border: 3rpx solid rgba(255, 125, 0, 0.3);
            background: #fff;
            z-index: 1; /* 确保在正确层级 */
            
            &:hover {
              border-color: rgba(255, 125, 0, 0.5);
              background: #fff;
              transform: translateY(-1rpx);
              box-shadow: 0 2rpx 8rpx rgba(255, 125, 0, 0.15);
              z-index: 2; /* 悬停时提升层级 */
            }
            
            /* 添加一个微弱的脉冲效果提示可选择 */
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 40rpx;
              height: 40rpx;
              border: 2rpx solid rgba(255, 125, 0, 0.3);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              opacity: 0;
              animation: gentlePulse 3s infinite;
            }
          }
        }

        /* 选中状态样式 */
        &.selected {
          border: 3rpx solid #5dade2;
          background: #fff;
          box-shadow: 0 6rpx 20rpx rgba(93, 173, 226, 0.15);
          transform: scale(1.01); /* 减小缩放以避免边框被裁切 */
          z-index: 2; /* 确保选中项在上层 */
          
          /* 选中状态的内部光晕效果 */
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 125, 0, 0.05) 0%, rgba(255, 125, 0, 0.02) 100%);
            border-radius: 20rpx;
            pointer-events: none;
          }
        }

        .select-indicator {
          position: absolute;
          bottom: 8rpx;
          right: 8rpx;
          width: 36rpx;
          height: 36rpx;
          background: #5dade2;
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3rpx 10rpx rgba(255, 125, 0, 0.4);
          z-index: 5;
          animation: bounceIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

          .edit-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }

          .edit-icon {
            font-size: 20rpx;
            color: #fff;
            font-weight: bold;
            line-height: 1;
          }
        }

        /* 点击反馈 */
        &:active {
          transform: scale(0.98);
        }
      }
    }

    /* 底部渐变遮罩 */
    .bottom-mask {
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60rpx;
      background: linear-gradient(to top, #f0f8ff 0%, rgba(240, 248, 255, 0) 100%);
      pointer-events: none;
      z-index: 10;
    }

    /* WebKit滚动条隐藏 */
    &::-webkit-scrollbar {
      display: none;
      width: 0;
    }
  }
}

/* 动画关键帧 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 125, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10rpx rgba(255, 125, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 125, 0, 0);
  }
}

@keyframes gentlePulse {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.4);
  }
}

/* 成品库双区域布局样式 */
.finished-content {
  flex: 1;
  padding: 0 32rpx 120rpx 32rpx;
  overflow-y: auto;
}

.finished-section {
  margin-bottom: 40rpx;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 2rpx solid #f0f0f0;
    margin-bottom: 24rpx;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12rpx;
    }
    
    .section-icon {
      font-size: 32rpx;
    }
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    
    .section-count {
      font-size: 24rpx;
      color: #666;
      background: #f5f5f5;
      padding: 8rpx 16rpx;
      border-radius: 16rpx;
    }
  }
  
  .section-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
  }
}

.finished-item {
  position: relative;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  
  &.completed-item {
    border-left: 6rpx solid #10b981;
    
    .item-content {
      .item-status {
        background: #d1fae5;
        color: #065f46;
      }
    }
  }
  
  &.pending-item {
    border-left: 6rpx solid #f59e0b;
    
    .item-content {
      .item-status {
        background: #fed7aa;
        color: #92400e;
      }
    }
  }
  
  &.selected {
    border-color: #ff7d00;
    background: linear-gradient(135deg, #fff 0%, #fff8f1 100%);
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 24rpx rgba(255, 125, 0, 0.15);
    
    .select-indicator {
      opacity: 1;
    }
  }
  
  &.edit-mode:not(.selected) {
    border-color: rgba(255, 125, 0, 0.3);
    cursor: pointer;
    
    &:active {
      transform: translateY(1rpx);
    }
  }
  
  .item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12rpx;
    
    .item-icon {
      font-size: 48rpx;
    }
    
    .item-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
    
    .item-status {
      font-size: 24rpx;
      padding: 6rpx 12rpx;
      border-radius: 12rpx;
      font-weight: 500;
      
      &.completed-status {
        background: #d1fae5;
        color: #065f46;
      }
      
      &.pending-status {
        background: #fed7aa;
        color: #92400e;
      }
    }
  }
  
  .select-indicator {
    position: absolute;
    bottom: 8rpx;
    right: 8rpx;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .edit-icon-wrapper {
      background: #ff7d00;
      border-radius: 50%;
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2rpx 8rpx rgba(255, 125, 0, 0.3);
      
      .edit-icon {
        font-size: 24rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

</style>

<!-- 非scoped样式，用于全局隐藏滚动条 -->
<style>
/* 页面级滚动条隐藏 */
.material-content::-webkit-scrollbar {
  display: none;
  width: 0;
}

/* 兼容性设置 */
.material-content {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
</style>
