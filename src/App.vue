<script lang="ts" setup>
onLaunch(() => {
  // console.log('初始化完成时触发')
})
onShow(() => {
  // console.log('启动，或从后台进入前台显示')
})
onHide(() => {
  // console.log('从前台进入后台')
})
onError((error) => {
  console.error('App Error', error)
})
onPageNotFound(() => {
  console.error('App Page Not Found')
  router.notFound()
})
</script>
