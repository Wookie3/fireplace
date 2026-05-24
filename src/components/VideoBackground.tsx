import { useState, useRef, useEffect } from 'react'

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Handle video loading
    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      console.error('Video failed to load')
      setHasError(true)
      setIsLoading(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Sync initial state
    video.muted = isMuted

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      const newMuted = !isMuted
      video.muted = newMuted
      setIsMuted(newMuted)
    }
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play().catch((err) => console.log('Autoplay blocked:', err))
        setIsPlaying(true)
      }
    }
  }

  // Handle remote control/keyboard play/pause keys
  useEffect(() => {
    const handleMediaKeys = (e: KeyboardEvent) => {
      // Space key only triggers play/pause if not focusing on a button to avoid double-triggering clicks
      const isButtonFocused = document.activeElement?.tagName === 'BUTTON'
      const isSpace = e.key === ' ' || e.code === 'Space'
      
      if (
        e.key === 'MediaPlayPause' ||
        e.key === 'Play' ||
        e.key === 'Pause' ||
        (isSpace && !isButtonFocused)
      ) {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener('keydown', handleMediaKeys)
    return () => {
      window.removeEventListener('keydown', handleMediaKeys)
    }
  }, [isPlaying])

  if (hasError) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-2">Failed to load video</p>
          <p className="text-sm opacity-75">Please refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        src="/video/fireplace.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      />

      {isLoading && (
        <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-pulse text-2xl mb-2">Loading fireplace...</div>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-orange-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <button
          onClick={toggleMute}
          data-tv-focusable="true"
          className="fixed top-8 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white hover:text-orange-400 focus:text-orange-400 transition-all z-10 cursor-pointer"
          aria-label="Toggle mute"
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      )}
    </>
  )
}

