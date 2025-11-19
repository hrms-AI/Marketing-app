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
          
          // 延迟跳转到策略页面
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/strategy/index'
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

<!-- SCSS + 玻璃拟态 + 亮色风格，UI层无业务逻辑 -->
<style scoped lang="scss">
// 引入全局变量
@import '@/static/styles/variables.scss';

// 主容器 - 使用SCSS嵌套结构
.login-bg {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, #e8f4ff 0%, #f0f8ff 50%, $bg-white 100%);
  position: relative;

  // Logo区域
  .login-logo-box {
    margin-top: 190rpx;
    margin-bottom: $spacing-xl;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-logo {
      width: 180rpx;
      height: 180rpx;
      border-radius: $border-radius-lg + 12rpx; // 32rpx
      background: rgba(255,255,255,0.6);
      box-shadow: 0 8rpx 32rpx 0 $shadow-dark;
      backdrop-filter: blur(8rpx);
    }
  }

  // 标题
  .login-title {
    font-size: $font-size-xxl;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 48rpx;
    text-align: center;
  }

  // 表单容器
  .login-form {
    width: 80vw;
    max-width: 600rpx;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    // 输入框容器
    .login-input-box {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.9);
      border-radius: $border-radius-xl;
      padding: 0 $padding-lg;
      height: $input-height;
      margin-bottom: $spacing-md;
      box-shadow: 0 4rpx 16rpx 0 $shadow-light;
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(10rpx);

      // 图标样式
      .login-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: $spacing-sm;
        display: inline-block;
        background-size: contain;
        background-repeat: no-repeat;
        
        &.user {
          background-image: url('data:image/svg+xml;utf8,<svg fill="%23999999" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>');
        }
        
        &.lock {
          background-image: url('data:image/svg+xml;utf8,<svg fill="%23999999" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/></svg>');
        }
      }

      // 输入框
      .login-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: $font-size-lg;
        color: $text-primary;
        outline: none;
        padding: 0;

        &::placeholder {
          color: $text-placeholder;
        }
      }
    }

    // 登录按钮
    .login-btn {
      width: 100%;
      height: $button-height;
      border-radius: $border-radius-xl;
      background: linear-gradient(135deg, $primary-color 0%, #4285f4 100%);
      color: $text-white;
      font-size: $font-size-lg;
      font-weight: bold;
      border: none;
      margin-top: $spacing-sm;
      box-shadow: 0 6rpx 20rpx 0 rgba(41,111,183,0.3);
      transition: all $animation-duration-normal $ease-out;
      cursor: pointer;
      
      &:active {
        transform: translateY(2rpx);
        box-shadow: 0 4rpx 12rpx 0 rgba(41,111,183,0.25);
      }

      &.disabled {
        background: $text-disabled;
        color: $text-white;
        box-shadow: none;
        cursor: not-allowed;
        transform: none;
      }
    }

    // 注册按钮
    .register-btn {
      width: 100%;
      height: $button-height;
      border-radius: $border-radius-xl;
      background: transparent;
      color: $primary-color;
      font-size: $font-size-lg;
      font-weight: normal;
      border: 2rpx solid rgba(41,111,183,0.3);
      margin-top: $spacing-lg;
      transition: all $animation-duration-fast $ease-out;
      cursor: pointer;
      
      &:active {
        border-color: $primary-color;
        background: rgba(41,111,183,0.05);
      }
    }
  }

  // 协议区域
  .login-protocol {
    position: absolute;
    bottom: $spacing-lg;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-sm;
    color: $text-disabled;
    gap: 4rpx;

    .login-protocol-check {
      color: $text-disabled;
      margin-right: $spacing-xs;
      cursor: pointer;
      transition: color $animation-duration-normal ease;
      font-size: $font-size-md;
      width: 32rpx;
      height: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.checked {
        color: $primary-color;
      }
    }

    .login-protocol-link {
      color: $text-primary;
      text-decoration: underline;
      margin: 0 4rpx;
    }
  }
}


</style>
