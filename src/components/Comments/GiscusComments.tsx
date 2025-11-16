import { useEffect } from 'react'
import Giscus from '@giscus/react'

export const GiscusComments = () => {
  const theme = import.meta.env.VITE_GISCUS_THEME || 'preferred_color_scheme'
  
  // Store current URL before GitHub OAuth redirect
  useEffect(() => {
    sessionStorage.setItem('giscus_return_url', window.location.pathname + window.location.search)
  }, [])
  
  // Check if required environment variables are set
  const repo = import.meta.env.VITE_GISCUS_REPO
  const repoId = import.meta.env.VITE_GISCUS_REPO_ID
  const category = import.meta.env.VITE_GISCUS_CATEGORY
  const categoryId = import.meta.env.VITE_GISCUS_CATEGORY_ID

  // Show error message if configuration is missing
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div style={{
        padding: '20px',
        margin: '20px 0',
        border: '2px solid #ff6b6b',
        borderRadius: '8px',
        backgroundColor: '#fff5f5',
        color: '#c92a2a'
      }}>
        <h3>⚠️ Comments Configuration Missing</h3>
        <p>Giscus comments are not configured properly. Missing environment variables:</p>
        <ul>
          {!repo && <li>VITE_GISCUS_REPO</li>}
          {!repoId && <li>VITE_GISCUS_REPO_ID</li>}
          {!category && <li>VITE_GISCUS_CATEGORY</li>}
          {!categoryId && <li>VITE_GISCUS_CATEGORY_ID</li>}
        </ul>
        <p>
          <strong>For site admin:</strong> Add these environment variables in your Vercel dashboard 
          (Settings → Environment Variables) and redeploy.
        </p>
      </div>
    )
  }

  return (
    <Giscus
      repo={repo as `${string}/${string}`}
      repoId={repoId}
      category={category}
      categoryId={categoryId}
      mapping={import.meta.env.VITE_GISCUS_MAPPING || 'pathname'}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={theme}
      lang={import.meta.env.VITE_GISCUS_LANG || 'en'}
      loading="lazy"
    />
  )
}
