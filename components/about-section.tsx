"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Briefcase } from "lucide-react"
import Image from "next/image"
import { ME } from "@/imageconfig"
import { getAbout, getApiBaseUrl, resolveApiAssetUrl } from "@/services"
import type { About } from "@/services"

const DEFAULT_ABOUT: About = {
  name: "",
  email: "",
  education: "",
  availability: "",
  bio: [],
  image: "",
}

export function AboutSection() {
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [])

  const data = about ?? DEFAULT_ABOUT
  const imageSrc = data.image
    ? resolveApiAssetUrl(data.image, getApiBaseUrl())
    : null

  if (loading) {
    return (
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-400">Loading about...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
            My background and journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="aspect-[4/6] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray/10">
                <div className="w-[full] h-full flex items-center justify-center relative">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Image src={ME} fill alt="" className="object-cover object-top" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">
                    {data.availability || "Available for work"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
              <div className="space-y-6 text-gray-300 leading-relaxed mb-8">
                {data.bio.length > 0 ? (
                  data.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript.
                    </p>
                    <p>
                      I collaborate with product managers, designers, and engineers in agile environments, delivering high-quality features in fast-moving teams.
                    </p>
                  </>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-white font-medium">{data.name || "—"}</p>
                </div>
                <div className="truncate">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a
                    className="text-white font-medium"
                    aria-label="Email"
                    title={data.email}
                    href={data.email ? `mailto:${data.email}` : "#"}
                  >
                    {data.email || "—"}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    {data.education || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Availability</p>
                  <p className="text-green-400 font-medium flex items-center gap-2">
                    <Briefcase size={16} />
                    {data.availability || "Open to opportunities"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
