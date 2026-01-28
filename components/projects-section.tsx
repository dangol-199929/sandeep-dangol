"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PRO } from "@/imageconfig"
import Image from "next/image"
interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  metrics: string[]
}

function ProjectCard({
  project,
  onClick,
  index,
}: {
  project: Project
  onClick: () => void
  index: number
}) {
  const imageMap = {
    'revv': PRO.revv,
    'ban': PRO.ban,
    'bs': PRO.bs,
    'koklass': PRO.koklass,
    'assistant': PRO.assistant
  }

  const imageSrc = imageMap[project.image as keyof typeof imageMap]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            fill
            alt={project.title}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FolderKanban className="w-12 h-12 mx-auto text-gray-600" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = project.image ? [project.image] : []

  const imageMap = {
    'revv': PRO.revv,
    'ban': PRO.ban,
    'bs': PRO.bs,
    'koklass': PRO.koklass,
    'assistant': PRO.assistant
  }

  const imageSrc = imageMap[project.image as keyof typeof imageMap]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#151515] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
          {imageSrc ? (
            <Image
              src={imageSrc}
              fill
              className="object-cover"
              alt={project.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderKanban className="w-16 h-16 text-gray-600" />
            </div>
          )}

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">{project.title}</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">{project.fullDescription}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full h-auto text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metrics */}
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {project.metrics.map((metric) => (
                <div key={metric} className="text-center flex justify-center items-center p-4 bg-white/5 rounded-xl h-auto">
                  <p className="text-emerald-400 font-semibold">{metric}</p>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4">
            {project.liveUrl && project.liveUrl !== "#" && (
              <Button
                asChild
                className="flex-1  text-white"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <Button
                variant="outline"
                asChild
                className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
            Some of my recent work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No projects yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
