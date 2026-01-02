# Graphics Components

This directory contains reusable graphics and visual components for the Rapid Sort application.

## Components

### AnimatedBackground
Animated gradient background with floating elements and grid patterns.
- **Usage**: `<AnimatedBackground />`
- **Features**: Responsive, theme-aware, smooth animations

### HeroGraphics
Animated hero section graphics with orbiting icons.
- **Usage**: `<HeroGraphics />`
- **Features**: Central icon with orbiting feature icons, connecting lines

### FeatureShowcase
Feature cards with animated icons and hover effects.
- **Usage**: `<FeatureShowcase />`
- **Features**: 6 feature cards, staggered animations, hover effects

### StatsVisualization
Animated statistics display with counter animations.
- **Usage**: `<StatsVisualization />`
- **Features**: Animated counters, glassmorphism design, gradient background

### ConnectionStatus
WebSocket connection status indicator with animations.
- **Usage**: `<ConnectionStatus />`
- **Features**: Real-time status, ripple effects, tooltips

### Logo
Animated SVG logo component.
- **Usage**: `<Logo size={40} animated={true} />`
- **Props**:
  - `size`: number (default: 40)
  - `animated`: boolean (default: false)

## Design Principles

1. **Performance**: All animations use CSS transforms and opacity for optimal performance
2. **Accessibility**: Proper color contrast and semantic HTML
3. **Responsiveness**: Mobile-first design with breakpoints
4. **Theme Support**: Dark/light mode compatible
5. **Reusability**: Modular components with customizable props

## Animation Guidelines

- Use `keyframes` from `@mui/system` for animations
- Keep animation durations between 0.3s - 3s
- Use `ease-in-out` or `ease-out` timing functions
- Add `will-change` for frequently animated properties
- Respect `prefers-reduced-motion` media query

## Color Palette

- Primary: `#6366f1` (Indigo)
- Secondary: `#764ba2` (Purple)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Info: `#06b6d4` (Cyan)

## Examples

```tsx
// Landing page with graphics
import AnimatedBackground from './graphics/AnimatedBackground';
import HeroGraphics from './graphics/HeroGraphics';
import FeatureShowcase from './graphics/FeatureShowcase';

function LandingPage() {
  return (
    <>
      <AnimatedBackground />
      <HeroGraphics />
      <FeatureShowcase />
    </>
  );
}

// Navbar with connection status
import ConnectionStatus from './graphics/ConnectionStatus';

function Navbar() {
  return (
    <AppBar>
      <Toolbar>
        <ConnectionStatus />
      </Toolbar>
    </AppBar>
  );
}
```

## Future Enhancements

- [ ] Add loading skeletons
- [ ] Create chart components
- [ ] Add 3D graphics with Three.js
- [ ] Implement particle effects
- [ ] Add SVG illustrations
