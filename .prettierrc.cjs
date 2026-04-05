// Prettier配置文档：https://prettier.io/docs/en/options.html
/** @type {import('prettier').Config} */
module.exports = {
  printWidth: 320, // 指定每行的最大长度。当代码超过 300 个字符时，Prettier 会尝试将其换行
  tabWidth: 2, // 指定一个制表符（Tab）等于多少个空格。这里设置为 2。
  useTabs: false, // 使用空格进行缩进，而不是使用制表符。
  semi: false, // 在语句末尾打印分号。
  singleQuote: true, // 使用单引号（'）而不是双引号（"）。
  quoteProps: 'preserve', // 仅在对象属性名需要时（例如属性名包含特殊字符）才为其添加引号。
  jsxSingleQuote: true, // 在 JSX 中使用单引号而不是双引号。
  trailingComma: 'none', // 仅在ES5 中需要的位置添加逗号
  bracketSpacing: true, // 在对象字面量的大括号 {} 内侧打印空格。例如 { foo: bar } 而不是 {foo:bar}。
  bracketSameLine: false, // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。
  arrowParens: 'always', // 在唯一的箭头函数参数周围始终包含括号。
  proseWrap: 'preserve', // 对于 Markdown 等文本文件，保持其原有的换行方式，不做自动换行处理。
  htmlWhitespaceSensitivity: 'ignore', // 忽略 HTML、Vue、Angular 和 Handlebars 文件中的全局空白敏感性。Prettier 会对标签周围的空白进行更自由的格式化。
  vueIndentScriptAndStyle: false, // Vue 文件脚本和样式标签缩进
  endOfLine: 'lf', // 统一使用 LF (\n) 作为换行符，通常用于 Linux 和 macOS 系统。
  embeddedLanguageFormatting: 'auto', // 让 Prettier 自动格式化文件中的嵌入代码，例如 HTML 字符串中的 JavaScript 代码。
  singleAttributePerLine: false, // 强制每个属性单独占一行（适用于 HTML、Vue、JSX 等）
  // Prettier 可以限制自己只格式化在文件顶部包含特殊注释（称为 pragma）的文件。这在逐渐将大型、未格式化的代码库过渡到 Prettier 时非常有用<bool>，默认false
  requirePragma: false,
  // Prettier可以在文件的顶部插入一个 @format 的特殊注释，以表明该文件已经被Prettier格式化过了。在使用 --require-pragma 参数处理一连串的文件时这个功能将十分有用。如果文件顶部已经有一个do-clock，这个选项将新建一行注释，并打上 @format 标记<bool>，默认false
  insertPragma: false
}
