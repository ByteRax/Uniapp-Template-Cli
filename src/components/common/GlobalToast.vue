<script lang="ts" setup>
import { onBeforeUnmount, watch } from 'vue'

const { toastOptions, currentPage } = storeToRefs(useGlobalToast())

const { close: closeGlobalToast } = useGlobalToast()

const toast = useToast('globalToast')
const currentPath = getCurrentPath()

// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false)

nextTick(() => {
  hackAlipayVisible.value = true
})
// #endif

watch(
  () => toastOptions.value,
  (newVal) => {
    if (newVal && newVal.show) {
      if (currentPage.value === currentPath && currentPath === getCurrentPath()) {
        toast.show({
          ...newVal,
          duration: 0,
          closed: () => {
            if (toastOptions.value === newVal) closeGlobalToast()
            newVal.closed?.()
          }
        })
      } else {
        toast.close()
      }
    } else {
      toast.close()
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  toast.close()
  if (currentPage.value === currentPath) closeGlobalToast()
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
  <wd-toast v-if="hackAlipayVisible" selector="globalToast" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-toast selector="globalToast" />
  <!-- #endif -->
</template>
