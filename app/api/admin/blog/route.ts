import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  title:          z.string().min(1, 'Title is required'),
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  content:        z.string(),
  tags:           z.array(z.string()).default([]),
  featuredImage:  z.string().nullable().optional(),
  seoTitle:       z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  published:      z.boolean().default(false),
})

async function isAdmin(): Promise<boolean> {
  const clerk = await currentUser()
  const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''
  return !!email && email === process.env.ADMIN_EMAIL
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { title, slug, content, tags, featuredImage, seoTitle, seoDescription, published } = body.data

    const post = await prisma.blogPost.create({
      data: {
        title, slug, content, tags,
        featuredImage:  featuredImage  ?? null,
        seoTitle:       seoTitle       ?? null,
        seoDescription: seoDescription ?? null,
        published,
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, id: post.id })
  } catch (err) {
    const e = err as { code?: string }
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }
    console.error('Blog POST error:', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
