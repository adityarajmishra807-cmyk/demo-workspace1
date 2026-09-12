import type { ClientConfig } from '@/types/client';
import type { IndustryArchetype } from './industryArchetypes';

export type ImagePriority = 'required' | 'recommended' | 'optional';
export type ImageRole = 'hero' | 'offering' | 'portfolio' | 'team' | 'environment' | 'detail' | 'location' | 'social-proof';

export interface ImageSlot {
  id: string;
  role: ImageRole;
  label: string;
  priority: ImagePriority;
  suppliedAsset?: string;
  recommendedAspectRatio: 'wide' | 'landscape' | 'portrait' | 'square';
  cropStrategy: 'cover' | 'contain' | 'natural';
  fallback: 'gradient' | 'typography' | 'none';
  generationAllowed: boolean;
}

export interface ImagePlan {
  slots: ImageSlot[];
  suppliedCount: number;
  requiredMissing: string[];
  imageReadiness: 'low' | 'medium' | 'high';
  rules: { neverFabricate: string[]; preserveSubject: string[] };
}

const value = (v: unknown) => typeof v === 'string' ? v.trim() : '';

export function buildImagePlan(client: ClientConfig, archetype: IndustryArchetype): ImagePlan {
  const assets = (client.images || []) as Array<{ url?: string; src?: string; alt?: string; type?: string }>;
  const usable = assets.filter((asset) => value(asset.url || asset.src));
  const first = usable[0]?.url || usable[0]?.src;

  const slots: ImageSlot[] = [
    { id: 'hero', role: 'hero', label: 'Primary hero image', priority: archetype.design.imagePriority === 'high' ? 'recommended' : 'optional', suppliedAsset: first, recommendedAspectRatio: 'wide', cropStrategy: 'cover', fallback: 'gradient', generationAllowed: false },
  ];

  if (archetype.imageNeeds.some((need) => /portfolio|work|project/i.test(need))) {
    slots.push({ id: 'portfolio', role: 'portfolio', label: 'Featured work / portfolio', priority: 'recommended', suppliedAsset: usable[1]?.url || usable[1]?.src, recommendedAspectRatio: 'landscape', cropStrategy: 'cover', fallback: 'typography', generationAllowed: false });
  }
  if (archetype.imageNeeds.some((need) => /team|founder|coach|agent|faculty/i.test(need))) {
    slots.push({ id: 'team', role: 'team', label: 'Team / founder', priority: 'optional', suppliedAsset: usable[2]?.url || usable[2]?.src, recommendedAspectRatio: 'portrait', cropStrategy: 'cover', fallback: 'typography', generationAllowed: false });
  }
  if (archetype.imageNeeds.some((need) => /interior|facility|property|space|environment/i.test(need))) {
    slots.push({ id: 'environment', role: 'environment', label: 'Business environment', priority: 'recommended', suppliedAsset: usable[3]?.url || usable[3]?.src, recommendedAspectRatio: 'landscape', cropStrategy: 'cover', fallback: 'gradient', generationAllowed: false });
  }

  const requiredMissing = slots.filter((slot) => slot.priority === 'required' && !slot.suppliedAsset).map((slot) => slot.id);
  const readiness = usable.length >= 4 ? 'high' : usable.length >= 2 ? 'medium' : 'low';

  return {
    slots,
    suppliedCount: usable.length,
    requiredMissing,
    imageReadiness: readiness,
    rules: {
      neverFabricate: ['customer photos', 'team identities', 'portfolio results', 'property features', 'location imagery presented as real', 'before/after results'],
      preserveSubject: ['do not distort logos or faces', 'do not crop away critical product/service context', 'do not imply an asset depicts a fact not supplied by the client'],
    },
  };
}

export function imageSlotFor(plan: ImagePlan, role: ImageRole): ImageSlot | undefined {
  return plan.slots.find((slot) => slot.role === role);
}
