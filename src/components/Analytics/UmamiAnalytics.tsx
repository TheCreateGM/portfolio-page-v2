import { useEffect } from 'react'

export const UmamiAnalytics = () => {
  useEffect(() => {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
    const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL

    // Only load if both environment variables are set
    if (!websiteId || !scriptUrl) {
      console.warn('Umami Analytics: Environment variables not set. Skipping analytics.')
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[data-website-id="${websiteId}"]`)
    if (existingScript) {
      return
    }

    // Create and inject the Umami script
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.setAttribute('data-website-id', websiteId)
    script.src = scriptUrl

    document.head.appendChild(script)

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(`script[data-website-id="${websiteId}"]`)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [])

  return null // This component doesn't render anything
}
