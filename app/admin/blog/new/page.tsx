import { BlogEditor } from '../BlogEditor'

export default function NewBlogPostPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">New Blog Post</h1>
        <p className="text-sm text-slate-500 mt-0.5">Write and publish to datafyle.com/blog</p>
      </div>
      <BlogEditor
        initial={{
          title: '', slug: '', content: '', tags: [],
          featuredImage: null, seoTitle: null, seoDescription: null, published: false, featured: false,
        }}
      />
    </div>
  )
}
