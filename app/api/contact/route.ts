import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONTACT_FILE = path.join(process.cwd(), "data", "contact.json");

function normalizeItem(item: unknown): {
  label: string;
  value: string;
  href: string;
  target?: string;
  download?: string;
} {
  const o =
    typeof item === "object" && item !== null
      ? (item as Record<string, unknown>)
      : {};
  return {
    label: String(o.label ?? ""),
    value: String(o.value ?? ""),
    href: String(o.href ?? ""),
    ...(typeof o.target === "string" && { target: o.target }),
    ...(typeof o.download === "string" && { download: o.download }),
  };
}

export async function GET() {
  try {
    const data = await fs.readFile(CONTACT_FILE, "utf-8");
    const arr = JSON.parse(data);
    const items = Array.isArray(arr) ? arr.map(normalizeItem) : [];
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be an array of contact items" },
        { status: 400 },
      );
    }
    const items = body.map(normalizeItem);
    await fs.writeFile(CONTACT_FILE, JSON.stringify(items, null, 2));
    return NextResponse.json(items);
  } catch (err) {
    console.error("Contact PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 },
    );
  }
}
