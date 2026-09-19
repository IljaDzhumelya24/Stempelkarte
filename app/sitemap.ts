import type { MetadataRoute } from 'next';

const routes = ['', '/produkt', '/branchen', '/branchen/kiosk', '/branchen/cafe', '/branchen/barbershop', '/preise', '/demo', '/ueber-uns', '/kontakt', '/faq', '/datenschutz', '/impressum'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://stamp-demo.de${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
