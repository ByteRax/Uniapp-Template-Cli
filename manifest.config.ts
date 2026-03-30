import { readFileSync } from 'node:fs'
import path from 'node:path'
// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import { env } from './getEnv'

const packageJsonPath = path.resolve(__dirname, 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const { VITE_APP_TITLE, VITE_UNI_APPID, VITE_WX_APPID, VITE_APP_PUBLIC_BASE, VITE_FALLBACK_LOCALE, VITE_USER_NODE_ENV } = env
const isBuild = VITE_USER_NODE_ENV === 'production'

export default defineManifestConfig({
  name: `${VITE_APP_TITLE}-${isBuild ? 'release' : 'debug'}`,
  appid: `${VITE_UNI_APPID}`,
  description: packageJson?.description ?? '',
  versionName: packageJson?.version ?? '1.0.0',
  versionCode: packageJson?.versionCode ?? '100',
  transformPx: false,
  locale: VITE_FALLBACK_LOCALE, // 'zh-Hans'
  h5: {
    router: {
      base: VITE_APP_PUBLIC_BASE
    },
    darkmode: true,
    themeLocation: 'theme.json'
  },
  /* 5+App特有相关 */
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    compatible: {
      ignoreVersion: true
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0
    },
    /* 模块配置 */
    modules: {},
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        minSdkVersion: 21,
        targetSdkVersion: 30,
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>'
        ]
      },
      /* ios打包配置 */
      ios: {},
      /* SDK配置 */
      sdkConfigs: {},
      /* 图标配置 */
      icons: {
        android: {
          hdpi: 'static/app/icons/72x72.png',
          xhdpi: 'static/app/icons/96x96.png',
          xxhdpi: 'static/app/icons/144x144.png',
          xxxhdpi: 'static/app/icons/192x192.png'
        },
        ios: {
          appstore: 'static/app/icons/1024x1024.png',
          ipad: {
            app: 'static/app/icons/76x76.png',
            'app@2x': 'static/app/icons/152x152.png',
            notification: 'static/app/icons/20x20.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'proapp@2x': 'static/app/icons/167x167.png',
            settings: 'static/app/icons/29x29.png',
            'settings@2x': 'static/app/icons/58x58.png',
            spotlight: 'static/app/icons/40x40.png',
            'spotlight@2x': 'static/app/icons/80x80.png'
          },
          iphone: {
            'app@2x': 'static/app/icons/120x120.png',
            'app@3x': 'static/app/icons/180x180.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'notification@3x': 'static/app/icons/60x60.png',
            'settings@2x': 'static/app/icons/58x58.png',
            'settings@3x': 'static/app/icons/87x87.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
            'spotlight@3x': 'static/app/icons/120x120.png'
          }
        }
      }
    }
  },
  /* 快应用特有相关 */
  quickapp: {},
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    projectname: `${VITE_APP_TITLE}-${isBuild ? 'release' : 'debug'}`,
    setting: {
      urlCheck: false,
      minified: isBuild, // 上传代码时是否自动压缩脚本文件
      minifyWXSS: isBuild, // 上传代码时是否自动压缩样式文件
      minifyWXML: isBuild, // 上传代码时是否自动压缩 WXML 文件
      postcss: false, // 上传代码时样式是否自动补全
      uglifyFileName: isBuild, // 上传时进行代码保护
      swc: true, // 开启 swc 编译模式
      ignoreUploadUnusedFiles: isBuild // 上传时是否过滤无依赖文件
    },
    darkmode: true,
    themeLocation: 'theme.json',
    optimization: {
      subPackages: true
    },
    lazyCodeLoading: 'requiredComponents',
    // 是否合并组件虚拟节点外层属性，uni-app 3.5.1+ 开始支持。目前仅支持 style、class 属性。
    // 默认不开启（undefined），这里设置为开启。
    mergeVirtualHostAttributes: true,
    usingComponents: true,
    libVersion: 'latest'
    // 处理微信开发者工具报错
  },
  'mp-alipay': {
    usingComponents: true,
    styleIsolation: 'shared',
    optimization: {
      subPackages: true
    },
    // 解决支付宝小程序开发工具报错 【globalThis is not defined】
    compileOptions: {
      globalObjectMode: 'enable',
      transpile: {
        script: {
          ignore: ['node_modules/**']
        }
      }
    }
  },
  'mp-baidu': {
    usingComponents: true
  },
  'mp-toutiao': {
    usingComponents: true
  },
  uniStatistics: {
    enable: false
  },
  vueVersion: '3'
})
