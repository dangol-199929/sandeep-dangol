"use client"

import { motion } from "framer-motion"

export default function DotGrid() {
  const rows =15
  const cols = 37

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2  h-full flex items-center justify-center overflow-hidden blur-[9px]">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          const random = Number(Math.random() > 0.03)
          const delay = (row + col) * random
          const isPink = Math.random() > 0.5

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.2], scale: 1 }}
              transition={{
                opacity: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: delay,
                },
                scale: {
                  duration: random,
                  delay: delay,
                },
              }}
              className={`w-6 h-6 rounded-full ${
                isPink ? "bg-emerald-600" : "bg-teal-600"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}