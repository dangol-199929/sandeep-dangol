import type { LucideIcon } from "lucide-react";

/**
 * Shared types for portfolio API responses and entities.
 */

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

export interface ContactItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  target: string;
  download?: string;
}
