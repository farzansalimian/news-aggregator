import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '.'
import { vi } from 'vitest'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } },
    )

    rerender({ value: 'world', delay: 500 })

    expect(result.current).toBe('hello')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('world')
  })

  it('cancels previous timeout when value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    )

    rerender({ value: 'b', delay: 500 })
    rerender({ value: 'c', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(499)
    })

    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe('c')
  })
})
