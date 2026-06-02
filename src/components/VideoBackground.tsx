import { useState, useRef, useEffect } from 'react'

type Resolution = '720p' | '1080p'

const VIDEO_SOURCES: Record<Resolution, string> = {
  '720p':  '/video/fireplace_720p.mp4',
  '1080p': '/video/fireplace_1080p.mp4',
}

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [resolution, setResolution] = useState<Resolution>('720p')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      console.error('Video failed to load', {
        code: video.error?.code,
        message: video.error?.message,
        src: video.currentSrc,
        networkState: video.networkState,
        readyState: video.readyState,
      })
      setHasError(true)
      setIsLoading(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Sync initial muted state
    video.muted = isMuted

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // Reload video when resolution changes
  useEffect(() => {
    const video = videoRef.current
    if (!video || isLoading) return

    setIsLoading(true)
    setHasError(false)

    // Short tick so React commits the new src before we call load()
    const timer = setTimeout(() => {
      video.load()
      video.muted = isMuted
      video.play().catch((err) => console.log('Autoplay blocked after resolution switch:', err))
    }, 50)

    return () => clearTimeout(timer)
  }, [resolution])

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

  const toggleResolution = () => {
    setResolution((prev) => (prev === '720p' ? '1080p' : '720p'))
  }

  // Handle remote control/keyboard play/pause keys
  useEffect(() => {
    const handleMediaKeys = (e: KeyboardEvent) => {
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
        src={VIDEO_SOURCES[resolution]}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
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
        <>
          {/* Mute toggle — top right */}
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

          {/* Resolution toggle — bottom left */}
          <button
            onClick={toggleResolution}
            data-tv-focusable="true"
            className="fixed bottom-8 left-8 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:text-orange-400 focus:text-orange-400 transition-all z-10 cursor-pointer flex items-center gap-2"
            aria-label={`Switch to ${resolution === '720p' ? '1080p' : '720p'}`}
          >
            {/* Small "HD" icon */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8H7v3H5V8H3v8h2v-3h2v3h2zm6.5 0h-4v8h4c.8 0 1.5-.7 1.5-1.5v-5c0-.8-.7-1.5-1.5-1.5zm-.5 6h-2v-4h2v4z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">{resolution}</span>
          </button>
        </>
      )}
    </>
  )
}
