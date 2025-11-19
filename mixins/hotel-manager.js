/**
 * 酒店选择和管理逻辑
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
  
  methods: {
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
        
        // 重新加载数据
        this.loadMarketingStats && this.loadMarketingStats()
      }
    },
    
    // 加载酒店信息
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
        const res = await userApi.getHotelInfo(userId)
        
        if (res && res.data && res.data.hotel_list) {
          this.hotelList = res.data.hotel_list || []
          this.hotelNames = this.hotelList.map(hotel => hotel.hotel_name || hotel.name || '未命名酒店')
          
          // 默认选中第一个酒店
          if (this.hotelList.length > 0) {
            const firstHotel = this.hotelList[0]
            this.selectedHotelId = firstHotel.hotel_id || firstHotel.id
            this.selectedHotelName = firstHotel.hotel_name || firstHotel.name
            this.selectedHotelIndex = 0
            
            console.log('默认选中第一个酒店:', {
              id: this.selectedHotelId,
              name: this.selectedHotelName
            })
          }
        } else {
          uni.showToast({
            title: '未获取到酒店信息',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载酒店信息失败:', error)
        uni.showToast({
          title: '加载酒店信息失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
