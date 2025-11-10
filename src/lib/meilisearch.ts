import { MeiliSearch } from 'meilisearch'

export const meili = new MeiliSearch({
  host: import.meta.env.VITE_MEILISEARCH_URL as string,
  apiKey: import.meta.env.VITE_MEILISEARCH_KEY as string
})

export const postsIndex = () => meili.index('posts')
export const projectsIndex = () => meili.index('projects')
