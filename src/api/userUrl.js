import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const userUrl = {
  // 登录
  loginUrl: '/api-auth/seller/login',
  userInfoUrl: '/api-auth/seller/userInfo',
  logoutUrl: '/api-auth/seller/logout',
  messageCountUrl: '/api-seller/seller/messageCount'
}
