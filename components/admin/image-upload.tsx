"use client"

import React, { useState, useRef, useMemo } from "react"
import { X, ImageIcon } from "lucide-react"
import { uploadImage, isAllowedImageType, resolveUploadUrl } from "@/services"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Project Screenshot" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = useMemo(() => {
    if (!value) return ""
    return resolveUploadUrl(value)
  }, [value])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    if (!isAllowedImageType(file)) {
      setUploadError("Only JPEG, PNG, WebP, and GIF are allowed.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewBlob(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    try {
      const { path } = await uploadImage(file)
      onChange(path)
      setPreviewBlob(null)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
      setPreviewBlob(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const [previewBlob, setPreviewBlob] = useState<string | null>(null)
  const previewSrc = previewBlob || displayUrl

  const handleRemove = () => {
    onChange("")
    setPreviewBlob(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>

      {previewSrc ? (
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-gray-400 text-sm">Click to upload image</span>
              <span className="text-gray-500 text-xs">PNG, JPG, WebP, GIF</span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-2 text-sm text-red-400">{uploadError}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image"
      />
    </div>
  )
}
