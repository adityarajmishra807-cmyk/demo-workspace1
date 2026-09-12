# Phase 2 — Business Intelligence

## Status
Implemented on `main`.

## What changed

The Demo Engine now has a deterministic business-intelligence layer that derives a structured profile from the supplied `ClientConfig` instead of treating client data as a flat collection of fields.

### Business profile

The analyzer derives:

- industry and confidence
- likely audience
- explicit service/offerings list
- primary conversion goal
- existing brand/template character signals
- image/logo/service-image/contact-channel availability
- structured location availability
- content-data signals and source word count

### Safety / grounding

The analyzer only uses information already present in the client configuration plus conservative category defaults. It does not generate testimonials, ratings, awards, statistics, credentials, prices, addresses, or other unsupported business claims.

### Integration

- New analyzer: `src/engine/businessIntelligence.ts`
- `ClientConfig` now supports an optional `businessProfile`.
- `formToClientConfig()` generates the profile when a client is created or edited.
- Client registry loading enriches legacy clients that do not yet have a stored profile.
- Remote client fetch/sync paths also enrich profiles so existing demos gain the Phase 2 intelligence layer without requiring migration.

## Quality gate

The implementation is intentionally independent from visual template selection. Phase 2 establishes the business understanding layer that later phases can consume for industry archetypes, section planning, content depth, image selection, and conversion strategy.
