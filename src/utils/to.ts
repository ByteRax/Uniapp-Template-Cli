// 源码实现
export const to = async <T>(promise: Promise<T>): Promise<[Error | null, T | null]> => {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    // 关键：统一转换为 Error 类型
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}
