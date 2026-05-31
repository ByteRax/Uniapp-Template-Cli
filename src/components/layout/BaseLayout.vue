<script lang="ts" setup>
// 组件选项配置
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

// 组件 Props 定义
interface Props {
  /** 布局容器高度 */
  height?: string
  /** 是否自动显示加载状态 */
  autoLoading?: boolean
  /** 是否显示登录提示 */
  showLogin?: boolean
  /** 背景颜色 */
  bgColor?: string
}

// 布局状态管理
const state = reactive({
  showLoading: false,
  showError: false,
  showEmpty: false,
  errorStr: '',
  errorCallback: () => {}
})

// 是否显示成功状态（没有加载、错误或空数据）
const success: Ref<boolean> = computed(() => {
  return !(state.showLoading || state.showError || state.showEmpty)
})

onBeforeMount(() => {
  if (props.autoLoading) {
    state.showLoading = true
  }
})

/**
 * 重置布局状态
 */
function resetState() {
  state.showLoading = false
  state.showError = false
  state.showEmpty = false
  state.errorStr = ''
  state.errorCallback = () => {}
}

/**
 * 显示加载状态
 */
function showLoading() {
  resetState()
  state.showLoading = true
}

/**
 * 显示空数据状态
 */
function showEmpty() {
  resetState()
  state.showEmpty = true
}

/**
 * 显示错误状态
 * @param errorStr 错误提示文本
 * @param errorCallback 重试回调函数
 */
function showError(errorStr: string, errorCallback: () => void) {
  resetState()
  state.showError = true
  state.errorStr = errorStr
  state.errorCallback = errorCallback
}

/**
 * 显示成功状态（显示内容）
 * @param isEmpty 是否展示空数据状态
 */
function showSuccess(isEmpty = false) {
  console.log('调用成功了')
  resetState()
  state.showEmpty = isEmpty
}

/**
 * 处理重试按钮点击事件
 */
function handleRetry() {
  state.errorCallback?.()
  showLoading()
}

// 暴露给父组件的方法
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
