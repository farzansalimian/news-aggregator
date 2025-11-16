import { cx } from '.'

describe('cx utility', () => {
  it('merges multiple class names', () => {
    expect(cx('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('merges and overrides conflicting classes', () => {
    expect(cx('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles undefined, null, or empty strings', () => {
    expect(cx('bg-red-500', undefined, '', null, 'text-white')).toBe(
      'bg-red-500 text-white',
    )
  })

  it('handles multiple merges at once', () => {
    expect(cx('px-4 py-2', 'px-2', 'py-4')).toBe('px-2 py-4')
  })
})
