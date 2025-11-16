import { describe, it, expect } from 'vitest'
import { stripHtml } from '.'

describe('stripHtml', () => {
  it('removes HTML tags from a string', () => {
    const html = '<p>Hello <strong>World</strong>!</p>'
    expect(stripHtml(html)).toBe('Hello World!')
  })

  it('handles empty strings', () => {
    expect(stripHtml('')).toBe('')
  })

  it('handles strings without HTML', () => {
    const text = 'Just plain text'
    expect(stripHtml(text)).toBe('Just plain text')
  })

  it('handles nested HTML tags', () => {
    const html = '<div><p>Nested <span>content</span></p></div>'
    expect(stripHtml(html)).toBe('Nested content')
  })

  it('removes self-closing tags', () => {
    const html = 'Line break<br />New line'
    expect(stripHtml(html)).toBe('Line break New line')
  })
})
