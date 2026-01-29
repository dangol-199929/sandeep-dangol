import type { Skill } from "./types";

/**
 * Returns skills data for the portfolio.
 * Currently static; can be extended to fetch from /api/skills or similar.
 */
export function getSkills(): Skill[] {
  return [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Shadcn UI", level: 88 },
    { name: "REST API", level: 85 },
    { name: "HTML/CSS", level: 95 },
    { name: "Git", level: 85 },
    { name: "Agile/Scrum", level: 82 },
    { name: "Docker", level: 65 },
    { name: "Jest Testing", level: 70 },
  ];
}
