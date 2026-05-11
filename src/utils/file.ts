import { compressImages } from '@/utils/compress'

/** uni.chooseImage 返回的临时文件最小字段集合。 */
interface TempFileLike {
  /** 图片文件大小，单位为字节。 */
  size?: number
  /** 图片文件名，部分平台可能不返回。 */
  name?: string
}

/** 页面可直接预览或提交的本地图片文件。 */
export interface SelectedImageFile {
  /** 图片展示地址，H5 压缩后可能是 object URL。 */
  url: string
  /** 图片本地路径或临时访问地址。 */
  path: string
  /** 图片文件大小，单位为字节。 */
  size?: number
  /** 图片文件名，用于日志和调试展示。 */
  name?: string
}

/** 单张图片压缩前后的大小变化日志。 */
export interface ImageCompressionLogItem {
  name: string
  originalSizeText: string
  compressedSizeText: string
  savedSizeText: string
  savedPercentText: string
}

/** 选择并压缩图片的配置。 */
interface ChooseCompressedImagesOptions {
  count: number
  quality?: number
  sourceType?: Array<'album' | 'camera'>
  sizeType?: Array<'original' | 'compressed'>
}

/** 选择并压缩图片后的结果。 */
interface ChooseCompressedImagesResult {
  images: SelectedImageFile[]
  compressionLog: ImageCompressionLogItem[]
}

/**
 * 格式化文件大小，未知或无效大小统一返回占位文案。
 */
export function formatFileSize(size?: number): string {
  if (!size) {
    return '未知'
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

function normalizeImagePath(path: string, file?: TempFileLike): SelectedImageFile {
  const segments = path.split('/')
  return {
    url: path,
    path,
    size: file?.size,
    name: file?.name || segments[segments.length - 1]
  }
}

function getCompressedImageUrl(result: File | Blob | string): string {
  if (typeof result === 'string') {
    return result
  }
  return URL.createObjectURL(result)
}

export function getFileSize(path: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    uni.getFileInfo({
      filePath: path,
      success: (result) => {
        resolve(result.size)
      },
      fail: () => {
        resolve(undefined)
      }
    })
  })
}

async function getCompressedImageSize(result: File | Blob | string): Promise<number | undefined> {
  if (typeof result === 'string') {
    return getFileSize(result)
  }
  return result.size
}

function buildCompressionLogItem(originalImage: SelectedImageFile, compressedImage: SelectedImageFile): ImageCompressionLogItem {
  const originalSize = originalImage.size
  const compressedSize = compressedImage.size
  const savedSize = originalSize && compressedSize ? Math.max(originalSize - compressedSize, 0) : undefined
  const savedPercent = originalSize && savedSize !== undefined ? `${((savedSize / originalSize) * 100).toFixed(1)}%` : '未知'

  return {
    name: originalImage.name || originalImage.path,
    originalSizeText: formatFileSize(originalSize),
    compressedSizeText: formatFileSize(compressedSize),
    savedSizeText: formatFileSize(savedSize),
    savedPercentText: savedPercent
  }
}

function chooseImages(options: ChooseCompressedImagesOptions): Promise<SelectedImageFile[]> {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: options.count,
      sizeType: options.sizeType || ['compressed'],
      sourceType: options.sourceType || ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = Array.isArray(result.tempFilePaths) ? result.tempFilePaths : [result.tempFilePaths]
        const tempFiles = Array.isArray(result.tempFiles) ? result.tempFiles : [result.tempFiles]
        resolve(tempFilePaths.map((path, index) => normalizeImagePath(path, tempFiles[index])))
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/** 图片选择、压缩和文件信息处理工具。 */
export class ImageFileUtil {
  /**
   * 选择图片后立即压缩，返回压缩后的图片和压缩前后大小变化。
   */
  static async chooseCompressedImages(options: ChooseCompressedImagesOptions): Promise<ChooseCompressedImagesResult> {
    const selectedImages = await chooseImages(options)
    const originalSizes = await Promise.all(
      selectedImages.map((item) => {
        return item.size ? Promise.resolve(item.size) : getFileSize(item.path)
      })
    )
    const compressedResults = await compressImages(
      selectedImages.map((item) => item.path),
      { quality: options.quality ?? 0.72, width: 1080, height: 1080 }
    )
    const compressedSizes = await Promise.all(compressedResults.map(getCompressedImageSize))
    const images = compressedResults.map((result, index) => {
      const sourceImage = selectedImages[index]
      const path = getCompressedImageUrl(result)
      return {
        url: path,
        path,
        size: compressedSizes[index],
        name: sourceImage?.name
      }
    })
    const compressionLog = images.map((item, index) => {
      const sourceImage = selectedImages[index]
      if (!sourceImage) {
        return buildCompressionLogItem(item, item)
      }
      return buildCompressionLogItem(
        {
          ...sourceImage,
          size: originalSizes[index]
        },
        item
      )
    })

    return {
      images,
      compressionLog
    }
  }
}
