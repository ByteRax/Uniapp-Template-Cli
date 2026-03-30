import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'
// vite-plugin-auto-version.ts
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import dayjs from 'dayjs'

interface AutoVersionPluginOptions {
  file?: string // package.json 路径
  type?: 'patch' | 'minor' | 'major' // 版本类型
  inject?: boolean // 是否注入到构建中
}

/**
 * 自动版本管理插件，用于在构建过程中自动更新项目版本号、Git 提交信息等。
 * 支持注入版本信息到代码中，适用于需要动态获取版本的前端项目。
 *
 * @param options - 插件配置项，包含文件路径、版本更新类型和是否注入等选项
 * @returns Vite 插件对象
 */
export function AutoVersion(options: AutoVersionPluginOptions = {}): Plugin {
  const { file = 'package.json', type = 'patch', inject = true } = options
  let isBuild = false
  let manifestPath: string
  let packagePath: string
  let buildDate: string
  let gitCommitHash: string = 'unknown'
  let gitCommitDate: string = ''

  return {
    name: 'auto-version',
    enforce: 'pre', // 在其他插件之前运行

    /**
     * Vite 配置解析阶段钩子，判断当前是否为构建命令
     * @param config - Vite 配置对象
     * @param env - 环境信息，包括命令类型等
     */
    config(config, { command }) {
      isBuild = command === 'build' && process.env['NODE_ENV'] === 'production'
    },

    /**
     * Vite 配置确认阶段钩子，在此阶段完成路径初始化和版本信息更新逻辑
     * @param resolvedConfig - 已解析的 Vite 配置对象
     */
    configResolved(resolvedConfig) {
      manifestPath = `${resolvedConfig.root}/src/manifest.json`
      packagePath = resolve(resolvedConfig.root, file)

      // 获取构建时间和 Git 提交信息
      try {
        buildDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
        gitCommitHash = execSync('git rev-parse --short HEAD', {
          encoding: 'utf-8'
        }).trim()
        gitCommitDate = execSync('git show -s --format=%ci HEAD', {
          encoding: 'utf-8'
        }).trim()
      } catch {
        gitCommitHash = 'unknown'
        gitCommitDate = 'unknownDate'
      }

      // 构建阶段才执行版本更新逻辑
      if (isBuild) {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
        const oldVersionCode = packageJson.versionCode
        const newVersionCode = ProcessVersionCode(oldVersionCode)
        const oldVersionName = packageJson.version
        const newVersionName = IncrementVersionName(packageJson.version, type, newVersionCode)

        // 更新 package.json 中的版本信息
        packageJson.version = newVersionName
        packageJson.versionCode = newVersionCode
        packageJson.gitHash = gitCommitHash
        packageJson.buildDate = buildDate
        writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))

        // 更新 manifest.json 中的版本信息
        const manifestJson = readFileSync(manifestPath, 'utf-8')
        let newManifestJson = replaceManifest(manifestJson, 'versionCode', `"${newVersionCode}"`)
        newManifestJson = replaceManifest(newManifestJson, 'versionName', `"${newVersionName}"`)
        writeFileSync(manifestPath, newManifestJson)

        console.log(`Version updated from ${oldVersionName} to ${newVersionName}`)
      }
    },

    /**
     * 在开发阶段，Vite 调用此钩子来请求插件对特定文件进行转换。
     * 主要用于将版本信息注入到代码中的占位符变量中。
     * @param code - 原始代码内容
     * @param id - 文件标识符（通常是文件路径）
     * @returns 转换后的代码或原始代码
     */
    transform(code, id) {
      const versionName = '__APP_VERSION__'

      // 如果启用了注入功能且代码中包含版本占位符，则进行替换
      if (inject && code.includes(versionName)) {
        try {
          const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

          // 创建替换映射
          const replacements = {
            [versionName]: `"${packageJson.version}"`,
            __APP_BUILD_DATE__: JSON.stringify(buildDate),
            __APP_GIT_HASH__: JSON.stringify(gitCommitHash),
            __APP_GIT_DATE__: JSON.stringify(gitCommitDate)
          }

          // 一次性完成所有替换
          let result = code
          for (const [searchValue, replaceValue] of Object.entries(replacements)) {
            if (code.includes(searchValue)) {
              const regex = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
              result = result.replace(regex, replaceValue)
            }
          }

          return {
            code: result,
            map: null // 不生成 source map，消除警告
          }
        } catch {
          return code.replace(new RegExp(versionName, 'g'), '"unknown"')
        }
      }

      return {
        code,
        map: null // 不生成 source map，消除警告
      }
    }
  }
}

/**
 * 根据指定的版本类型递增版本号
 * @param version 当前版本号字符串，格式为 "major.minor.patch"
 * @param type 版本递增类型，可选值为 'patch'（补丁版本）、'minor'（次版本）、'major'（主版本）
 * @param endVersionCode 新的补丁版本号，用于替换原版本号中的patch部分
 * @returns 递增后的新版本号字符串
 */
function IncrementVersionName(version: string, type: 'patch' | 'minor' | 'major', endVersionCode: string): string {
  // 解析版本号为数字数组，提供默认值 0
  const parts = version.split('.').map(Number)
  const major = parts[0] ?? 0
  const minor = parts[1] ?? 0
  const patch = parts[2] ?? 0

  switch (type) {
    case 'major':
      // 主版本号递增，次版本号重置为0，补丁版本号使用新值
      return `${major + 1}.0.${endVersionCode}`
    case 'minor':
      // 次版本号递增，补丁版本号使用新值
      return `${major}.${minor + 1}.${endVersionCode}`
    case 'patch':
      // 补丁版本号使用新值
      return `${major}.${minor}.${endVersionCode}`
    default:
      // 类型不匹配时返回原版本号
      return version
  }
}

/**
 * 处理版本号，根据日期前缀和自增规则生成新的版本号
 * @param version - 输入的版本号字符串
 * @returns 处理后的版本号字符串，格式为YYYYMMDDNN
 */
function ProcessVersionCode(version: string): string {
  // 获取今天的日期 (YYYYMMDD)
  const todayDate = dayjs().format('YYYYMMDD')

  // 检查是否以8位数字日期开头
  const isDatePrefix = /^\d{8}/.test(version) && version.length >= 8

  let endVersionCode = '01'
  // 规则1: 不是日期开头 -> YYYYMMDD01
  if (!isDatePrefix) {
    return `${todayDate}${endVersionCode}`
  }

  const datePrefix = version.substring(0, 8)

  // 规则2: 日期开头但不是今天 -> YYYYMMDD01
  if (datePrefix !== todayDate) {
    return `${todayDate}${endVersionCode}`
  }

  // 规则3: 今天日期开头，则末尾版本号自增
  if (datePrefix === todayDate) {
    const endingStr = version.substring(8)
    if (endingStr) {
      endVersionCode = `${Number.parseInt(endingStr) + 1}`.padStart(2, '0')
    }
    return `${todayDate}${endVersionCode}`
  }
  // 其他情况保持不变
  return version
}

/**
 * 替换manifest文件中指定路径的值
 * @param manifest - 原始manifest文件内容字符串
 * @param path - 需要替换的属性路径，使用点号分隔（例如："app.name"）
 * @param value - 要设置的新值
 * @returns 替换后的manifest文件内容字符串
 */
function replaceManifest(manifest: string, path: string, value: string) {
  // 解析路径数组和相关信息
  const arr = path.split('.')
  const len = arr.length
  const lastItem = arr[len - 1]

  if (!lastItem) {
    return manifest
  }

  let i = 0
  const manifestArr = manifest.split(/\n/)

  // 遍历manifest的每一行，查找并替换指定路径的值
  for (let index = 0; index < manifestArr.length; index++) {
    const item = manifestArr[index]
    if (item && new RegExp(`"${arr[i]}"`).test(item)) ++i
    if (i === len && item) {
      // 检查当前行是否有逗号，用于保持原有的格式
      const hasComma = /,/.test(item)
      manifestArr[index] = item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? ',' : ''}`)
      break
    }
  }
  return manifestArr.join('\n')
}
