"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Linkedin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm, ValidationError } from "@formspree/react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "sandeepdangol1999sep29@gmail.com",
    href: "mailto:sandeepdangol1999sep29@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/sandeep-dangol",
    href: "https://linkedin.com/in/sandeep-dangol",
  },
]

export function ContactSection() {
  const [state, handleSubmit] = useForm("mreeazrr")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (state.succeeded) {
    return (
      <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
              {"Let's work together"}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">Contact Information</h3>

                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row sm:items-center gap-3 group"
                    >
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <item.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-white font-medium group-hover:text-emerald-400 transition-colors break-words">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Current Status</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      Available for freelance work and full-time opportunities
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-400">
                    {"Thank you for reaching out. I'll get back to you soon."}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 md:py-32 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-6">
            {"Let's work together"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">Contact Information</h3>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center gap-3 group"
                  >
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-white font-medium group-hover:text-emerald-400 transition-colors break-words">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Current Status</h4>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-300">
                    Available for freelance work and full-time opportunities
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Send Me a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-fuchsia-500 resize-none"
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full  text-white py-6"
                >
                  {state.submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
                <ValidationError errors={state.errors} className="text-red-400 text-sm" />
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
