# Phase 3 — Industry Archetypes

## Status
Implemented on `main`.

## Purpose
Create a reusable industry strategy layer between business intelligence and later website strategy, content, image, and section-generation phases.

## Included archetypes

- Restaurant / Cafe
- Hotel / Hospitality
- Photography
- Media / Creator
- Salon / Beauty
- Gym / Fitness
- Real Estate
- Clinic / Healthcare
- Professional Service
- Local Service
- Creative Agency
- Retail
- Education
- General fallback

## Each archetype defines

- section-family priority and ordering
- visual/design direction
- layout principles
- content density
- image priority and image roles needed
- primary conversion goal
- contextual CTA strategy

## Grounding

The resolver consumes the Phase 2 `BusinessProfile`. It does not invent business facts. Archetypes provide structural and design defaults only; actual copy, proof, prices, credentials, testimonials, and other claims must still come from supplied business data in later phases.

## Architecture

`ClientConfig -> BusinessProfile -> IndustryArchetype`

The archetype layer is intentionally independent of the existing visual templates. Later phases can consume the archetype to build a `WebsiteStrategy`, choose section variants, determine content depth, and assign image roles.

## Quality gate

The implementation is deterministic, typed, reusable, and includes a General fallback for unknown industries. It does not require a visual-template rewrite.
