"use client"

import React from "react"

import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/admin/toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}
