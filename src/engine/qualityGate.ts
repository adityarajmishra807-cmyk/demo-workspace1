import type { ClientConfig } from '@/types/client';
import type { BusinessProfile } from './businessIntelligence';
import type { IndustryArchetype } from './industryArchetypes';
import type { ContentPlan } from './contentIntelligence';
import type { ImagePlan } from './imageIntelligence';
import type { ConversionPlan } from './conversionEngine';

export type QualitySeverity = 'error' | 'warning' | 'info';
export interface QualityFinding { code: string; severity: QualitySeverity; message: string; }
export interface QualityReport { passed: boolean; score: number; findings: QualityFinding[]; checks: Record<string, boolean>; }

export function runQualityGate(input: {
  client: ClientConfig;
  profile: BusinessProfile;
  archetype: IndustryArchetype;
  content: ContentPlan;
  images: ImagePlan;
  conversion: ConversionPlan;
}): QualityReport {
  const findings: QualityFinding[] = [];
  const checks: Record<string, boolean> = {};
  const check = (name: string, ok: boolean, severity: QualitySeverity, message: string, code: string) => {
    checks[name] = ok;
    if (!ok) findings.push({ code, severity, message });
  };

  check('business-name', Boolean(input.client.businessName?.trim()), 'error', 'Business name is missing.', 'MISSING_BUSINESS_NAME');
  check('description', Boolean(input.client.description?.trim()), 'warning', 'Business description is missing.', 'MISSING_DESCRIPTION');
  check('industry', Boolean(input.profile.industry?.trim()), 'warning', 'Industry classification is missing.', 'MISSING_INDUSTRY');
  check('content-required', input.content.missingRequired.length === 0, 'error', `Required content is missing: ${input.content.missingRequired.join(', ')}.`, 'MISSING_REQUIRED_CONTENT');
  check('primary-cta', Boolean(input.conversion.primary.label?.trim()), 'error', 'Primary conversion action is missing.', 'MISSING_PRIMARY_CTA');
  check('contact-destination', input.conversion.primary.hrefType !== 'anchor' || Boolean(input.client.contact), 'warning', 'Primary CTA has no verified contact destination.', 'UNVERIFIED_CTA_DESTINATION');
  check('image-plan', input.images.slots.length > 0, 'error', 'No image strategy was produced.', 'MISSING_IMAGE_PLAN');
  check('no-fabricated-image-evidence', input.images.slots.every((slot) => !slot.generationAllowed), 'error', 'A business-specific image slot allows fabrication.', 'FABRICATED_IMAGE_RISK');
  check('archetype', input.archetype.id !== 'general' || input.profile.confidence < 0.75, 'warning', 'Industry archetype fell back to General despite a high-confidence profile.', 'ARCHETYPE_FALLBACK');

  const errors = findings.filter((finding) => finding.severity === 'error').length;
  const warnings = findings.filter((finding) => finding.severity === 'warning').length;
  const score = Math.max(0, Math.round(100 - errors * 20 - warnings * 5));
  return { passed: errors === 0, score, findings, checks };
}
