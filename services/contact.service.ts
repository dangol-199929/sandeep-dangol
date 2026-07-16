import type { ContactItem, ContactItemApi } from "./types";
import { Mail, Linkedin, Download } from "lucide-react";
import contactFallback from "../data/contact.json";
import { apiUrl, fetchJson, fetchJsonWithFallback } from "./api";

const CONTACT_PATH = "/api/contact";

const LABEL_TO_ICON = {
  Email: Mail,
  LinkedIn: Linkedin,
  Resume: Download,
} as Record<string, typeof Mail>;

/**
 * Maps API contact items to UI shape (adds icon by label). Unknown labels get Mail as fallback.
 */
export function contactItemsWithIcons(items: ContactItemApi[]): ContactItem[] {
  return items.map((item) => ({
    ...item,
    icon: LABEL_TO_ICON[item.label] ?? Mail,
    target: item.target ?? "_blank",
  }));
}

function validateContactItem(item: ContactItemApi): void {
  if (!item.label?.trim()) throw new Error("Contact item requires label");
  if (!item.value?.trim()) throw new Error("Contact item requires value");
  if (!item.href?.trim()) throw new Error("Contact item requires href");
}

/**
 * Fetches contact items from GET /api/contact.
 */
export async function getContactItems(): Promise<ContactItemApi[]> {
  const data = await fetchJsonWithFallback<ContactItemApi[]>(
    apiUrl(CONTACT_PATH),
    contactFallback,
    { fallbackLabel: "contact" },
  );
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    label: String(item?.label ?? ""),
    value: String(item?.value ?? ""),
    href: String(item?.href ?? ""),
    target: typeof item?.target === "string" ? item.target : "_blank",
    download: typeof item?.download === "string" ? item.download : undefined,
  }));
}

/**
 * Replaces all contact items via PUT /api/contact.
 */
export async function updateContact(
  items: ContactItemApi[],
): Promise<ContactItemApi[]> {
  items.forEach(validateContactItem);
  const payload = items.map(({ label, value, href, target, download }) => ({
    label,
    value,
    href,
    ...(target !== undefined && { target }),
    ...(download !== undefined && { download }),
  }));
  const data = await fetchJson<ContactItemApi[]>(apiUrl(CONTACT_PATH), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!Array.isArray(data)) return items;
  return data;
}
