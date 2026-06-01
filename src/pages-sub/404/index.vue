<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom'
  }
})
function goBack() {
  router.home()
}
</script>

<template>
  <view class="h-screen flex flex-col items-center justify-center">
    <view>404</view>
    <view>页面不存在</view>
    <button class="text-center w-40 mt-6" @click="goBack">返回首页</button>
  </view>
</template>
