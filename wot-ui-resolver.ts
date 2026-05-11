import type { ComponentResolver } from '@uni-helper/vite-plugin-uni-components'
import { kebabCase } from '@uni-helper/vite-plugin-uni-components'

/**
 * Wot UI V2 的 npm 包组件路径已迁移到 @wot-ui/ui，需要使用官方推荐的解析规则。
 */
export function WotResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.match(/^Wd[A-Z]/)) {
        const compName = kebabCase(name)

        return {
          name,
          from: `@wot-ui/ui/components/${compName}/${compName}.vue`
        }
      }

      return undefined
    }
  }
}
