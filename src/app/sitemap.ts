import type { MetadataRoute } from 'next';
import { SERVICE_BRIEFS } from '@/features/services/inquirySchema';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://sagittariuz.ai';

  return [
    ...SERVICE_BRIEFS.map(service => ({ url: `${base}/services/${service.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    {
      url: `${base}/`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/team`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/projects`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/species-de-extinction`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
