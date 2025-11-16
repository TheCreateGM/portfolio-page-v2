import { useEffect } from 'react'

export const GiscusCallback = () => {
  useEffect(() => {
    // Get the giscus parameter from URL
    const urlParams = new URLSearchParams(window.location.search)
    const giscusParam = urlParams.get('giscus')
    
    // Get the original page URL from session storage or default to blog
    const returnUrl = sessionStorage.getItem('giscus_return_url') || '/blog'
    
    // Clear the stored URL
    sessionStorage.removeItem('giscus_return_url')

    // If we have a giscus parameter, append it to the return URL
    if (giscusParam) {
      const separator = returnUrl.includes('?') ? '&' : '?'
      const finalUrl = `${returnUrl}${separator}giscus=${encodeURIComponent(giscusParam)}`
      
      // Use window.location for a full page reload to ensure Giscus processes the auth
      window.location.href = finalUrl
    } else {
      // No giscus param, just navigate back
      window.history.pushState({}, '', returnUrl)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        padding: '40px',
        borderRadius: '12px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 20px',
          border: '4px solid #0969da',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h2 style={{ marginBottom: '12px', color: '#24292f' }}>
          Completing GitHub Login
        </h2>
        <p style={{ color: '#57606a', marginBottom: '0' }}>
          Redirecting you back to the page...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
