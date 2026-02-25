import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ABOUT_FILE = path.join(process.cwd(), "data", "about.json");

function ensureBioArray(bio: unknown): string[] {
  if (Array.isArray(bio)) return bio.filter((x) => typeof x === "string");
  if (typeof bio === "string") return [bio];
  return [];
}

function normalizeAbout(body: Record<string, unknown>) {
  return {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    education: String(body.education ?? ""),
    availability: String(body.availability ?? ""),
    bio: ensureBioArray(body.bio),
    image: String(body.image ?? ""),
  };
}

export async function GET() {
  try {
    const data = await fs.readFile(ABOUT_FILE, "utf-8");
    const about = JSON.parse(data);
    return NextResponse.json(normalizeAbout(about));
  } catch {
    return NextResponse.json(
      normalizeAbout({
        name: "",
        email: "",
        education: "",
        availability: "",
        bio: [],
        image: "",
      }),
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    let existing: Record<string, unknown> = {};
    try {
      const data = await fs.readFile(ABOUT_FILE, "utf-8");
      existing = JSON.parse(data) as Record<string, unknown>;
    } catch {
      // no existing file
    }
    const merged = { ...existing, ...body };
    const about = normalizeAbout(merged);
    await fs.writeFile(ABOUT_FILE, JSON.stringify(about, null, 2));
    return NextResponse.json(about);
  } catch (err) {
    console.error("About PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update about" },
      { status: 500 },
    );
  }
}
