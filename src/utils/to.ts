/**
 * 将 Promise 转换为 [error, data] 元组形式
 * 用于异步错误处理，避免 try-catch 嵌套
 * @param promise 要处理的 Promise
 * @returns [错误, 数据] 元组，成功时错误为 null，失败时数据为 null
 */
export const to = async <T>(promise: Promise<T>): Promise<[Error | null, T | null]> => {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}
