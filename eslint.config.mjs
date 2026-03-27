import uni from '@uni-helper/eslint-config'

export default uni({
  vue: true,
  markdown: false,
  ignores: [
    'node_modules',
    '.nuxt',
    'dist',
    // 忽略uni_modules目录
    '**/uni_modules/',
    // 忽略原生插件目录
    '**/nativeplugins/',
    'dist',
    // unplugin-auto-import 生成的类型文件，每次提交都改变，所以加入这里吧，与 .gitignore 配合使用
    'auto-import.d.ts',
    // vite-plugin-uni-pages 生成的类型文件，每次切换分支都一堆不同的，所以直接 .gitignore
    '**/uni-pages.d.ts',
    // @uni-ku/bundle-optimizer 生成的类型文件
    '**/async-import.d.ts',
    '**/async-component.d.ts',
    // 插件生成的文件
    'src/pages.json',
    'src/manifest.json',
    // 忽略自动生成文件
    'src/service/**',
    // HTML 入口文件
    'index.html'
  ],
  // https://eslint-config.antfu.me/rules
  rules: {
    // ==================== TypeScript 规则 ====================
    // http://eslint.cn/docs/rules/
    // https://typescript-eslint.io/rules/no-unused-vars/
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': ['warn', { allow: ['arrowFunctions', 'functions', 'methods'] }],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'dot-notation': 'off', // 禁用点号访问检查，允许使用方括号访问属性

    // ==================== Vue 规则 ====================
    // https://eslint.vuejs.org/rules/
    // Oxfmt 负责代码格式化，这里仅保留 Vue 模板与 SFC 结构相关规则
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style']
      }
    ],
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/eqeqeq': ['error', 'smart'],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: { void: 'always', normal: 'always', component: 'always' },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/max-attributes-per-line': 'off', // 禁用，交给 Oxfmt 的 singleAttributePerLine 处理
    'vue/multi-word-component-names': ['warn', { ignores: ['index', '404', 'App', 'App.ku', 'login', 'paging'] }],
    'vue/no-arrow-functions-in-watch': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-empty-component-block': 'error',
    'vue/no-unused-refs': 'warn',
    'vue/no-v-html': 'warn',
    'vue/one-component-per-file': 'error',
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/require-prop-types': 'error',
    'vue/valid-define-emits': 'error',
    'vue/valid-define-props': 'error',
    'vue/valid-v-for': 'error',
    'vue/valid-v-if': 'error',
    'vue/valid-v-model': 'error',
    'vue/valid-v-on': 'error',
    'vue/valid-v-slot': 'error',
    'vue/v-for-delimiter-style': ['error', 'in'],
    'vue/singleline-html-element-content-newline': 'off', // 禁用单行元素内容换行检查，避免与 Oxfmt 冲突
    'vue/comma-dangle': 'off', // 禁用 Vue 文件中的尾随逗号检查，避免与 Oxfmt 冲突

    // ==================== 样式规则 ====================
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/comma-dangle': 'off', // 禁用尾随逗号检查，避免与 Oxfmt 冲突
    '@stylistic/indent': 'off', // 禁用缩进检查，避免与 Oxfmt 冲突
    '@stylistic/member-delimiter-style': 'off', // 禁用类型成员分隔符检查，避免与 Oxfmt 冲突
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/semi': ['error', 'never'],
    'style/arrow-parens': ['error', 'always'],
    'style/comma-dangle': 'off', // 禁用尾随逗号检查，避免与 Oxfmt 冲突
    'style/comma-spacing': ['error', { before: false, after: true }],
    'style/indent': 'off', // 禁用缩进检查
    'style/indent-binary-ops': 'off', // 禁用二元操作符缩进检查
    'style/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'style/member-delimiter-style': 'off', // 禁用类型成员分隔符检查，避免与 Oxfmt 冲突
    'style/space-before-blocks': ['error', 'always'],
    'style/space-infix-ops': ['error'],

    // ==================== 其他规则 ====================
    'antfu/if-newline': 'off', // 禁用 if 换行检查，避免与 Oxfmt 冲突
    'antfu/curly': 'off', // 禁用强制大括号检查，允许单行 if 语句
    'antfu/top-level-function': 'off', // 禁用顶层函数必须使用 function 关键字的检查
    'object-shorthand': 'off', // 禁用属性简写检查（Expected property shorthand.）
    'eslint-comments/no-unlimited-disable': 'error',
    'eslint-comments/require-description': 'error',
    'generator-star-spacing': ['error', { before: true, after: true }],
    'jsdoc/check-param-names': 'off',
    'jsdoc/require-returns-description': 'off',
    'no-case-declarations': 'error',
    'no-console': 'off', // 禁用 console 检查，允许使用所有 console 方法
    'no-constant-condition': ['warn', { checkLoops: false }],
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-boolean-cast': 'error',
    'no-fallthrough': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'no-sparse-arrays': 'error',
    'no-unreachable': 'error',
    'no-unused-vars': 'off', // 使用 @typescript-eslint/no-unused-vars 代替
    'no-use-before-define': 'off', // 使用 @typescript-eslint/no-use-before-define 代替
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'off',
    'no-useless-return': 'error',
    'node/prefer-global/process': 'off',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'unicorn/number-literal-case': 'off', // 禁用数字字面量大小写检查，避免与 Oxfmt 冲突
    'unused-imports/no-unused-vars': 'off',
    '@stylistic/operator-linebreak': 'off', // 禁用操作符换行位置检查
    'style/operator-linebreak': 'off' // 同时禁用 style/ 前缀的规则
  }
})
