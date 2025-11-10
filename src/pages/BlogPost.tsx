import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout/Layout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GiscusComments } from '@/components/Comments/GiscusComments'
import postsData from '@/data/posts.json'

interface BlogPostType {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  tags: string[]
  published: boolean
  published_at: string
  author: {
    name: string
    avatar: string | null
  }
  created_at: string
  updated_at: string
}

interface BlogPostProps {
  slug: string
}

export const BlogPost = ({ slug }: BlogPostProps) => {
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const foundPost = postsData.find(p => p.slug === slug && p.published)
      setPost(foundPost || null)
    } catch (e) {
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl">Loading post...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-red-500">
            <p className="text-xl">Error: {error}</p>
            <p className="mt-4">
              <a href="/blog" className="text-blue-500 hover:underline">
                ← Back to Blog
              </a>
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <a href="/blog" className="text-blue-500 hover:underline">
              ← Back to Blog
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back link */}
        <div className="mb-8">
          <a href="/blog" className="text-blue-500 hover:underline">
            ← Back to Blog
          </a>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600 dark:text-gray-400">
          {post.published_at && (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {post.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        )}

        {/* Divider */}
        <hr className="my-12 border-gray-300 dark:border-gray-700" />

        {/* Comments */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <GiscusComments />
        </div>
      </article>
    </Layout>
  )
}
