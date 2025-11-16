import { useEffect, useState } from 'react'

export const useMount = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  return { isMounted }
}
