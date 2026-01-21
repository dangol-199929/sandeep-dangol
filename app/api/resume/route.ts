import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const RESUME_DIR = path.join(process.cwd(), "public", "resume")
const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json")

async function ensureResumeDir() {
  try {
    await fs.access(RESUME_DIR)
  } catch {
    await fs.mkdir(RESUME_DIR, { recursive: true })
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8")
    const settings = JSON.parse(data)
    return NextResponse.json({ resumePath: settings.resumePath })
  } catch {
    return NextResponse.json({ resumePath: "/resume/Resume.pdf" })
  }
}

export async function POST(request: Request) {
  try {
    await ensureResumeDir()
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = `resume-${Date.now()}.pdf`
    const filePath = path.join(RESUME_DIR, filename)
    
    await fs.writeFile(filePath, buffer)
    
    // Update settings with new resume path
    const resumePath = `/resume/${filename}`
    await fs.writeFile(
      SETTINGS_FILE,
      JSON.stringify({ resumePath }, null, 2)
    )
    
    return NextResponse.json({ resumePath, success: true })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 })
  }
}
