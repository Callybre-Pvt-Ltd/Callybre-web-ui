import { useEffect } from 'react'

// Closes the active modal when the user presses Escape (matches original site behaviour).
export default function useEscapeToClose(closeModal) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeModal])
}
