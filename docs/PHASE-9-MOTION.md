# Phase 9 — Motion System

## Status
Implemented on `main`.

## Purpose
Provide a reusable motion layer for the V2 rendering system without coupling animation behavior to individual templates.

## Included

- subtle / expressive / none intensity modes
- load, scroll, hover, and focus triggers
- reusable fade, image-reveal, hover-lift, and focus-lift presets
- centralized duration, easing, and distance tokens
- reduced-motion accessibility contract

## Accessibility

The system explicitly respects `prefers-reduced-motion` at the integration layer and provides a no-transform mode. Motion is progressive enhancement, never required for comprehension or interaction.

## Integration

Later template/rendering work can consume `buildMotionSystem()` and `motionCssVariables()` rather than introducing ad-hoc animation timings.
