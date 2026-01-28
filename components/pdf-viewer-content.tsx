"use client"

import React, { useEffect, useRef } from "react"

// Import PDFObject - it will be available globally after dynamic import
// We import it here to ensure it's loaded in the bundle

interface PDFViewerContentProps {
  pdfUrl: string
  onClose: () => void
}

/**
 * PDFViewerContent Component
 * Embeds PDF using PDFObject for native browser PDF viewing
 * Loaded dynamically to avoid homepage bundle bloat
 */
export default function PDFViewerContent({ pdfUrl, onClose }: PDFViewerContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfEmbeddedRef = useRef<boolean>(false)

  /**
   * Handle keyboard navigation
   * ESC to close modal
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  /**
   * Embed PDF using PDFObject when component mounts
   */
  useEffect(() => {
    if (!containerRef.current || pdfEmbeddedRef.current) return

    const embedPDF = async () => {
      try {
        // Import PDFObject dynamically to ensure it's loaded
        const PDFObject = (await import('pdfobject')).default

        // PDFObject options for better integration
        const options = {
          height: "100%",
          width: "100%",
          omitInlineStyles: true, // We'll handle styling with CSS
          fallbackLink: `<p>This browser does not support inline PDFs. <a href="${pdfUrl}" target="_blank">Click here to view the PDF</a></p>`,
          suppressConsole: true, // Reduce console noise in production
          pdfOpenParams: {
            toolbar: 0, // Hide toolbar
            navpanes: 0, // Hide navigation panes
            pagemode: 'none', // No side panels
          },
        }

        // Embed the PDF
        const embedded = PDFObject.embed(pdfUrl, containerRef.current!, options)

        if (embedded) {
          pdfEmbeddedRef.current = true
        }
      } catch (error) {
        console.error("Failed to embed PDF:", error)
      }
    }

    embedPDF()

    // Cleanup function
    return () => {
      if (containerRef.current) {
        // Clear the container when unmounting
        containerRef.current.innerHTML = ""
        pdfEmbeddedRef.current = false
      }
    }
  }, [pdfUrl])

  /**
   * Set up keyboard event listeners and prevent body scroll
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div className="flex flex-col h-full">
      {/* PDF Display Area */}
      <div className="flex-1 overflow-hidden bg-[#1a1a1a]">
        {/* PDFObject will embed the PDF here */}
        <div
          ref={containerRef}
          className="pdfobject-container w-full h-full"
          style={{ minHeight: "78vh" }}
        />

      </div>

      {/* Footer with keyboard hints */}
      <div className="px-6 py-3 border-t border-white/10 bg-[#0a0a0a]">
        <p className="text-xs text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">ESC</kbd> to close
        </p>
      </div>
    </div>
  )
}