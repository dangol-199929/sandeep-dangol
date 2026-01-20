import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "projects.json")

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

async function readProjects(): Promise<Project[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2))
}

export async function GET() {
  const projects = await readProjects()
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const projects = await readProjects()
    
    const newProject: Project = {
      id: Date.now().toString(),
      title: body.title || "",
      description: body.description || "",
      fullDescription: body.fullDescription || "",
      image: body.image || "",
      tags: body.tags || [],
      liveUrl: body.liveUrl || "#",
      githubUrl: body.githubUrl || "#",
      metrics: body.metrics || [],
    }
    
    projects.push(newProject)
    await writeProjects(projects)
    
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const projects = await readProjects()
    
    const index = projects.findIndex((p) => p.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    projects[index] = { ...projects[index], ...body }
    await writeProjects(projects)
    
    return NextResponse.json(projects[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    
    const projects = await readProjects()
    const filtered = projects.filter((p) => p.id !== id)
    
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    await writeProjects(filtered)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
