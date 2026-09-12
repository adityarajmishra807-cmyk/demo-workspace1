import type { ClientConfig, TemplateId } from '@/types/client';
import LuxuryTemplate from '@/templates/LuxuryTemplate';
import PhotographyTemplate from '@/templates/PhotographyTemplate';
import LocalServiceTemplate from '@/templates/LocalServiceTemplate';
import RestaurantTemplate from '@/templates/RestaurantTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import TemplateV2Renderer from '@/templates/TemplateV2Renderer';

const templates: Record<TemplateId, React.ComponentType<{ client: ClientConfig }>> = {
  luxury: LuxuryTemplate,
  photography: PhotographyTemplate,
  'local-service': LocalServiceTemplate,
  restaurant: RestaurantTemplate,
  professional: ProfessionalTemplate,
};

export function renderTemplate(client: ClientConfig) {
  const Template = templates[client.template] || LuxuryTemplate;
  return <Template client={client} />;
}

/** V2 rendering uses the adaptive section architecture while legacy rendering remains available. */
export function renderTemplateV2(client: ClientConfig) {
  return <TemplateV2Renderer client={client} />;
}
