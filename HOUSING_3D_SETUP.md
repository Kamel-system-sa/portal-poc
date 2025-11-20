# Housing Module 3D Setup

## Required Packages

The Housing Module now uses full 3D visualization. To enable the 3D features, install the following packages:

```bash
npm install @react-three/fiber @react-three/drei three
```

## Features

- **3D Room Viewer**: Fully interactive 3D room visualization with rotation, zoom, and pan controls
- **3D Tent Viewer**: Complete 3D tent structure with interior bed layout visualization
- **Interactive Controls**: Click and drag to rotate, scroll to zoom, right-click to pan

## Usage

1. Navigate to any housing page (Hotels, Buildings, Mina, or Arafat)
2. Click on a room or tent card
3. Click the "View 3D" button to open the interactive 3D viewer
4. Use mouse controls to rotate, zoom, and inspect the 3D model

## Components

- `Room3DViewer.tsx`: 3D room visualization component
- `Tent3DViewer.tsx`: 3D tent visualization component

Both components use React Three Fiber for rendering and include:
- OrbitControls for camera manipulation
- PerspectiveCamera for realistic viewing
- Proper lighting setup
- Material properties matching the design system colors

