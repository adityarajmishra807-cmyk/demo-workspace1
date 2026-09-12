# Phase 13 — Demo Engine V2 Integration

## Status
Implemented on `main`.

## Purpose
Unify the Phase 2–12 intelligence layers behind one deterministic orchestration API.

## Entry point

`buildDemoEngineV2(client)`

## Pipeline

`ClientConfig -> BusinessProfile -> IndustryArchetype -> DesignTokens -> LongFormPlan -> ContentPlan -> ImagePlan -> MotionSystem -> MobileStrategy -> ConversionPlan -> TemplateV2Blueprint -> QualityReport`

## Result

`DemoEngineV2Result` exposes every planning layer to the renderer and downstream tooling. `canRenderDemoV2()` blocks rendering when the quality gate reports an error.

## Compatibility

The existing `renderTemplate()` path remains unchanged. V2 is additive and can be adopted by a route or renderer explicitly, preventing legacy demos from changing unexpectedly.

## Boundary

This phase completes orchestration, not a wholesale visual rewrite. The existing templates remain the presentation layer until a renderer consumes the V2 plans.
