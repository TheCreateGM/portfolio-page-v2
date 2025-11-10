import Giscus from '@giscus/react'

export const GiscusComments = () => {
  const theme = import.meta.env.VITE_GISCUS_THEME || 'preferred_color_scheme'

  return (
    <Giscus
      repo={import.meta.env.VITE_GISCUS_REPO as `${string}/${string}`}
      repoId={import.meta.env.VITE_GISCUS_REPO_ID}
      category={import.meta.env.VITE_GISCUS_CATEGORY}
      categoryId={import.meta.env.VITE_GISCUS_CATEGORY_ID}
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
