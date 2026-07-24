import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/settings',
          '/admin',
          '/api/',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: 'https://datafyle.com/sitemap.xml',
  }
}
