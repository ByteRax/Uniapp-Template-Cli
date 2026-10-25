<script lang="ts" setup>
import { fullyDecodeUrl } from '@/router'
import { HOME_PAGE } from '@/router/router'
import { userStore } from '@/stores/userStore'
import { generateUUID } from '@/utils'

const tokenStore = userStore()
definePage({
  style: {
    navigationBarTitleText: '登录'
  }
})

const redirectUrl = ref('')
onLoad((options) => {
  console.log('login options: ', options)
  if (options?.['redirect']) {
    redirectUrl.value = fullyDecodeUrl(options['redirect'])
  }
  console.log('redirectUrl.value: ', redirectUrl.value)
})

function doLogin() {
  if (tokenStore.hasLogin()) {
    uni.navigateBack()
    return
  }
  tokenStore.setTokenInfo({
    token: generateUUID(),
    expiresIn: 60
  })
  let path = redirectUrl.value || HOME_PAGE
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  router.push(path, true)
}
</script>

<template>
  <view class="login">
    <view class="text-center">登录页</view>
    <button class="text-center w-40 mt-4" @click="doLogin">点击模拟登录</button>
  </view>
</template>
