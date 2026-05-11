import { buildUrlWithParams as _buildUrlWithParams } from '@wot-ui/ui/common/util'

// /**
//  * 获取字符串的字素长度（grapheme length）
//  * @param str - 要计算长度的字符串
//  * @returns 字符串的字素数量
//  * @example
//  * ```
//  * console.log(getGraphemeLength('a'));   // 输出：1
//  * console.log(getGraphemeLength('中'));   // 输出：1
//  * console.log(getGraphemeLength('👦🏻'));  // 输出：1
//  * console.log(getGraphemeLength('😂'));   // 输出：1
//  * console.log(getGraphemeLength('👩•👩•👧•👦'));  // 输出：1 (家庭emoji)
//  * ```
//  */
// export function getGraphemeLength(str: string) {
//   const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
//   const segments = segmenter.segment(str)
//   return [...segments].length
// }

/**
 * 构建带参数的URL
 * @param baseUrl 基础URL
 * @param params 参数对象，键值对表示要添加到URL的参数
 * @returns 返回带有参数的URL
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, string>) {
  return _buildUrlWithParams(baseUrl, params)
}
