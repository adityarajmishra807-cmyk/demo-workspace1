# Phase 7 — Image Intelligence

## Status
Implemented on `main`.

## Purpose
Create an asset-aware image plan between industry strategy and rendering. The engine identifies image roles, priorities, aspect ratios, crop behavior, and safe fallbacks without inventing business assets.

## Pipeline

`ClientConfig -> BusinessProfile -> IndustryArchetype -> ImagePlan`

## Included

- hero, portfolio, team, and environment image slots
- archetype-aware image priorities
- supplied asset detection
- image readiness scoring
- aspect-ratio and crop recommendations
- non-fabricating fallbacks
- explicit rules for preserving faces, logos, and factual context

## Safety boundary

The engine does not fabricate customer photos, team identities, portfolio results, property features, real location imagery, or before/after results. `generationAllowed` is false for business-specific image slots; missing assets must fall back to layout-safe presentation rather than invented evidence.

## Integration

Later section/template phases can consume `ImagePlan` to decide which visual modules to render and how to handle missing assets.
