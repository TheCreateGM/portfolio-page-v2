import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../SearchBar'

// Mock Meilisearch
const mockSearch = vi.fn()

vi.mock('../../../lib/meilisearch', () => ({
  postsIndex: () => ({ search: mockSearch }),
  projectsIndex: () => ({ search: mockSearch })
}))

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      render(<SearchBar />)
      
      const searchInput = screen.getByPlaceholderText('Search posts and projects...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should render search icon', () => {
      const { container } = render(<SearchBar />)
      
      const searchIcon = container.querySelector('svg')
      expect(searchIcon).toBeInTheDocument()
    })

    it('should have proper input styling', () => {
      render(<SearchBar />)
      
      const input = screen.getByPlaceholderText('Search posts and projects...')
      expect(input).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'pl-10',
        'rounded-lg',
        'border'
      )
    })
  })

  describe('Debounced Search', () => {
    it('should debounce search with 300ms delay', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      
      // Should not search immediately
      expect(mockSearch).not.toHaveBeenCalled()

      // Fast-forward time
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalled()
      })
    })

    it('should cancel previous search on new input', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 't')
      vi.advanceTimersByTime(150)
      
      await userEvent.type(input, 'e')
      vi.advanceTimersByTime(150)

      await userEvent.type(input, 's')
      
      // Should not have called search yet
      expect(mockSearch).not.toHaveBeenCalled()

      // Complete the debounce
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        // Should only call once with the final query
        expect(mockSearch).toHaveBeenCalledTimes(2) // Once for posts, once for projects
      })
    })

    it('should not search for empty queries', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalled()
      })

      mockSearch.mockClear()

      // Clear the input
      await userEvent.clear(input)
      vi.advanceTimersByTime(300)

      expect(mockSearch).not.toHaveBeenCalled()
    })
  })

  describe('Search Functionality', () => {
    it('should search both posts and projects indices', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test excerpt'
        }
      ]

      const mockProjectHits = [
        {
          id: '2',
          name: 'Test Project',
          slug: 'test-project'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: mockProjectHits })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalledTimes(2)
        expect(mockSearch).toHaveBeenCalledWith('test', { limit: 5 })
      })
    })

    it('should display search results for posts', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'React Testing Guide',
          slug: 'react-testing',
          excerpt: 'Learn how to test React components'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'react')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('React Testing Guide')).toBeInTheDocument()
        expect(screen.getByText('Learn how to test React components')).toBeInTheDocument()
        expect(screen.getByText('Blog')).toBeInTheDocument()
      })
    })

    it('should display search results for projects', async () => {
      const mockProjectHits = [
        {
          id: '1',
          name: 'Portfolio Website',
          slug: 'portfolio'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: [] })
        .mockResolvedValueOnce({ hits: mockProjectHits })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'portfolio')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
        expect(screen.getByText('Project')).toBeInTheDocument()
      })
    })

    it('should display mixed results (posts and projects)', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'TypeScript Tutorial',
          slug: 'typescript-tutorial',
          excerpt: 'Learn TypeScript'
        }
      ]

      const mockProjectHits = [
        {
          id: '2',
          name: 'TypeScript Library',
          slug: 'ts-library'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: mockProjectHits })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'typescript')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('TypeScript Tutorial')).toBeInTheDocument()
        expect(screen.getByText('TypeScript Library')).toBeInTheDocument()
        expect(screen.getByText('Blog')).toBeInTheDocument()
        expect(screen.getByText('Project')).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner during search', async () => {
      mockSearch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ hits: [] }), 1000)))

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        const spinner = screen.getByRole('img', { hidden: true })
        expect(spinner).toBeInTheDocument()
      })
    })

    it('should hide loading spinner after search completes', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(mockSearch).toHaveBeenCalled()
      })

      // Wait for loading to finish
      await waitFor(() => {
        const spinner = screen.queryByRole('img', { hidden: true })
        expect(spinner).not.toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('should display no results message when no matches found', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'xyz123notfound')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText(/No results found for/)).toBeInTheDocument()
        expect(screen.getByText('xyz123notfound', { exact: false })).toBeInTheDocument()
      })
    })

    it('should suggest trying different keywords', async () => {
      mockSearch.mockResolvedValue({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'notfound')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText(/Try different keywords/)).toBeInTheDocument()
      })
    })
  })

  describe('Result Links', () => {
    it('should have correct href for blog posts', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /Test Post/i })
        expect(link).toHaveAttribute('href', '/blog/test-post')
      })
    })

    it('should have correct href for projects', async () => {
      const mockProjectHits = [
        {
          id: '1',
          name: 'Test Project',
          slug: 'test-project'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: [] })
        .mockResolvedValueOnce({ hits: mockProjectHits })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /Test Project/i })
        expect(link).toHaveAttribute('href', '/projects#test-project')
      })
    })
  })

  describe('Result Interaction', () => {
    it('should clear search query when result is clicked', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...') as HTMLInputElement

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })

      const link = screen.getByRole('link', { name: /Test Post/i })
      fireEvent.click(link)

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('should hide results dropdown when result is clicked', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })

      const link = screen.getByRole('link', { name: /Test Post/i })
      fireEvent.click(link)

      await waitFor(() => {
        expect(screen.queryByText('Test Post')).not.toBeInTheDocument()
      })
    })
  })

  describe('Click Outside Behavior', () => {
    it('should close results when clicking outside', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      const { container } = render(
        <div>
          <SearchBar />
          <div data-testid="outside">Outside element</div>
        </div>
      )

      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })

      // Click outside
      const outside = screen.getByTestId('outside')
      fireEvent.mouseDown(outside)

      await waitFor(() => {
        expect(screen.queryByText('Test Post')).not.toBeInTheDocument()
      })
    })

    it('should not close results when clicking inside search container', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })

      // Click on input (inside)
      fireEvent.mouseDown(input)

      // Results should still be visible
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })
  })

  describe('Focus Behavior', () => {
    it('should show results on focus if query exists', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })

      // Blur the input
      input.blur()

      await waitFor(() => {
        // Results should be hidden after clicking outside
        expect(screen.queryByText('Test Post')).not.toBeInTheDocument()
      })

      // Focus again
      fireEvent.focus(input)

      // Results should show again
      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle search errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockSearch.mockRejectedValue(new Error('Search failed'))

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Search error:', expect.any(Error))
      })

      consoleError.mockRestore()
    })

    it('should show empty results on error', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockSearch.mockRejectedValue(new Error('Search failed'))

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText(/No results found for/)).toBeInTheDocument()
      })

      consoleError.mockRestore()
    })
  })

  describe('Result Badges', () => {
    it('should show correct badge colors for posts', async () => {
      const mockPostHits = [
        {
          id: '1',
          title: 'Test Post',
          slug: 'test-post',
          excerpt: 'Test'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: mockPostHits })
        .mockResolvedValueOnce({ hits: [] })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        const badge = screen.getByText('Blog')
        expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'dark:bg-blue-900', 'dark:text-blue-200')
      })
    })

    it('should show correct badge colors for projects', async () => {
      const mockProjectHits = [
        {
          id: '1',
          name: 'Test Project',
          slug: 'test-project'
        }
      ]

      mockSearch
        .mockResolvedValueOnce({ hits: [] })
        .mockResolvedValueOnce({ hits: mockProjectHits })

      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')

      await userEvent.type(input, 'test')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        const badge = screen.getByText('Project')
        expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-200')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on input', () => {
      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')
      
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should maintain focus management', async () => {
      render(<SearchBar />)
      const input = screen.getByPlaceholderText('Search posts and projects...')
      
      input.focus()
      expect(document.activeElement).toBe(input)
    })
  })
})
