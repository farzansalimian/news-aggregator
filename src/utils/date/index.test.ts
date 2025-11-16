import { describe, it, expect } from 'vitest'
import { formatDate } from '.'

describe('formatDate', () => {
  it('formats a Date object to YYYY-MM-DD', () => {
    const date = new Date('2025-11-16T15:30:00Z')
    expect(formatDate(date)).toBe('2025-11-16')
  })

  it('formats an ISO string to YYYY-MM-DD', () => {
    const dateStr = '2025-11-16T15:30:00Z'
    expect(formatDate(dateStr)).toBe('2025-11-16')
  })

  it('formats a date string without time', () => {
    const dateStr = '2025-11-16'
    expect(formatDate(dateStr)).toBe('2025-11-16')
  })

  it('handles local date strings', () => {
    const dateStr = '2025-11-16T23:59:59'
    // Depending on timezone, toISOString converts to UTC
    const isoDate = new Date(dateStr).toISOString().split('T')[0]
    expect(formatDate(dateStr)).toBe(isoDate)
  })
})
