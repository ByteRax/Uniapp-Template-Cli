<script lang="ts" setup>
export interface Props {
  /** 标题 */
  title?: string
  /** 自定义类名 */
  customClass?: string
  /** 垂直间距 */
  ver?: number | string
  /** 水平间距 */
  hor?: number | string
  /** 是否透明 */
  transparent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  customClass: '',
  ver: 10,
  hor: 15,
  transparent: false
})

const style = computed(() => {
  return `margin: 0 ${props.hor}px;padding:${props.ver}px 0;`
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<template>
  <view :class="[transparent ? '' : 'bg-white dark:bg-[var(--wot-dark-background2)]', customClass]" class="box-border w-full text-gray-500 px-3 mb-3 dark:text-gray-300 last:mb-0">
    <view class="text-26rpx px-4 py-3">
      {{ title }}
    </view>
    <view :style="transparent ? '' : style">
      <slot />
    </view>
  </view>
</template>
