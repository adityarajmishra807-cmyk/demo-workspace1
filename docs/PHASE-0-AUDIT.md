# Demo Engine V2 — Phase 0 Audit

Date: 2026-09-12
Repository: `adityarajmishra807-cmyk/demo-workspace1`
Baseline branch: `main`

## Phase 0 status

**Audit complete. No application behavior was changed in Phase 0.**

The purpose of this phase was to establish a reliable baseline before the architecture and visual-system work begins.

## Current architecture

### Runtime flow

```text
Browser
  -> App.tsx
     -> local slug OR remote demo slug
        -> ClientSite
           -> applyClientTheme()
           -> renderTemplate()
              -> one of 5 fixed templates
                 -> shared visual components
```

Remote demos are loaded from `api/demo-store.ts` through `clientRegistry.fetchRemoteClient`, while generated/published client configuration is represented by `ClientConfig`.

### Current template layer

The engine currently has five fixed template IDs:

- `luxury`
- `photography`
- `local-service`
- `restaurant`
- `professional`

`src/templates/index.tsx` maps each ID directly to a React template component.

### Shared component layer

The main website building blocks are currently:

- Navbar
- Hero
- About
- Services
- Gallery
- Features
- CTA
- Contact
- Footer

This is a good reusable foundation, but the templates still determine the page architecture directly.

## Data model findings

`ClientConfig` currently provides a useful base for a small business website:

- business identity
- industry
- tagline/headline/description
- location
- about content
- services
- gallery images
- hero image
- features
- contact information
- template
- brand colors
- font style
- CTA labels
- expiry

### Important limitation

The model is too shallow for a genuinely adaptive long-form website. There is currently no first-class representation for:

- business archetype
- target audience
- primary conversion goal
- section plan
- content confidence/source status
- image roles
- testimonials/proof with provenance
- menu/products/packages
- process/steps
- FAQ
- social proof
- booking/order/directions actions
- per-section design intent

This should be addressed in Phase 1 rather than patched into individual templates.

## Generation pipeline findings

`api/generate-demo.ts` already contains a strong design-intelligence system prompt and asks Gemini to classify the business, choose a visual style, plan information architecture, and avoid fabricated facts.

However, the structured response is still mostly a flat collection of strings. The generation endpoint currently selects one of the five existing template IDs, returns a single visual search query, and supplies a hero plus gallery image list.

### Main architectural gap

The AI is reasoning about website strategy in the prompt, but the returned data structure does not preserve that reasoning.

Therefore the frontend cannot reliably render the strategy that the model selected.

This is the primary architectural problem to solve in Phase 1.

## Visual-system findings

The current visual layer already includes several positive foundations:

- CSS design tokens
- brand-aware semantic palette derivation
- contrast-aware text selection
- four font modes
- responsive typography
- reduced-motion support
- scroll-aware hero motion
- shared section/container primitives

The current Hero is already more sophisticated than a basic landing-page hero, with responsive typography, image motion, overlays, CTAs and a scroll indicator.

The Services component also uses a numbered editorial list rather than a basic three-card grid.

### Main visual limitations

1. Page architecture is still largely fixed per template.
2. Section variety is limited by the shared component inventory.
3. Many businesses can receive sections that are technically valid but strategically weak for their industry.
4. The engine does not yet choose image roles; it mainly treats imagery as hero/gallery assets.
5. The data model does not support richer section-specific content.
6. The system can produce a longer page, but not yet a consistently intelligent long-form page.
7. The design system has strong foundations but needs more composition families to avoid repetitive layouts.

## Responsive findings

The global CSS has explicit mobile breakpoints, responsive typography, touch-target considerations, reduced-motion handling, and overflow protection.

The mobile foundation is therefore usable for the next phases.

The remaining mobile work should be treated as a deliberate design pass later, rather than rewriting responsiveness during the architecture phase.

## Technical findings

### Dependencies

The project is a Vite + React + TypeScript application using Tailwind CSS and Lucide React. The package scripts include:

- `dev`
- `build`
- `lint`
- `typecheck`
- `preview`

### CI

No GitHub Actions workflow runs are currently present for this repository. Automated repository CI therefore cannot be used as the Phase 0 verification source.

### Local build verification

A local `git clone` could not be performed in the current execution environment because outbound DNS/network access to GitHub is unavailable. The audit therefore uses repository source inspection and the declared project configuration rather than claiming a local build passed.

**Important:** this is an environment limitation, not a project failure.

## Risk assessment

### Low risk

- Existing template mapping
- Shared component reuse
- Theme token system
- Font system
- Existing remote demo routing
- Existing expiry behavior

### Medium risk

- Expanding `ClientConfig`
- Adding section planning
- Increasing template composition depth
- Image-role handling
- Changes to generated demo payloads

### High-risk areas to protect

- Existing remote demo URLs
- Server-side demo persistence
- Authentication/dashboard flow
- 7-day expiry behavior
- Existing client configurations
- Backwards compatibility with old stored demos

## Phase 0 baseline conclusion

The current engine is **not a rewrite candidate**. It has a sound React/template foundation and a useful theme system.

The core problem is architectural:

> The generation layer reasons about custom websites, but the data/rendering layer still behaves like a fixed five-template system.

The correct next move is therefore **Phase 1: New Section Architecture and Website Strategy Model**.

We should not begin by adding more random sections to the five templates. First create the intermediate strategy/section model, preserve compatibility with existing `ClientConfig`, and make the renderer capable of composing sections intentionally.

## Phase 1 acceptance criteria

Phase 1 should not be considered complete until:

- Existing five template IDs still work.
- Existing published demos remain renderable.
- A website strategy can be represented separately from raw client data.
- Sections are represented as composable, typed concepts.
- Section order can be selected per business.
- Missing data can suppress or simplify a section safely.
- The system can support different architectures for a restaurant, media brand, professional service, and local service without duplicating an entire template.
- The next phase can add industry intelligence without another structural rewrite.
