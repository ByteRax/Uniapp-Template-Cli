import type { CommonAllType } from '@/utils/type.ts'
import { deepClone as _deepClone } from '@wot-ui/ui/common/util'

/**
 * 判断一个值是否是对象
 * @param value - 要检查的值
 * @returns 如果值是对象，则返回 true；否则返回 false
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 判断一个值是否是数组
 * @param value - 要检查的值
 * @returns 如果值是数组，则返回 true；否则返回 false
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * 判断属性是否是string类型类型
 * @param property
 * @returns
 */
export function isString(property: CommonAllType): property is string {
  return typeof property === 'string'
}

/**
 * 判断属性是否为空
 * @param property
 * @returns
 */
export function isNull(property: CommonAllType): boolean {
  return property === null || property === undefined
}

/**
 * 判断属性内容是否为空
 * @param property
 * @returns
 */
export function isEmpty(property: CommonAllType): boolean {
  if (isNull(property)) {
    return true
  } else if (isString(property)) {
    return property === '' || property.length === 0
  } else if (Array.isArray(property)) {
    return property.length === 0
  } else if (property instanceof Map) {
    return property.size === 0
  } else if (isObjectEmpty(property)) {
    return true
  }
  return false
}

/**
 * 判断字符串是否为非空。true为非空空，否则false
 * @returns
 * @param property
 */
export function isNotEmpty(property: CommonAllType): boolean {
  return !isEmpty(property)
}

export function isObjectEmpty(obj: CommonAllType): boolean {
  try {
    if (isNull(obj)) {
      return true
    }
    if (obj instanceof ArrayBuffer || obj instanceof Uint8Array) {
      return obj.byteLength === 0
    }
    // 使用类型检查确保 obj 是对象类型
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).length === 0
    }
    return false
  } catch (e) {
    console.error(`$isObjectEmpty_${e}`)
    return true
  }
}

/**
 * 判断object是否存在某个属性
 * @param obj
 * @param propertyKey
 * @returns
 */
export function hasProperty(obj: object, propertyKey: PropertyKey) {
  return Reflect.has(obj, propertyKey)
}

/**
 * 设置Object 中指定属性的值
 * @param obj
 * @param key
 * @param value
 */
export function setValue(obj: object, key: string, value: CommonAllType) {
  try {
    Reflect.set(obj, key, value)
  } catch (e) {
    console.error('setValue', e)
  }
}

/**
 * 获取Object 中指定属性的值
 * @param obj
 * @param key
 * @param defaultValue
 * @returns
 */
export function getValue<T>(obj: object | undefined | null | unknown, key: string, defaultValue: T): T {
  try {
    if (obj === undefined || obj === null) {
      return defaultValue
    }
    const value = Reflect.get(obj, key)
    if (value === undefined || value === null || value === '') {
      return defaultValue
    }
    return value
  } catch (e) {
    console.error('getValue', e)
    return defaultValue
  }
}

/**
 * 深拷贝函数，用于将对象进行完整复制。
 * @param obj 要深拷贝的对象
 * @param cache 用于缓存已复制的对象，防止循环引用
 * @returns 深拷贝后的对象副本
 */
export function deepClone<T>(obj: T, cache: Map<any, any> = new Map()): T {
  return _deepClone(obj, cache)
}
