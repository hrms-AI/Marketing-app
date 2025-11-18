<template>
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
      <view class="tab-item" :class="{'active': activeTab === 'income'}" @click="switchTab('income')">
        <text class="tab-text">收益素材</text>
        <view v-if="activeTab === 'income'" class="tab-underline"></view>
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
      <view class="finished-desc">展示所有已完成的营销素材作品</view>
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

    <!-- 九宫格素材库 -->
    <view 
      class="material-content"
      :style="'height: ' + scrollHeight + 'px;'"
    >
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
            <view v-else-if="activeTab === 'income'" class="file-placeholder">
              <text class="material-type-icon">📊</text>
              <text class="file-name">{{ item.name }}</text>
            </view>
            <view v-else-if="activeTab === 'finished'" class="finished-placeholder">
              <text class="material-type-icon">🎨</text>
              <text class="finished-name">{{ item.title }}</text>
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
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'image',
      selectedDate: '',
      scrollHeight: 0,
      selectedItems: [], // 选中的素材项
      isEditMode: false, // 编辑模式状态
      // 不同类型素材的数据
      materialData: {
        image: [], // 图片素材数据
        video: [], // 视频素材数据  
        income: [], // 收益素材数据
        finished: [] // 成品库数据
      }
    }
  },
  mounted() {
    this.calculateScrollHeight();
    // 初始化一些示例数据
    this.initSampleData();
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
    // 上传区域的提示文字
    uploadText() {
      switch(this.activeTab) {
        case 'image': return '上传图片';
        case 'video': return '上传视频';  
        case 'income': return '上传文件';
        case 'finished': return '仅展示'; // 成品库不允许上传
        default: return '点击上传';
      }
    },
    // 上传区域的图标
    uploadIcon() {
      switch(this.activeTab) {
        case 'image': return '📷';
        case 'video': return '🎬';
        case 'income': return '📄';
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
      } else if (currentTab === 'income') {
        // 上传文件
        this.uploadFiles();
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
    
    // 上传文件
    uploadFiles() {
      // 使用选择文档的方式，支持多种文件类型
      uni.chooseFile({
        count: 10,
        extension: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar'],
        success: (res) => {
          uni.showLoading({ title: '上传中...' });
          setTimeout(() => {
            res.tempFiles.forEach(file => {
              this.materialData.income.push({
                id: Date.now() + Math.random(),
                type: 'file',
                name: file.name,
                size: file.size,
                path: file.path,
                uploadTime: new Date().toLocaleString()
              });
            });
            
            uni.hideLoading();
            uni.showToast({
              title: `成功上传${res.tempFiles.length}个文件`,
              icon: 'success'
            });
          }, 1000);
        },
        fail: (error) => {
          console.log('文件选择失败:', error);
          // 如果chooseFile不可用，尝试使用其他方式
          this.uploadFilesAlternative();
        }
      });
    },
    
    // 备用文件上传方案
    uploadFilesAlternative() {
      // 显示文件类型选择
      uni.showActionSheet({
        itemList: ['选择图片', '选择视频', '选择文档（通过分享）'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 选择图片作为文件
            uni.chooseImage({
              count: 9,
              success: (imgRes) => {
                uni.showLoading({ title: '上传中...' });
                setTimeout(() => {
                  imgRes.tempFilePaths.forEach((path, index) => {
                    this.materialData.income.push({
                      id: Date.now() + Math.random() + index,
                      type: 'file',
                      name: `图片文件_${Date.now()}.jpg`,
                      size: 0,
                      path: path,
                      uploadTime: new Date().toLocaleString()
                    });
                  });
                  uni.hideLoading();
                  uni.showToast({
                    title: `成功上传${imgRes.tempFilePaths.length}个文件`,
                    icon: 'success'
                  });
                }, 1000);
              }
            });
          } else if (res.tapIndex === 1) {
            // 选择视频作为文件
            uni.chooseVideo({
              success: (videoRes) => {
                uni.showLoading({ title: '上传中...' });
                setTimeout(() => {
                  this.materialData.income.push({
                    id: Date.now(),
                    type: 'file',
                    name: `视频文件_${Date.now()}.mp4`,
                    size: videoRes.size || 0,
                    path: videoRes.tempFilePath,
                    uploadTime: new Date().toLocaleString()
                  });
                  uni.hideLoading();
                  uni.showToast({
                    title: '成功上传1个文件',
                    icon: 'success'
                  });
                }, 1000);
              }
            });
          } else if (res.tapIndex === 2) {
            // 提示用户通过其他方式分享文档
            uni.showModal({
              title: '文档上传提示',
              content: '由于平台限制，请通过以下方式上传文档：\n1. 从其他应用分享到本应用\n2. 或先保存到相册再选择\n\n当前演示添加示例文件。',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // 添加示例文档
                  this.addSampleDocuments();
                }
              }
            });
          }
        },
        fail: () => {
          uni.showToast({ title: '取消上传', icon: 'none' });
        }
      });
    },
    
    // 添加示例文档
    addSampleDocuments() {
      const sampleDocs = [
        { name: '营销方案.pdf', type: 'pdf' },
        { name: '数据报告.xlsx', type: 'excel' },
        { name: '产品介绍.docx', type: 'word' }
      ];
      
      uni.showLoading({ title: '添加文件中...' });
      setTimeout(() => {
        sampleDocs.forEach((doc, index) => {
          this.materialData.income.push({
            id: Date.now() + index,
            type: 'file',
            name: doc.name,
            size: Math.floor(Math.random() * 1000000) + 100000, // 随机文件大小
            path: '',
            uploadTime: new Date().toLocaleString()
          });
        });
        uni.hideLoading();
        uni.showToast({
          title: `成功添加${sampleDocs.length}个文件`,
          icon: 'success'
        });
      }, 1000);
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
      
      // 收益素材示例数据
      for(let i = 1; i <= 6; i++) {
        this.materialData.income.push({
          id: i,
          type: 'file',
          name: `收益报告_${i}.pdf`,
          size: 1024000,
          uploadTime: '2024-08-12'
        });
      }
      
      // 成品库示例数据
      for(let i = 1; i <= 12; i++) {
        this.materialData.finished.push({
          id: i,
          type: 'finished',
          title: `营销方案_${i}`,
          category: i % 2 === 0 ? '图文方案' : '视频方案',
          status: '已完成',
          createTime: '2024-08-12'
        });
      }
    },
    calculateScrollHeight() {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync();
      const windowHeight = systemInfo.windowHeight;
      
      // 计算其他元素占用的高度（单位：px）
      // tabs: 约70px, add-section: 约200px, material-lib-row: 约70px, padding等: 约100px
      const otherHeight = 340;
      
      // 计算scroll-view的高度
      this.scrollHeight = windowHeight - otherHeight;
    }
  }
}
</script>

<style lang="less" scoped>
/* 全局隐藏所有滚动条 */
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* 页面整体 */
.material-page {
  background: #fff8f2;
  height: 100vh;
  padding: 32rpx;
  padding-bottom: 100rpx; /* 调整底部间距 */
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
        color: #ff7d00;
      }

      .tab-underline {
        position: absolute;
        left: 50%;
        bottom: -8rpx;
        width: 60rpx;
        height: 6rpx;
        background: #ff7d00;
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
      border: 2rpx dashed #ff7d00;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      background: #fff;

      .upload-icon {
        font-size: 48rpx;
        color: #ff7d00;
      }

      .upload-text {
        font-size: 28rpx;
        color: #ff7d00;
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
    background: #ffeee6;
    border-radius: 24rpx;
    border-left: 6rpx solid #ff7d00;

    .finished-title {
      font-size: 36rpx;
      color: #bf6a00;
      font-weight: 600;
    }

    .finished-desc {
      font-size: 28rpx;
      color: #bf6a00;
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
      border: 2rpx solid #ff7d00;
      border-radius: 16rpx;
      padding: 8rpx 24rpx;

      .date-icon {
        font-size: 28rpx;
        color: #ff7d00;
      }

      .date-text {
        font-size: 28rpx;
        color: #bf6a00;
      }
    }

    .edit-btn {
      background: #ff7d00;
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
        border: 2rpx solid #ff7d00;
        border-radius: 16rpx;
        padding: 8rpx 24rpx;

        .cancel-text {
          font-size: 28rpx;
          color: #bf6a00;
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
    scrollbar-width: none !important; /* Firefox */
    -ms-overflow-style: none !important; /* IE 和 Edge */
    -webkit-overflow-scrolling: touch; /* iOS 流畅滚动 */
    padding: 0 4rpx; /* 添加左右内边距防止边框被裁切 */
    
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
            background: #ffeee6;
          }

          .file-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #ffeee6;
            padding: 16rpx;

            .file-name {
              font-size: 20rpx;
              color: #bf6a00;
              text-align: center;
              margin-top: 8rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
            }
          }

          .finished-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #ffeee6;
            padding: 16rpx;

            .finished-name {
              font-size: 20rpx;
              color: #8b5a00;
              text-align: center;
              margin-top: 8rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
              font-weight: 500;
            }
          }

          .material-type-icon {
            font-size: 48rpx;
            color: #ff7d00;
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
          border: 3rpx solid #ff7d00;
          background: #fff;
          box-shadow: 0 6rpx 20rpx rgba(255, 125, 0, 0.15);
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
          background: #ff7d00;
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
      background: linear-gradient(to top, #fff8f2 0%, rgba(255, 248, 242, 0) 100%);
      pointer-events: none;
      z-index: 10;
    }

    /* 彻底隐藏WebKit滚动条 */
    &::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    
    &::-webkit-scrollbar-track {
      display: none !important;
    }
    
    &::-webkit-scrollbar-thumb {
      display: none !important;
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

</style>

<!-- 非scoped样式，用于全局隐藏滚动条 -->
<style>
/* 强制隐藏所有滚动条，包括滚动时的临时显示 */
scroll-view::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

/* 全局隐藏所有滚动条 */
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

*::-webkit-scrollbar-track {
  display: none !important;
}

*::-webkit-scrollbar-thumb {
  display: none !important;
}
</style>
