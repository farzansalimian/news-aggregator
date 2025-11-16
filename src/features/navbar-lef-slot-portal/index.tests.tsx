import { render } from '@testing-library/react'
import { NavbarLeftSlotPortal } from '.'
import { HEADER_NAVBAR_LEFT_SLOT_ID } from '@/constants/element-ids'
import { useMount as useMountOriginal } from '@/hooks/use-mount'

vi.mock('@/hooks/use-mount')

const useMount = vi.mocked(useMountOriginal)

describe('NavbarLeftSlotPortal', () => {
  beforeEach(() => {
    document.body.innerHTML = '' // clean DOM
  })

  it('renders nothing if isMounted is false', () => {
    useMount.mockReturnValue({ isMounted: false })
    const { container } = render(
      <NavbarLeftSlotPortal>Test</NavbarLeftSlotPortal>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing if target element does not exist', () => {
    useMount.mockReturnValue({ isMounted: true })
    const { container } = render(
      <NavbarLeftSlotPortal>Test</NavbarLeftSlotPortal>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders children into the target element when mounted', () => {
    useMount.mockReturnValue({ isMounted: true })

    // Create the target element in the DOM
    const target = document.createElement('div')
    target.id = HEADER_NAVBAR_LEFT_SLOT_ID
    document.body.appendChild(target)

    render(<NavbarLeftSlotPortal>Test</NavbarLeftSlotPortal>)

    // Children should be rendered inside target
    expect(target).toHaveTextContent('Test')
  })
})
