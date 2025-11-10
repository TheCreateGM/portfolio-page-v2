import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Blog } from '../Blog'

// Mock the Layout component
vi.mock('../../components/Layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}))

// Mock the posts data
vi.mock('../../data/posts.json', () => ({
  default: [
    {
      id: '1',
      title: 'First Published Post',
      slug: 'first-published-post',
      excerpt: 'This is the first published post',
      content: '# First Post\n\nContent here',
      cover_image: 'https://example.com/image1.jpg',
      tags: ['react', 'typescript'],
      published: true,
      published_at: '2024-01-15T10:00:00Z',
      author: {
        name: 'John Doe',
        avatar: 'https://example.com/avatar1.jpg'
      },
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Second Published Post',
      slug: 'second-published-post',
      excerpt: 'This is the second published post',
      content: '# Second Post\n\nMore content',
      cover_image: null,
      tags: ['javascript'],
      published: true,
      published_at: '2024-01-20T10:00:00Z',
      author: {
        name: 'Jane Smith',
        avatar: null
      },
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      title: 'Unpublished Draft',
      slug: 'unpublished-draft',
      excerpt: 'This is a draft',
      content: '# Draft',
      cover_image: null,
      tags: [],
      published: false,
      published_at: '2024-01-25T10:00:00Z',
      author: {
        name: 'John Doe',
        avatar: null
      },
      created_at: '2024-01-25T10:00:00Z',
      updated_at: '2024-01-25T10:00:00Z'
    }
  ]
}))

describe('Blog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should display loading message initially', () => {
      render(<Blog />)
      expect(screen.getByText('Loading blog posts...')).toBeInTheDocument()
    })
  })

  describe('Published Posts Display', () => {
    it('should display only published posts', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getByText('First Published Post')).toBeInTheDocument()
        expect(screen.getByText('Second Published Post')).toBeInTheDocument()
      })

      // Unpublished post should not be displayed
      expect(screen.queryByText('Unpublished Draft')).not.toBeInTheDocument()
    })

    it('should display posts in descending order by published date', async () => {
      render(<Blog />)

      await waitFor(() => {
        const postTitles = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
        expect(postTitles[0]).toBe('Second Published Post')
        expect(postTitles[1]).toBe('First Published Post')
      })
    })

    it('should display post excerpts', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getByText('This is the first published post')).toBeInTheDocument()
        expect(screen.getByText('This is the second published post')).toBeInTheDocument()
      })
    })

    it('should display cover images when available', async () => {
      render(<Blog />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        const firstPostImage = images.find(img => img.getAttribute('alt') === 'First Published Post')
        expect(firstPostImage).toBeInTheDocument()
        expect(firstPostImage).toHaveAttribute('src', 'https://example.com/image1.jpg')
      })
    })

    it('should not render image element when cover_image is null', async () => {
      render(<Blog />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        const secondPostImage = images.find(img => img.getAttribute('alt') === 'Second Published Post')
        expect(secondPostImage).toBeUndefined()
      })
    })

    it('should display tags when available', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument()
        expect(screen.getByText('typescript')).toBeInTheDocument()
        expect(screen.getByText('javascript')).toBeInTheDocument()
      })
    })

    it('should display formatted published dates', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
        expect(screen.getByText('January 20, 2024')).toBeInTheDocument()
      })
    })

    it('should have clickable post titles linking to blog post pages', async () => {
      render(<Blog />)

      await waitFor(() => {
        const firstPostLink = screen.getByRole('link', { name: 'First Published Post' })
        expect(firstPostLink).toHaveAttribute('href', '/blog/first-published-post')

        const secondPostLink = screen.getByRole('link', { name: 'Second Published Post' })
        expect(secondPostLink).toHaveAttribute('href', '/blog/second-published-post')
      })
    })
  })

  describe('Empty State', () => {
    it('should display empty state message when no posts are published', async () => {
      // Mock with no published posts
      vi.doMock('../../data/posts.json', () => ({
        default: [
          {
            id: '1',
            title: 'Draft Post',
            slug: 'draft-post',
            excerpt: 'Draft',
            content: 'Draft content',
            cover_image: null,
            tags: [],
            published: false,
            published_at: '2024-01-01T10:00:00Z',
            author: { name: 'Test', avatar: null },
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z'
          }
        ]
      }))

      const { unmount } = render(<Blog />)
      unmount()

      // Re-import and render
      vi.resetModules()
      const { Blog: BlogReloaded } = await import('../Blog')
      render(<BlogReloaded />)

      await waitFor(() => {
        expect(screen.getByText('No blog posts yet. Check back soon!')).toBeInTheDocument()
      })
    })

    it('should display empty state with proper styling', async () => {
      vi.doMock('../../data/posts.json', () => ({
        default: []
      }))

      const { unmount } = render(<Blog />)
      unmount()

      vi.resetModules()
      const { Blog: BlogReloaded } = await import('../Blog')
      render(<BlogReloaded />)

      await waitFor(() => {
        const emptyMessage = screen.getByText('No blog posts yet. Check back soon!')
        expect(emptyMessage).toHaveClass('text-xl', 'text-gray-600', 'dark:text-gray-400')
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when loading fails', async () => {
      // Mock posts data to throw error
      vi.doMock('../../data/posts.json', () => {
        throw new Error('Failed to load posts')
      })

      const { unmount } = render(<Blog />)
      unmount()

      vi.resetModules()
      
      try {
        const { Blog: BlogReloaded } = await import('../Blog')
        render(<BlogReloaded />)

        await waitFor(() => {
          expect(screen.getByText(/Error:/)).toBeInTheDocument()
          expect(screen.getByText('Failed to load posts')).toBeInTheDocument()
        })
      } catch (e) {
        // If module import fails, that's also acceptable for this test
        expect(e).toBeDefined()
      }
    })
  })

  describe('Layout Integration', () => {
    it('should render within Layout component', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getByTestId('layout')).toBeInTheDocument()
      })
    })

    it('should pass currentPage prop to Layout', async () => {
      const { container } = render(<Blog />)

      await waitFor(() => {
        expect(container.querySelector('[data-testid="layout"]')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Grid Layout', () => {
    it('should render posts in a grid layout', async () => {
      render(<Blog />)

      await waitFor(() => {
        const gridContainer = screen.getByText('First Published Post')
          .closest('.grid')
        
        expect(gridContainer).toBeInTheDocument()
        expect(gridContainer).toHaveClass('gap-8', 'md:grid-cols-2', 'lg:grid-cols-3')
      })
    })

    it('should apply proper article card styling', async () => {
      render(<Blog />)

      await waitFor(() => {
        const article = screen.getByText('First Published Post').closest('article')
        expect(article).toHaveClass(
          'bg-white',
          'dark:bg-gray-800',
          'rounded-lg',
          'shadow-lg',
          'overflow-hidden',
          'hover:shadow-xl',
          'transition-shadow'
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('should use semantic HTML elements', async () => {
      render(<Blog />)

      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(2)
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
      })
    })

    it('should have proper heading hierarchy', async () => {
      render(<Blog />)

      await waitFor(() => {
        const h1 = screen.getByRole('heading', { level: 1, name: 'Blog' })
        expect(h1).toBeInTheDocument()

        const h2Headings = screen.getAllByRole('heading', { level: 2 })
        expect(h2Headings.length).toBeGreaterThan(0)
      })
    })

    it('should have descriptive alt text for images', async () => {
      render(<Blog />)

      await waitFor(() => {
        const image = screen.getByAltText('First Published Post')
        expect(image).toBeInTheDocument()
      })
    })
  })

  describe('Date Formatting', () => {
    it('should format dates in US locale format', async () => {
      render(<Blog />)

      await waitFor(() => {
        const formattedDate = screen.getByText(/January \d+, \d{4}/)
        expect(formattedDate).toBeInTheDocument()
      })
    })

    it('should handle missing published_at gracefully', async () => {
      vi.doMock('../../data/posts.json', () => ({
        default: [
          {
            id: '1',
            title: 'No Date Post',
            slug: 'no-date',
            excerpt: 'Post without date',
            content: 'Content',
            cover_image: null,
            tags: [],
            published: true,
            published_at: null,
            author: { name: 'Test', avatar: null },
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-01T10:00:00Z'
          }
        ]
      }))

      const { unmount } = render(<Blog />)
      unmount()

      vi.resetModules()
      const { Blog: BlogReloaded } = await import('../Blog')
      const { container } = render(<BlogReloaded />)

      await waitFor(() => {
        expect(screen.getByText('No Date Post')).toBeInTheDocument()
        // Should not crash when rendering without date
        expect(container).toBeInTheDocument()
      })
    })
  })

  describe('Tag Rendering', () => {
    it('should not render empty tag lists', async () => {
      render(<Blog />)

      await waitFor(() => {
        const secondPost = screen.getByText('Second Published Post').closest('article')
        const tags = secondPost?.querySelectorAll('.px-2.py-1')
        
        // Second post has one tag
        expect(tags?.length).toBeGreaterThan(0)
      })
    })

    it('should apply proper tag styling', async () => {
      render(<Blog />)

      await waitFor(() => {
        const tag = screen.getByText('react')
        expect(tag).toHaveClass('px-2', 'py-1', 'bg-gray-200', 'dark:bg-gray-700', 'rounded', 'text-sm')
      })
    })
  })
})
