# Phase 8 — Template V2

## Status
Implemented on `main`.

## Purpose
Introduce an archetype-aware template blueprint layer without breaking the existing template renderer.

## Pipeline

`ClientConfig -> BusinessProfile -> IndustryArchetype -> TemplateV2Blueprint -> existing template renderer`

## Included

- V2 blueprint registry for every Phase 3 archetype
- archetype-specific template mode
- section-order blueprint
- image-led / content-led / conversion-led visual priority
- V2 template resolver
- public `renderTemplateV2()` entry point

## Compatibility

The existing `renderTemplate()` path is unchanged. V2 is opt-in so Phase 8 does not create a silent redesign or regression for existing demos.

The blueprint layer intentionally reuses the current five visual templates until later phases introduce richer section composition. This keeps the migration incremental: V2 determines the strategic shape now, while subsequent phases replace the remaining one-template-fits-all behavior.

## Archetype mapping

Hospitality and premium/product businesses use the luxury visual base; photography, media, and creative work use the photography base; direct local conversion uses the local-service base; professional, healthcare, and education use the professional base; restaurants retain the restaurant base.
