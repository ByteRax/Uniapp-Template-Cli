<script lang="ts" setup>
import PrivacyPopup from '@/components/business/PrivacyPopup.vue'
import { uuid } from '@/utils/uuid'

definePage({
  type: 'home',
  style: {
    navigationBarTitleText: '首页'
  }
})

function onGenerateUUID() {
  const u = uuid()
  console.log('uuid:', u)
}

function textHttp() {
  Apis.http.post('/harmony/index/json', {}, {}).then((res: any) => {
    if (res.isOK(true, true)) {
      console.log(res.data)
    }
  })
  setTimeout(() => {
    Apis.http.post('/harmony/index/json').then((res: any) => {
      if (res.isOK(true, true)) {
        console.log(res.data)
      }
    })
  }, 30)
}
</script>

<template>
  <base-layout>
    <view class="h-full w-full p-4">
      <wd-cell-group border custom-class="rounded-2! overflow-hidden mb-4">
        <wd-cell is-link title="下拉刷新框架" @click="router.push('/pages/index/paging')" />
        <wd-cell is-link title="Unocss 原子化" @click="router.push('/pages-sub/styles/index')" />
        <wd-cell is-link title="测试页面A" @click="router.push('/pages/index/testA')" />
        <wd-cell is-link title="测试页面B" @click="router.push('/pages/index/testB')" />
        <wd-cell is-link title="测试网络请求" @click="textHttp()" />
      </wd-cell-group>
    </view>
    <PrivacyPopup />
  </base-layout>
</template>
