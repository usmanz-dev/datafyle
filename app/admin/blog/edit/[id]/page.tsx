import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogEditor } from '../../BlogEditor'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">Edit Post</h1>
        <p className="text-sm text-slate-500 mt-0.5">Update and republish</p>
      </div>
      <BlogEditor
        initial={{
          id:             post.id,
          title:          post.title,
          slug:           post.slug,
          content:        post.content,
          tags:           post.tags,
          featuredImage:  post.featuredImage,
          seoTitle:       post.seoTitle,
          seoDescription: post.seoDescription,
          published:      post.published,
        }}
      />
    </div>
  )
}
