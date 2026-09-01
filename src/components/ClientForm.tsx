import { useState } from 'react';
import type { TemplateId, FontStyle, ClientConfig } from '@/types/client';

const templateOptions: { value: TemplateId; label: string; description: string }[] = [
  { value: 'luxury', label: 'Luxury', description: 'Premium, cinematic, elegant' },
  { value: 'photography', label: 'Photography', description: 'Large imagery, editorial layouts' },
  { value: 'local-service', label: 'Local Service', description: 'Trust-focused, strong CTAs' },
  { value: 'restaurant', label: 'Restaurant / Hospitality', description: 'Visual menu, reservation focus' },
  { value: 'professional', label: 'Professional Business', description: 'Clean, structured, trustworthy' },
];
const fontOptions: { value: FontStyle; label: string }[] = [
  { value: 'serif', label: 'Serif (Elegant)' }, { value: 'sans', label: 'Sans (Modern)' },
  { value: 'modern', label: 'Modern (Clean)' }, { value: 'editorial', label: 'Editorial (Bold)' },
];

export interface ClientFormData {
  businessName: string; industry: string; location: string; description: string; services: string;
  phone: string; email: string; whatsapp: string; instagram: string; website: string;
  heroImage: string; galleryImages: string; template: TemplateId; fontStyle: FontStyle;
  brandColors: { primary: string; secondary: string; accent: string }; ctaText: string;
  tagline: string; headline: string; about: string; contactName: string;
  researchReference: string; notes: string;
}

export function clientConfigToFormData(client: ClientConfig): ClientFormData {
  return {
    businessName: client.businessName, industry: client.industry,
    location: client.location?.address || [client.location?.city, client.location?.region, client.location?.country].filter(Boolean).join(', '),
    description: client.description || client.tagline || '', services: (client.services || []).map((s) => s.name).join('\n'),
    phone: client.contact?.phone || '', email: client.contact?.email || '', whatsapp: client.contact?.whatsapp || '',
    instagram: client.contact?.instagram || '', website: client.contact?.website || '', heroImage: client.heroImage || '',
    galleryImages: (client.galleryImages || []).map((g) => g.url || '').filter(Boolean).join('\n'), template: client.template,
    fontStyle: client.fontStyle, brandColors: { primary: client.brandColors.primary, secondary: client.brandColors.secondary, accent: client.brandColors.accent },
    ctaText: client.ctaText || 'Get in Touch', tagline: client.tagline || '', headline: client.headline || '',
    about: client.about?.body?.join('\n') || '', contactName: client.contact?.contactName || '', researchReference: client.contact?.instagram || client.contact?.website || '', notes: '',
  };
}

export const emptyFormData: ClientFormData = {
  businessName: '', industry: '', location: '', description: '', services: '', phone: '', email: '', whatsapp: '', instagram: '', website: '',
  heroImage: '', galleryImages: '', template: 'luxury', fontStyle: 'serif', brandColors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#c9a227' },
  ctaText: 'Get in Touch', tagline: '', headline: '', about: '', contactName: '', researchReference: '', notes: '',
};

function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return <div><label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">{label}</label>{children}{error ? <p className="text-xs text-red-400 mt-1.5">{error}</p> : hint ? <p className="text-xs text-white/30 mt-1.5">{hint}</p> : null}</div>;
}
const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.07] transition-all';

export interface ClientFormProps {
  initialData: ClientFormData; submitLabel: string; onSubmit: (data: ClientFormData) => void; onCancel: () => void; isEdit?: boolean; existingId?: string;
}

export default function ClientForm({ initialData, submitLabel, onSubmit, onCancel }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const update = <K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const generateWithGemini = async () => {
    setAiError('');
    const brief = form.notes.trim();
    if (!brief) { setAiError('Paste the business information in the box first.'); return; }
    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Gemini could not generate the content.');
      setForm((prev) => ({ ...prev, ...payload.data, notes: prev.notes }));
      setErrors({});
    } catch (error) { setAiError(error instanceof Error ? error.message : 'Could not generate content. Please try again.'); }
    finally { setAiLoading(false); }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = 'Business name is required';
    if (!form.industry.trim()) next.industry = 'Industry is required';
    if (!form.description.trim()) next.description = 'Description is required';
    setErrors(next); return Object.keys(next).length === 0;
  };

  return <form onSubmit={(e) => { e.preventDefault(); if (validate()) onSubmit(form); }} className="space-y-6">
    <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-6 space-y-5">
      <div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold uppercase tracking-wider text-sky-200">Generate Entire Demo with Gemini</h3><p className="text-xs text-white/40 mt-1">Paste everything you know about the business in one box. Gemini will organize it for you.</p></div><span className="text-xs text-sky-300/70 border border-sky-400/20 rounded-full px-2.5 py-1">AI Assist</span></div>
      <Field label="Business Information" hint="Put the business name, industry, location, website, Instagram, services, contact details, brand notes, and anything else you know — all at once.">
        <textarea className={`${inputClass} min-h-[180px] resize-y`} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder={'Example:\nMeridian Yachts\nLuxury yacht charter in Goa\nWebsite: https://...\nInstagram: @...\nPhone: +91...\nServices: private yacht charters, sunset cruises\nPremium, cinematic, sophisticated brand\nUse real information only.'} />
      </Field>
      <div className="flex items-center gap-4"><button type="button" onClick={generateWithGemini} disabled={aiLoading} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-sm">{aiLoading ? 'Generating...' : 'Generate with Gemini'}</button>{aiError && <p className="text-sm text-red-300">{aiError}</p>}</div>
    </div>

    <div className="rounded-2xl border border-white/10 p-6 space-y-5"><div><h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Generated Website Content</h3><p className="text-xs text-white/35 mt-1">Review and edit Gemini's output before creating the demo.</p></div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Business Name" error={errors.businessName}><input className={inputClass} value={form.businessName} onChange={(e) => update('businessName', e.target.value)} /></Field>
        <Field label="Industry" error={errors.industry}><input className={inputClass} value={form.industry} onChange={(e) => update('industry', e.target.value)} /></Field>
        <Field label="Location"><input className={inputClass} value={form.location} onChange={(e) => update('location', e.target.value)} /></Field>
        <Field label="Tagline"><input className={inputClass} value={form.tagline} onChange={(e) => update('tagline', e.target.value)} /></Field>
        <Field label="Headline"><input className={inputClass} value={form.headline} onChange={(e) => update('headline', e.target.value)} /></Field>
        <Field label="CTA Text"><input className={inputClass} value={form.ctaText} onChange={(e) => update('ctaText', e.target.value)} /></Field>
      </div>
      <Field label="Description" error={errors.description}><textarea className={`${inputClass} min-h-[90px]`} value={form.description} onChange={(e) => update('description', e.target.value)} /></Field>
      <Field label="About"><textarea className={`${inputClass} min-h-[120px]`} value={form.about} onChange={(e) => update('about', e.target.value)} /></Field>
      <Field label="Services" hint="One service per line"><textarea className={`${inputClass} min-h-[100px]`} value={form.services} onChange={(e) => update('services', e.target.value)} /></Field>
    </div>

    <div className="rounded-2xl border border-white/10 p-6 space-y-5"><h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact & Assets</h3><div className="grid sm:grid-cols-2 gap-5">
      <Field label="Contact Name"><input className={inputClass} value={form.contactName} onChange={(e) => update('contactName', e.target.value)} /></Field>
      <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
      <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
      <Field label="WhatsApp"><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></Field>
      <Field label="Instagram"><input className={inputClass} value={form.instagram} onChange={(e) => update('instagram', e.target.value)} /></Field>
      <Field label="Website"><input className={inputClass} value={form.website} onChange={(e) => update('website', e.target.value)} /></Field>
      <Field label="Hero Image URL"><input className={inputClass} value={form.heroImage} onChange={(e) => update('heroImage', e.target.value)} /></Field>
      <Field label="Gallery Image URLs" hint="One URL per line"><textarea className={`${inputClass} min-h-[80px]`} value={form.galleryImages} onChange={(e) => update('galleryImages', e.target.value)} /></Field>
    </div></div>

    <div className="rounded-2xl border border-white/10 p-6 space-y-5"><h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Design</h3>
      <div className="grid sm:grid-cols-2 gap-5"><Field label="Template"><select className={inputClass} value={form.template} onChange={(e) => update('template', e.target.value as TemplateId)}>{templateOptions.map((t) => <option key={t.value} value={t.value} className="bg-[#0a0a0f]">{t.label}</option>)}</select></Field>
      <Field label="Font Style"><select className={inputClass} value={form.fontStyle} onChange={(e) => update('fontStyle', e.target.value as FontStyle)}>{fontOptions.map((f) => <option key={f.value} value={f.value} className="bg-[#0a0a0f]">{f.label}</option>)}</select></Field></div>
      <div className="grid sm:grid-cols-3 gap-5"><Field label="Primary"><input className={inputClass} value={form.brandColors.primary} onChange={(e) => update('brandColors', { ...form.brandColors, primary: e.target.value })} /></Field><Field label="Secondary"><input className={inputClass} value={form.brandColors.secondary} onChange={(e) => update('brandColors', { ...form.brandColors, secondary: e.target.value })} /></Field><Field label="Accent"><input className={inputClass} value={form.brandColors.accent} onChange={(e) => update('brandColors', { ...form.brandColors, accent: e.target.value })} /></Field></div>
    </div>

    <div className="flex items-center justify-end gap-4 pt-2"><button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white">Cancel</button><button type="submit" className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm">{submitLabel}</button></div>
  </form>;
}
