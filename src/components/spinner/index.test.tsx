import { render } from '@testing-library/react'
import { Spinner } from './index'

describe('Spinner', () => {
  test('renders spinner', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('has correct spinner styling', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('.animate-spin')

    expect(spinner).toHaveClass('h-8')
    expect(spinner).toHaveClass('w-8')
    expect(spinner).toHaveClass('rounded-full')
    expect(spinner).toHaveClass('border-2')
    expect(spinner).toHaveClass('border-blue-500')
    expect(spinner).toHaveClass('border-t-transparent')
  })

  test('has flex container with justify-center', () => {
    const { container } = render(<Spinner />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('flex')
    expect(wrapper.className).toContain('justify-center')
  })
})
