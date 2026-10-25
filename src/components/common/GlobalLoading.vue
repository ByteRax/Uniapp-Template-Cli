<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useGlobalLoading } from '@/composables/useGlobalLoading.ts'

const { loadingOptions, currentPage } = storeToRefs(useGlobalLoading())

const { close: closeGlobalLoading } = useGlobalLoading()

const loading = useToast('globalLoading')
const currentPath = getCurrentPath()

// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false)

nextTick(() => {
  hackAlipayVisible.value = true
})
// #endif

watch(
  () => loadingOptions.value,
  (newVal) => {
    if (newVal && newVal.show) {
      if (currentPage.value === currentPath && currentPath === getCurrentPath()) {
        loading.loading({
          ...newVal,
          closed: () => {
            if (loadingOptions.value === newVal) closeGlobalLoading()
            newVal.closed?.()
          }
        })
      } else {
        loading.close()
      }
    } else {
      loading.close()
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  loading.close()
  if (currentPage.value === currentPath) closeGlobalLoading()
})
</script>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<template>
  <!-- #ifdef MP-ALIPAY -->
  <wd-toast v-if="hackAlipayVisible" selector="globalLoading" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-toast selector="globalLoading" />
  <!-- #endif -->
</template>
