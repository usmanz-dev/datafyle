import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = 'https://datafyle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/pricing`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/contact`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/terms`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/refund`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true, createdAt: true },
      orderBy: { publishedAt: 'desc' },
    })
    blogPages = posts.map((p) => ({
      url:             `${BASE}/blog/${p.slug}`,
      lastModified:    p.publishedAt ?? p.createdAt,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }))
  } catch {
    // DB unavailable at build time — skip blog posts
  }

  return [...staticPages, ...blogPages]
}
