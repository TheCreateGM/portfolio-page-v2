import { useEffect, useRef, useState } from 'react'
import { postsIndex, projectsIndex } from '@/lib/meilisearch'

type SearchResult = {
  type: 'post' | 'project'
  id: string
  title: string
  slug: string
  excerpt?: string
}

type PostHit = {
  id: string
  title: string
  slug: string
  excerpt?: string
}

type ProjectHit = {
  id: string
  name: string
  slug: string
}

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const [posts, projects] = await Promise.all([
        postsIndex().search<PostHit>(searchTerm, { limit: 5 }),
        projectsIndex().search<ProjectHit>(searchTerm, { limit: 5 })
      ])

      const mappedResults: SearchResult[] = [
        ...posts.hits.map((hit: PostHit) => ({
          type: 'post' as const,
          id: hit.id,
          title: hit.title,
          slug: hit.slug,
          excerpt: hit.excerpt
        })),
        ...projects.hits.map((hit: ProjectHit) => ({
          type: 'project' as const,
          id: hit.id,
          title: hit.name,
          slug: hit.slug
        }))
      ]

      setResults(mappedResults)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search posts and projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <a
              key={`${result.type}-${result.id}`}
              href={result.type === 'post' ? `/blog/${result.slug}` : `/projects#${result.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
              onClick={() => {
                setShowResults(false)
                setQuery('')
              }}
            >
              <div className="flex items-start space-x-3">
                {/* Type Badge */}
                <span
                  className={`flex-shrink-0 mt-1 px-2 py-0.5 text-xs font-medium rounded ${
                    result.type === 'post'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {result.type === 'post' ? 'Blog' : 'Project'}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {result.title}
                  </h4>
                  {result.excerpt && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {result.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query && !loading && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No results found for "<strong>{query}</strong>"
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Try different keywords or check your search term
          </p>
        </div>
      )}
    </div>
  )
}
