/**
 * 酒店选择和管理逻辑
 * 纯前端模式：使用本地模拟数据
 */
// import { userApi } from '../utils/api' // 纯前端模式已注释

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
    
    // 加载酒店信息 - 纯前端模式
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
        // 纯前端模式：使用本地模拟数据
        const res = await this.mockGetHotelInfo(userId)
        
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
    },
    
    // 纯前端模式：模拟获取酒店信息
    async mockGetHotelInfo(userId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 模拟酒店数据
          const mockHotelData = {
            code: 200,
            message: '获取成功',
            data: {
              hotel_list: [
                {
                  hotel_id: 'hotel_001',
                  id: 'hotel_001',
                  hotel_name: '北京王府井酒店',
                  name: '北京王府井酒店',
                  city: '北京',
                  address: '北京市东城区王府井大街88号',
                  star_level: 5,
                  status: 'active'
                },
                {
                  hotel_id: 'hotel_002', 
                  id: 'hotel_002',
                  hotel_name: '上海外滩精品酒店',
                  name: '上海外滩精品酒店',
                  city: '上海',
                  address: '上海市黄浦区中山东一路99号',
                  star_level: 4,
                  status: 'active'
                },
                {
                  hotel_id: 'hotel_003',
                  id: 'hotel_003', 
                  hotel_name: '广州天河商务酒店',
                  name: '广州天河商务酒店',
                  city: '广州',
                  address: '广州市天河区珠江新城核心区',
                  star_level: 4,
                  status: 'active'
                },
                {
                  hotel_id: 'hotel_004',
                  id: 'hotel_004',
                  hotel_name: '深圳福田国际酒店', 
                  name: '深圳福田国际酒店',
                  city: '深圳',
                  address: '深圳市福田区深南大道2008号',
                  star_level: 5,
                  status: 'active'
                },
                {
                  hotel_id: 'hotel_005',
                  id: 'hotel_005',
                  hotel_name: '成都春熙路酒店',
                  name: '成都春熙路酒店', 
                  city: '成都',
                  address: '成都市锦江区春熙路南段8号',
                  star_level: 4,
                  status: 'active'
                }
              ]
            }
          }
          
          console.log('模拟酒店数据:', mockHotelData)
          resolve(mockHotelData)
        }, 500) // 模拟网络延迟
      })
    }
  }
}
