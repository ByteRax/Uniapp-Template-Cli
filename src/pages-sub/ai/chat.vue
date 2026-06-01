<script lang="ts" setup>
defineOptions({
  name: 'AiChat'
})

definePage({
  style: {
    navigationBarTitleText: 'AI Chat'
  }
})

type ChatRole = 'user' | 'assistant'
type ChatStatus = 'done' | 'streaming'
type MarkdownBlockType = 'paragraph' | 'heading' | 'list' | 'code'

interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  reasoning: string
  status: ChatStatus
  thinkingCollapsed: boolean
}

interface MarkdownBlock {
  type: MarkdownBlockType
  html?: string
  lines?: string[]
  level?: number
  code?: string
}

const paging = ref<ZPagingRef<ChatMessage> | null>(null)
const dataList = ref<ChatMessage[]>([])
const inputText = ref('')
const sending = ref(false)

let messageSeed = 0
let streamTimer: ReturnType<typeof setTimeout> | null = null

const initialMessages: ChatMessage[] = [
  {
    id: createId(),
    role: 'assistant',
    content: '你好，我是一个本地模拟的 AI 助手。\n\n你可以发送问题，我会演示：\n- **Markdown 消息**\n- `流式输出`\n- 思考过程折叠',
    reasoning: '',
    status: 'done',
    thinkingCollapsed: true
  }
]

onUnmounted(() => {
  if (streamTimer) {
    clearTimeout(streamTimer)
  }
})

function queryList(_pageNo: number, _pageSize: number) {
  paging.value?.complete(initialMessages)
}

function handleSend() {
  const text = inputText.value.trim()
  if (!text || sending.value) {
    return
  }

  inputText.value = ''
  sending.value = true

  const userMessage = createMessage('user', text)
  const assistantMessage = createMessage('assistant', '')
  assistantMessage.status = 'streaming'
  assistantMessage.thinkingCollapsed = false

  paging.value?.addChatRecordData([userMessage, assistantMessage], true, true)
  scrollToBottom()
  runMockStream(assistantMessage, text)
}

async function runMockStream(message: ChatMessage, prompt: string) {
  const reasoning = `我先理解用户的问题：“${prompt}”。\n接着组织一个简短回答，并用 Markdown 展示重点。`
  const answer = `## 回答\n已收到：**${prompt}**。\n\n这是本地模拟的流式回复，后续可以把 \`runMockStream\` 替换为真实接口。\n\n\`\`\`ts\nconst feature = 'z-paging virtual chat'\n\`\`\`\n\n- 使用 z-paging 聊天记录模式\n- 支持动态高度虚拟列表\n- 支持轻量 Markdown 渲染`

  await streamText(reasoning, (chunk) => {
    message.reasoning += chunk
    refreshStreamingCell(message)
  })
  await streamText(answer, (chunk) => {
    message.content += chunk
    refreshStreamingCell(message)
  })

  message.status = 'done'
  message.thinkingCollapsed = true
  refreshStreamingCell(message)
  sending.value = false
}

function streamText(text: string, onChunk: (chunk: string) => void) {
  const chunks = text.match(/[\s\S]{1,3}/g) || []
  let index = 0

  return new Promise<void>((resolve) => {
    const tick = () => {
      const chunk = chunks[index]
      if (!chunk) {
        resolve()
        return
      }

      onChunk(chunk)
      index++
      streamTimer = setTimeout(tick, 36)
    }

    tick()
  })
}

function refreshStreamingCell(message: ChatMessage) {
  const index = dataList.value.findIndex((item) => item.id === message.id)
  nextTick(() => {
    if (index >= 0) {
      paging.value?.didUpdateVirtualListCell(index)
    }
    paging.value?.updateVirtualListRender()
    scrollToBottom()
  })
}

function scrollToBottom() {
  nextTick(() => {
    paging.value?.scrollToBottom(false)
  })
}

function toggleThinking(message: ChatMessage) {
  if (!message.reasoning || message.status === 'streaming') {
    return
  }
  message.thinkingCollapsed = !message.thinkingCollapsed
  refreshStreamingCell(message)
}

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: createId(),
    role,
    content,
    reasoning: '',
    status: 'done',
    thinkingCollapsed: true
  }
}

function createId() {
  messageSeed++
  return `chat-${Date.now()}-${messageSeed}`
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] || ''

    if (!line.trim()) {
      index++
      continue
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = []
      index++
      while (index < lines.length && !lines[index]?.startsWith('```')) {
        codeLines.push(lines[index] || '')
        index++
      }
      blocks.push({ type: 'code', code: codeLines.join('\n') })
      index++
      continue
    }

    const heading = parseHeading(line)
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        html: renderInline(heading[2])
      })
      index++
      continue
    }

    if (isListLine(line)) {
      const listLines: string[] = []
      while (index < lines.length && isListLine(lines[index] || '')) {
        listLines.push(renderInline((lines[index] || '').slice(2)))
        index++
      }
      blocks.push({ type: 'list', lines: listLines })
      continue
    }

    const paragraph: string[] = []
    while (index < lines.length && lines[index]?.trim() && !lines[index]?.startsWith('```') && !parseHeading(lines[index] || '') && !isListLine(lines[index] || '')) {
      paragraph.push(renderInline(lines[index] || ''))
      index++
    }
    blocks.push({ type: 'paragraph', html: paragraph.join('<br />') })
  }

  return blocks
}

function parseHeading(line: string) {
  const markEnd = line.indexOf(' ')
  if (markEnd < 1 || markEnd > 3) {
    return null
  }
  const marks = line.slice(0, markEnd)
  if (!marks.split('').every((char) => char === '#')) {
    return null
  }
  const text = line.slice(markEnd + 1).trim()
  return text ? { 1: marks, 2: text } : null
}

function isListLine(line: string) {
  return (line.startsWith('- ') || line.startsWith('* ')) && line.length > 2
}

function renderInline(text: string) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return map[char] || char
  })
}
</script>

<template>
  <base-layout bg-color="#f8f8f8">
    <z-paging ref="paging" v-model="dataList" use-chat-record-mode use-virtual-list cell-height-mode="dynamic" safe-area-inset-bottom bottom-bg-color="#f8f8f8" @query="queryList">
      <template #cell="{ item }">
        <view style="transform: scaleY(-1)">
          <view class="chat-message" :class="item.role === 'user' ? 'chat-message--user' : 'chat-message--assistant'">
            <view class="chat-avatar">
              {{ item.role === 'user' ? '我' : 'AI' }}
            </view>
            <view class="chat-body">
              <view v-if="item.role === 'assistant' && item.reasoning" class="thinking">
                <view class="thinking__header" @click="toggleThinking(item)">
                  <text>{{ item.status === 'streaming' ? '思考中...' : '思考过程' }}</text>
                  <text v-if="item.status !== 'streaming'" class="thinking__toggle">
                    {{ item.thinkingCollapsed ? '展开' : '收起' }}
                  </text>
                </view>
                <view v-if="item.status === 'streaming' || !item.thinkingCollapsed" class="thinking__content">
                  <text>{{ item.reasoning }}</text>
                </view>
              </view>

              <view class="chat-bubble" :class="item.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'">
                <template v-for="(block, blockIndex) in parseMarkdown(item.content || (item.status === 'streaming' ? ' ' : ''))" :key="blockIndex">
                  <rich-text v-if="block.type === 'heading'" class="md-heading" :nodes="block.html || ''" />
                  <view v-else-if="block.type === 'list'" class="md-list">
                    <view v-for="(line, lineIndex) in block.lines" :key="lineIndex" class="md-list__item">
                      <text class="md-list__dot">•</text>
                      <rich-text class="md-list__text" :nodes="line" />
                    </view>
                  </view>
                  <view v-else-if="block.type === 'code'" class="md-code">
                    <text selectable>{{ block.code }}</text>
                  </view>
                  <rich-text v-else class="md-paragraph" :nodes="block.html || ''" />
                </template>
                <text v-if="item.status === 'streaming'" class="stream-cursor">|</text>
              </view>
            </view>
          </view>
        </view>
      </template>

      <template #bottom>
        <view class="chat-input">
          <textarea v-model="inputText" class="chat-input__textarea" :disabled="sending" :maxlength="-1" auto-height confirm-type="send" cursor-spacing="16" placeholder="输入消息..." @confirm="handleSend" />
          <button class="chat-input__button" :disabled="sending || !inputText.trim()" @click="handleSend">
            {{ sending ? '发送中' : '发送' }}
          </button>
        </view>
      </template>
    </z-paging>
  </base-layout>
</template>

<style scoped>
.chat-message {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-avatar {
  flex: 0 0 64rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 8rpx;
  background: #1d4ed8;
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 64rpx;
  text-align: center;
}

.chat-message--assistant .chat-avatar {
  background: #0f766e;
}

.chat-body {
  max-width: 78%;
}

.chat-bubble {
  box-sizing: border-box;
  min-height: 48rpx;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  line-height: 1.65;
  word-break: break-word;
}

.chat-bubble--user {
  background: #1d4ed8;
  color: #fff;
}

.chat-bubble--assistant {
  background: #fff;
  color: #1f2937;
}

.thinking {
  overflow: hidden;
  margin-bottom: 12rpx;
  border: 1rpx solid #d9e4dd;
  border-radius: 8rpx;
  background: #eef8f4;
  color: #315249;
}

.thinking__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 18rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.thinking__toggle {
  color: #0f766e;
  font-weight: 400;
}

.thinking__content {
  border-top: 1rpx solid #d9e4dd;
  padding: 16rpx 18rpx;
  font-size: 24rpx;
  line-height: 1.6;
  white-space: pre-wrap;
}

.md-heading {
  display: block;
  margin-bottom: 12rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.md-paragraph {
  display: block;
  margin-bottom: 12rpx;
}

.md-list {
  margin-bottom: 12rpx;
}

.md-list__item {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  margin-bottom: 6rpx;
}

.md-list__dot {
  flex: 0 0 auto;
}

.md-list__text {
  flex: 1;
}

.md-code {
  display: block;
  margin: 12rpx 0;
  border-radius: 8rpx;
  background: #111827;
  color: #e5e7eb;
  font-family: monospace;
  font-size: 24rpx;
  line-height: 1.6;
  padding: 18rpx;
  white-space: pre-wrap;
}

.stream-cursor {
  display: inline-block;
  color: #0f766e;
  font-weight: 700;
}

.chat-input {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  width: 100%;
  border-top: 1rpx solid #e5e7eb;
  background: #f8f8f8;
  padding: 16rpx 20rpx;
  gap: 16rpx;
}

.chat-input__textarea {
  flex: 1;
  min-height: 44rpx;
  max-height: 180rpx;
  border: 1rpx solid #d1d5db;
  border-radius: 8rpx;
  background: #fff;
  color: #111827;
  font-size: 28rpx;
  line-height: 44rpx;
  padding: 14rpx 18rpx;
}

.chat-input__button {
  width: 128rpx;
  height: 76rpx;
  border-radius: 8rpx;
  background: #1d4ed8;
  color: #fff;
  font-size: 28rpx;
  line-height: 76rpx;
  padding: 0;
}

.chat-input__button[disabled] {
  background: #93a4bd;
  color: #fff;
}
</style>
