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
  { value: 'serif', label: 'Serif (Elegant)' },
  { value: 'sans', label: 'Sans (Modern)' },
  { value: 'modern', label: 'Modern (Clean)' },
  { value: 'editorial', label: 'Editorial (Bold)' },
];

export interface ClientFormData {
  businessName: string;
  industry: string;
  location: string;
  description: string;
  services: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  heroImage: string;
  galleryImages: string;
  template: TemplateId;
  fontStyle: FontStyle;
  brandColors: { primary: string; secondary: string; accent: string };
  ctaText: string;
  researchReference: string;
  notes: string;
}

export function clientConfigToFormData(client: ClientConfig): ClientFormData {
  return {
    businessName: client.businessName,
    industry: client.industry,
    location: client.location?.address || [client.location?.city, client.location?.region, client.location?.country].filter(Boolean).join(', '),
    description: client.description || client.tagline || '',
    services: (client.services || []).map((s) => s.name).join('\n'),
    phone: client.contact?.phone || '',
    email: client.contact?.email || '',
    whatsapp: client.contact?.whatsapp || '',
    instagram: client.contact?.instagram || '',
    heroImage: client.heroImage || '',
    galleryImages: (client.galleryImages || []).map((g) => g.url || '').filter(Boolean).join('\n'),
    template: client.template,
    fontStyle: client.fontStyle,
    brandColors: {
      primary: client.brandColors.primary,
      secondary: client.brandColors.secondary,
      accent: client.brandColors.accent,
    },
    ctaText: client.ctaText || 'Get in Touch',
    researchReference: client.contact?.instagram || client.contact?.website || '',
    notes: '',
  };
}

export const emptyFormData: ClientFormData = {
  businessName: '',
  industry: '',
  location: '',
  description: '',
  services: '',
  phone: '',
  email: '',
  whatsapp: '',
  instagram: '',
  heroImage: '',
  galleryImages: '',
  template: 'luxury',
  fontStyle: 'serif',
  brandColors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#c9a227' },
  ctaText: 'Get in Touch',
  researchReference: '',
  notes: '',
};

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-400 mt-1.5">{error}</p>
      ) : hint ? (
        <p className="text-xs text-white/30 mt-1.5">{hint}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.07] transition-all';

export interface ClientFormProps {
  initialData: ClientFormData;
  submitLabel: string;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  existingId?: string;
}

export default function ClientForm({
  initialData,
  submitLabel,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const update = <K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateWithGemini = async () => {
    setAiError('');
    if (!form.businessName.trim() || !form.industry.trim()) {
      setErrors((prev) => ({
        ...prev,
        businessName: !form.businessName.trim() ? 'Business name is required' : prev.businessName,
        industry: !form.industry.trim() ? 'Industry is required' : prev.industry,
      }));
      setAiError('Enter the business name and industry first.');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: form.businessName,
          industry: form.industry,
          location: form.location,
          websiteOrInstagram: form.researchReference,
          notes: form.notes,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Gemini could not generate the content.');

      setForm((prev) => ({ ...prev, ...payload.data }));
      setErrors({});
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Could not generate content. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = 'Business name is required';
    if (!form.industry.trim()) next.industry = 'Industry is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gemini */}
      <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-200">Generate with Gemini</h3>
            <p className="text-xs text-white/40 mt-1">Enter the basics, then let Gemini prepare the website content for your review.</p>
          </div>
          <span className="text-xs text-sky-300/70 border border-sky-400/20 rounded-full px-2.5 py-1">AI Assist</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Website / Instagram Reference" hint="Optional. Paste a URL or handle for context.">
            <input
              className={inputClass}
              value={form.researchReference}
              onChange={(e) => update('researchReference', e.target.value)}
              placeholder="https://... or @handle"
            />
          </Field>
          <Field label="Extra Notes" hint="Anything you know about the business. No need to be polished.">
            <input
              className={inputClass}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Premium, family owned, Goa, etc."
            />
          </Field>
        </div>
        {aiError && (
          <div className="rounded-xl border border-red-400/20 bg-red-500/5 p-3 text-sm text-red-300">{aiError}</div>
        )}
        <button
          type="button"
          onClick={generateWithGemini}
          disabled={aiLoading}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
        >
          {aiLoading ? 'Generating...' : 'Generate with Gemini'}
        </button>
      </div>

      {/* Business Info */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Business Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Business Name" error={errors.businessName}>
            <input
              className={`${inputClass} ${errors.businessName ? 'border-red-400/50' : ''}`}
              value={form.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              placeholder="e.g. Meridian Studio"
            />
          </Field>
          <Field label="Industry" error={errors.industry}>
            <input
              className={`${inputClass} ${errors.industry ? 'border-red-400/50' : ''}`}
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
              placeholder="e.g. Interior Design"
            />
          </Field>
          <Field label="Location" hint="City, Region, Country">
            <input className={inputClass} value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Mumbai, India" />
          </Field>
          <Field label="Description" hint="Short business description">
            <input className={inputClass} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Short business description" />
          </Field>
        </div>
        <Field label="Services" hint="One service per line">
          <textarea className={`${inputClass} min-h-[80px] resize-y`} value={form.services} onChange={(e) => update('services', e.target.value)} placeholder={'Consultation\nDesign\nInstallation'} />
        </Field>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="hello@..." /></Field>
          <Field label="WhatsApp"><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Instagram"><input className={inputClass} value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle" /></Field>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Images</h3>
        <Field label="Hero Image URL" hint="A URL to the main background image"><input className={inputClass} value={form.heroImage} onChange={(e) => update('heroImage', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Gallery Image URLs" hint="One URL per line"><textarea className={`${inputClass} min-h-[80px] resize-y`} value={form.galleryImages} onChange={(e) => update('galleryImages', e.target.value)} placeholder={'https://...\nhttps://...'} /></Field>
      </div>

      {/* Template & Branding */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Template & Branding</h3>
        <Field label="Template">
          <div className="grid sm:grid-cols-2 gap-3">
            {templateOptions.map((t) => (
              <button key={t.value} type="button" onClick={() => update('template', t.value)} className={`text-left p-4 rounded-xl border transition-all ${form.template === t.value ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-white/40 mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        </Field>
        <Field label="Font Style">
          <select className={inputClass} value={form.fontStyle} onChange={(e) => update('fontStyle', e.target.value as FontStyle)}>
            {fontOptions.map((f) => <option key={f.value} value={f.value} className="bg-[#0a0a0f]">{f.label}</option>)}
          </select>
        </Field>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Primary Color"><div className="flex items-center gap-3"><input type="color" value={form.brandColors.primary} onChange={(e) => update('brandColors', { ...form.brandColors, primary: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer" /><input className={inputClass} value={form.brandColors.primary} onChange={(e) => update('brandColors', { ...form.brandColors, primary: e.target.value })} /></div></Field>
          <Field label="Secondary Color"><div className="flex items-center gap-3"><input type="color" value={form.brandColors.secondary} onChange={(e) => update('brandColors', { ...form.brandColors, secondary: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer" /><input className={inputClass} value={form.brandColors.secondary} onChange={(e) => update('brandColors', { ...form.brandColors, secondary: e.target.value })} /></div></Field>
          <Field label="Accent Color"><div className="flex items-center gap-3"><input type="color" value={form.brandColors.accent} onChange={(e) => update('brandColors', { ...form.brandColors, accent: e.target.value })} className="w-12 h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer" /><input className={inputClass} value={form.brandColors.accent} onChange={(e) => update('brandColors', { ...form.brandColors, accent: e.target.value })} /></div></Field>
        </div>
        <Field label="CTA Text" hint="Main call-to-action button text"><input className={inputClass} value={form.ctaText} onChange={(e) => update('ctaText', e.target.value)} placeholder="Get in Touch" /></Field>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button>
        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20">{submitLabel}</button>
      </div>
    </form>
  );
}
