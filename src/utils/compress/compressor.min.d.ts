interface CompressorOptions {
  quality?: number
  width?: number
  height?: number
  success?(result: File | Blob): void
  error?(error: Error): void
}

declare class Compressor {
  constructor(file: File | Blob, options?: CompressorOptions)
}

export default Compressor
