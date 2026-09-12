# Phase 10 — Mobile V2

## Status
Implemented on `main`.

## Purpose
Define mobile-first behavior as an explicit strategy layer rather than relying on desktop layouts shrinking automatically.

## Included

- compact / balanced / immersive density modes
- mobile navigation strategy
- readable content width and minimum body size
- consistent section rhythm and horizontal padding
- responsive media defaults and layout-shift prevention
- minimum 44px interaction targets
- sticky primary CTA option
- no hover-only interaction dependency
- reduced-motion and focus visibility requirements

## Architecture

`MobileStrategy` exposes tokens and behavior that the V2 renderer can consume. It intentionally does not force a template rewrite in this phase.

## Quality goals

Mobile layouts should remain readable, tappable, visually intentional, and conversion-oriented rather than being compressed desktop pages.
