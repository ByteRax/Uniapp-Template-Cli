import { execSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import { loadEnv } from 'vite'

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName)
  return index > -1 ? process.argv[index + 1] : undefined
}

function resolveMode() {
  return getArgValue('--mode') || process.env.NODE_ENV || 'development'
}

function getTargetPort(mode) {
  const envDir = path.resolve(process.cwd(), 'env')
  const env = loadEnv(mode, envDir)
  const port = Number.parseInt(env.VITE_APP_PORT || '', 10)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`VITE_APP_PORT 配置无效: ${env.VITE_APP_PORT || '<empty>'}`)
  }

  return port
}

function listPidsByPort(port) {
  try {
    if (os.platform() === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString()
      const pids = output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(/\s+/).at(-1))
        .filter(Boolean)
      return [...new Set(pids)]
    }

    const output = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString()
    const pids = output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    return [...new Set(pids)]
  } catch {
    return []
  }
}

function killPid(pid) {
  if (os.platform() === 'win32') {
    execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
    return
  }

  execSync(`kill -9 ${pid}`, { stdio: 'ignore' })
}

function main() {
  if (process.env.SKIP_KILL_PORT === 'true') {
    console.log('[port:free] SKIP_KILL_PORT=true，跳过端口清理')
    return
  }

  const mode = resolveMode()
  const port = getTargetPort(mode)
  const pids = listPidsByPort(port)

  if (!pids.length) {
    console.log(`[port:free] 端口 ${port} 空闲，无需处理`)
    return
  }

  console.log(`[port:free] 检测到端口 ${port} 被占用，准备强制关闭 PID: ${pids.join(', ')}`)

  const failedPids = []

  for (const pid of pids) {
    try {
      killPid(pid)
      console.log(`[port:free] 已关闭 PID ${pid}`)
    } catch {
      failedPids.push(pid)
    }
  }

  if (failedPids.length) {
    throw new Error(`[port:free] 关闭失败 PID: ${failedPids.join(', ')}，请手动处理后重试`)
  }
}

main()
