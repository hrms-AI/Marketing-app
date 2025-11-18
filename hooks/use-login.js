// #region 登录逻辑 Hook (vue2兼容版)
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
