<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '下拉刷新上拉加载框架'
  },
  needLogin: true
})
const { page, paging } = useGlobalPage()
const dataList = ref<ZPagingVirtualItem<{ title: string }>[]>([])
function queryList(pageNo: number, pageSize: number) {
  setTimeout(() => {
    let listData = []
    for (let i = 0; i < 80; i++) {
      listData.push({
        title: `测试数据${i}${pageSize}`
      })
    }
    if (pageNo === 3) {
      listData = []
    }
    paging?.value?.complete(listData)
    page?.value?.showSuccess()
  }, 500)
}
onMounted(() => {
  // paging?.value.
})
</script>

<template>
  <base-layout ref="page">
    <z-paging
      ref="paging"
      :force-close-inner-list="true"
      cell-height-mode="dynamic"
      use-virtual-list
      @query="queryList"
      @virtual-list-change="(vList: ZPagingVirtualItem<{ title: string }>[]) => (dataList = vList)"
    >
      <view v-for="item in dataList" :id="`zp-id-${item.zp_index}`" :key="item.zp_index" class="block">
        <text>测试列表XXXXXXXXXX</text>
      </view>
    </z-paging>
  </base-layout>
</template>
