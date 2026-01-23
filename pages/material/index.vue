<template>
  <view class="material-page">
    <!-- 状态栏 -->
    <status-bar />

    <!-- 顶部导航栏 -->
    <top-navbar
      title="营销素材"
      :show-back="false"
      :show-logo="false"
    />

    <!-- 主要内容区 -->
    <view class="material-content">
      <!-- 大类切换：素材/成品 -->
      <view class="main-category-tabs">
        <view
          class="main-category-tab"
          :class="{ active: currentCategory === 'material' }"
          @click="switchCategory('material')"
        >
          <text class="main-category-text">素材库</text>
        </view>
        <view
          class="main-category-tab"
          :class="{ active: currentCategory === 'product' }"
          @click="switchCategory('product')"
        >
          <text class="main-category-text">成品库</text>
        </view>
      </view>

      <!-- 素材分类（只在素材库显示） -->
      <view class="category-tabs" v-if="currentCategory === 'material'">
        <view
          class="category-tab"
          :class="{ active: currentType === 'image' }"
          @click="switchType('image')"
        >
          <text class="category-text">图片素材</text>
        </view>
        <view
          class="category-tab"
          :class="{ active: currentType === 'video' }"
          @click="switchType('video')"
        >
          <text class="category-text">视频素材</text>
        </view>
        <view
          class="category-tab"
          :class="{ active: currentType === 'text' }"
          @click="switchType('text')"
        >
          <text class="category-text">文案模板</text>
        </view>
      </view>

      <!-- 成品分类（只在成品库显示） -->
      <view class="category-tabs" v-if="currentCategory === 'product'">
        <view
          class="category-tab"
          :class="{ active: currentType === 'poster' }"
          @click="switchType('poster')"
        >
          <text class="category-text">宣传海报</text>
        </view>
        <view
          class="category-tab"
          :class="{ active: currentType === 'video_ad' }"
          @click="switchType('video_ad')"
        >
          <text class="category-text">视频广告</text>
        </view>
        <view
          class="category-tab"
          :class="{ active: currentType === 'h5' }"
          @click="switchType('h5')"
        >
          <text class="category-text">H5页面</text>
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-box">
        <view class="search-input-wrapper">
          <text class="search-icon">🔍</text>
          <input
            class="search-input"
            type="text"
            :value="searchKeyword"
            @input="onSearchInput"
            placeholder="搜索素材名称或标签"
            placeholder-style="color: #999;"
          />
          <text
            v-if="searchKeyword"
            class="clear-icon"
            @click="clearSearch"
          >✕</text>
        </view>
      </view>

      <!-- 素材列表 -->
      <view class="material-grid" v-if="!loading && materialList.length > 0">
        <view class="material-item" v-for="item in materialList" :key="item.id" @click="previewMaterial(item)">
          <!-- 素材库：图片素材 -->
          <image v-if="currentCategory === 'material' && currentType === 'image'" class="material-image" :src="item.url" mode="aspectFill" />

          <!-- 素材库：视频素材 -->
          <view v-else-if="currentCategory === 'material' && currentType === 'video'" class="video-wrapper">
            <image class="material-image" :src="item.cover || item.url" mode="aspectFill" />
            <view class="video-icon">
              <text class="play-icon">▶</text>
            </view>
          </view>

          <!-- 素材库：文案素材 -->
          <view v-else-if="currentCategory === 'material' && currentType === 'text'" class="text-content">
            <text class="text-preview">{{ item.name }}</text>
          </view>

          <!-- 成品库：海报 -->
          <image v-else-if="currentCategory === 'product' && currentType === 'poster'" class="material-image" :src="item.url" mode="aspectFill" />

          <!-- 成品库：视频广告 -->
          <view v-else-if="currentCategory === 'product' && currentType === 'video_ad'" class="video-wrapper">
            <image class="material-image" :src="item.cover || item.url" mode="aspectFill" />
            <view class="video-icon">
              <text class="play-icon">▶</text>
            </view>
          </view>

          <!-- 成品库：H5页面 -->
          <view v-else-if="currentCategory === 'product' && currentType === 'h5'" class="h5-content">
            <image class="material-image" :src="item.cover || item.url" mode="aspectFill" />
            <view class="h5-badge">
              <text class="badge-text">H5</text>
            </view>
          </view>

          <!-- 素材信息 -->
          <view class="material-info">
            <text class="material-name">{{ item.name }}</text>
            <view class="material-tags" v-if="item.tags && item.tags.length">
              <text class="tag" v-for="(tag, idx) in item.tags.slice(0, 2)" :key="idx">{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载中 -->
      <view class="loading-container" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view class="empty-container" v-if="!loading && materialList.length === 0">
        <text class="empty-text">暂无{{ typeNames[currentType] }}</text>
      </view>
    </view>

    <!-- 素材详情弹窗 -->
    <uv-popup
      v-model="detailVisible"
      mode="center"
      :round="20"
      :close-on-click-overlay="true"
      :custom-style="{ width: '650rpx', maxHeight: '80vh' }"
    >
      <view class="material-detail-popup" v-if="currentMaterial">
        <!-- 关闭按钮 -->
        <view class="detail-close" @click="closeDetail">
          <text class="close-icon">✕</text>
        </view>

        <!-- 素材内容 -->
        <scroll-view class="detail-content" scroll-y>
          <!-- 图片/封面 -->
          <image
            v-if="currentMaterial.type === 'image' || currentMaterial.type === 'poster'"
            class="detail-image"
            :src="currentMaterial.url"
            mode="widthFix"
          />
          <image
            v-else-if="currentMaterial.type === 'video' || currentMaterial.type === 'video_ad' || currentMaterial.type === 'h5'"
            class="detail-image"
            :src="currentMaterial.cover || currentMaterial.url"
            mode="widthFix"
          />

          <!-- 文案内容 -->
          <view v-else-if="currentMaterial.type === 'text'" class="detail-text-content">
            <text class="text-content-full">{{ currentMaterial.content || currentMaterial.name }}</text>
          </view>

          <!-- 素材信息 -->
          <view class="detail-info">
            <view class="detail-title">{{ currentMaterial.name }}</view>

            <!-- 标签 -->
            <view class="detail-tags" v-if="currentMaterial.tags && currentMaterial.tags.length">
              <text class="detail-tag" v-for="(tag, idx) in currentMaterial.tags" :key="idx">{{ tag }}</text>
            </view>

            <!-- 详细信息 -->
            <view class="detail-meta">
              <view class="meta-item" v-if="currentMaterial.size">
                <text class="meta-label">大小：</text>
                <text class="meta-value">{{ formatFileSize(currentMaterial.size) }}</text>
              </view>
              <view class="meta-item" v-if="currentMaterial.width && currentMaterial.height">
                <text class="meta-label">尺寸：</text>
                <text class="meta-value">{{ currentMaterial.width }} × {{ currentMaterial.height }}</text>
              </view>
              <view class="meta-item" v-if="currentMaterial.duration">
                <text class="meta-label">时长：</text>
                <text class="meta-value">{{ formatDuration(currentMaterial.duration) }}</text>
              </view>
              <view class="meta-item">
                <text class="meta-label">类型：</text>
                <text class="meta-value">{{ getTypeName(currentMaterial.type) }}</text>
              </view>
              <view class="meta-item" v-if="currentMaterial.created_at">
                <text class="meta-label">创建时间：</text>
                <text class="meta-value">{{ formatDate(currentMaterial.created_at) }}</text>
              </view>
            </view>

            <!-- 描述 -->
            <view class="detail-description" v-if="currentMaterial.description">
              <text class="description-label">描述</text>
              <text class="description-text">{{ currentMaterial.description }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 操作按钮 -->
        <view class="detail-actions">
          <button class="action-btn primary-btn" @click="handleDownload">下载</button>
          <button class="action-btn secondary-btn" @click="handleShare">分享</button>
        </view>
      </view>
    </uv-popup>

    <!-- 底部Tab栏 -->
    <bottom-tabbar currentTab="material" />
  </view>
</template>

<script>
import hotelManager from '@/mixins/hotel-manager'

export default {
  mixins: [hotelManager],

  data() {
    return {
      currentCategory: 'material', // 当前大类：material-素材库, product-成品库
      currentType: 'image', // 当前选中的类型
      materialList: [], // 素材列表
      loading: false, // 加载状态
      searchKeyword: '', // 搜索关键词
      typeNames: {
        // 素材库类型
        image: '图片素材',
        video: '视频素材',
        text: '文案模板',
        // 成品库类型
        poster: '宣传海报',
        video_ad: '视频广告',
        h5: 'H5页面'
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      // 详情弹窗相关
      detailVisible: false,
      currentMaterial: null
    }
  },

  computed: {
    // 获取当前酒店信息
    currentHotel() {
      return {
        id: this.selectedHotelId,
        name: this.selectedHotelName
      }
    }
  },

  onLoad() {
    // 先初始化全局酒店数据到组件
    this.initGlobalHotelData()

    // 检查是否有选中的酒店
    if (this.selectedHotelId) {
      this.loadMaterialList()
    } else {
      // 如果没有选中的酒店，先加载酒店列表
      this.loadHotelInfo().then(() => {
        this.loadMaterialList()
      })
    }
  },

  methods: {
    // 切换大类（素材库/成品库）
    switchCategory(category) {
      if (this.currentCategory === category) return

      this.currentCategory = category
      // 切换大类时，重置为该大类的第一个类型
      if (category === 'material') {
        this.currentType = 'image'
      } else if (category === 'product') {
        this.currentType = 'poster'
      }
      this.pagination.page = 1
      this.materialList = []
      this.loadMaterialList()
    },

    // 切换素材类型
    switchType(type) {
      if (this.currentType === type) return

      this.currentType = type
      this.pagination.page = 1
      this.materialList = []
      this.loadMaterialList()
    },

    // 加载素材列表
    async loadMaterialList() {
      if (!this.selectedHotelId) {
        console.warn('未选中酒店，跳过加载素材列表')
        return
      }

      this.loading = true

      try {
        const { userApi } = require('@/utils/api')
        const res = await userApi.getMaterialList({
          page: this.pagination.page,
          limit: this.pagination.limit,
          hotel_id: String(this.selectedHotelId), // 确保是字符串类型
          type: this.currentType,
          keyword: this.searchKeyword || undefined // 传递搜索关键词
        })

        if (res.code === 0) {
          this.materialList = res.data.items || []
          this.pagination.total = res.data.total || 0
        } else {
          uni.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载素材列表失败:', error)
        // API调用失败，使用mock数据
        this.loadMockMaterialList()
      } finally {
        this.loading = false
      }
    },

    // 搜索素材
    handleSearch(keyword) {
      this.searchKeyword = keyword
      this.pagination.page = 1
      this.materialList = []
      this.loadMaterialList()
    },

    // 搜索输入事件
    onSearchInput(e) {
      this.searchKeyword = e.detail.value
    },

    // 清除搜索
    clearSearch() {
      this.searchKeyword = ''
      this.pagination.page = 1
      this.materialList = []
      this.loadMaterialList()
    },

    // 加载mock素材数据
    loadMockMaterialList() {
      console.log('使用mock素材数据 - 当前分类:', this.currentCategory, this.currentType)

      const mockData = {
        // 素材库数据
        image: [
          {
            id: 1,
            hotel_id: this.selectedHotelId,
            type: 'image',
            name: '酒店大堂图片',
            url: 'https://picsum.photos/400/300?random=1',
            size: 102400,
            width: 1920,
            height: 1080,
            is_public: 1,
            tags: ['大堂', '豪华']
          },
          {
            id: 2,
            hotel_id: this.selectedHotelId,
            type: 'image',
            name: '客房展示',
            url: 'https://picsum.photos/400/300?random=2',
            size: 98000,
            width: 1920,
            height: 1080,
            is_public: 1,
            tags: ['客房', '舒适']
          },
          {
            id: 3,
            hotel_id: this.selectedHotelId,
            type: 'image',
            name: '餐厅美食',
            url: 'https://picsum.photos/400/300?random=3',
            size: 115000,
            width: 1920,
            height: 1080,
            is_public: 1,
            tags: ['餐厅', '美食']
          },
          {
            id: 4,
            hotel_id: this.selectedHotelId,
            type: 'image',
            name: '会议室',
            url: 'https://picsum.photos/400/300?random=4',
            size: 89000,
            width: 1920,
            height: 1080,
            is_public: 1,
            tags: ['会议', '商务']
          }
        ],
        video: [
          {
            id: 5,
            hotel_id: this.selectedHotelId,
            type: 'video',
            name: '酒店宣传片',
            url: 'https://example.com/video.mp4',
            cover: 'https://picsum.photos/400/300?random=5',
            size: 5120000,
            duration: 120,
            is_public: 1,
            tags: ['宣传', '介绍']
          },
          {
            id: 6,
            hotel_id: this.selectedHotelId,
            type: 'video',
            name: '客房导览',
            url: 'https://example.com/room-tour.mp4',
            cover: 'https://picsum.photos/400/300?random=6',
            size: 3800000,
            duration: 90,
            is_public: 1,
            tags: ['客房', '导览']
          }
        ],
        text: [
          {
            id: 7,
            hotel_id: this.selectedHotelId,
            type: 'text',
            name: '春节促销文案',
            content: '🎊 新春特惠！豪华客房限时5折起，含双人早餐！\n\n🏨 尊享豪华体验，感受星级服务\n📍 市中心便利位置，出行无忧\n\n⏰ 活动时间：即日起至2月15日\n📞 预订热线：400-xxx-xxxx',
            url: '',
            is_public: 1,
            tags: ['促销', '春节']
          },
          {
            id: 8,
            hotel_id: this.selectedHotelId,
            type: 'text',
            name: '周末套餐文案',
            content: '💝 周末放松套餐\n\n🏨 豪华大床房一晚\n🍳 双人自助早餐\n🏊 室内泳池使用权\n💆 赠送按摩服务一次\n\n💰 特价：￥688/晚\n（原价￥1288）',
            url: '',
            is_public: 1,
            tags: ['周末', '套餐']
          },
          {
            id: 9,
            hotel_id: this.selectedHotelId,
            type: 'text',
            name: '商务会议文案',
            content: '📊 专业会议服务\n\n✅ 多种会议室规格可选\n✅ 完善的会议设备\n✅ 专属茶歇服务\n✅ 专业会务团队\n\n📞 24小时预订热线：400-xxx-xxxx',
            url: '',
            is_public: 1,
            tags: ['商务', '会议']
          }
        ],
        // 成品库数据
        poster: [
          {
            id: 10,
            hotel_id: this.selectedHotelId,
            type: 'poster',
            name: '春节促销海报',
            url: 'https://picsum.photos/400/500?random=10',
            size: 204800,
            width: 1080,
            height: 1920,
            is_public: 1,
            tags: ['春节', '促销']
          },
          {
            id: 11,
            hotel_id: this.selectedHotelId,
            type: 'poster',
            name: '情人节特惠海报',
            url: 'https://picsum.photos/400/500?random=11',
            size: 198000,
            width: 1080,
            height: 1920,
            is_public: 1,
            tags: ['情人节', '浪漫']
          },
          {
            id: 12,
            hotel_id: this.selectedHotelId,
            type: 'poster',
            name: '商务会议海报',
            url: 'https://picsum.photos/400/500?random=12',
            size: 210000,
            width: 1080,
            height: 1920,
            is_public: 1,
            tags: ['商务', '会议']
          }
        ],
        video_ad: [
          {
            id: 13,
            hotel_id: this.selectedHotelId,
            type: 'video_ad',
            name: '15秒抖音广告',
            url: 'https://example.com/ad-video1.mp4',
            cover: 'https://picsum.photos/400/300?random=13',
            size: 8900000,
            duration: 15,
            is_public: 1,
            tags: ['抖音', '短视频']
          },
          {
            id: 14,
            hotel_id: this.selectedHotelId,
            type: 'video_ad',
            name: '30秒品牌宣传片',
            url: 'https://example.com/ad-video2.mp4',
            cover: 'https://picsum.photos/400/300?random=14',
            size: 15200000,
            duration: 30,
            is_public: 1,
            tags: ['品牌', '宣传']
          }
        ],
        h5: [
          {
            id: 15,
            hotel_id: this.selectedHotelId,
            type: 'h5',
            name: '酒店介绍H5',
            url: 'https://example.com/h5/hotel-intro',
            cover: 'https://picsum.photos/400/300?random=15',
            size: 0,
            is_public: 1,
            tags: ['介绍', '品牌']
          },
          {
            id: 16,
            hotel_id: this.selectedHotelId,
            type: 'h5',
            name: '活动报名H5',
            url: 'https://example.com/h5/event-signup',
            cover: 'https://picsum.photos/400/300?random=16',
            size: 0,
            is_public: 1,
            tags: ['活动', '报名']
          }
        ]
      }

      this.materialList = mockData[this.currentType] || []
      this.pagination.total = this.materialList.length
    },

    // 预览素材 - 改为显示详情弹窗
    async previewMaterial(item) {
      try {
        uni.showLoading({ title: '加载中...' })

        // 调用详情接口获取完整数据
        const { userApi } = require('@/utils/api')
        const detail = await userApi.getMaterialInfo({
          id: item.id,
          hotel_id: this.selectedHotelId
        })

        if (detail && detail.code === 0) {
          this.currentMaterial = detail.data || item
          this.detailVisible = true
        } else {
          // 接口失败，使用列表中的数据
          this.currentMaterial = item
          this.detailVisible = true
        }
      } catch (error) {
        console.error('获取素材详情失败:', error)
        // 接口失败，使用列表中的数据
        this.currentMaterial = item
        this.detailVisible = true
      } finally {
        uni.hideLoading()
      }
    },

    // 关闭详情弹窗
    closeDetail() {
      this.detailVisible = false
      this.currentMaterial = null
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return '-'
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    },

    // 格式化时长
    formatDuration(seconds) {
      if (!seconds) return '-'
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    // 获取类型名称
    getTypeName(type) {
      const typeMap = {
        image: '图片',
        video: '视频',
        text: '文案',
        poster: '海报',
        video_ad: '视频广告',
        h5: 'H5页面'
      }
      return typeMap[type] || type
    },

    // 下载素材
    handleDownload() {
      if (!this.currentMaterial) return

      // 图片类型直接预览并下载
      if (this.currentMaterial.type === 'image' || this.currentMaterial.type === 'poster') {
        uni.previewImage({
          urls: [this.currentMaterial.url],
          current: this.currentMaterial.url
        })
      } else {
        uni.showToast({
          title: '下载功能开发中',
          icon: 'none'
        })
      }
    },

    // 分享素材
    handleShare() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style scoped>
.material-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #fff 60%);
}

.material-content {
  padding: 32rpx 32rpx 120rpx; /* 左右32rpx，顶部200rpx在下面单独设置 */
  padding-top: 200rpx;
}

/* 大类切换标签 */
.main-category-tabs {
  display: flex;
  background: #e8f4f8;
  border-radius: 46rpx;
  padding: 8rpx;
  margin-bottom: 32rpx;
}

.main-category-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-radius: 46rpx;
  transition: all 0.3s ease;
}

.main-category-tab.active {
  background: #5dade2;
  box-shadow: 0 4rpx 12rpx rgba(93, 173, 226, 0.3);
}

.main-category-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 400;
}

.main-category-tab.active .main-category-text {
  color: #fff;
  font-weight: 500;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 46rpx;
  padding: 8rpx;
  margin-top: 40rpx;
  margin-bottom: 24rpx;
}

/* 搜索框 */
.search-box {
  margin-bottom: 32rpx;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 46rpx;
  padding: 16rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 44rpx;
  line-height: 44rpx;
}

.clear-icon {
  font-size: 32rpx;
  color: #999;
  padding: 0 8rpx;
  margin-left: 16rpx;
}

.category-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 46rpx;
  transition: all 0.3s ease;
}

.category-tab.active {
  background: #5dade2;
}

.category-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 400;
}

.category-tab.active .category-text {
  color: #fff;
  font-weight: 500;
}

/* 素材网格 */
.material-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.material-item {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

/* 素材图片 */
.material-image {
  width: 100%;
  height: 300rpx;
  display: block;
}

/* 视频包装器 */
.video-wrapper {
  position: relative;
  width: 100%;
  height: 300rpx;
}

.video-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  color: #fff;
  font-size: 36rpx;
  margin-left: 6rpx;
}

/* 文案内容 */
.text-content {
  height: 300rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-preview {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* H5内容 */
.h5-content {
  position: relative;
  width: 100%;
  height: 300rpx;
}

.h5-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.3);
}

.badge-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
}

/* 素材信息 */
.material-info {
  padding: 20rpx 24rpx;
}

.material-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.material-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  font-size: 22rpx;
  color: #5dade2;
  background: rgba(93, 173, 226, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

/* 加载中 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

/* 空状态 */
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 详情弹窗 */
.material-detail-popup {
  position: relative;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.detail-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-icon {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.detail-content {
  max-height: 60vh;
  padding-bottom: 20rpx;
}

.detail-image {
  width: 100%;
  display: block;
}

.detail-text-content {
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content-full {
  font-size: 28rpx;
  color: #fff;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
}

.detail-info {
  padding: 32rpx;
}

.detail-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 24rpx;
  line-height: 1.4;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.detail-tag {
  font-size: 24rpx;
  color: #5dade2;
  background: rgba(93, 173, 226, 0.1);
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.detail-meta {
  margin-bottom: 24rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  font-size: 26rpx;
  color: #666;
  min-width: 160rpx;
}

.meta-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.detail-description {
  margin-top: 24rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.description-label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  font-weight: 600;
}

.description-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
}

.detail-actions {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.primary-btn {
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
  color: #fff;
}

.secondary-btn {
  background: #f0f0f0;
  color: #333;
}
</style>
