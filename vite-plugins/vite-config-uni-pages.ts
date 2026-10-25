import type { PageContext } from '@uni-helper/vite-plugin-uni-pages'
import fs from 'node:fs'
import path from 'node:path'
import * as prettier from 'prettier'

export function handlePageName(pages: PageContext['pageMetaData']) {
  pages.forEach((page) => {
    // 主包、分包都保留显式名称；只有缺失时才按路径生成。
    if (!page['name']) page['name'] = page.path.replace(/[/.-]/g, '_').toUpperCase()
  })
}

export function handleSubPackagePageName(subPackages: PageContext['subPageMetaData']) {
  subPackages.forEach((subPackage) => handlePageName(subPackage.pages))
}

export async function writePageConst(ctx: Pick<PageContext, 'pageMetaData' | 'subPageMetaData'>) {
  const pageConstEntries: string[] = []
  const pages: PageContext['pageMetaData'] = [...ctx.pageMetaData, ...ctx.subPageMetaData.flatMap((subPackage) => subPackage.pages.map((page) => ({ ...page, path: `${subPackage.root}/${page.path}` })))]
  pages.forEach((page) => {
    // 使用标题作为注释
    const comment = `/** ${page.style?.navigationBarTitleText || ''} */`
    // name 作为唯一键
    pageConstEntries.push(`${comment}\n${JSON.stringify(page['name'])}: ${JSON.stringify(`/${page.path}`)},\n`)
  })
  // 如果你是 ts 项目，可以对照参考改为 enum 或者其他形式
  const fileContent = `
  /*******************************
   * 此文件由脚本自动生成，请勿手动修改 *
   *******************************/
  /**
   * 页面路径常量
   */
  export const PageUrlConst = {\n${pageConstEntries.join('\n')}\n}
  `
  const filepath = path.resolve(__dirname, '../src/router/pageConst.ts')
  console.warn('生成路径', filepath)
  try {
    // 确保目录存在
    const dir = path.dirname(filepath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    // 如果你不需要 prettier 美化代码，可以跳过该步骤，直接写入文件
    const prettierConfig = await prettier.resolveConfig(filepath)
    const formattedContent = await prettier.format(fileContent, {
      ...prettierConfig,
      filepath
    })
    fs.writeFileSync(filepath, formattedContent, {
      encoding: 'utf-8'
    })
    console.warn(`✅ 页面路径常量文件已成功生成：${filepath}`)
  } catch (error) {
    const err = error as Error
    console.error(`❌ 生成页面路径常量文件失败：${err.message}`)
    console.error('错误详情：', error)
  }
}
