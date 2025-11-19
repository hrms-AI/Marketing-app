/**
 * 日期选择和管理逻辑
 */
export default {
  data() {
    return {
      // 日期相关
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      yearIndex: new Date().getFullYear() - 2000,
      monthIndex: new Date().getMonth(),
      dateRange: [
        // 年份范围 2000-2050
        Array.from({ length: 51 }, (_, i) => (2000 + i).toString()),
        // 月份范围 1-12
        Array.from({ length: 12 }, (_, i) => (i + 1).toString())
      ]
    }
  },
  
  methods: {
    // 初始化当前日期
    initCurrentDate() {
      const now = new Date()
      this.selectedYear = now.getFullYear()
      this.selectedMonth = now.getMonth() + 1
      this.yearIndex = this.selectedYear - 2000
      this.monthIndex = this.selectedMonth - 1
    },
    
    // 日期选择器变化事件
    onDateChange(e) {
      const [yearIdx, monthIdx] = e.detail.value
      this.yearIndex = yearIdx
      this.monthIndex = monthIdx
      this.selectedYear = 2000 + yearIdx
      this.selectedMonth = monthIdx + 1
      
      console.log('日期变更:', {
        year: this.selectedYear,
        month: this.selectedMonth
      })
      
      // 更新统计数据
      this.loadMarketingStats && this.loadMarketingStats()
    },
    
    // AI生成月度计划（跳转到表单页面）
    handleAIGenerate() {
      if (!this.selectedHotelId) {
        uni.showToast({
          title: '请先选择酒店',
          icon: 'none'
        })
        return
      }
      
      // 跳转到AI生成表单页面，传递必要参数
      uni.navigateTo({
        url: `/pages/ai-generate-form/index?hotelId=${this.selectedHotelId}&year=${this.selectedYear}&month=${this.selectedMonth}`
      })
    },
    
    // 查看本月度营销计划
    handleViewPlan() {
      if (!this.selectedHotelId) {
        uni.showToast({
          title: '请先选择酒店',
          icon: 'none'
        })
        return
      }
      
      // 跳转到营销计划详情页面
      uni.navigateTo({
        url: `/pages/marketing-plan/index?hotelId=${this.selectedHotelId}&year=${this.selectedYear}&month=${this.selectedMonth}&hotelName=${encodeURIComponent(this.selectedHotelName || '未知酒店')}`
      })
    }
  }
}
