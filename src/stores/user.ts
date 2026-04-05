import type { IUserInfoRes } from '@/api/types/login.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/login.ts'

const initState: IUserInfoRes = {
  avatar: '',
  nickname: '',
  userId: 0,
  name: ''
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfoRes | null>(null)
    const token = ref('')
    const isLoggedIn = computed(() => !!token.value)
    const userName = computed(() => userInfo.value?.name || '游客')

    // 设置用户信息 可设置部分信息（比如更新 token）
    const setUserInfo = (val?: IUserInfoRes): void => {
      if (val) {
        userInfo.value = val
      }
    }

    // 清除用户信息
    const logout = (): void => {
      userInfo.value = { ...initState }
      token.value = ''
      userInfo.value = null
    }

    /**
     * 获取用户信息
     */
    const login = async () => {
      const res = await getUserInfo()
      setUserInfo(res.data)
      return res
    }

    return {
      userInfo,
      login,
      setUserInfo,
      logout
    }
  },
  {
    persist: true // 是否持久化
  }
)
