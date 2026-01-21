"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Briefcase } from "lucide-react"
import Image from "next/image"
import { ME } from "@/imageconfig"

export function AboutSection() {
  const [resumePath, setResumePath] = useState("/resume/Resume.pdf")

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
        console.error("Failed to fetch resume path:", error)
      }
    }

    fetchResumePath()
  }, [])
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
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="aspect-[5/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray/10">
                <div className="w-full h-full flex items-center justify-center relative">
                <Image src={ME} fill alt='' className="object-cover" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Available for work</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
              <div className="space-y-6 text-gray-300 leading-relaxed mb-8">
                <p>
                  {"Graduate Software Engineer with 4+ years of experience in frontend development using React, Next.js, JavaScript, and TypeScript. Experienced in building scalable, user-focused web applications."}
                </p>
                <p>
                  {"I've collaborated with product managers, designers, and engineers in agile environments, optimizing performance through experimentation and delivering high-quality features in fast-moving, global teams."}
                </p>
                <p>
                  {"I leverage AI-assisted tools including GitHub Copilot-style workflows (Cursor IDE, v0) to improve development productivity while maintaining code quality. I'm motivated by continuous learning, customer feedback, and building intuitive digital experiences."}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-white font-medium">Sandeep Dangol</p>
                </div>
                <div className="truncate">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a className="text-white font-medium" aria-label="Email" title="sandeepdangol1999sep29@gmail.com" href="mailto:sandeepdangol1999sep29@gmail.com">sandeepdangol1999sep29@gmail.com</a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    BSc Computing (UCSI University)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Availability</p>
                  <p className="text-green-400 font-medium flex items-center gap-2">
                    <Briefcase size={16} />
                    Open to opportunities
                  </p>
                </div>
              </div>

              {/* <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                <a href={resumePath} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
