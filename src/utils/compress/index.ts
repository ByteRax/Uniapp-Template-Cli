// #ifdef H5
import './compressor.min.js'
// #endif

interface CompressOptions {
  /** 压缩质量，H5 取 0 到 1，非 H5 会转换为 uni.compressImage 的 0 到 100 */
  quality?: number
  /** 目标宽度，未传时保留原图宽度 */
  width?: number
  /** 目标高度，未传时保留原图高度 */
  height?: number
  /** 全部图片压缩成功后的回调 */
  success?: (result: CompressResult[]) => void
  /** 任意图片压缩失败后的回调 */
  fail?: (error: unknown) => void
}

/** 压缩结果：H5 返回 File/Blob，非 H5 返回临时文件路径 */
type CompressResult = File | Blob | string

interface UniCompressImageSuccessResult {
  /** uni.compressImage 生成的临时文件路径 */
  tempFilePath: string
}

// #ifdef H5
interface CompressorOptions {
  quality?: number
  width?: number
  height?: number
  success?: (result: File | Blob) => void
  error?: (error: Error) => void
}

interface CompressorConstructor {
  new (file: File | Blob, options?: CompressorOptions): unknown
}

declare global {
  interface Window {
    Compressor?: CompressorConstructor
  }
}
// #endif

/** 内部使用的压缩配置，保证 quality 始终有默认值 */
type NormalizeCompressOptions = Required<Pick<CompressOptions, 'quality'>> & Omit<CompressOptions, 'quality'>

// #ifdef H5
function convertUrlToFile(imageUrl: string, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    fetch(imageUrl, { method: 'GET', mode: 'cors' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('图片加载失败')
        }

        const blob = await response.blob()
        resolve(new File([blob], fileName, { type: blob.type }))
      })
      .catch(() => {
        reject(new Error('图片 url 转换 Blob 失败'))
      })
  })
}
// #endif

function normalizeOptions(options?: CompressOptions): NormalizeCompressOptions {
  return Object.assign(
    {},
    {
      quality: 0.8
    },
    options
  )
}

function compress(path: string, options?: CompressOptions): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const normalizedOptions = normalizeOptions(options)

    // #ifdef H5
    convertUrlToFile(path, 'compressed-image')
      .then((file) => {
        const Compressor = window.Compressor
        if (!Compressor) {
          reject(new Error('图片压缩组件加载失败'))
          return
        }

        const compressor = new Compressor(file, {
          quality: normalizedOptions.quality,
          width: normalizedOptions.width || undefined,
          height: normalizedOptions.height || undefined,
          success(result: File | Blob) {
            resolve(result)
          },
          error(error: Error) {
            reject(error)
          }
        })
        void compressor
      })
      .catch((error) => {
        reject(error)
      })
    // #endif

    // #ifndef H5
    uni.compressImage({
      src: path,
      compressedWidth: normalizedOptions.width || undefined,
      compressedHeight: normalizedOptions.height || undefined,
      quality: normalizedOptions.quality * 100,
      success(result: UniCompressImageSuccessResult) {
        resolve(result.tempFilePath)
      },
      fail(error) {
        reject(error)
      }
    })
    // #endif
  })
}

/**
 * 批量压缩图片。
 */
export async function compressImages(paths: string[], options?: CompressOptions): Promise<CompressResult[]> {
  const tasks: Array<Promise<CompressResult>> = []

  for (const path of paths) {
    tasks.push(compress(path, options))
  }

  try {
    const result = await Promise.all(tasks)
    options?.success?.(result)
    return result
  } catch (error) {
    options?.fail?.(error)
    throw error
  }
}
