import type { ClientConfig, TemplateId } from '@/types/client';
import LuxuryTemplate from '@/templates/LuxuryTemplate';
import PhotographyTemplate from '@/templates/PhotographyTemplate';
import LocalServiceTemplate from '@/templates/LocalServiceTemplate';
import RestaurantTemplate from '@/templates/RestaurantTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';

const templates: Record<
  TemplateId,
  React.ComponentType<{ client: ClientConfig }>
> = {
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
