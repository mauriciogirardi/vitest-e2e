import { sanitizeStr } from "./sanitize-str"

describe('sanitizeStr', () => {
  it('should return empty string when have a falsy value', () => {
    // @ts-expect-error todo test
    expect(sanitizeStr()).toBe('')
  })

  it('should return empty string when not have string value', () => {
    // @ts-expect-error todo test
    expect(sanitizeStr(123)).toBe('')
  })

  it('should return string with trim', () => {
    expect(sanitizeStr('     a     ')).toBe('a')
  })

  it('should return string normalize with NFC', () => {
    const original = 'e\u0301'
    const expected = 'é'
    expect(sanitizeStr(original)).toBe(expected)
  })
})