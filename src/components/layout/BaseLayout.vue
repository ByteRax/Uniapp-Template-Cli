<script lang="ts" setup>
import { computed, onBeforeMount, reactive } from 'vue'

defineOptions({
  name: 'BaseLayout',
  inheritAttrs: true,
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
})

const props = withDefaults(defineProps<Props>(), {
  height: 'calc(100vh - var(--window-top))',
  autoLoading: false,
  showLogin: false
})

interface Props {
  height?: string
  autoLoading?: boolean
  showLogin?: boolean
  bgColor?: string
}

const state = reactive({
  showLoading: false,
  showError: false,
  showEmpty: false,
  errorStr: '',
  errorCallback: () => {}
})

const success: Ref<boolean> = computed(() => {
  return !(state.showLoading || state.showError || state.showEmpty)
})

onBeforeMount(() => {
  if (props.autoLoading) {
    state.showLoading = true
  }
})

function resetState() {
  Object.assign(state, {
    showLoading: false,
    showError: false,
    showEmpty: false,
    errorStr: '',
    errorCallback: () => {}
  })
}

function showLoading() {
  resetState()
  state.showLoading = true
}

function showEmpty() {
  resetState()
  state.showEmpty = true
}

function showError(errorStr: string, errorCallback: () => void) {
  resetState()
  state.showError = true
  state.errorStr = errorStr
  state.errorCallback = errorCallback
}

function showSuccess(isEmpty = false) {
  resetState()
  state.showEmpty = isEmpty
}

function handleRetry() {
  const retry = state.errorCallback
  showLoading()
  retry?.()
}

defineExpose<BaseLayoutRef>({
  showLoading,
  showEmpty,
  showSuccess,
  showError
})
</script>

<template>
  <view :style="{ height, backgroundColor: bgColor }" class="base-layout flex-col">
    <slot v-if="success" />
    <view v-if="!success" class=":uno: wh-full flex-center flex-1">
      <view v-if="state.showLoading" class="flex-col-center">
        <wd-loading color="#777777" size="46" />
        <text class="m-t-10rpx text-#777">加载中...</text>
      </view>

      <view v-if="state.showEmpty" class="flex-col-center text-#777">
        <wd-icon name="file" size="46" />
        <text class="m-t-10rpx">暂无数据</text>
      </view>

      <view v-if="state.showError" class="flex-col-center text-#777">
        <wd-icon name="drive-file" size="46" />
        <text class="m-t-10rpx">
          {{ state.errorStr || '加载失败' }}
        </text>
        <wd-button class="m-t-10rpx" type="warning" @click="handleRetry">重新加载</wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.base-layout {
  position: relative;
  width: 100%;
}
</style>
