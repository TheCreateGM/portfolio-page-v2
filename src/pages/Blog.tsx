import { useEffect, useState } from 'react'
import { Layout } from '@/components/Layout/Layout'
import postsData from '@/data/posts.json'

interface BlogPost {
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

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Filter only published posts and sort by date
      const publishedPosts = postsData
        .filter(post => post.published)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      setPosts(publishedPosts)
    } catch (e) {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <Layout currentPage="blog">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-xl">Loading blog posts...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout currentPage="blog">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-red-500">
            <p className="text-xl">Error: {error}</p>
            <p className="mt-4">Please check your Directus configuration.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout currentPage="blog">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    <a
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {post.title}
                    </a>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
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
                  {post.published_at && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
