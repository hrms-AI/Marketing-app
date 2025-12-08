/**
 * 登录服务层 - 纯前端模式
 * 📝 说明：当前为纯前端演示模式，使用本地模拟登录
 * 🔐 默认账号：admin / 123456
 * ⚠️ 注意：生产环境需要连接真实后端API
 */

/**
 * 模拟登录接口
 * @param {string} account 账号（演示用：admin）
 * @param {string} password 密码（演示用：123456）
 * @returns {Promise<void>} 登录成功或抛出异常
 * @description 纯前端模拟登录，无真实网络请求
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
