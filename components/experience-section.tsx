"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  side: "left" | "right"
}

function TimelineItem({
  experience,
  index,
  total,
}: {
  experience: Experience
  index: number
  total: number
}) {
  const isRight = experience.side === "right"

  return (
    <div className="relative flex items-center justify-center">
      {/* Timeline Line */}
      {index < total - 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-[calc(100%+4rem)] bg-gradient-to-b from-emerald-500/50 to-teal-500/20 z-0" />
      )}

      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#0a0a0a] z-10"
      />

      {/* Content */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 z-10 relative">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: isRight ? 0 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`${isRight ? "lg:opacity-0 lg:invisible" : ""}`}
        >
          {!isRight && (
            <div className="bg-[#161616]/[0.85] border border-white/10 rounded-2xl p-6 hover:bg-[#161616]/[0.75] transition-all">
              <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {experience.company} | {experience.period}
              </p>
              <p className="text-gray-300 leading-relaxed">{experience.description}</p>
            </div>
          )}
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: isRight ? 50 : 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`${!isRight ? "lg:opacity-0 lg:invisible" : ""}`}
        >
          {isRight && (
            <div className="bg-[#161616]/[0.85] border border-white/10 rounded-2xl p-6 hover:bg-[#161616]/[0.75] transition-all">
              <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {experience.company} | {experience.period}
              </p>
              <p className="text-gray-300 leading-relaxed">{experience.description}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/experiences")
        if (response.ok) {
          const data = await response.json()
          setExperiences(data)
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  return (
    <section id="experience" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
            My professional journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work Experience
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl max-w-md mx-auto">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto space-y-16">
            {experiences.map((experience, index) => (
              <TimelineItem
                key={experience.id}
                experience={experience}
                index={index}
                total={experiences.length}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
