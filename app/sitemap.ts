import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = 'https://datafyle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, publishedAt: true },
    orderBy: { publishedAt: 'desc' },
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  ]

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedAt ?? new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages]
}
