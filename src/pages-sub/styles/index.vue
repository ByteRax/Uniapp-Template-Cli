<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: 'UnoCSS 演示'
  }
})

const { success: showSuccess } = useGlobalToast()

// 演示状态
const animationState = ref(false)

// UnoCSS 核心特性
const unocssFeatures = ref([
  {
    icon: '⚡',
    title: '即时按需',
    desc: '只生成你使用的CSS',
    example: 'text-red-500 bg-blue-100'
  },
  {
    icon: '🎨',
    title: '完全可定制',
    desc: '灵活的配置和预设',
    example: 'custom-color-brand'
  },
  {
    icon: '🔧',
    title: '预设丰富',
    desc: '内置Tailwind、Windi等预设',
    example: '@unocss/preset-wind'
  },
  {
    icon: '🚀',
    title: '性能优异',
    desc: '极快的构建速度',
    example: '< 200ms'
  }
])

// 颜色系统演示
const colorCategories = ref([
  {
    name: '灰色系',
    colors: [
      { name: 'gray-50', class: 'bg-gray-50', value: '#f9fafb' },
      { name: 'gray-100', class: 'bg-gray-100', value: '#f3f4f6' },
      { name: 'gray-200', class: 'bg-gray-200', value: '#e5e7eb' },
      { name: 'gray-300', class: 'bg-gray-300', value: '#d1d5db' },
      { name: 'gray-400', class: 'bg-gray-400', value: '#9ca3af' },
      { name: 'gray-500', class: 'bg-gray-500', value: '#6b7280' }
    ]
  },
  {
    name: '主题色',
    colors: [
      { name: 'blue-500', class: 'bg-blue-500', value: '#3b82f6' },
      { name: 'green-500', class: 'bg-green-500', value: '#10b981' },
      { name: 'red-500', class: 'bg-red-500', value: '#ef4444' },
      { name: 'yellow-500', class: 'bg-yellow-500', value: '#f59e0b' },
      { name: 'purple-500', class: 'bg-purple-500', value: '#8b5cf6' },
      { name: 'pink-500', class: 'bg-pink-500', value: '#ec4899' }
    ]
  }
])

// 布局演示数据
const layoutExamples = ref([
  {
    title: 'Flex 居中',
    code: 'flex items-center justify-center',
    class: 'flex items-center justify-center h-160rpx bg-blue-100 rounded-2 text-blue-800'
  },
  {
    title: 'Grid 网格',
    code: 'grid grid-cols-3 gap-16rpx',
    class: 'grid grid-cols-3 gap-16rpx'
  },
  {
    title: 'Space Between',
    code: 'flex justify-between items-center',
    class: 'flex justify-between items-center h-128rpx bg-green-100 rounded-2 px-32rpx text-green-800'
  }
])

// 间距系统
const spacingExamples = ref([
  {
    name: 'p-8rpx',
    value: '4px',
    class: 'p-8rpx bg-red-100 inline-block m-8rpx rounded'
  },
  {
    name: 'p-16rpx',
    value: '8px',
    class: 'p-16rpx bg-blue-100 inline-block m-8rpx rounded'
  },
  {
    name: 'p-32rpx',
    value: '16px',
    class: 'p-32rpx bg-green-100 inline-block m-8rpx rounded'
  },
  {
    name: 'p-48rpx',
    value: '24px',
    class: 'p-48rpx bg-yellow-100 inline-block m-8rpx rounded'
  },
  {
    name: 'p-64rpx',
    value: '32px',
    class: 'p-64rpx bg-purple-100 inline-block m-8rpx rounded'
  }
])

// 字体系统
const fontExamples = ref([
  { name: 'text-xs', size: '12px', class: 'text-xs' },
  { name: 'text-sm', size: '14px', class: 'text-sm' },
  { name: 'text-base', size: '16px', class: 'text-base' },
  { name: 'text-lg', size: '18px', class: 'text-lg' },
  { name: 'text-xl', size: '20px', class: 'text-xl' },
  { name: 'text-2xl', size: '24px', class: 'text-2xl' },
  { name: 'text-3xl', size: '30px', class: 'text-3xl' }
])

// 阴影和效果
const effectExamples = ref([
  { name: 'shadow-sm', class: 'shadow-sm bg-white p-32rpx rounded-2 mb-24rpx' },
  { name: 'shadow', class: 'shadow bg-white p-32rpx rounded-2 mb-24rpx' },
  { name: 'shadow-md', class: 'shadow-md bg-white p-32rpx rounded-2 mb-24rpx' },
  { name: 'shadow-lg', class: 'shadow-lg bg-white p-32rpx rounded-2 mb-24rpx' },
  { name: 'shadow-xl', class: 'shadow-xl bg-white p-32rpx rounded-2 mb-24rpx' }
])

// 切换动画
function toggleAnimation() {
  animationState.value = !animationState.value
  showSuccess({ msg: `动画状态: ${animationState.value ? '开启' : '关闭'}` })
}

// 复制代码
function copyCode(code: string) {
  uni.setClipboardData({
    data: code,
    showToast: false,
    success: () => {
      uni.hideToast()
      showSuccess({ msg: '代码已复制到剪贴板' })
    }
  })
}

// 链接导航处理
function handleNavigate(url: string) {
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data: url,
    showToast: false,
    success: () => {
      uni.hideToast()
      showSuccess({ msg: `${url} 已复制到剪贴板` })
    }
  })
  // #endif
}
</script>

<template>
  <view class="min-h-screen bg-gray-100 py-24rpx dark:bg-[var(--wot-dark-background)]">
    <!-- 头部介绍 -->
    <view class="mx-24rpx mb-24rpx">
      <view class="rounded-3 bg-white text-center px-40rpx py-64rpx dark:bg-[var(--wot-dark-background2)]">
        <view class="text-80rpx mb-24rpx">🎨</view>
        <view class="text-gray-800 font-bold text-48rpx mb-16rpx dark:text-[var(--wot-dark-color)]">UnoCSS 原子化CSS</view>
        <view class="text-3.5 text-gray-600 leading-relaxed mb-2 dark:text-[var(--wot-dark-color2)]">即时按需的原子化CSS引擎</view>
        <view class="text-gray-500 text-24rpx dark:text-[var(--wot-dark-color2)]">具有高性能且极具灵活性的即时原子化CSS引擎</view>
      </view>
    </view>

    <!-- UnoCSS 核心特性 -->
    <demo-block custom-class="unocss-demo-block" title="UnoCSS 核心特性" transparent>
      <view class="grid grid-cols-2 gap-24rpx">
        <view v-for="feature in unocssFeatures" :key="feature.title" class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="text-48rpx mb-16rpx">
            {{ feature.icon }}
          </view>
          <view class="text-3.5 text-gray-800 font-bold mb-8rpx dark:text-[var(--wot-dark-color)]">
            {{ feature.title }}
          </view>
          <view class="text-gray-600 leading-snug text-24rpx mb-16rpx dark:text-[var(--wot-dark-color2)]">
            {{ feature.desc }}
          </view>
          <view class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono px-16rpx py-8rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]">
            {{ feature.example }}
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 颜色系统 -->
    <demo-block custom-class="unocss-demo-block" title="颜色系统" transparent>
      <view v-for="category in colorCategories" :key="category.name" class="mb-32rpx last:mb-0">
        <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">
          {{ category.name }}
        </view>
        <view class="grid grid-cols-3 gap-16rpx">
          <view v-for="color in category.colors" :key="color.name" class="overflow-hidden rounded-2 bg-white shadow-sm dark:bg-[var(--wot-dark-background2)]" @click="copyCode(color.class)">
            <view :class="color.class" class="w-full h-96rpx" />
            <view class="p-16rpx">
              <view class="text-2.5 text-gray-800 font-mono dark:text-[var(--wot-dark-color)]">
                {{ color.name }}
              </view>
              <view class="text-gray-500 text-16rpx dark:text-[var(--wot-dark-color2)]">
                {{ color.value }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 布局系统 -->
    <demo-block custom-class="unocss-demo-block" title="布局系统" transparent>
      <view class="space-y-4">
        <view v-for="example in layoutExamples" :key="example.title" class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="flex items-center justify-between mb-24rpx">
            <view class="text-gray-800 font-bold text-32rpx dark:text-[var(--wot-dark-color)]">
              {{ example.title }}
            </view>
            <view class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono px-16rpx py-8rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode(example.code)">
              {{ example.code }}
            </view>
          </view>
          <view v-if="example.title === 'Flex 居中'" :class="example.class">
            <text class="text-3.5">居中内容</text>
          </view>
          <view v-else-if="example.title === 'Grid 网格'" :class="example.class">
            <view v-for="n in 6" :key="n" class="rounded bg-blue-100 text-center text-blue-800 text-24rpx p-16rpx dark:bg-blue-900/30 dark:text-blue-300">
              {{ n }}
            </view>
          </view>
          <view v-else :class="example.class">
            <text class="text-3.5">左侧</text>
            <text class="text-3.5">右侧</text>
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 间距系统 -->
    <demo-block custom-class="unocss-demo-block" title="间距系统" transparent>
      <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
        <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">内边距 (Padding)</view>
        <view class="text-gray-600 leading-relaxed text-24rpx mb-32rpx dark:text-[var(--wot-dark-color2)]">点击下方色块复制对应的 padding 类名</view>
        <view class="flex flex-wrap items-center gap-16rpx">
          <view v-for="spacing in spacingExamples" :key="spacing.name" :class="spacing.class" class="cursor-pointer" @click="copyCode(spacing.name)">
            <text class="text-2.5 text-gray-700 font-mono">
              {{ spacing.name }}
            </text>
          </view>
        </view>
        <view class="text-2.5 text-gray-500 mt-32rpx dark:text-[var(--wot-dark-color2)]">💡 提示：p-8rpx = 4px, p-16rpx = 8px, p-32rpx = 16px, p-48rpx = 24px, p-64rpx = 32px</view>
      </view>
    </demo-block>

    <!-- 字体系统 -->
    <demo-block custom-class="unocss-demo-block" title="字体系统" transparent>
      <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
        <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">字体大小</view>
        <view class="space-y-3">
          <view v-for="font in fontExamples" :key="font.name" class="flex items-center justify-between border-b border-gray-100 pb-16rpx last:border-b-0 dark:border-[var(--wot-dark-border)]" @click="copyCode(font.name)">
            <text :class="font.class" class="text-gray-800 dark:text-[var(--wot-dark-color)]">字体演示文字</text>
            <view class="flex items-center space-x-2">
              <text class="text-2.5 text-gray-500 dark:text-[var(--wot-dark-color2)]">
                {{ font.size }}
              </text>
              <text class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono px-16rpx py-8rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]">
                {{ font.name }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 阴影效果 -->
    <demo-block custom-class="unocss-demo-block" title="阴影效果" transparent>
      <view class="space-y-3">
        <view v-for="effect in effectExamples" :key="effect.name" :class="effect.class" @click="copyCode(effect.name)">
          <view class="flex items-center justify-between">
            <text class="text-3.5 text-gray-800">阴影效果演示</text>
            <text class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono px-16rpx py-8rpx">
              {{ effect.name }}
            </text>
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 交互效果 -->
    <demo-block custom-class="unocss-demo-block" title="交互效果" transparent>
      <view class="space-y-4">
        <!-- 悬停效果 -->
        <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">悬停效果</view>
          <view class="grid grid-cols-2 gap-24rpx">
            <view class="rounded-2 bg-blue-100 text-center transition-all duration-300 p-32rpx active:scale-95 hover:scale-105 hover:bg-blue-200">
              <text class="text-blue-800 text-24rpx">悬停变色</text>
            </view>
            <view class="rounded-2 bg-green-100 text-center transition-all duration-300 p-32rpx hover:shadow-lg hover:-translate-y-1">
              <text class="text-green-800 text-24rpx">悬停上浮</text>
            </view>
          </view>
          <view class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono p-16rpx mt-24rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode('hover:bg-blue-200 hover:scale-105 transition-all duration-300')">hover:bg-blue-200 hover:scale-105 transition-all duration-300</view>
        </view>

        <!-- 动画效果 -->
        <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">动画效果</view>
          <wd-button block type="primary" @click="toggleAnimation">切换动画状态</wd-button>
          <view class="flex justify-center mt-32rpx">
            <view
              :class="[animationState ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform rotate-12 scale-110 shadow-lg' : 'bg-gray-100 text-gray-800 transform rotate-0 scale-100 shadow-sm dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color)]']"
              class="rounded-2 text-center transition-all duration-500 ease-in-out p-48rpx"
            >
              <text class="font-bold text-32rpx">动画演示</text>
            </view>
          </view>
          <view class="rounded bg-gray-100 text-2.5 text-gray-700 leading-relaxed font-mono p-16rpx mt-24rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode('transition-all duration-500 ease-in-out transform rotate-12 scale-110')">
            transition-all duration-500 ease-in-out\n transform rotate-12 scale-110
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 响应式设计 -->
    <demo-block custom-class="unocss-demo-block" title="响应式设计" transparent>
      <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
        <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">响应式断点</view>
        <view class="text-gray-600 leading-relaxed text-24rpx mb-32rpx dark:text-[var(--wot-dark-color2)]">UnoCSS 支持响应式断点，可以根据屏幕尺寸应用不同样式</view>
        <view class="rounded-2 bg-red-100 text-center p-32rpx mb-32rpx dark:bg-red-900/30 lg:bg-yellow-100 md:bg-blue-100 sm:bg-green-100 dark:lg:bg-yellow-900/30 dark:md:bg-blue-900/30 dark:sm:bg-green-900/30">
          <text class="text-3.5 text-gray-800 font-bold dark:text-[var(--wot-dark-color)]">响应式背景色</text>
        </view>
        <view class="grid grid-cols-1 gap-24rpx lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          <view v-for="n in 8" :key="n" class="rounded bg-purple-100 text-center text-purple-800 text-24rpx p-24rpx dark:bg-purple-900/30 dark:text-purple-300">项目 {{ n }}</view>
        </view>
        <view class="rounded bg-gray-100 text-2.5 text-gray-700 leading-relaxed font-mono p-16rpx mt-32rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4')">
          grid-cols-1 sm:grid-cols-2\n md:grid-cols-3 lg:grid-cols-4
        </view>
      </view>
    </demo-block>

    <!-- 实用工具类 -->
    <demo-block custom-class="unocss-demo-block" title="实用工具类" transparent>
      <view class="space-y-4">
        <!-- 显示隐藏 -->
        <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">显示/隐藏</view>
          <view class="flex flex-wrap mb-24rpx gap-16rpx">
            <view class="rounded bg-green-100 text-green-800 text-24rpx px-24rpx py-16rpx">显示 (block)</view>
            <view class="rounded bg-blue-100 text-blue-800 text-24rpx px-24rpx py-16rpx">内联 (inline)</view>
            <view class="rounded bg-purple-100 text-purple-800 text-24rpx px-24rpx py-16rpx">弹性 (flex)</view>
          </view>
          <view class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono p-16rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode('block inline flex hidden')">block inline flex hidden</view>
        </view>

        <!-- 定位 -->
        <view class="rounded-2 bg-white p-32rpx dark:bg-[var(--wot-dark-background2)]">
          <view class="text-gray-800 font-bold text-32rpx mb-24rpx dark:text-[var(--wot-dark-color)]">定位系统</view>
          <view class="relative rounded-2 bg-gray-100 h-192rpx dark:bg-[var(--wot-dark-background3)]">
            <view class="absolute left-2 top-2 rounded bg-red-500 text-2.5 text-white px-16rpx py-8rpx">top-2 left-2</view>
            <view class="absolute right-2 top-2 rounded bg-blue-500 text-2.5 text-white px-16rpx py-8rpx">top-2 right-2</view>
            <view class="absolute bottom-2 left-2 rounded bg-green-500 text-2.5 text-white px-16rpx py-8rpx">bottom-2 left-2</view>
            <view class="absolute bottom-2 right-2 rounded bg-purple-500 text-2.5 text-white px-16rpx py-8rpx">bottom-2 right-2</view>
          </view>
          <view class="rounded bg-gray-100 text-2.5 text-gray-700 font-mono p-16rpx mt-24rpx dark:bg-[var(--wot-dark-background3)] dark:text-[var(--wot-dark-color2)]" @click="copyCode('absolute relative top-2 left-2 right-2 bottom-2')">absolute relative top-2 left-2 right-2 bottom-2</view>
        </view>
      </view>
    </demo-block>

    <!-- 相关链接 -->
    <demo-block custom-class="unocss-demo-block" title="相关链接" transparent>
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell is-link title="📚 UnoCSS 官方文档" value="unocss.dev" @click="handleNavigate('https://unocss.dev/')" />
        <wd-cell is-link title="🐙 GitHub 仓库" value="unocss/unocss" @click="handleNavigate('https://github.com/unocss/unocss')" />
        <wd-cell is-link title="🎮 在线演练场" value="在线体验" @click="handleNavigate('https://unocss.dev/play/')" />
        <wd-cell is-link title="📖 Tailwind CSS" value="参考文档" @click="handleNavigate('https://tailwindcss.com/docs')" />
        <wd-cell is-link title="💡 最佳实践" value="使用指南" @click="handleNavigate('https://unocss.dev/guide/')" />
      </wd-cell-group>
    </demo-block>
  </view>
</template>
