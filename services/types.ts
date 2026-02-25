import type { LucideIcon } from "lucide-react";

/**
 * Shared types for portfolio API responses and entities.
 */

/** About section content (API shape) */
export interface About {
  name: string;
  email: string;
  education: string;
  availability: string;
  bio: string[];
  image: string;
}

/** Contact item from API (no icon; UI maps label to icon) */
export interface ContactItemApi {
  label: string;
  value: string;
  href: string;
  target?: string;
  download?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  metrics: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  side: "left" | "right";
}

export interface ResumeResponse {
  resumePath: string;
}

export interface Skill {
  name: string;
  level: number;
}

/** Contact item with icon (used by UI after mapping from API) */
export interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  target: string;
  download?: string;
}
