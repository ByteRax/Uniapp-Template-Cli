/**
 * 小程序更新检查 - uni-app 统一 API
 */
const checkMiniProgramUpdate = () => {
  if (!uni.canIUse('getUpdateManager')) {
    console.warn('当前小程序版本过低,不支持自动更新功能')
    return
  }

  const updateManager = uni.getUpdateManager()

  // 检查更新
  updateManager.onCheckForUpdate((res) => {
    console.log('小程序检查更新->', res)

    if (res.hasUpdate) {
      console.log('发现新版本')
      // 新版本下载完成
      updateManager.onUpdateReady(() => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好,是否立即重启应用以获得更好的体验?',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            } else {
              Apis.showToast({
                title: '建议及时更新以获得最佳体验'
              })
            }
          }
        })
      })
      // 新版本下载失败
      updateManager.onUpdateFailed(() => {
        uni.showModal({
          title: '更新失败',
          content: '新版本下载失败,请检查网络连接后重试。或删除当前小程序,重新搜索打开获取最新版本。',
          showCancel: false,
          confirmText: '知道了'
        })
      })
    } else {
      console.log('当前已是最新版本')
    }
  })
}

/**
 * 检查应用更新 - 需要集成第三方 SDK 或使用原生开发
 */
const checkAppUpdate = () => {
  // App 端更新检查逻辑
}

/**
 * 检查应用更新
 * 根据当前平台自动选择对应的更新检查方法
 */
const checkUpdate = () => {
  if (isMp) {
    checkMiniProgramUpdate()
  } else if (isApp) {
    checkAppUpdate()
  } else {
    console.log('当前平台不支持自动更新检查')
  }
}
