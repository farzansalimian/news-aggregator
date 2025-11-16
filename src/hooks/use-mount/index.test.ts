import { renderHook } from '@testing-library/react'
import { useMount } from '.'

describe('useMount', () => {
  it('returns false initially and true after mount', () => {
    const { result } = renderHook(() => useMount())
    expect(result.current.isMounted).toBe(true)
  })
})
