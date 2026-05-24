# Fireplace Channel

A cozy, immersive fireplace simulation web app optimized for both desktop browsers and Smart TVs (10-foot UI experience).

## Features

- **Smart TV Optimization**:
  - **HTTP 206 Range Request Streaming**: The video stream is loaded in chunks natively via Vite static file serving. This is highly compatible with Smart TVs, preventing them from downloading the entire video file at once and exhausting memory.
  - **10-Foot UI Focus Styles**: Focused elements feature a prominent cozy fire-orange outline (`#f97316`), glow effect, and a 1.15x scale animation, ensuring they are clearly visible from a TV viewing distance.
  - **Keyboard & Remote Navigation**:
    - Automatically targets and focuses the first control on page load.
    - Use Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) to navigate/cycle between controls.
    - Supports media keys (`MediaPlayPause`, `Play`, `Pause`) or the Spacebar (when a button isn't focused) to toggle play/pause of the fireplace video.
- **Improved Controls**:
  - **Mute Toggle**: Easily toggle sound with the speaker button. The icon updates immediately on click.
  - **Fullscreen Toggle**: Immerse yourself with full-screen mode utilizing the HTML5 Fullscreen API.
- **Responsive Layout**: Designed to adjust perfectly to any screen size, from small smart devices to large Smart TVs.

## Getting Started

To run the application locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser or TV emulator.

## Usage

- **Navigation**: Use remote control Arrow keys or keyboard arrow keys to move focus between the **Mute** button (top right) and the **Fullscreen** button (bottom right).
- **Play/Pause**: Press `Space` or media controls on your remote (`Play`, `Pause`, `MediaPlayPause`) to pause or resume the fire.
- **Select**: Use the remote's `Enter` key / `OK` button or the keyboard `Enter` / `Space` keys to activate the focused button.

## Building for Production

To build the application for production:

```bash
npm run build
npm run preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing. Run the tests using:

```bash
npm run test
```

## Project Structure

```
fireplace/
├── public/
│   └── video/
│       └── fireplace.mp4      # Fireplace video (with audio track)
├── src/
│   ├── components/
│   │   ├── VideoBackground.tsx  # Handles video element, streaming, media keys, mute state
│   │   └── FullscreenToggle.tsx # Handles entering and exiting fullscreen mode
│   ├── App.tsx                # Main app layout and TV navigation controller
│   ├── main.tsx               # TanStack Router setup and mounting point
│   ├── styles.css             # Main styling, Tailwind CSS base, and TV focus styles
│   └── App.test.tsx           # Component test suite
└── package.json
```

## Tech Stack

- **Framework**: React 19 (Vite)
- **Routing**: TanStack Router (Code-based routing)
- **Styling**: Tailwind CSS
- **Testing**: Vitest + jsdom + React Testing Library
