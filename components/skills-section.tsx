"use client"

import { motion } from "framer-motion"

const skills = [
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
]

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">{name}</h3>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
            viewport={{ once: true }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-sm text-gray-400">{level}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
            Technologies I work with
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Skills
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <SkillBar key={skill.name} {...skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
