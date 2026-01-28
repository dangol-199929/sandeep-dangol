import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Sandeep Dangol - Frontend Web Developer',
  description: 'Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript. Building scalable, user-focused web applications.',
  generator: 'v0.app',
  openGraph: {
    title: 'Sandeep Dangol - Frontend Web Developer',
    description: 'Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sandeep Dangol - Frontend Web Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sandeep Dangol - Frontend Web Developer',
    description: 'Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased bg-[#0a0a0a] text-white dark scroll-smooth`}
    >
      <body className={`${inter.variable} antialiased bg-[#0a0a0a] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
