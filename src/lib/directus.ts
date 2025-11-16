import { createDirectus, rest, readItems } from '@directus/sdk'

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string | null
  tags?: string[] | null
  published?: boolean
  published_at?: string | null
}

export type Project = {
  id: string
  name: string
  slug: string
  description?: string
  url?: string | null
  repo_url?: string | null
  cover_image?: string | null
  tags?: string[] | null
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export type DirectusSchema = {
  posts: BlogPost[]
  projects: Project[]
}

const baseURL = import.meta.env.VITE_DIRECTUS_URL as string

export const directus = createDirectus<DirectusSchema>(baseURL).with(rest())

export const getPosts = async (options?: Record<string, unknown>): Promise<BlogPost[]> => {
  const result = await directus.request(readItems('posts', options))
  return result as unknown as BlogPost[]
}

export const getPostBySlug = async (slug: string, fields?: string[]): Promise<BlogPost[]> => {
  const result = await directus.request(readItems('posts', { filter: { slug: { _eq: slug }, published: { _eq: true } }, limit: 1, fields }))
  return result as unknown as BlogPost[]
}

export const getProjects = async (options?: Record<string, unknown>): Promise<Project[]> => {
  const result = await directus.request(readItems('projects', options))
  return result as unknown as Project[]
}

export const getProjectBySlug = async (slug: string, fields?: string[]): Promise<Project[]> => {
  const result = await directus.request(readItems('projects', { filter: { slug: { _eq: slug } }, limit: 1, fields }))
  return result as unknown as Project[]
}
