import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { env } from './getEnv'

const { VITE_APP_TITLE } = env
export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    // 导航栏配置
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: `${VITE_APP_TITLE}`,
    // 页面背景配置
    backgroundColor: '@bgColor',
    backgroundTextStyle: '@bgTxtStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',
    // 下拉刷新配置
    enablePullDownRefresh: false,
    onReachBottomDistance: 50
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': '@wot-ui/ui/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue'
    }
  },
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['pages-sub']
    }
  }
})
