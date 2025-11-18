// 登录服务层，纯业务逻辑，无状态

/**
 * 登录接口
 * @param {string} account 账号
 * @param {string} password 密码
 * @returns {Promise<void>} 登录成功或抛出异常
 */
export async function login(account, password) {
  // 这里应调用真实后端API，演示用Promise模拟
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (account === 'admin' && password === '123456') {
        resolve()
      } else {
        reject(new Error('账号或密码错误'))
      }
    }, 800)
  })
}
