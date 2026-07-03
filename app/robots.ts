import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/settings/'],
      },
    ],
    sitemap: 'https://datafyle.com/sitemap.xml',
  }
}
