import type { IAuthLoginRes, ILoginForm } from '@/api/types/login'
import type { ResponseData } from '@/http/types.ts'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue' // 修复：导入 computed
import { login as _login, logout as _logout, wxLogin as _wxLogin, getWxCode } from '@/api/login'
import { useUserStore } from './user'

// 初始化状态
const tokenInfoState = {
  token: '',
  expiresIn: 0
}

export const userStore = defineStore(
  'token',
  () => {
    // 定义用户信息
    const tokenInfo = ref<IAuthLoginRes>({ ...tokenInfoState })
    // 设置用户信息
    const setTokenInfo = (val: IAuthLoginRes) => {
      tokenInfo.value = val
      // 计算并存储过期时间
      const now = Date.now()
      const expireTime = now + val.expiresIn * 1000
      uni.setStorageSync('accessTokenExpireTime', expireTime)
    }

    /**
     * 判断token是否过期
     */
    const isTokenExpired = () => {
      if (!tokenInfo.value) {
        return true
      }
      const now = Date.now()
      const expireTime = uni.getStorageSync('accessTokenExpireTime')
      if (!expireTime) return true
      return now >= expireTime
    }

    /**
     * 登录成功后处理逻辑
     * @param tokenInfo 登录返回的token信息
     */
    async function _postLogin(tokenInfo: ResponseData<IAuthLoginRes>) {
      if (tokenInfo.data) {
        setTokenInfo(tokenInfo.data)
      }
      const userStore = useUserStore()
      await userStore.fetchUserInfo()
    }

    /**
     * 用户登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @param loginForm 登录参数
     * @returns 登录结果
     */
    const login = async (loginForm: ILoginForm) => {
      try {
        const res = await _login(loginForm)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        return res
      } catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'error'
        })
        throw error
      }
    }

    /**
     * 微信登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @returns 登录结果
     */
    const wxLogin = async () => {
      try {
        // 获取微信小程序登录的code
        const code = await getWxCode()
        const res = await _wxLogin(code)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        return res
      } catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'error'
        })
        throw error
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        // TODO 实现自己的退出登录逻辑
        await _logout()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        // 无论成功失败，都需要清除本地token信息
        // 清除存储的过期时间
        uni.removeStorageSync('accessTokenExpireTime')
        uni.removeStorageSync('refreshTokenExpireTime')
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync('token')
        const userStore = useUserStore()
        userStore.clearUserInfo()
      }
    }
    /**
     * 获取有效的token
     * 注意：在computed中不直接调用异步函数，只做状态判断
     * 实际的刷新操作应由调用方处理
     */
    const getValidToken = computed(() => {
      return tokenInfo.value.token ?? ''
    })

    /**
     * 检查是否有登录信息（不考虑token是否过期）
     */
    const hasLoginInfo = computed(() => {
      if (!tokenInfo.value) {
        return false
      }
      return !!tokenInfo.value.token
    })

    /**
     * 检查是否已登录且token有效
     */
    const hasLogin = () => {
      return hasLoginInfo.value && !isTokenExpired()
    }

    /**
     * 尝试获取有效的token，如果过期且可刷新，则刷新token
     * @returns 有效的token或空字符串
     */
    const tryGetValidToken = async (): Promise<string> => {
      if (!getValidToken.value) {
        try {
          return getValidToken.value
        } catch (error) {
          console.error('尝试刷新token失败:', error)
          return ''
        }
      }
      return getValidToken.value
    }

    return {
      // 核心API方法
      login,
      wxLogin,
      logout,
      hasLogin,
      tryGetValidToken,
      validToken: getValidToken,
      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true
  }
)
