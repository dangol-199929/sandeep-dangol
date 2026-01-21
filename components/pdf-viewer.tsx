"use client"

import React from "react"
import { Download, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import dynamic from "next/dynamic"

// Dynamic import for PDF components to avoid loading on homepage
const PDFViewerContent = dynamic(() => import("./pdf-viewer-content.tsx"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <Loader2Icon className="animate-spin text-emerald-500 rounded-full h-9 w-9  mb-4"></Loader2Icon>
      <p>Loading PDF viewer...</p>
    </div>
  ),
})

interface PDFViewerProps {
  pdfUrl: string
  isOpen: boolean
  onClose: () => void
}

/**
 * PDFViewer Component
 * Displays a PDF in a modal using PDFObject for native browser PDF viewing
 * Uses Shadcn Dialog for smooth animations and accessibility
 */
export function PDFViewer({ pdfUrl, isOpen, onClose }: PDFViewerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[65vw] !sm:max-w-auto !max-h-[90vh] p-0 bg-[#111] border-white/10 overflow-hidden gap-0">
        {/* Header with title and download button */}
        <DialogHeader className="px-6 py-2 border-b border-white/10 bg-[#0a0a0a] flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-xl">Resume</DialogTitle>

          {/* Download Button */}
          <Button
            asChild
            className=" text-white rounded-full px-4 me-4"
          >
            <a href={pdfUrl} download="Sandeep_Dangol_Resume.pdf">
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </DialogHeader>

        {/* PDF Viewer Content with dynamic import */}
        <div className="flex-1 overflow-hidden">
          <PDFViewerContent pdfUrl={pdfUrl} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}