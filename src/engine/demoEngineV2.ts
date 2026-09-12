import type { ClientConfig } from '@/types/client';
import { analyzeBusiness, type BusinessProfile } from './businessIntelligence';
import { resolveIndustryArchetype, type IndustryArchetype } from './industryArchetypes';
import { buildContentPlan, type ContentPlan } from './contentIntelligence';
import { buildImagePlan, type ImagePlan } from './imageIntelligence';
import { buildConversionPlan, type ConversionPlan } from './conversionEngine';
import { buildMobileStrategy, type MobileStrategy } from './mobileStrategy';
import { buildMotionSystem, type MotionSystem } from './motionSystem';
import { createDesignTokens, type DesignTokens } from './designSystem';
import { buildLongFormPlan, type LongFormPlan } from './longForm';
import { runQualityGate, type QualityReport } from './qualityGate';
import { getTemplateV2Blueprint, type TemplateV2Blueprint } from '@/templates/templateV2';

export interface DemoEngineV2Result {
  client: ClientConfig;
  profile: BusinessProfile;
  archetype: IndustryArchetype;
  design: DesignTokens;
  longForm: LongFormPlan;
  content: ContentPlan;
  images: ImagePlan;
  motion: MotionSystem;
  mobile: MobileStrategy;
  conversion: ConversionPlan;
  template: TemplateV2Blueprint;
  quality: QualityReport;
}

export function buildDemoEngineV2(client: ClientConfig): DemoEngineV2Result {
  const profile = client.businessProfile || analyzeBusiness(client);
  const archetype = resolveIndustryArchetype(profile);
  const design = createDesignTokens(profile);
  const longForm = buildLongFormPlan(client, profile);
  const content = buildContentPlan(client, archetype);
  const images = buildImagePlan(client, archetype);
  const motion = buildMotionSystem('subtle');
  const mobile = buildMobileStrategy(longForm.length === 'immersive' ? 'immersive' : 'balanced');
  const conversion = buildConversionPlan(profile, archetype);
  const template = getTemplateV2Blueprint(client);
  const quality = runQualityGate({ client, profile, archetype, content, images, conversion });
  return { client, profile, archetype, design, longForm, content, images, motion, mobile, conversion, template, quality };
}

export function canRenderDemoV2(result: DemoEngineV2Result): boolean { return result.quality.passed; }
