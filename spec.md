# Clario

## Current State
Clario is a landing page hero with an animated orb and scroll-based reveal sections. It features a HeroCanvas and HeroOrb component with basic canvas animation.

## Requested Changes (Diff)

### Add
- A high-quality revolving circle (orbiting ring/orb) in the hero section
- Hold interaction: when user holds the circle for 3 seconds, trigger haptic-like visual vibration effect
- After 3-second hold, play an extreme-quality graphic burst/explosion particle animation
- After the burst animation completes, show floating subject field cards (e.g. Science, Math, Design, Code, Philosophy, Art, Music, Business, etc.) that float and drift in 3D space
- All animations targeting 4K-quality rendering and 60fps performance (high-resolution canvas, crisp geometry, smooth interpolation)

### Modify
- Hero section to feature the new interactive revolving circle as the centerpiece
- Canvas rendering to use high-DPI pixel ratio for crisp 4K-quality visuals

### Remove
- Nothing removed

## Implementation Plan
1. Create a new `InteractiveOrb` component using Canvas API with:
   - A revolving ring/circle with glow, gradients, and high-quality rendering
   - Mouse/touch hold detection (3-second hold timer)
   - Visual vibration effect during hold (increasing shake/tremor)
   - Burst particle explosion on hold completion (hundreds of particles with velocity, color, fade)
   - Floating subject cards that appear post-burst and drift with subtle physics
2. Use `window.devicePixelRatio` scaling for crisp rendering on high-DPI/4K screens
3. 60fps via `requestAnimationFrame` loop
4. Integrate into App.tsx hero section replacing or alongside existing HeroOrb
