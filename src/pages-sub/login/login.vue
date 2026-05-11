<script lang="ts" setup>
import { ensureDecodeURIComponent, parseUrlToObj } from '@/router'
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
    redirectUrl.value = ensureDecodeURIComponent(options['redirect'])
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
  let path = redirectUrl.value
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const { path: _path, query } = parseUrlToObj(path)
  console.log('_path:', _path, 'query:', query, 'path:', path)
  router.push(path, true)
}
</script>

<template>
  <view class="login">
    <view class="text-center">登录页</view>
    <button class="mt-4 w-40 text-center" @click="doLogin">点击模拟登录</button>
  </view>
</template>
