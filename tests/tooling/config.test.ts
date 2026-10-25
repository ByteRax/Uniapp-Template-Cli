import { describe, expect, it } from 'vitest'
import { getMode, isBuildCommand } from '../../getEnv'
import { handlePageName, handleSubPackagePageName } from '../../vite-plugins/vite-config-uni-pages'

describe('environment mode', () => {
  it('separates release builds from development mode and watch builds', () => {
    expect(isBuildCommand(['build', '--mode', 'development'], '')).toBe(true)
    expect(isBuildCommand(['--mode', 'production'], '')).toBe(false)
    expect(isBuildCommand(['build', '--watch'], '')).toBe(false)
    expect(isBuildCommand(['build'], 'development')).toBe(false)
    expect(isBuildCommand([], 'production')).toBe(true)
    expect(getMode(['build', '--watch'], '')).toBe('development')
    expect(getMode(['-m', 'test'])).toBe('test')
  })
  it.each([
    [[], 'development'],
    [['build', '-p', 'mp-weixin'], 'production'],
    [['-p', 'app', '--mode', 'test'], 'test'],
    [['build', '--mode', 'development'], 'development'],
    [['--mode=production'], 'production'],
    [['build', '--mode=test'], 'test']
  ])('selects the mode for %j', (args, expected) => {
    expect(getMode(args as string[], '')).toBe(expected)
  })
  it.each([['--mode'], ['--mode='], ['--mode', '--host']])('rejects a missing mode value: %j', (...args) => {
    expect(() => getMode(args)).toThrow('--mode requires a value')
  })
})

describe('page metadata naming', () => {
  it('names ordinary and subpackage pages while retaining explicit names', () => {
    const context = {
      pageMetaData: [{ path: 'pages/index/index' }, { path: 'pages/custom', name: 'CUSTOM' }],
      subPageMetaData: [{ root: 'pages-sub', pages: [{ path: 'login/login' }, { path: 'custom', name: 'SUB_CUSTOM' }] }]
    }
    handlePageName(context.pageMetaData)
    handleSubPackagePageName(context.subPageMetaData)
    expect(context.pageMetaData.map((page) => page.name)).toEqual(['PAGES_INDEX_INDEX', 'CUSTOM'])
    expect(context.subPageMetaData[0]?.pages.map((page) => page.name)).toEqual(['LOGIN_LOGIN', 'SUB_CUSTOM'])
  })
})
