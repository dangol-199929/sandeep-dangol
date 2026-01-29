import type { ContactItem } from "./types";
import { Mail, Linkedin, Download } from "lucide-react";

/**
 * Default resume path; can be overridden when resume API is available.
 */
const DEFAULT_RESUME_HREF = "/resume/Resume.pdf";
const DEFAULT_RESUME_DOWNLOAD = "Sandeep_Dangol_Resume.pdf";

/**
 * Returns contact information for the portfolio.
 * Currently static; can be extended to fetch from /api/settings or similar.
 */
export function getContactInfo(options?: {
  resumePath?: string;
}): ContactItem[] {
  const resumePath = options?.resumePath ?? DEFAULT_RESUME_HREF;
  return [
    {
      icon: Mail,
      label: "Email",
      value: "sandeepdangol1999sep29@gmail.com",
      href: "mailto:sandeepdangol1999sep29@gmail.com",
      target: "_blank",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/sandeep-dangol",
      href: "https://linkedin.com/in/sandeep-dangol",
      target: "_blank",
    },
    {
      icon: Download,
      label: "Resume",
      value: "Download Resume",
      href: resumePath,
      download: DEFAULT_RESUME_DOWNLOAD,
      target: "_self",
    },
  ];
}
