import { VideoBackground } from './components/VideoBackground'
import { FullscreenToggle } from './components/FullscreenToggle'

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <VideoBackground />
      <FullscreenToggle />
    </div>
  )
}

export default App
