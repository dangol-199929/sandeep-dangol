"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PDFViewer } from "@/components/pdf-viewer"

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [resumePath, setResumePath] = useState("/resume/Resume.pdf")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = navLinks.map((link) => link.href.replace("#", ""))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch resume path from settings
  useEffect(() => {
    const fetchResumePath = async () => {
      try {
        const response = await fetch("/api/resume")
        if (response.ok) {
          const data = await response.json()
          if (data.resumePath) {
            setResumePath(data.resumePath)
          }
        }
      } catch (error) {
        // Use default path if fetch fails
      }
    }
    fetchResumePath()
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isScrolled ? "top-2" : "top-4"
      )}
    >
      <nav
        className={cn(
          "flex items-center gap-1 px-2 py-2 rounded-full border border-white/10 backdrop-blur-xl transition-all duration-300",
          isScrolled ? "bg-black/30 shadow-lg shadow-black/20" : "bg-black/60"
        )}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="px-4 py-2 font-bold text-lg"
        >
          <span className="text-emerald-400">Sandeep</span>
          <span className="text-white">D</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 pe-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                activeSection === link.href.replace("#", "")
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {link.name}
            </button>
          ))}
          <Button
            className="ml-2  text-white rounded-full px-6"
            onClick={() => setIsResumeModalOpen(true)}
          >
            Resume
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium rounded-xl transition-colors",
                  activeSection === link.href.replace("#", "")
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
              </button>
            ))}
            <Button
              className="mt-2 rounded-full"
              onClick={() => {
                setIsMobileMenuOpen(false)
                setIsResumeModalOpen(true)
              }}
            >
              Resume
            </Button>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewer
        pdfUrl={resumePath}
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </header>
  )
}
