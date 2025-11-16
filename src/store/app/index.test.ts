import { describe, it, expect } from 'vitest'
import { appReducer, appSetWindowSize, appSelectIsMobile } from './'
import { ReducersName } from '../constants'
import type { RootState } from '..'

describe('appSlice', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, { type: '' })).toEqual({
      windowSize: { width: 1024, height: 768 },
    })
  })

  it('should update window size correctly', () => {
    const previousState = { windowSize: { width: 1024, height: 768 } }
    const action = appSetWindowSize({ width: 500, height: 800 })
    const nextState = appReducer(previousState, action)

    expect(nextState.windowSize).toEqual({ width: 500, height: 800 })
  })

  it('appSelectIsMobile returns true when width < 768', () => {
    const mockState = {
      [ReducersName.App]: { windowSize: { width: 500, height: 800 } },
    }
    expect(appSelectIsMobile(mockState as RootState)).toBe(true)
  })

  it('appSelectIsMobile returns false when width >= 768', () => {
    const mockState = {
      [ReducersName.App]: { windowSize: { width: 1024, height: 800 } },
    }
    expect(appSelectIsMobile(mockState as RootState)).toBe(false)
  })
})
