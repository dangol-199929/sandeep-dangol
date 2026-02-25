"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LogOut,
  FolderKanban,
  Briefcase,
  FileText,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  Home,
  X,
  Save,
  User,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/admin/toast"
import { FormField } from "@/components/admin/form-field"
import { ImageUpload } from "@/components/admin/image-upload"
import { TagsInput } from "@/components/admin/tags-input"
import Link from "next/link"
import {
  getResumePath,
  uploadResume,
  getProjects,
  getExperiences,
  createProject,
  updateProject,
  deleteProject,
  createExperience,
  updateExperience,
  deleteExperience,
  getAbout,
  updateAbout,
  getContactItems,
  updateContact,
  getApiBaseUrl,
  resolveApiAssetUrl,
} from "@/services"
import type { Project, Experience, About, ContactItemApi } from "@/services"

type Tab = "projects" | "experience" | "resume" | "about" | "contact"

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<Tab>("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [resumePath, setResumePath] = useState("")
  const [about, setAbout] = useState<About | null>(null)
  const [contactItems, setContactItems] = useState<ContactItemApi[]>([])

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [projectsData, experiencesData, resumeData, aboutData, contactData] = await Promise.all([
        getProjects().catch(() => []),
        getExperiences().catch(() => []),
        getResumePath().catch(() => ""),
        getAbout().catch(() => null),
        getContactItems().catch(() => []),
      ])
      setProjects(projectsData)
      setExperiences(experiencesData)
      setResumePath(resumeData)
      setAbout(aboutData)
      setContactItems(contactData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { id: "projects" as Tab, label: "Projects", icon: FolderKanban, count: projects.length },
    { id: "experience" as Tab, label: "Experience", icon: Briefcase, count: experiences.length },
    { id: "resume" as Tab, label: "Resume", icon: FileText },
    { id: "about" as Tab, label: "About", icon: User },
    { id: "contact" as Tab, label: "Contact", icon: Mail, count: contactItems.length },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-white/10"
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "projects" && (
              <ProjectsTab
                projects={projects}
                onRefresh={fetchData}
                onEdit={(project) => {
                  setEditingProject(project)
                  setIsProjectModalOpen(true)
                }}
                onAdd={() => {
                  setEditingProject(null)
                  setIsProjectModalOpen(true)
                }}
                showToast={showToast}
              />
            )}

            {activeTab === "experience" && (
              <ExperienceTab
                experiences={experiences}
                onRefresh={fetchData}
                onEdit={(exp) => {
                  setEditingExperience(exp)
                  setIsExperienceModalOpen(true)
                }}
                onAdd={() => {
                  setEditingExperience(null)
                  setIsExperienceModalOpen(true)
                }}
                showToast={showToast}
              />
            )}

            {activeTab === "resume" && (
              <ResumeTab
                resumePath={resumePath}
                onRefresh={fetchData}
                showToast={showToast}
              />
            )}

            {activeTab === "about" && (
              <AboutTab
                about={about}
                onRefresh={fetchData}
                showToast={showToast}
              />
            )}

            {activeTab === "contact" && (
              <ContactTab
                items={contactItems}
                onRefresh={fetchData}
                showToast={showToast}
              />
            )}
          </>
        )}
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={fetchData}
          showToast={showToast}
        />
      )}

      {/* Experience Modal */}
      {isExperienceModalOpen && (
        <ExperienceModal
          experience={editingExperience}
          onClose={() => setIsExperienceModalOpen(false)}
          onSave={fetchData}
          showToast={showToast}
        />
      )}
    </div>
  )
}

// Projects Tab Component
function ProjectsTab({
  projects,
  onRefresh,
  onEdit,
  onAdd,
  showToast,
}: {
  projects: Project[]
  onRefresh: () => void
  onEdit: (project: Project) => void
  onAdd: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await deleteProject(id)
      showToast("Project deleted successfully", "success")
      onRefresh()
    } catch {
      showToast("Failed to delete project", "error")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <Button onClick={onAdd} className=" text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-20 h-14 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                {project.image ? (
                  <img
                    src={resolveApiAssetUrl(project.image, getApiBaseUrl()) || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{project.title}</h3>
                <p className="text-sm text-gray-400 truncate">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Experience Tab Component
function ExperienceTab({
  experiences,
  onRefresh,
  onEdit,
  onAdd,
  showToast,
}: {
  experiences: Experience[]
  onRefresh: () => void
  onEdit: (experience: Experience) => void
  onAdd: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return

    try {
      await deleteExperience(id)
      showToast("Experience deleted successfully", "success")
      onRefresh()
    } catch {
      showToast("Failed to delete experience", "error")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <Button onClick={onAdd} className=" text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No experience entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{exp.title}</h3>
                <p className="text-sm text-gray-400">
                  {exp.company} | {exp.period}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(exp)}
                  className="border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(exp.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Resume Tab Component
function ResumeTab({
  resumePath,
  onRefresh,
  showToast,
}: {
  resumePath: string
  onRefresh: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file", "error")
      return
    }

    setIsUploading(true)
    try {
      await uploadResume(file)
      showToast("Resume uploaded successfully", "success")
      onRefresh()
    } catch {
      showToast("Failed to upload resume", "error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Resume</h2>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-20 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-8 h-8 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Current Resume</h3>
            <p className="text-sm text-gray-400 mb-4">
              {resumePath || "No resume uploaded yet"}
            </p>
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isUploading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : " text-white cursor-pointer"
                  }`}>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Upload New Resume
                    </>
                  )}
                </span>
              </label>
              {resumePath && (
                <a
                  href={resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
                >
                  View Current
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// About Tab Component
function AboutTab({
  about,
  onRefresh,
  showToast,
}: {
  about: About | null
  onRefresh: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const [formData, setFormData] = useState<About>({
    name: about?.name ?? "",
    email: about?.email ?? "",
    education: about?.education ?? "",
    availability: about?.availability ?? "",
    bio: Array.isArray(about?.bio) ? [...about.bio] : [],
    image: about?.image ?? "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [bioText, setBioText] = useState(about?.bio?.join("\n") ?? "")

  useEffect(() => {
    if (about) {
      setFormData({
        name: about.name,
        email: about.email,
        education: about.education,
        availability: about.availability,
        bio: Array.isArray(about.bio) ? [...about.bio] : [],
        image: about.image,
      })
      setBioText(Array.isArray(about.bio) ? about.bio.join("\n") : "")
    }
  }, [about])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const bio = bioText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    const payload: About = { ...formData, bio }
    setIsSaving(true)
    try {
      await updateAbout(payload)
      showToast("About updated successfully", "success")
      onRefresh()
    } catch {
      showToast("Failed to update about", "error")
    } finally {
      setIsSaving(false)
    }
  }

  if (about === null && !formData.name && !formData.email) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">About</h2>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
          <p className="text-red-400 mb-4">Failed to load about content.</p>
          <Button onClick={onRefresh} variant="outline" className="border-white/10 text-gray-300">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">About</h2>
      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <FormField
          label="Name"
          id="about-name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          placeholder="Your name"
        />
        <FormField
          label="Email"
          id="about-email"
          type="email"
          value={formData.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
          placeholder="your@email.com"
        />
        <FormField
          label="Education"
          id="about-education"
          value={formData.education}
          onChange={(v) => setFormData({ ...formData, education: v })}
          placeholder="e.g. BSc Computing (UCSI University)"
        />
        <FormField
          label="Availability"
          id="about-availability"
          value={formData.availability}
          onChange={(v) => setFormData({ ...formData, availability: v })}
          placeholder="e.g. Open to opportunities"
        />
        <div>
          <label htmlFor="about-bio" className="block text-sm font-medium text-gray-300 mb-2">
            Bio (one paragraph per line)
          </label>
          <textarea
            id="about-bio"
            rows={6}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
            placeholder="Paragraph 1&#10;Paragraph 2&#10;..."
          />
        </div>
        <ImageUpload
          label="Profile image"
          value={formData.image}
          onChange={(path) => setFormData({ ...formData, image: path })}
        />
        <Button type="submit" disabled={isSaving} className=" text-white">
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save About
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

// Contact Tab Component
function ContactTab({
  items,
  onRefresh,
  showToast,
}: {
  items: ContactItemApi[]
  onRefresh: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const [localItems, setLocalItems] = useState<ContactItemApi[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalItems(items.length ? items.map((i) => ({ ...i })) : [])
  }, [items])

  const addItem = () => {
    setLocalItems((prev) => [...prev, { label: "", value: "", href: "", target: "_blank" }])
  }

  const removeItem = (index: number) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof ContactItemApi, value: string) => {
    setLocalItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSave = async () => {
    const valid = localItems.every((i) => i.label?.trim() && i.value?.trim() && i.href?.trim())
    if (!valid) {
      showToast("Each item needs label, value, and href", "error")
      return
    }
    setIsSaving(true)
    try {
      await updateContact(localItems)
      showToast("Contact info updated successfully", "success")
      onRefresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update contact", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        {localItems.map((item, index) => (
          <div key={index} className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <input
              type="text"
              placeholder="Label (e.g. Email)"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
              className="flex-1 min-w-[80px] px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="Value / display text"
              value={item.value}
              onChange={(e) => updateItem(index, "value", e.target.value)}
              className="flex-1 min-w-[100px] px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="href (URL or mailto:)"
              value={item.href}
              onChange={(e) => updateItem(index, "href", e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="target (_blank)"
              value={item.target ?? ""}
              onChange={(e) => updateItem(index, "target", e.target.value)}
              className="w-24 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="download (filename)"
              value={item.download ?? ""}
              onChange={(e) => updateItem(index, "download", e.target.value)}
              className="w-32 px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <Button type="button" onClick={addItem} variant="outline" className="border-white/10 text-gray-300">
            <Plus className="w-4 h-4 mr-2" />
            Add item
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving} className=" text-white">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Contact
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Project Modal Component
function ProjectModal({
  project,
  onClose,
  onSave,
  showToast,
}: {
  project: Project | null
  onClose: () => void
  onSave: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: project?.title || "",
    description: project?.description || "",
    fullDescription: project?.fullDescription || "",
    image: project?.image || "",
    tags: project?.tags || [],
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    metrics: project?.metrics || [],
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (project) {
        await updateProject({ ...formData, id: project.id })
      } else {
        await createProject(formData)
      }
      showToast(project ? "Project updated successfully" : "Project created successfully", "success")
      onSave()
      onClose()
    } catch {
      showToast("Failed to save project", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {project ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Title"
            id="title"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="Project title"
            required
          />

          <FormField
            label="Short Description"
            id="description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Brief description for card view"
            required
          />

          <FormField
            label="Full Description"
            id="fullDescription"
            type="textarea"
            value={formData.fullDescription}
            onChange={(value) => setFormData({ ...formData, fullDescription: value })}
            placeholder="Detailed description for modal view"
            rows={4}
          />

          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
          />

          <TagsInput
            label="Technologies"
            value={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="Type and press Enter (e.g., React, Next.js)"
          />

          <TagsInput
            label="Key Metrics"
            value={formData.metrics}
            onChange={(metrics) => setFormData({ ...formData, metrics })}
            placeholder="Type and press Enter (e.g., 50% faster load times)"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Live URL"
              id="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={(value) => setFormData({ ...formData, liveUrl: value })}
              placeholder="https://..."
            />
            <FormField
              label="GitHub URL"
              id="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={(value) => setFormData({ ...formData, githubUrl: value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1  text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {project ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Experience Modal Component
function ExperienceModal({
  experience,
  onClose,
  onSave,
  showToast,
}: {
  experience: Experience | null
  onClose: () => void
  onSave: () => void
  showToast: (message: string, type: "success" | "error") => void
}) {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    period: experience?.period || "",
    description: experience?.description || "",
    side: experience?.side || "right",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (experience) {
        await updateExperience({ ...formData, id: experience.id })
      } else {
        await createExperience(formData)
      }
      showToast(experience ? "Experience updated successfully" : "Experience created successfully", "success")
      onSave()
      onClose()
    } catch {
      showToast("Failed to save experience", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {experience ? "Edit Experience" : "Add New Experience"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Role / Title"
            id="title"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="e.g., Frontend Developer"
            required
          />

          <FormField
            label="Company / Organization"
            id="company"
            value={formData.company}
            onChange={(value) => setFormData({ ...formData, company: value })}
            placeholder="e.g., Tech Company Inc."
            required
          />

          <FormField
            label="Duration"
            id="period"
            value={formData.period}
            onChange={(value) => setFormData({ ...formData, period: value })}
            placeholder="e.g., Jan 2022 - Present"
            required
          />

          <FormField
            label="Description"
            id="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Describe your role and achievements..."
            rows={4}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1  text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {experience ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
