import { useContext } from 'react'
import { SecurityContext } from '../contexts/SecurityContext'

export const useSecurity = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}

// Re-export utility functions for convenience
export { sanitizeURL, sanitizeHTML, validateEmail, validateInput } from '../utils/security'
