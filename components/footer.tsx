"use client"

import { Linkedin, Mail, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-xl font-bold">
            <span className="text-emerald-400">Sandeep</span>
            <span className="text-white">D</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/sandeep-dangol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:sandeepdangol1999sep29@gmail.com"
              className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Sandeep Dangol. All rights reserved.
            </p>
            <Button
              onClick={scrollToTop}
              size="icon"
              className="bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
