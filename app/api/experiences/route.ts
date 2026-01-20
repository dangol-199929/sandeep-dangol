import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "experiences.json")

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  side: "left" | "right"
}

async function readExperiences(): Promise<Experience[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeExperiences(experiences: Experience[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(experiences, null, 2))
}

export async function GET() {
  const experiences = await readExperiences()
  return NextResponse.json(experiences)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const experiences = await readExperiences()
    
    // Alternate sides for new items
    const lastSide = experiences.length > 0 ? experiences[experiences.length - 1].side : "left"
    
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: body.title || "",
      company: body.company || "",
      period: body.period || "",
      description: body.description || "",
      side: body.side || (lastSide === "left" ? "right" : "left"),
    }
    
    experiences.unshift(newExperience) // Add to beginning
    await writeExperiences(experiences)
    
    return NextResponse.json(newExperience, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const experiences = await readExperiences()
    
    const index = experiences.findIndex((e) => e.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    
    experiences[index] = { ...experiences[index], ...body }
    await writeExperiences(experiences)
    
    return NextResponse.json(experiences[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    
    const experiences = await readExperiences()
    const filtered = experiences.filter((e) => e.id !== id)
    
    if (filtered.length === experiences.length) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }
    
    await writeExperiences(filtered)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
