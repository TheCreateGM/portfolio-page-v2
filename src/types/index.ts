export interface Bio {
  nickname: string;
  location: string;
  introduction: string;
}

export interface Skill {
  image: string;
  description: string;
}

export interface InfoData {
  bio: Bio;
  skills: Skill[];
}

export interface Project {
  title: string;
  image: string;
  live_link: string | null;
  repo_link: string | null;
  logos: string[];
}

export interface ProjectsData {
  website: Project[];
  '3dmodel': Project[];
  game: Project[];
  Application: Project[];
  other: Project[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  fa_class: string;
}

export interface GalleryItem {
  category: string;
  image: string;
  link: string;
}

export type Theme = 'light' | 'dark';