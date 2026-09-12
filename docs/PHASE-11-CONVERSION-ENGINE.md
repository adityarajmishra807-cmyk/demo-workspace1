# Phase 11 — Conversion Engine

## Status
Implemented on `main`.

## Purpose
Create an explicit conversion layer that turns the business goal and industry archetype into a small, contextual CTA system.

## Included
- primary and secondary CTA planning
- hero, mid-page, final placement
- real phone, WhatsApp, and email destination detection when supplied
- contextual CTA strategy
- trust/anti-fabrication requirements

## Pipeline
`BusinessProfile + IndustryArchetype -> ConversionPlan`

The engine does not invent contact destinations or proof. Rendering can consume the plan to place actions consistently across V2 templates.
