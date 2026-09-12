# Phase 12 — Automated Quality Gate

## Status
Implemented on `main`.

## Purpose
Provide a deterministic pre-render validation layer that catches missing business data, conversion failures, weak content coverage, archetype anomalies, and image fabrication risks before V2 rendering.

## Checks
- business identity
- description and industry coverage
- required content completeness
- primary CTA presence
- verified CTA destination availability
- image strategy presence
- business-specific image fabrication prevention
- unexpected high-confidence General archetype fallback

## Output
`QualityReport` contains a pass/fail state, 0–100 score, individual check results, and actionable findings classified as error, warning, or info.

## Gate behavior
Errors fail the gate. Warnings reduce the score but do not block rendering. The gate is deterministic and has no network dependency.
