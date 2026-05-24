import { useEffect } from 'react'
import { VideoBackground } from './components/VideoBackground'
import { FullscreenToggle } from './components/FullscreenToggle'

function App() {
  useEffect(() => {
    // Auto-focus the first focusable element on load
    const timer = setTimeout(() => {
      const focusableElements = document.querySelectorAll<HTMLElement>('[data-tv-focusable="true"]')
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }, 500)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        const focusableElements = Array.from(
          document.querySelectorAll<HTMLElement>('[data-tv-focusable="true"]')
        )
        if (focusableElements.length === 0) return

        e.preventDefault()

        const currentActive = document.activeElement as HTMLElement
        const currentIndex = focusableElements.indexOf(currentActive)

        let nextIndex = 0
        if (currentIndex === -1) {
          nextIndex = 0
        } else {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % focusableElements.length
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length
          }
        }

        focusableElements[nextIndex].focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <VideoBackground />
      <FullscreenToggle />
    </div>
  )
}

export default App

