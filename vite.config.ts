// eslint-disable-next-line ts/ban-ts-comment -- 某些第三方库（如 @uni-helper/vite-plugin-uni-manifest 和 dayjs）使用 export = 语法，虽然 tsconfig 中已启用 esModuleInterop，但 IDE 仍报类型错误。运行时能够正确处理这些导入，因此使用 ts-nocheck 忽略类型检查
// @ts-nocheck
import type { ConfigEnv } from 'vite'
import * as path from 'node:path'
import * as process from 'node:process'
import CompressJson from '@binbinji/unplugin-compress-json/vite'
import Uni from '@uni-helper/plugin-uni'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
// @see https://github.com/uni-helper/vite-plugin-uni-manifest
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from '@uni-helper/vite-plugin-uni-pages'
/**
 * 分包优化、模块异步跨包调用、组件异步跨包引用
 * @see https://github.com/uni-ku/bundle-optimizer
 */
import UniOptimization from '@uni-ku/bundle-optimizer'
import UniKuRoot from '@uni-ku/root'
import UnoCSS from '@unocss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import dayjs from 'dayjs'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'
import ViteRestart from 'vite-plugin-restart'
import { handlePageName } from './vite-plugins/vite-config-uni-pages'
import openDevTools from './vite-plugins/vite-open-dev-tools'
import { AutoVersion } from './vite-plugins/vite-plugin-auto-version'

// https://vitejs.dev/config/
export default async ({ mode }: ConfigEnv) => {
  const { UNI_PLATFORM, VITE_USER_NODE_ENV, SKIP_OPEN_DEVTOOLS } = process.env
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const { VITE_APP_PORT, VITE_SERVER_BASEURL, VITE_APP_TITLE, VITE_DELETE_CONSOLE, VITE_APP_PUBLIC_BASE, VITE_APP_PROXY_ENABLE, VITE_APP_PROXY_PREFIX } = env
  const isBuild = VITE_USER_NODE_ENV === 'production'
  console.warn('UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  return defineConfig({
    envDir: './env', // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    optimizeDeps: {
      exclude: isBuild ? ['wot-design-uni'] : []
    },

    plugins: [
      AutoVersion({
        type: 'patch', // 可选: 'patch', 'minor', 'major'
        inject: true
      }),
      await UniHelperManifest(),
      UniPages({
        dts: 'src/types/uni-pages.d.ts',
        subPackages: ['src/pages-sub'],
        onAfterMergePageMetaData: (ctx) => {
          handlePageName(ctx, 'pageMetaData')
          handlePageName(ctx, 'subPageMetaData')
        },
        exclude: ['**/components/**/*.*', '**/layout/**/*.*']
      }),
      // Components 需要在 Uni 之前引入
      UniComponents({
        resolvers: [WotResolver()],
        extensions: ['vue'],
        deep: true, // 是否递归扫描子目录，
        directoryAsNamespace: false, // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: 'src/types/components.d.ts', // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
        dirs: ['src/components', 'src/layout']
      }),
      UniKuRoot({
        enabledGlobalRef: true
      }),
      Uni(),
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: 'fix-vite-plugin-vue',
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        }
      },
      UnoCSS(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          'uni-app',
          {
            'wot-design-uni': ['useToast', 'useMessage', 'useNotify', 'CommonUtil'],
            'z-paging/types': ['zPaging', 'ZPagingVirtualItem']
          }
        ],
        dts: 'src/types/auto-import.d.ts', // 'src/stores/**',
        dirs: ['src/composables/**', 'src/stores/**', 'src/utils/**', 'src/hooks/**', 'src/router/**'], // 自动导入 hooks
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        },
        vueTemplate: true
      }),
      UniOptimization({
        enable: {
          optimization: true,
          'async-import': true,
          'async-component': true
        },
        dts: {
          enable: true,
          base: 'src/types',
          'async-import': {
            enable: true,
            base: 'src/types',
            name: 'async-import.d.ts',
            path: './src/types/async-import.d.ts'
          },
          'async-component': {
            enable: true,
            base: 'src/types',
            name: 'async-component.d.ts',
            path: './src/types/async-component.d.ts'
          }
        },
        logger: false
      }),
      // 图片优化插件
      isBuild &&
        viteImagemin({
          gifsicle: {
            optimizationLevel: 7,
            interlaced: false
          },
          optipng: {
            optimizationLevel: 7
          },
          mozjpeg: {
            quality: 85
          },
          pngquant: {
            quality: [0.8, 0.9],
            speed: 4
          },
          svgo: {
            plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }]
          }
        }),
      CompressJson(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.ts']
      }),
      // 点击页面上的 DOM，它能够自动打开你的 IDE 并将光标定位到 DOM 对应的源代码位置。[Mac 系统默认组合键是 Option + Shift；Window 的默认组合键是 Alt + Shift，在浏览器控制台会输出相关组合键提示]
      codeInspectorPlugin({
        bundler: 'vite'
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === 'h5' && {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss')).replace('%VITE_APP_TITLE%', `${VITE_APP_TITLE}`)
        }
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5' &&
        isBuild &&
        visualizer({
          filename: './node_modules/.cache/visualizer/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        }),
      // 自动打开开发者工具插件 (必须修改 .env 文件中的 VITE_WX_APPID)
      // 上传时通过 SKIP_OPEN_DEVTOOLS=true 跳过
      SKIP_OPEN_DEVTOOLS !== 'true' && openDevTools({ mode })
    ],
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY_ENABLE)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@img': path.resolve(__dirname, './src/static/images'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layout': path.resolve(__dirname, './src/layout'),
        '@utils': path.resolve(__dirname, './src/utils')
      },
      // 自动补全扩展名
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    server: {
      host: '0.0.0.0',
      open: !isBuild,
      hmr: true,
      port: Number.parseInt(`${VITE_APP_PORT}`, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy:
        VITE_APP_PROXY_ENABLE === 'true'
          ? {
              [`${VITE_APP_PROXY_PREFIX}`]: {
                target: VITE_SERVER_BASEURL,
                changeOrigin: true,
                // 后端有/api前缀则不做处理，没有则需要去掉
                rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), '')
              }
            }
          : undefined,
      // 预热文件以降低启动期间的初始页面加载时长
      warmup: {
        // 预热的客户端文件：首页、views、 components
        clientFiles: ['./index.html', './src/{views,components,layout}/*']
      }
    },
    esbuild: {
      drop: ['debugger']
    },
    build: {
      sourcemap: !isBuild,
      target: 'es2020',
      cssTarget: 'chrome61',
      cssCodeSplit: true, // CSS 代码分割
      cssMinify: isBuild ? 'esbuild' : false, // 开发环境不用压缩
      minify: isBuild ? 'terser' : false, // 开发环境不用压缩
      terserOptions: {
        compress: isBuild
          ? {
              ecma: 2020,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.debug', 'console.warn'],
              pure_getters: true,
              keep_fargs: false,
              unsafe_comps: true,
              unsafe: true,
              unsafe_math: true
            }
          : false
      },
      rollupOptions: {
        output: isBuild
          ? {
              chunkFileNames: 'static/js/[name]-[hash].js',
              entryFileNames: 'static/js/[name]-[hash].js',
              assetFileNames: 'static/[ext]/[name]-[hash][extname]',
              manualChunks(id) {
                // 分包策略优化
                if (id.includes('vue') || id.includes('@vue')) {
                  return 'vue-vendor'
                }
                if (id.includes('pinia')) {
                  return 'pinia-vendor'
                }
                if (id.includes('wot-design-uni')) {
                  return 'wot-design-uni'
                }
                if (id.includes('z-paging')) {
                  return 'z-paging'
                }
                if (id.includes('node_modules')) {
                  // 将其他第三方库打包为一个单独的 chunk
                  const match = id.match(/node_modules\/([^/]+)/)
                  if (match) {
                    return `vendor-${match[1]}`
                  }
                }
                return undefined
              },
              // 优化 Rollup 输出
              compact: true
            }
          : {},
        // 优化 Rollup 构建
        treeshake: {
          moduleSideEffects: true
        }
      }
    }
  })
}
