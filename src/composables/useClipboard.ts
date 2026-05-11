export const useClipboard = () => {
  const copy = async (text: string): Promise<boolean> => {
    try {
      // #ifdef H5
      await navigator.clipboard.writeText(text)
      // #endif

      // #ifndef H5
      uni.setClipboardData({
        data: text,
        showToast: false
      })
      // #endif

      return true
    } catch {
      return false
    }
  }

  return { copy }
}
