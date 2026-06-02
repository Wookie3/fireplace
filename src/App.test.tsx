// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App.tsx'

describe('App', () => {
  test('renders fireplace app with controls', () => {
    const { container } = render(<App />)
    
    // Check if the video element exists
    const videoElement = container.querySelector('video')
    expect(videoElement).toBeDefined()

    // Initially, it shows the loading screen and does not show the mute button
    expect(screen.queryByRole('button', { name: /toggle mute/i })).toBeNull()

    // Trigger the canplay event on the video to simulate it loading
    if (videoElement) {
      fireEvent(videoElement, new Event('canplay'))
    }

    // Now, loading should be false and the mute button should be rendered
    const muteButton = screen.getByRole('button', { name: /toggle mute/i })
    expect(muteButton).toBeDefined()

    // Check if the fullscreen button exists
    const fullscreenButton = screen.getByRole('button', { name: /enter fullscreen/i })
    expect(fullscreenButton).toBeDefined()

    // Check if the resolution button exists and displays correct label
    const resolutionButton = screen.getByRole('button', { name: /switch to 1080p/i })
    expect(resolutionButton).toBeDefined()

    // Click resolution button to toggle resolution state
    fireEvent.click(resolutionButton)

    // Trigger canplay again to simulate loading the new video resolution
    if (videoElement) {
      fireEvent(videoElement, new Event('canplay'))
    }

    expect(screen.getByRole('button', { name: /switch to 720p/i })).toBeDefined()
  })
})
