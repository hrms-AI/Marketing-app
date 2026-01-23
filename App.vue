<script>
	export default {
		globalData: {
			// 酒店数据全局存储
			hotelList: [],
			hotelTotal: 0,
			selectedHotelId: null,
			selectedHotelName: null,
			selectedHotelIndex: 0,
			userInfo: null
		},
		onLaunch: function() {
			console.log('App Launch')
			// 初始化全局数据
			this.initGlobalData()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 初始化全局数据
			initGlobalData() {
				// 从本地存储恢复数据到全局
				const hotelList = uni.getStorageSync('hotelList')
				const hotelTotal = uni.getStorageSync('hotelTotal')
				const selectedHotelId = uni.getStorageSync('selectedHotelId')
				const selectedHotelName = uni.getStorageSync('selectedHotelName')
				const userInfo = uni.getStorageSync('userInfo')

				if (hotelList) {
					this.globalData.hotelList = hotelList
					console.log('✅ 全局数据初始化 - 酒店列表:', hotelList.length, '家')
				}
				if (hotelTotal) {
					this.globalData.hotelTotal = hotelTotal
				}
				if (selectedHotelId) {
					this.globalData.selectedHotelId = selectedHotelId
				}
				if (selectedHotelName) {
					this.globalData.selectedHotelName = selectedHotelName
				}
				if (userInfo) {
					this.globalData.userInfo = userInfo
				}

				console.log('✅ 全局数据初始化完成')
			},

			// 更新酒店列表
			updateHotelList(hotelList, total) {
				this.globalData.hotelList = hotelList
				this.globalData.hotelTotal = total
				// 同步到本地存储
				uni.setStorageSync('hotelList', hotelList)
				uni.setStorageSync('hotelTotal', total)
				console.log('✅ 全局酒店列表已更新')
			},

			// 更新选中的酒店
			updateSelectedHotel(hotelId, hotelName, index = 0) {
				this.globalData.selectedHotelId = hotelId
				this.globalData.selectedHotelName = hotelName
				this.globalData.selectedHotelIndex = index
				// 同步到本地存储
				uni.setStorageSync('selectedHotelId', hotelId)
				uni.setStorageSync('selectedHotelName', hotelName)
				console.log('✅ 全局选中酒店已更新:', hotelId, hotelName)
			},

			// 获取全局数据
			getGlobalData() {
				return this.globalData
			}
		}
	}
</script>

<style lang="scss">
/*每个页面公共css */
</style>
