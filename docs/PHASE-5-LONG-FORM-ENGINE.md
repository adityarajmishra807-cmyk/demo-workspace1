# Phase 5 — Long-Form Engine

## Status
Implemented on `main`.

## Purpose
Turn business intelligence and industry archetypes into a deterministic page-depth plan so demos can become substantially longer without relying on filler copy.

## Pipeline

`ClientConfig -> BusinessProfile -> IndustryArchetype -> LongFormPlan`

## Capabilities

- Selects compact, standard, long, or immersive page depth.
- Adapts depth to supplied source content and number of offerings.
- Uses the industry archetype's section priority as the structural order.
- Ensures core conversion sections remain present.
- Adds location/about/visual sections only when supported by supplied data or assets.
- Gives every section a minimum and maximum word budget.
- Suggests block counts to encourage varied composition.
- Reports source coverage so later content generation can distinguish data-rich and data-light clients.
- Provides explicit anti-fabrication rules.

## Content integrity

The engine is a planner, not a fake-content generator. It does not invent testimonials, credentials, prices, awards, guarantees, portfolio items, or other business facts. Later content-generation phases should consume this plan and stay inside the supplied evidence.

## Design intent

Long-form does not mean repeating cards or adding arbitrary sections. The plan uses industry-specific ordering, variable content budgets, available assets, and conversion priorities to create meaningful depth and different page rhythms.
