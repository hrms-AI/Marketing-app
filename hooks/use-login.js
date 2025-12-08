/**
 * 登录逻辑 Hook - 纯前端模式
 * Vue2 兼容版本
 * 
 * 🎯 功能：提供登录状态管理和登录方法
 * 📝 说明：当前使用本地模拟登录服务
 * 🔐 测试账号：admin / 123456
 */
import { login as loginService } from '../services/auth'

export default function useLogin() {
  return {
    login(account, password, cb) {
      // cb: (err) => void
      loginService(account, password)
        .then(() => {
          if (cb) cb(null)
        })
        .catch((e) => {
          if (cb) cb(e.message || '登录失败')
        })
    }
  }
}
// #endregion
