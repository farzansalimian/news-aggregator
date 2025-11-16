import { render } from '@testing-library/react'
import { SidebarPortal } from '.'
import { SIDEBAR_ID } from '@/constants/element-ids'
import { useMount as useMountOriginal } from '@/hooks/use-mount'
import { vi } from 'vitest'

// Mock the hook
vi.mock('@/hooks/use-mount')
const useMount = vi.mocked(useMountOriginal)

describe('SidebarPortal', () => {
  beforeEach(() => {
    document.body.innerHTML = '' // Clean DOM before each test
  })

  it('renders nothing if isMounted is false', () => {
    useMount.mockReturnValue({ isMounted: false })
    const { container } = render(<SidebarPortal>Test</SidebarPortal>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing if target element does not exist', () => {
    useMount.mockReturnValue({ isMounted: true })
    const { container } = render(<SidebarPortal>Test</SidebarPortal>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders children into the target element when mounted', () => {
    useMount.mockReturnValue({ isMounted: true })

    // Create the target element in the DOM
    const target = document.createElement('div')
    target.id = SIDEBAR_ID
    document.body.appendChild(target)

    render(<SidebarPortal>Test</SidebarPortal>)

    expect(target).toHaveTextContent('Test')
  })
})
