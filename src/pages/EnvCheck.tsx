// Diagnostic page to check environment variables
// Visit /env-check to see what's configured

export default function EnvCheck() {
  const envVars = {
    'VITE_GISCUS_REPO': import.meta.env.VITE_GISCUS_REPO,
    'VITE_GISCUS_REPO_ID': import.meta.env.VITE_GISCUS_REPO_ID,
    'VITE_GISCUS_CATEGORY': import.meta.env.VITE_GISCUS_CATEGORY,
    'VITE_GISCUS_CATEGORY_ID': import.meta.env.VITE_GISCUS_CATEGORY_ID,
    'VITE_GISCUS_MAPPING': import.meta.env.VITE_GISCUS_MAPPING,
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : undefined,
    'VITE_DIRECTUS_URL': import.meta.env.VITE_DIRECTUS_URL,
    'VITE_MEILISEARCH_URL': import.meta.env.VITE_MEILISEARCH_URL,
    'VITE_MEILISEARCH_KEY': import.meta.env.VITE_MEILISEARCH_KEY ? '✓ Set' : undefined,
  }

  const missingVars = Object.entries(envVars).filter(([, value]) => !value)
  const hasIssues = missingVars.length > 0

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1>🔍 Environment Variables Check</h1>
      
      {hasIssues ? (
        <div style={{
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          color: '#c92a2a'
        }}>
          <h2>⚠️ Configuration Issues Found</h2>
          <p>{missingVars.length} environment variable(s) are missing or undefined:</p>
          <ul>
            {missingVars.map(([key]) => (
              <li key={key}><code>{key}</code></li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #51cf66',
          borderRadius: '8px',
          backgroundColor: '#f4fce3',
          color: '#2b8a3e'
        }}>
          <h2>✅ All Required Variables Set</h2>
        </div>
      )}

      <h2>Current Configuration</h2>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginTop: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f3f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
              Variable
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
              Value
            </th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(envVars).map(([key, value]) => (
            <tr key={key} style={{ borderBottom: '1px solid #e9ecef' }}>
              <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '14px' }}>
                {key}
              </td>
              <td style={{ 
                padding: '12px', 
                fontFamily: 'monospace', 
                fontSize: '14px',
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {value || <span style={{ color: '#868e96' }}>undefined</span>}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                {value ? (
                  <span style={{ color: '#51cf66', fontSize: '20px' }}>✓</span>
                ) : (
                  <span style={{ color: '#ff6b6b', fontSize: '20px' }}>✗</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasIssues && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>📋 How to Fix</h3>
          <ol>
            <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel Dashboard</a></li>
            <li>Select your project</li>
            <li>Navigate to <strong>Settings → Environment Variables</strong></li>
            <li>Add the missing variables listed above</li>
            <li>Redeploy your site</li>
          </ol>
          <p>
            <strong>Note:</strong> After adding variables, you MUST redeploy for changes to take effect.
          </p>
        </div>
      )}

      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e7f5ff',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>💡 Tip:</strong> This page is only for diagnostics. 
        Delete <code>src/pages/EnvCheck.tsx</code> after fixing the issues.
      </div>
    </div>
  )
}
