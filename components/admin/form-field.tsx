"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "url" | "textarea"
  placeholder?: string
  required?: boolean
  rows?: number
}

export function FormField({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  rows = 4,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 resize-none"
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
        />
      )}
    </div>
  )
}
