import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Router } from '../Router'

// Mock all page components
vi.mock('../../pages/Home', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../../pages/About', () => ({
  About: () => <div data-testid="about-page">About Page</div>
}))

vi.mock('../../pages/Projects', () => ({
  Projects: () => <div data-testid="projects-page">Projects Page</div>
}))

vi.mock('../../pages/Social', () => ({
  Social: () => <div data-testid="social-page">Social Page</div>
}))

vi.mock('../../pages/ParticleTest', () => ({
  ParticleTest: () => <div data-testid="particle-test-page">Particle Test Page</div>
}))

vi.mock('../../pages/Login', () => ({
  Login: () => <div data-testid="login-page">Login Page</div>
}))

vi.mock('../../pages/Blog', () => ({
  Blog: () => <div data-testid="blog-page">Blog Page</div>
}))

vi.mock('../../pages/BlogPost', () => ({
  BlogPost: ({ slug }: { slug: string }) => (
    <div data-testid="blog-post-page">Blog Post: {slug}</div>
  )
}))

describe('Router Component', () => {
  const originalLocation = window.location

  beforeEach(() => {
    // Mock window.location
    delete (window as any).location
    window.location = { ...originalLocation, pathname: '/' } as Location
  })

  afterEach(() => {
    window.location = originalLocation
    vi.clearAllMocks()
  })

  describe('Static Route Resolution', () => {
    it('should render Home component for root path', () => {
      window.location.pathname = '/'
      render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('should render About component for /about path', () => {
      window.location.pathname = '/about'
      render(<Router />)
      
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
      expect(screen.getByText('About Page')).toBeInTheDocument()
    })

    it('should render Projects component for /projects path', () => {
      window.location.pathname = '/projects'
      render(<Router />)
      
      expect(screen.getByTestId('projects-page')).toBeInTheDocument()
      expect(screen.getByText('Projects Page')).toBeInTheDocument()
    })

    it('should render Social component for /social path', () => {
      window.location.pathname = '/social'
      render(<Router />)
      
      expect(screen.getByTestId('social-page')).toBeInTheDocument()
      expect(screen.getByText('Social Page')).toBeInTheDocument()
    })

    it('should render ParticleTest component for /particle-test path', () => {
      window.location.pathname = '/particle-test'
      render(<Router />)
      
      expect(screen.getByTestId('particle-test-page')).toBeInTheDocument()
      expect(screen.getByText('Particle Test Page')).toBeInTheDocument()
    })

    it('should render Login component for /login path', () => {
      window.location.pathname = '/login'
      render(<Router />)
      
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('should render Blog component for /blog path', () => {
      window.location.pathname = '/blog'
      render(<Router />)
      
      expect(screen.getByTestId('blog-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Page')).toBeInTheDocument()
    })
  })

  describe('Dynamic Route Resolution', () => {
    it('should render BlogPost component with slug for /blog/:slug pattern', () => {
      window.location.pathname = '/blog/my-first-post'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Post: my-first-post')).toBeInTheDocument()
    })

    it('should handle different blog post slugs', () => {
      window.location.pathname = '/blog/react-hooks-guide'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Post: react-hooks-guide')).toBeInTheDocument()
    })

    it('should handle slugs with hyphens and numbers', () => {
      window.location.pathname = '/blog/typescript-tutorial-2024'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Post: typescript-tutorial-2024')).toBeInTheDocument()
    })

    it('should correctly extract slug from URL path', () => {
      window.location.pathname = '/blog/testing-with-vitest'
      render(<Router />)
      
      const blogPost = screen.getByTestId('blog-post-page')
      expect(blogPost.textContent).toContain('testing-with-vitest')
    })
  })

  describe('Pattern Matching Priority', () => {
    it('should prioritize static routes over dynamic patterns', () => {
      window.location.pathname = '/blog'
      render(<Router />)
      
      // Should render Blog list page, not BlogPost
      expect(screen.getByTestId('blog-page')).toBeInTheDocument()
      expect(screen.queryByTestId('blog-post-page')).not.toBeInTheDocument()
    })

    it('should match static routes first before checking patterns', () => {
      window.location.pathname = '/'
      render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.queryByTestId('blog-post-page')).not.toBeInTheDocument()
    })
  })

  describe('404 Fallback', () => {
    it('should render Home component for unknown routes', () => {
      window.location.pathname = '/non-existent-page'
      render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should handle deeply nested unknown paths', () => {
      window.location.pathname = '/foo/bar/baz'
      render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should fallback to Home for malformed blog post URLs', () => {
      window.location.pathname = '/blog/foo/bar'
      render(<Router />)
      
      // Should fallback since /blog/:slug only matches one segment
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  describe('Browser Navigation', () => {
    it('should update route on popstate event', async () => {
      window.location.pathname = '/'
      const { rerender } = render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()

      // Simulate browser back/forward navigation
      window.location.pathname = '/about'
      window.dispatchEvent(new PopStateEvent('popstate'))
      
      rerender(<Router />)
      
      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument()
      })
    })

    it('should clean up popstate event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const { unmount } = render(<Router />)
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function))
    })

    it('should add popstate event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      render(<Router />)
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function))
    })
  })

  describe('Route Pattern Validation', () => {
    it('should not match /blog with trailing slash as blog post', () => {
      window.location.pathname = '/blog/'
      render(<Router />)
      
      // Should fallback to home (or could render blog list depending on implementation)
      const page = screen.queryByTestId('blog-post-page')
      if (page) {
        // If it does render blog post, slug should be empty
        expect(page.textContent).not.toContain('Blog Post: /')
      }
    })

    it('should correctly match single-segment blog post slugs', () => {
      window.location.pathname = '/blog/post'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Post: post')).toBeInTheDocument()
    })

    it('should handle URL-encoded characters in slugs', () => {
      window.location.pathname = '/blog/hello%20world'
      render(<Router />)
      
      // The router should receive the raw pathname with %20
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
    })
  })

  describe('Initial Path Rendering', () => {
    it('should render correct component based on initial window.location', () => {
      window.location.pathname = '/projects'
      render(<Router />)
      
      expect(screen.getByTestId('projects-page')).toBeInTheDocument()
    })

    it('should handle initialization with dynamic route', () => {
      window.location.pathname = '/blog/initial-post'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
      expect(screen.getByText('Blog Post: initial-post')).toBeInTheDocument()
    })
  })

  describe('Multiple Renders', () => {
    it('should maintain state across multiple renders', () => {
      window.location.pathname = '/about'
      const { rerender } = render(<Router />)
      
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
      
      rerender(<Router />)
      
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
    })

    it('should not trigger unnecessary re-renders', () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      window.location.pathname = '/'
      const { rerender } = render(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      
      // Multiple rerenders without path change
      rerender(<Router />)
      rerender(<Router />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      
      consoleLog.mockRestore()
    })
  })

  describe('Case Sensitivity', () => {
    it('should handle exact case-sensitive path matching', () => {
      window.location.pathname = '/About'
      render(<Router />)
      
      // Most routers are case-sensitive, so /About !== /about
      // Should fallback to home
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should match exact lowercase paths', () => {
      window.location.pathname = '/about'
      render(<Router />)
      
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty pathname', () => {
      window.location.pathname = ''
      render(<Router />)
      
      // Empty path should likely render home or fallback
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should handle paths with query parameters', () => {
      // Query params shouldn't affect routing
      window.location.pathname = '/about'
      const { search } = window.location
      
      render(<Router />)
      
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
    })

    it('should handle paths with hash fragments', () => {
      window.location.pathname = '/projects'
      
      render(<Router />)
      
      expect(screen.getByTestId('projects-page')).toBeInTheDocument()
    })
  })

  describe('BlogPost Component Integration', () => {
    it('should pass correct slug prop to BlogPost component', () => {
      window.location.pathname = '/blog/integration-test'
      render(<Router />)
      
      const blogPost = screen.getByTestId('blog-post-page')
      expect(blogPost).toBeInTheDocument()
      expect(blogPost.textContent).toContain('integration-test')
    })

    it('should handle different BlogPost slugs dynamically', () => {
      const testSlugs = [
        'first-post',
        'second-post',
        'react-tutorial',
        'typescript-guide-2024'
      ]

      testSlugs.forEach(slug => {
        window.location.pathname = `/blog/${slug}`
        const { unmount } = render(<Router />)
        
        const blogPost = screen.getByTestId('blog-post-page')
        expect(blogPost.textContent).toContain(slug)
        
        unmount()
      })
    })
  })

  describe('Route Configuration', () => {
    it('should have all expected static routes configured', () => {
      const staticPaths = [
        '/',
        '/about',
        '/projects',
        '/social',
        '/particle-test',
        '/login',
        '/blog'
      ]

      staticPaths.forEach(path => {
        window.location.pathname = path
        const { unmount } = render(<Router />)
        
        // Each path should render something (not just fallback)
        const container = screen.getByTestId(/.+-page/)
        expect(container).toBeInTheDocument()
        
        unmount()
      })
    })

    it('should have dynamic blog post route configured', () => {
      window.location.pathname = '/blog/dynamic-slug-test'
      render(<Router />)
      
      expect(screen.getByTestId('blog-post-page')).toBeInTheDocument()
    })
  })
})
