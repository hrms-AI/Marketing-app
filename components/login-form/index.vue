<template>
  <view class="login-bg">
    <view class="login-logo-box">
      <image src="/static/logo.png" class="login-logo" mode="aspectFit" />
    </view>
    <view class="login-title">欢迎来到中旅集团</view>
    <form @submit.prevent="onLogin" class="login-form">
      <view class="login-input-box">
        <text class="login-icon user"></text>
        <input v-model="account" type="text" placeholder="请输入账号" class="login-input" />
      </view>
      <view class="login-input-box">
        <text class="login-icon lock"></text>
        <input v-model="password" type="password" placeholder="请输入密码" class="login-input" />
      </view>
      <button 
        form-type="submit" 
        class="login-btn" 
        :class="{ 'disabled': isLoading }"
        :disabled="isLoading"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      <button type="button" class="register-btn">注册</button>
    </form>
    <view class="login-protocol">
      <text 
        class="login-protocol-check" 
        :class="{ 'checked': isAgreed }"
        @click="toggleAgreement"
      >
        {{ isAgreed ? '✔' : '○' }}
      </text>
      <text>我已阅读并同意</text>
      <text class="login-protocol-link">《用户协议》</text>
      <text>和</text>
      <text class="login-protocol-link">《隐私政策》</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: '',
      isAgreed: false, // 是否同意协议
      isLoading: false // 是否正在登录
    }
  },
  methods: {
    // 切换协议同意状态
    toggleAgreement() {
      this.isAgreed = !this.isAgreed;
    },
    
    // 登录方法
    async onLogin() {
      console.log('点击登录按钮');
      
      // 第一步：检查是否勾选协议
      if (!this.isAgreed) {
        uni.showToast({
          title: '请先勾选并同意用户协议和隐私政策',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 第二步：验证账号是否输入
      if (!this.account.trim()) {
        uni.showToast({
          title: '请输入账号',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 第三步：验证密码是否输入
      if (!this.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 第四步：开始调用登录接口
      this.isLoading = true;
      
      try {
        console.log('登录参数:', {
          username: this.account,
          password: this.password
        });

        // 调用登录API
        const result = await this.$api.userApi.login({
          username: this.account,
          password: this.password
        });
        
        console.log('登录API返回结果:', result);
        
        // 第五步：根据登录接口返回结果处理
        if (result && result.data && result.data.token) {
          // 登录成功 - 根据您提供的返回结构判断
          console.log('登录成功！');
          
          // 保存用户信息和token到本地存储
          const userData = {
            userId: result.data.id || result.data.userId, // 用户ID，优先使用userId字段，否则使用id
            id: result.data.id,
            username: result.data.username,
            role: result.data.role,
            // 如果有其他字段也可以保存
            email: result.data.email,
            phone: result.data.phone,
            nickname: result.data.nickname
          };
          
          console.log('准备保存的用户数据:', userData);
          
          // 使用工具函数保存token和用户信息
          this.$utils.user.setToken(result.data.token);
          this.$utils.user.setUserInfo(userData);
          
          console.log('Token已保存:', result.data.token);
          console.log('用户信息已保存:', userData);
          
          // 验证保存结果
          const savedToken = this.$utils.user.getToken();
          const savedUserInfo = this.$utils.user.getUserInfo();
          console.log('验证保存结果 - Token:', savedToken);
          console.log('验证保存结果 - 用户信息:', savedUserInfo);
          
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          
          // 延迟跳转到主页面
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/main/index'
            });
          }, 1500);
          
        } else {
          // 登录失败 - 没有返回token或data为空
          const errorMsg = result?.message || result?.msg || result?.error || '登录失败，服务器未返回有效数据';
          console.log('登录失败:', errorMsg);
          
          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2500
          });
        }
        
      } catch (error) {
        console.error('登录请求异常:', error);
        
        // HTTP状态码错误已经在请求拦截器中统一处理了，这里主要处理网络异常
        let errorMessage = '网络异常，请检查网络连接';
        
        // 处理业务逻辑错误
        if (error.data && error.data.message) {
          errorMessage = error.data.message;
        }
        // 处理网络错误
        else if (error.errMsg) {
          if (error.errMsg.includes('timeout')) {
            errorMessage = '请求超时，请重试';
          } else if (error.errMsg.includes('fail')) {
            errorMessage = '网络请求失败，请检查服务器连接';
          } else if (error.errMsg.includes('invalid url')) {
            errorMessage = '服务器地址配置错误';
          }
        }
        
        // 如果是HTTP状态码错误，说明已经在拦截器中显示过toast了，这里就不重复显示
        if (!error.statusCode) {
          uni.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 2500
          });
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<!-- tailwindcss + 玻璃拟态 + 亮色风格，UI层无业务逻辑 -->
<style scoped>
/* 背景渐变和居中 */
.login-bg {
  min-height: 100vh;
 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, #e8f4ff 0%, #f0f8ff 50%, #fff 100%);
  position: relative;
}
.login-logo-box {
  margin-top: 190rpx;
  margin-bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-logo {
  width: 180rpx;
  height: 180rpx;
  border-radius: 32rpx;
  background: rgba(255,255,255,0.6);
  box-shadow: 0 8rpx 32rpx 0 rgba(0,0,0,0.08);
  backdrop-filter: blur(8rpx);
}
.login-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 48rpx;
}
.login-form {
  width: 80vw;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.login-input-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.8);
  border-radius: 999rpx;
  padding: 0 32rpx;
  height: 88rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
}
.login-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
}
.login-icon.user {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23bdbdbd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>');
}
.login-icon.lock {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23bdbdbd" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 8V7a5 5 0 0 0-10 0v1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-8-1a3 3 0 0 1 6 0v1H9V7zm8 11H7v-8h10v8z"/></svg>');
}
.login-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 32rpx;
  color: #333;
  outline: none;
  padding: 0;
}
.login-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 999rpx;
  background: #296FB7;
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  border: none;
  margin-top: 16rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba(41,111,183,0.25);
  transition: all 0.3s ease;
}

.login-btn.disabled {
  background: #cccccc;
  color: #999999;
  box-shadow: none;
  cursor: not-allowed;
}
.register-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 999rpx;
  background: transparent;
  color: #4a90e2;
  font-size: 36rpx;
  font-weight: bold;
  border: 2rpx solid transparent;
  margin-top: 32rpx;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  box-sizing: border-box;
}
.register-btn:hover, .register-btn:active {
  border-color: #4a90e2;
  background: #fff;
  color: #4a90e2;
}
.login-protocol {
  position: absolute;
  bottom: 32rpx;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  color: #bdbdbd;
  gap: 4rpx;
}
.login-protocol-check {
  color: #bdbdbd;
  margin-right: 8rpx;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 28rpx;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-protocol-check.checked {
  color: #4a90e2;
}
.login-protocol-link {
  color: #222;
  text-decoration: underline;
  margin: 0 4rpx;
}
</style>
