import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  title:          z.string().min(1).optional(),
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  content:        z.string().optional(),
  tags:           z.array(z.string()).optional(),
  featuredImage:  z.string().nullable().optional(),
  seoTitle:       z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  published:      z.boolean().optional(),
  featured:       z.boolean().optional(),
})

async function isAdmin(): Promise<boolean> {
  const clerk = await currentUser()
  const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''
  return !!email && email === process.env.ADMIN_EMAIL
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = updateSchema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { published, featured, ...rest } = body.data

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { published: true, publishedAt: true },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Set publishedAt when first publishing; clear when unpublishing
    let publishedAt: Date | null | undefined = undefined
    if (published === true && !existing.publishedAt) {
      publishedAt = new Date()
    } else if (published === false) {
      publishedAt = null
    } else if (published === true && existing.publishedAt) {
      publishedAt = existing.publishedAt
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(published !== undefined ? { published } : {}),
        ...(featured  !== undefined ? { featured  } : {}),
        ...(publishedAt !== undefined ? { publishedAt } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const e = err as { code?: string }
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }
    console.error('Blog PUT error:', err)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Blog DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
