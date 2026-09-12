# Phase 14B — Archetype-Specific Compositions

## Status
Implemented on `main`.

## Purpose
Give each business archetype a distinct visual/content composition instead of applying one generic page structure to every client.

## Included

Restaurant, hotel, photography, media, salon, gym, real estate, clinic, professional service, local service, creative agency, retail, education, and general fallback compositions.

Each composition defines a deliberate section sequence and design principles covering imagery, information hierarchy, and conversion behavior.

## Architecture

`IndustryArchetype -> ArchetypeComposition -> SectionVariant[]`

The composition layer is separate from section implementation so individual variants can evolve without rewriting business-specific strategy.
