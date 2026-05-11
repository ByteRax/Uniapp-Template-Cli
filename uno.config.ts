import type { Rule } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import transformerCompileClass from '@unocss/transformer-compile-class'
import { defineConfig, presetIcons, symbols, transformerDirectives, transformerVariantGroup } from 'unocss'
import { generateDarkColorRules, generateDarkColorShortcuts } from './uno-color-mapping.ts'

interface NumericRuleDefinition {
  prefix: string
  properties: string[]
  defaultUnit?: string
}

const DEFAULT_HAIRLINE_COLOR = '#dcdfe6'

type HairlineDirection = 'all' | 't' | 'r' | 'b' | 'l' | 'x' | 'y'

function normalizeHairlineColor(rawColor?: string) {
  if (!rawColor) return DEFAULT_HAIRLINE_COLOR

  if (rawColor.startsWith('[') && rawColor.endsWith(']')) return rawColor.slice(1, -1)

  return rawColor
}

function createHairlineRule(direction: HairlineDirection, rawColor?: string) {
  const color = normalizeHairlineColor(rawColor)
  const borderStyleMap: Record<HairlineDirection, Record<string, string>> = {
    all: { border: `1px solid ${color}` },
    t: { 'border-top': `1px solid ${color}` },
    r: { 'border-right': `1px solid ${color}` },
    b: { 'border-bottom': `1px solid ${color}` },
    l: { 'border-left': `1px solid ${color}` },
    x: {
      'border-left': `1px solid ${color}`,
      'border-right': `1px solid ${color}`
    },
    y: {
      'border-top': `1px solid ${color}`,
      'border-bottom': `1px solid ${color}`
    }
  }

  return [
    { position: 'relative' },
    {
      'content': '""',
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '200%',
      'height': '200%',
      'box-sizing': 'border-box',
      'transform': 'scale(0.5)',
      'transform-origin': '0 0',
      'pointer-events': 'none',
      'border-radius': 'inherit',
      ...borderStyleMap[direction],
      [symbols.selector]: (selector: string) => `${selector}::after`
    }
  ]
}

function createNumericRule({ prefix, properties, defaultUnit = 'rpx' }: NumericRuleDefinition) {
  return [new RegExp(`^${prefix}-(\\d+)(rpx)?$`), ([, value, unit]: string[]) => Object.fromEntries(properties.map((property) => [property, `${value}${unit || defaultUnit}`]))] as Rule
}

const numericRules = [
  { prefix: 'w', properties: ['width'] },
  { prefix: 'h', properties: ['height'], defaultUnit: '!important' },
  { prefix: 'size', properties: ['width', 'height'] },
  { prefix: 'text', properties: ['font-size'], defaultUnit: 'rpx !important' },
  { prefix: 'p', properties: ['padding'] },
  { prefix: 'pl', properties: ['padding-left'] },
  { prefix: 'pr', properties: ['padding-right'] },
  { prefix: 'pt', properties: ['padding-top'] },
  { prefix: 'pb', properties: ['padding-bottom'] },
  { prefix: 'px', properties: ['padding-left', 'padding-right'] },
  { prefix: 'py', properties: ['padding-top', 'padding-bottom'] },
  { prefix: 'm', properties: ['margin'] },
  { prefix: 'mx', properties: ['margin-left', 'margin-right'] },
  { prefix: 'my', properties: ['margin-top', 'margin-bottom'], defaultUnit: 'rpx !important' },
  { prefix: 'ml', properties: ['margin-left'] },
  { prefix: 'mr', properties: ['margin-right'] },
  { prefix: 'mt', properties: ['margin-top'] },
  { prefix: 'mb', properties: ['margin-bottom'] },
  { prefix: 'r', properties: ['border-radius'] },
  { prefix: 'gap-x', properties: ['column-gap'] },
  { prefix: 'gap-y', properties: ['row-gap'] },
  { prefix: 'gap', properties: ['gap'] },
  { prefix: 'btlr', properties: ['border-top-left-radius'] },
  { prefix: 'btrr', properties: ['border-top-right-radius'] },
  { prefix: 'bblr', properties: ['border-bottom-left-radius'] },
  { prefix: 'bbrr', properties: ['border-bottom-right-radius'] }
].map(createNumericRule)

export default defineConfig({
  presets: [
    presetUni({
      // 当前项目未使用 attributify 语法，关闭后可避免 uni 模板属性被误识别成非法样式规则
      attributify: false
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
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
    { 'flex-col-center': 'flex justify-center flex-col' },
    { 'flex-col': 'flex flex-col' },
    { 'flex-row': 'flex flex-row' },
    { 'flex-row-center': 'flex flex-row items-center' },
    {
      'f-b': 'flex justify-between items-center',
      'f-c': 'flex justify-center items-center',
      'f-s': 'flex justify-start items-center',
      'f-e': 'flex justify-end items-center',
      'text-overflow': 'truncate',
      'absolute-full': 'absolute top-0 left-0 w-full h-full',
      'fixed-full': 'fixed top-0 left-0 w-full h-full',
      'wh-full': 'w-full h-full',
      'full': 'w-full h-full'
    }
  ],
  // 动态图标需要在这里配置，或者写在vue页面中注释掉
  // safelist: ['i-carbon-code'],
  rules: [
    // 用法示例：hairline / hairline-t / hairline-x / hairline-red / hairline-b-[#e5e7eb]
    [/^hairline(?:-([trblxy]))?(?:-(.+))?$/, ([, direction, color]) => createHairlineRule((direction || 'all') as HairlineDirection, color) as any],
    [
      'p-safe',
      {
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
      }
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    // 动态规则
    ...numericRules,
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
