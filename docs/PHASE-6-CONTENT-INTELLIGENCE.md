# Phase 6 — Content Intelligence

## Status
Implemented on `main`.

## Purpose
Turn supplied client data into a structured content plan that later rendering and generation layers can safely consume.

## Pipeline

`ClientConfig -> BusinessProfile -> IndustryArchetype -> ContentPlan`

## Included

- source-aware content fields
- required / recommended / optional priorities
- word budgets
- source coverage score
- missing required-field detection
- explicit safe-expansion policy
- explicit never-invent policy
- content depth classification

## Safety boundary

The engine may expand structure, transitions, benefit framing grounded in supplied offerings, CTA microcopy, and section introductions. It must not invent prices, reviews, credentials, awards, locations, opening hours, statistics, customer results, or unsupported expertise claims.

This phase does not generate final marketing copy and does not alter visual templates.
