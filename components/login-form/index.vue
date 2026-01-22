<template>
  <view class="login-bg">
    <!-- Logo区域 - 两种登录方式都显示 -->
    <view class="login-logo-box">
      <image src="/static/logo.png" class="login-logo" mode="aspectFit" />
    </view>

    <!-- 登录标题 - 两种登录方式都显示 -->
    <view class="login-title">欢迎来到中旅集团</view>

    <!-- 登录方式切换 -->
    <view class="login-tabs">
      <view
        class="login-tab"
        :class="{ active: loginType === 'password' }"
        @click="switchLoginType('password')"
      >
        账号登录
      </view>
      <view
        class="login-tab"
        :class="{ active: loginType === 'wechat' }"
        @click="switchLoginType('wechat')"
      >
        微信快捷登录
      </view>
    </view>

    <!-- 账号密码登录表单 -->
    <form v-if="loginType === 'password'" @submit.prevent="onPasswordLogin" class="login-form">
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

    <!-- 微信一键登录 -->
    <view v-else class="wechat-login-container">
      <!-- 登录按钮 -->
      <button
        class="wechat-login-btn"
        :class="{ disabled: !canWechatLogin }"
        :disabled="!canWechatLogin"
        @tap="onWechatLoginClick"
      >
        {{ isLoading ? '登录中...' : '一键登录' }}
      </button>

      <!-- 协议同意 -->
      <view class="protocol-agree">
        <view
          class="agree-checkbox"
          :class="{ checked: isAgreed }"
          @click="toggleAgreement"
        >
          <view v-if="isAgreed" class="checkbox-inner" />
        </view>
        <text class="protocol-text">我已阅读并同意</text>
        <text class="protocol-link">《用户协议》</text>
        <text>和</text>
        <text class="protocol-link">《隐私政策》</text>
      </view>
    </view>

    <!-- 授权弹窗 -->
    <view v-if="showAuthPopup" class="auth-popup-mask" @click="closeAuthPopup">
      <view class="auth-popup" @click.stop>
        <view class="auth-content">
          <!-- 标题 -->
          <view class="auth-header">
            <view class="auth-title">获取您的昵称、头像、手机号</view>
            <view class="auth-desc">
              获取用户头像、昵称、手机号信息，主要用于完善个人资料，向用户提供更好使用体验
            </view>
          </view>

          <!-- 头像选择 -->
          <view class="auth-item">
            <view class="auth-label">头像</view>
            <button
              v-if="!userInfo.avatar"
              class="auth-btn"
              open-type="chooseAvatar"
              @chooseavatar="onChooseAvatar"
            >
              请选择头像
            </button>
            <image v-else class="auth-avatar" :src="userInfo.avatar" mode="aspectFill" />
          </view>

          <!-- 昵称输入 -->
          <view class="auth-item">
            <view class="auth-label">昵称</view>
            <input
              class="auth-input"
              type="nickname"
              v-model="userInfo.nickname"
              placeholder="请输入昵称"
              @input="onNicknameInput"
            />
          </view>

          <!-- 操作按钮 -->
          <view class="auth-actions">
            <view class="auth-cancel" @click="closeAuthPopup">取消</view>
            <button
              class="auth-confirm"
              open-type="getPhoneNumber"
              @getphonenumber="onGetPhoneNumber"
            >
              保存
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入API接口
import api from '@/utils/api.js'

export default {
  data() {
    return {
      // 登录方式：password-账号密码, wechat-微信快捷登录
      loginType: 'password',

      // 账号密码登录相关
      account: '',
      password: '',
      isAgreed: true,
      isLoading: false,

      // 微信登录相关
      showAuthPopup: false,
      wxLoginCode: '',
      userInfo: {
        avatar: '',
        nickname: ''
      }
    }
  },

  computed: {
    // 是否可以进行微信登录
    canWechatLogin() {
      return this.isAgreed && !this.isLoading
    }
  },

  mounted() {
    console.log('登录组件已挂载')
    // 检查是否已登录
    this.checkLoginStatus()
  },

  methods: {
    /**
     * 切换登录方式
     */
    switchLoginType(type) {
      this.loginType = type
      console.log('切换登录方式:', type)
    },

    /**
     * 切换协议同意状态
     */
    toggleAgreement() {
      this.isAgreed = !this.isAgreed
    },

    /**
     * 检查登录状态
     */
    async checkLoginStatus() {
      try {
        const code = await this.getWxLoginCode()
        if (!code) {
          console.log('获取微信code失败')
          return
        }

        // 获取用户信息
        const userData = await this.fetchUserInfo(code)
        console.log('用户数据:', userData)

        if (userData && userData.token) {
          // 已登录
          console.log('用户已登录，存储用户信息')
          this.performLogin(userData)
        }
      } catch (error) {
        console.log('检查登录状态失败:', error)
      }
    },

    /**
     * 账号密码登录
     */
    async onPasswordLogin() {
      console.log('点击账号密码登录按钮')

      // 检查协议
      if (!this.isAgreed) {
        uni.showToast({
          title: '请先勾选并同意用户协议和隐私政策',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 验证账号
      if (!this.account.trim()) {
        uni.showToast({
          title: '请输入账号',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 验证密码
      if (!this.password.trim()) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 开始登录
      this.isLoading = true

      try {
        console.log('登录参数:', {
          username: this.account,
          password: this.password
        })

        const token = await api.accountApi.login({
          username: this.account,
          password: this.password
        })

        console.log('登录接口返回结果:', token)

        if (token) {
          // 登录成功
          console.log('登录成功！')

          // 保存token
          uni.setStorageSync('token', token)

          // 创建用户信息
          const userData = {
            userId: this.account,
            username: this.account,
            token: token,
            loginTime: new Date().toISOString()
          }

          // 保存用户信息
          uni.setStorageSync('userInfo', userData)

          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          })

          // 跳转
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/strategy/index'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: '登录失败，请检查账号密码',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (error) {
        console.error('登录请求异常:', error)

        let errorMessage = '网络异常，请检查网络连接'

        if (error.statusCode === 500 || (error.data && error.data.code === 500)) {
          if (error.data && error.data.msg) {
            errorMessage = error.data.msg
          } else {
            errorMessage = '服务器内部错误，请稍后重试或联系技术支持'
          }
        } else if (error.data && error.data.message) {
          errorMessage = error.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        uni.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 微信一键登录点击
     */
    onWechatLoginClick() {
      console.log('点击微信登录按钮')

      if (!this.isAgreed) {
        uni.showToast({
          title: '请先阅读并同意协议',
          icon: 'none'
        })
        return
      }

      if (this.isLoading) {
        return
      }

      console.log('打开授权弹窗')
      this.showAuthPopup = true
    },

    /**
     * 获取微信登录code
     */
    async getWxLoginCode() {
      try {
        const res = await uni.login({ provider: 'weixin' })
        console.log('uni.login 返回:', res)

        const code = res?.code || res[1]?.code || res[0]?.code
        if (code) {
          this.wxLoginCode = code
          console.log('获取微信登录code:', this.wxLoginCode)
          return this.wxLoginCode
        }

        console.log('uni.login 未获取到code')
        return null
      } catch (error) {
        console.error('获取登录码失败:', error)
        uni.showToast({ title: '获取登录信息失败', icon: 'none' })
        return null
      }
    },

    /**
     * 获取用户信息
     */
    async fetchUserInfo(code) {
      try {
        const res = await api.accountApi.wechatUserInfo({ code })
        if (res && res.code === 200) {
          return res.data
        }
        return null
      } catch (error) {
        console.log('获取用户信息失败:', error)
        return null
      }
    },

    /**
     * 查询用户信息（不需要code）
     */
    async handleQueryUserInfo() {
      try {
        const res = await api.accountApi.wechatUserInfo({})
        if (res && res.code === 200) {
          return res.data
        }
        return null
      } catch (error) {
        console.log('获取用户信息失败:', error)
        return null
      }
    },

    /**
     * 用户注册
     */
    async registerUser(phoneCode) {
      if (!this.userInfo.avatar) {
        uni.showToast({ title: '请选择头像', icon: 'none' })
        return
      }
      if (!this.userInfo.nickname) {
        uni.showToast({ title: '请输入昵称', icon: 'none' })
        return
      }

      this.isLoading = true
      try {
        const code = await this.getWxLoginCode()
        const res = await api.accountApi.wechatRegister({
          avatar: this.userInfo.avatar,
          nickname: this.userInfo.nickname,
          code: phoneCode,
          openid: code
        })

        console.log('注册返回:', res)

        if (res && res.code === 200) {
          uni.setStorageSync('token', res.data.token)

          // 注册成功，获取用户信息
          const userData = await this.handleQueryUserInfo()
          console.log('注册后获取用户数据:', userData)

          if (userData && userData.token) {
            this.performLogin(userData)
          } else {
            uni.showToast({ title: '登录失败，请重试', icon: 'none' })
          }
        } else {
          uni.showToast({ title: res?.msg || '注册失败', icon: 'none' })
        }
      } catch (error) {
        console.error('注册失败:', error)
        uni.showToast({ title: '注册失败，请重试', icon: 'none' })
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 执行登录（存储用户信息）
     */
    performLogin(userData) {
      uni.setStorageSync('token', userData.token)
      uni.setStorageSync('userInfo', {
        nickname: userData.nickname,
        avatar_url: userData.avatar_url,
        ...userData
      })

      uni.showToast({ title: '登录成功', icon: 'success' })

      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/strategy/index',
          fail: (err) => {
            console.error('页面跳转失败：', err)
          },
          success: () => {
            console.log('页面跳转成功')
          }
        })
      }, 500)
    },

    /**
     * 选择头像
     */
    onChooseAvatar(e) {
      uni.getFileSystemManager().readFile({
        filePath: e.detail.avatarUrl,
        encoding: 'base64',
        success: (res) => {
          this.userInfo.avatar = `data:image/jpeg;base64,${res.data}`
        },
        fail: (err) => {
          console.error('读取头像失败:', err)
        }
      })
    },

    /**
     * 输入昵称
     */
    onNicknameInput(e) {
      this.userInfo.nickname = e.detail.value
    },

    /**
     * 获取手机号回调
     */
    onGetPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
        uni.showToast({ title: '已取消授权', icon: 'none' })
        return
      }
      this.registerUser(e.detail.code)
    },

    /**
     * 关闭授权弹窗
     */
    closeAuthPopup() {
      this.showAuthPopup = false
    }
  }
}
</script>

<!-- SCSS + 玻璃拟态 + 亮色风格，UI层无业务逻辑 -->
<style scoped lang="scss">
// 引入全局变量
@import '@/static/styles/variables.scss';

// 主容器
.login-bg {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(180deg, #e8f4ff 0%, #f0f8ff 50%, $bg-white 100%);
  padding: 20px;
  position: relative;
}

// Logo区域
.login-logo-box {
  margin-top: 80px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  .login-logo {
    width: 80px;
    height: 80px;
  }
}

// 标题
.login-title {
  font-size: 24px;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 30px;
  text-align: center;
}

// 登录方式切换
.login-tabs {
  display: flex;
  width: 80vw;
  max-width: 300px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 4px;

  .login-tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
    border-radius: 16px;
    transition: all 0.3s;

    &.active {
      background: $primary-color;
      color: white;
      font-weight: bold;
    }
  }
}

// 表单容器
.login-form {
  width: 80vw;
  max-width: 300px;
  display: flex;
  flex-direction: column;

  .login-input-box {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.9);
    border-radius: 20px;
    padding: 0 15px;
    height: 44px;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(10px);
    margin-bottom: 15px;

    .login-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
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

    .login-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 16px;
      color: #333;
      outline: none;
      padding: 0;

      &::placeholder {
        color: #999;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    background: linear-gradient(135deg, $primary-color 0%, #4285f4 100%);
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    margin-top: 10px;
    box-shadow: 0 4px 12px 0 rgba(41,111,183,0.3);
    transition: all 0.3s;

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px 0 rgba(41,111,183,0.25);
    }

    &.disabled {
      background: #ccc;
      color: white;
      box-shadow: none;
    }
  }

  .register-btn {
    width: 100%;
    height: 44px;
    border-radius: 22px;
    background: transparent;
    color: $primary-color;
    font-size: 16px;
    font-weight: normal;
    border: 1px solid rgba(41,111,183,0.3);
    margin-top: 15px;
    transition: all 0.3s;

    &:active {
      border-color: $primary-color;
      background: rgba(41,111,183,0.05);
    }
  }
}

// 微信登录容器
.wechat-login-container {
  width: 80vw;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 微信登录按钮
.wechat-login-btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, $primary-color 0%, #4285f4 100%);
  border-radius: 22px;
  border: none;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px 0 rgba(41,111,183,0.3);
  transition: all 0.3s;

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px 0 rgba(41,111,183,0.25);
  }

  &.disabled {
    opacity: 0.6;
    box-shadow: none;
  }

  &::after {
    border: none;
  }
}

// 协议同意区域
.protocol-agree {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;

  .agree-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;

    &.checked {
      border-color: #007aff;

      .checkbox-inner {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #007aff;
      }
    }
  }

  .protocol-text {
    color: #878787;
  }

  .protocol-link {
    color: #007aff;
  }
}

// 授权弹窗
.auth-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.auth-popup {
  width: 100%;
  max-height: 70vh;
  background: white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.auth-content {
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.auth-header {
  margin-bottom: 15px;

  .auth-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .auth-desc {
    font-size: 13px;
    color: #ababab;
    line-height: 1.6;
  }
}

.auth-item {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #f3f3f3;

  .auth-label {
    font-size: 14px;
    color: #333;
    width: 50px;
  }

  .auth-btn {
    flex: 1;
    font-size: 14px;
    color: #ababab;
    text-align: left;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;

    &::after {
      border: none;
    }
  }

  .auth-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .auth-input {
    flex: 1;
    font-size: 14px;
    color: #333;
  }
}

.auth-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;

  .auth-cancel {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    color: #39b54a;
    border-radius: 5px;
    font-size: 14px;
  }

  .auth-confirm {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #39b54a;
    color: white;
    border-radius: 5px;
    font-size: 14px;
    padding: 0;
    margin: 0;

    &::after {
      border: none;
    }
  }
}
</style>
