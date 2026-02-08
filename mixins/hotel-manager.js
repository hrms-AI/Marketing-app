/**
 * 酒店选择和管理逻辑
 * 优先调用真实API，失败时降级使用mock数据
 */
import { userApi } from '../utils/api'

export default {
  data() {
    return {
      // 酒店列表
      hotelList: [],
      hotelNames: [],
      selectedHotelIndex: 0,
      selectedHotelId: '',
      selectedHotelName: '',

      // 用户信息
      userInfo: null
    }
  },

  computed: {
    // 获取全局数据
    globalData() {
      return getApp().globalData
    }
  },

  methods: {
    // 初始化全局酒店数据
    initGlobalHotelData() {
      // 从全局数据同步到组件
      if (this.globalData.hotelList && this.globalData.hotelList.length > 0) {
        this.hotelList = this.globalData.hotelList
        this.hotelNames = this.hotelList.map(hotel => hotel.hotel_name || hotel.name || '未命名酒店')
        console.log('✅ 从全局数据同步酒店列表:', this.hotelList.length, '家')
      }

      if (this.globalData.selectedHotelId) {
        this.selectedHotelId = this.globalData.selectedHotelId
        this.selectedHotelName = this.globalData.selectedHotelName
        this.selectedHotelIndex = this.globalData.selectedHotelIndex
        console.log('✅ 从全局数据同步选中酒店:', this.selectedHotelName)
      }

      if (this.globalData.userInfo) {
        this.userInfo = this.globalData.userInfo
      }
    },

    // 酒店选择变化
    onHotelChange(e) {
      const index = e.detail.value
      this.selectedHotelIndex = index

      if (this.hotelList && this.hotelList[index]) {
        const hotel = this.hotelList[index]
        this.selectedHotelId = hotel.hotel_id || hotel.id
        this.selectedHotelName = hotel.hotel_name || hotel.name

        console.log('选中酒店:', {
          index,
          id: this.selectedHotelId,
          name: this.selectedHotelName
        })

        // 更新全局数据和本地存储
        const app = getApp()
        app.updateSelectedHotel(this.selectedHotelId, this.selectedHotelName, index)

        // 重新加载数据
        this.loadMarketingStats && this.loadMarketingStats()
      }
    },
    
    // 加载酒店信息 - 调用真实API
    async loadHotelInfo() {
      const userInfo = this.$utils.user.getUserInfo()
      this.userInfo = userInfo
      const userId = userInfo?.id || userInfo?.userId || userInfo?.user_id

      if (!userId) {
        uni.showToast({
          title: '用户信息不完整，请重新登录',
          icon: 'none',
          duration: 2000
        })
        return
      }

      try {
        uni.showLoading({ title: '加载中...' })

        console.log('🚀 正在调用真实API获取酒店列表...')
        const hotelListData = await userApi.getHotelList({ page: 1, limit: 100 })
        console.log('✅ API返回数据:', hotelListData)
        console.log('✅ 数据类型:', typeof hotelListData)
        console.log('✅ 是否有items:', hotelListData?.items)
        console.log('✅ 是否有list:', hotelListData?.list)
        console.log('✅ 是否有data:', hotelListData?.data)

        // 兼容多种API返回格式
        let items = null
        let total = 0

        if (hotelListData) {
          // 尝试获取items
          if (Array.isArray(hotelListData.items)) {
            items = hotelListData.items
            total = hotelListData.total || hotelListData.items.length
          } else if (Array.isArray(hotelListData.list)) {
            items = hotelListData.list
            total = hotelListData.total || hotelListData.list.length
          } else if (Array.isArray(hotelListData.data)) {
            // API返回格式：{data: [...], total: 2}
            items = hotelListData.data
            total = hotelListData.total || hotelListData.data.length
          } else if (Array.isArray(hotelListData)) {
            // 直接返回数组的情况
            items = hotelListData
            total = hotelListData.length
          }
        }

        if (items && items.length > 0) {
          // API调用成功，使用真实数据
          this.hotelList = items

          // 更新全局数据和本地存储
          const app = getApp()
          app.updateHotelList(items, total)

          console.log('✅ 使用真实API数据，共', total, '家酒店')
        } else {
          throw new Error('API返回数据为空或格式不正确')
        }

        // 处理酒店列表
        if (this.hotelList && this.hotelList.length > 0) {
          this.hotelNames = this.hotelList.map(hotel => hotel.hotel_name || hotel.name || '未命名酒店')

          // 默认选中第一个酒店
          const firstHotel = this.hotelList[0]
          this.selectedHotelId = firstHotel.hotel_id || firstHotel.id
          this.selectedHotelName = firstHotel.hotel_name || firstHotel.name
          this.selectedHotelIndex = 0

          // 更新全局选中的酒店
          const app = getApp()
          app.updateSelectedHotel(this.selectedHotelId, this.selectedHotelName, 0)

          console.log('✅ 默认选中第一个酒店:', {
            id: this.selectedHotelId,
            name: this.selectedHotelName
          })
        } else {
          uni.showToast({
            title: '未获取到酒店信息',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('❌ 加载酒店信息失败:', error)
        uni.showToast({
          title: '加载酒店信息失败，请检查网络连接',
          icon: 'none',
          duration: 3000
        })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
