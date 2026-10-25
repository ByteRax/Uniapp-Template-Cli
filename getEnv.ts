// 手动解析命令行参数获取 mode
import path from 'node:path'
import process from 'node:process'

import { loadEnv } from 'vite'

export function getMode(args = process.argv.slice(2), userNodeEnv = process.env['VITE_USER_NODE_ENV']): string {
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--mode' || arg === '-m' || arg?.startsWith('--mode=')) {
      const mode = arg === '--mode' || arg === '-m' ? args[index + 1] : arg.slice('--mode='.length)
      if (!mode || mode.startsWith('-')) throw new Error('--mode requires a value')
      return mode
    }
  }
  return isBuildCommand(args, userNodeEnv) ? 'production' : 'development'
}

export function isBuildCommand(args = process.argv.slice(2), userNodeEnv = process.env['VITE_USER_NODE_ENV']): boolean {
  if (userNodeEnv) return userNodeEnv === 'production'
  return args.includes('build') && !args.includes('--watch') && !args.includes('-w')
}
// 获取环境变量的范例
export const env = loadEnv(getMode(), path.resolve(process.cwd(), 'env'))
