import type { ClientConfig, FontStyle, TemplateId } from '@/types/client';

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
  website: string;
  tagline: string;
  headline: string;
  about: string;
  contactName: string;
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
    location: client.location,
    description: client.description,
    services: client.services.join('\n'),
    phone: client.contact?.phone || '',
    email: client.contact?.email || '',
    whatsapp: client.contact?.whatsapp || '',
    instagram: client.contact?.instagram || '',
    website: client.contact?.website || '',
    tagline: client.tagline,
    headline: client.headline,
    about: client.about,
    contactName: client.contact?.name || '',
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
  website: '',
  tagline: '',
  headline: '',
  about: '',
  contactName: '',
  template: 'professional',
  fontStyle: 'serif',
  brandColors: { primary: '#1a1a2e', secondary: '#16213e', accent: '#c9a227' },
  ctaText: 'Get in Touch',
  researchReference: '',
  notes: '',
};

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/60">{label}</label>
      {children}
      {error && <p className="text-xs text-red-300">{error}</p>}
      {hint && !error && <p className="text-xs text-white/35">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-400/50';

interface ClientFormProps {
  initialData?: ClientFormData;
  onSubmit: (data: ClientFormData) => void;
  submitLabel: string;
}

export default function ClientForm({ initialData = emptyFormData, onSubmit, submitLabel }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const update = <K extends keyof ClientFormData>(key: K, value: ClientFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateWithGemini = async () => {
    setAiError('');
    if (!form.businessName.trim()) {
      setErrors((prev) => ({ ...prev, businessName: 'Business name is required' }));
      setAiError('Enter the business name first.');
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
    if (!form.description.trim()) next.description = 'Description is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gemini */}
      <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-200">Generate with Gemini</h3>
            <p className="text-xs text-white/40 mt-1">Give Gemini the business details in one place, then review the generated website content.</p>
          </div>
          <span className="text-xs text-sky-300/70 border border-sky-400/20 rounded-full px-2.5 py-1">AI Assist</span>
        </div>

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Business Name" error={errors.businessName} hint="Required"> 
              <input
                className={`${inputClass} ${errors.businessName ? 'border-red-400/50' : ''}`}
                value={form.businessName}
                onChange={(e) => update('businessName', e.target.value)}
                placeholder="e.g. Meridian Yachts"
              />
            </Field>
            <Field label="Industry" error={errors.industry} hint="e.g. Yacht Charter, Cafe, Photography"> 
              <input
                className={`${inputClass} ${errors.industry ? 'border-red-400/50' : ''}`}
                value={form.industry}
                onChange={(e) => update('industry', e.target.value)}
                placeholder="e.g. Yacht Charter"
              />
            </Field>
            <Field label="Location" hint="City, region, country"> 
              <input className={inputClass} value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Goa, India" />
            </Field>
            <Field label="Website / Instagram" hint="Optional. Paste a URL or handle for context.">
              <input
                className={inputClass}
                value={form.researchReference}
                onChange={(e) => update('researchReference', e.target.value)}
                placeholder="https://... or @handle"
              />
            </Field>
          </div>

          <Field label="Extra Notes" hint="Anything you know about the business. No need to be polished.">
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Premium, family owned, Goa, luxury yacht experiences, target audience, services you know about, etc."
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

      {/* Generated / editable content */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Generated Website Content</h3>
          <p className="text-xs text-white/35 mt-1">Gemini fills these fields. Review and edit anything before creating the demo.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Tagline">
            <input className={inputClass} value={form.tagline} onChange={(e) => update('tagline', e.target.value)} placeholder="Tagline" />
          </Field>
          <Field label="Headline">
            <input className={inputClass} value={form.headline} onChange={(e) => update('headline', e.target.value)} placeholder="Headline" />
          </Field>
          <Field label="Description" error={errors.description}>
            <input className={`${inputClass} ${errors.description ? 'border-red-400/50' : ''}`} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Short business description" />
          </Field>
          <Field label="CTA Text">
            <input className={inputClass} value={form.ctaText} onChange={(e) => update('ctaText', e.target.value)} placeholder="Get in Touch" />
          </Field>
        </div>
        <Field label="Services" hint="One service per line">
          <textarea className={`${inputClass} min-h-[100px] resize-y`} value={form.services} onChange={(e) => update('services', e.target.value)} placeholder={'Consultation\nDesign\nInstallation'} />
        </Field>
        <Field label="About">
          <textarea className={`${inputClass} min-h-[120px] resize-y`} value={form.about} onChange={(e) => update('about', e.target.value)} placeholder="About the business" />
        </Field>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Contact Name"><input className={inputClass} value={form.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Contact person" /></Field>
          <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="hello@..." /></Field>
          <Field label="WhatsApp"><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} placeholder="+91 ..." /></Field>
          <Field label="Instagram"><input className={inputClass} value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@handle or URL" /></Field>
          <Field label="Website"><input className={inputClass} value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://..." /></Field>
        </div>
      </div>

      {/* Design */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">Design</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Template">
            <select className={inputClass} value={form.template} onChange={(e) => update('template', e.target.value as TemplateId)}>
              <option value="luxury">Luxury</option>
              <option value="photography">Photography</option>
              <option value="local-service">Local Service</option>
              <option value="restaurant">Restaurant / Hospitality</option>
              <option value="professional">Professional Business</option>
            </select>
          </Field>
          <Field label="Font Style">
            <select className={inputClass} value={form.fontStyle} onChange={(e) => update('fontStyle', e.target.value as FontStyle)}>
              <option value="serif">Serif</option>
              <option value="sans">Sans</option>
              <option value="display">Display</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <Field label="Primary"><input type="text" className={inputClass} value={form.brandColors.primary} onChange={(e) => update('brandColors', { ...form.brandColors, primary: e.target.value })} /></Field>
          <Field label="Secondary"><input type="text" className={inputClass} value={form.brandColors.secondary} onChange={(e) => update('brandColors', { ...form.brandColors, secondary: e.target.value })} /></Field>
          <Field label="Accent"><input type="text" className={inputClass} value={form.brandColors.accent} onChange={(e) => update('brandColors', { ...form.brandColors, accent: e.target.value })} /></Field>
        </div>
      </div>

      <button type="submit" className="w-full rounded-xl bg-white text-black py-3.5 font-semibold hover:bg-white/90 transition-colors">
        {submitLabel}
      </button>
    </form>
  );
}
