import { ref, computed, onMounted, onUnmounted } from 'vue'

type ScreenType = 'mobile' | 'tablet' | 'desktop'

export const useMediaQuery = () => {
  const windowWidth = ref(0)
  const windowHeight = ref(0)
  const breakpoints = { mobile: 768, tablet: 1024 }

  const updateWindowSize = () => {
    const systemInfo = uni.getSystemInfoSync()
    windowWidth.value = systemInfo.windowWidth
    windowHeight.value = systemInfo.windowHeight
  }

  const screenType = computed<ScreenType>(() => {
    if (windowWidth.value < breakpoints.mobile) return 'mobile'
    if (windowWidth.value < breakpoints.tablet) return 'tablet'
    return 'desktop'
  })

  const isMobile = computed(() => screenType.value === 'mobile')
  const isTablet = computed(() => screenType.value === 'tablet')
  const isDesktop = computed(() => screenType.value === 'desktop')

  // #ifdef H5
  let resizeHandler: (() => void) | null = null
  onMounted(() => {
    updateWindowSize()
    resizeHandler = updateWindowSize
    window.addEventListener('resize', resizeHandler)
  })
  onUnmounted(() => {
    if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  })
  // #endif

  // #ifndef H5
  onMounted(() => updateWindowSize())
  // #endif

  return { isMobile, isTablet, isDesktop, screenType, windowWidth, windowHeight }
}
