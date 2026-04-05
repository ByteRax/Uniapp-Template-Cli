import { presetUni } from '@uni-helper/unocss-preset-uni'
import transformerCompileClass from '@unocss/transformer-compile-class'
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'
import { generateDarkColorRules, generateDarkColorShortcuts } from './uno-color-mapping'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true // 属性化模式需要前缀
      }
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    // 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
    transformerVariantGroup(),
    // 将一组类合并编译为一个单独的类【在类名字符串前添加 :uno: 来标记它们以进行合并编译。】
    transformerCompileClass()
  ],
  shortcuts: [
    // 生成的暗色模式颜色快捷方式
    ...generateDarkColorShortcuts(),
    { 'flex-center': 'flex justify-center items-center' },
    { 'flex-col-center': 'flex justify-center items-center flex-col' },
    { 'flex-col': 'flex flex-col' },
    { 'flex-row': 'flex flex-row' },
    {
      'f-b': 'flex justify-between items-center',
      'f-c': 'flex justify-center items-center',
      'f-s': 'flex justify-start items-center',
      'f-e': 'flex justify-end items-center',
      'text-overflow': 'truncate',
      'absolute-full': 'absolute top-0 left-0 w-full h-full',
      'fixed-full': 'fixed top-0 left-0 w-full h-full',
      'wh-full': 'w-full h-full'
    }
  ],
  // 动态图标需要在这里配置，或者写在vue页面中注释掉
  // safelist: ['i-carbon-code'],
  rules: [
    [
      'p-safe',
      {
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
      }
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    // 动态规则
    [/^size-(\d+)$/, ([, d]) => ({ width: `${d}rpx`, height: `${d}rpx` })],
    // 动态暗色模式颜色规则
    ...generateDarkColorRules()
  ],
  theme: {
    colors: {
      /** 主题色，用法如: text-primary */
      primary: 'var(--wot-color-theme,#0957DE)'
    },
    fontSize: {
      /** 提供更小号的字体，用法如：text-2xs */
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx']
    },
    platforms: {
      wechat: 'mp-weixin',
      web: 'h5'
    }
  }
})
