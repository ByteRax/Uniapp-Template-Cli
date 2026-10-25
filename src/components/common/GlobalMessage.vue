<script lang="ts" setup>
import { deepClone, isFunction } from '@wot-ui/ui/common/util'
import { onBeforeUnmount } from 'vue'

const { messageOptions, currentPage } = storeToRefs(useGlobalMessage())

const messageBox = useDialog('globalMessage')
const messageStore = useGlobalMessage()
const currentPath = getCurrentPath()

// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false)

nextTick(() => {
  hackAlipayVisible.value = true
})
// #endif

watch(
  () => messageOptions.value,
  (newVal) => {
    if (newVal) {
      if (currentPage.value === currentPath && currentPath === getCurrentPath()) {
        const option = deepClone(newVal)
        messageBox.show(option).then(
          (res) => {
            if (messageOptions.value === newVal) messageStore.close()
            if (isFunction(option.success)) {
              option.success(res)
            }
          },
          (err) => {
            if (messageOptions.value === newVal) messageStore.close()
            if (isFunction(option.fail)) {
              option.fail(err)
            }
          }
        )
      } else messageBox.close()
    } else {
      messageBox.close()
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  messageBox.close()
  if (currentPage.value === currentPath) messageStore.close()
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
  <wd-dialog v-if="hackAlipayVisible" selector="globalMessage" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-dialog selector="globalMessage" />
  <!-- #endif -->
</template>
