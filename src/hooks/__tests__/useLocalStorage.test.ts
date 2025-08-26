import { describe, it, expect, beforeEach } from 'vitest'

const useLocalStorage = (key: string, defaultValue: string) => {
  const getValue = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const setValue = (value: string) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silent fail in test environment
    }
  }

  return { getValue, setValue }
}

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('should return default value when localStorage is empty', () => {
    const { getValue } = useLocalStorage('test-key', 'default-value')
    
    expect(getValue()).toBe('default-value')
  })

  it('should store and retrieve values correctly', () => {
    const { getValue, setValue } = useLocalStorage('user-preferences', 'default')
    
    setValue('dark-theme')
    
    expect(getValue()).toBe('dark-theme')
    
    const { getValue: getValue2, setValue: setValue2 } = useLocalStorage('another-key', 'fallback')
    setValue2('some-value')
    expect(getValue2()).toBe('some-value')
  })

  it('should handle invalid JSON gracefully', () => {
    const originalGetItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => 'invalid-json{'
    
    const { getValue } = useLocalStorage('broken-key', 'fallback')
    expect(getValue()).toBe('fallback')
    
    Storage.prototype.getItem = originalGetItem
  })

  it('should handle localStorage errors gracefully', () => {
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = () => { throw new Error('Storage full') }
    
    const { setValue } = useLocalStorage('test', 'default')
    
      expect(() => setValue('new-value')).not.toThrow()
    
    Storage.prototype.setItem = originalSetItem
  })
})
