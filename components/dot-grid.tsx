"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function DotGrid() {
  const rows = 15
  const cols = 37
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const calculateDistance = (dotX: number, dotY: number) => {
    const deltaX = mousePosition.x - dotX
    const deltaY = mousePosition.y - dotY
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  const getDotTransform = (row: number, col: number, dotSize: number) => {
    const dotX = col * (dotSize + 16) // 16 is gap
    const dotY = row * (dotSize + 16)
    const distance = calculateDistance(dotX, dotY)
    const maxDistance = 200 // Maximum distance for effect

    if (distance > maxDistance) return { x: 0, y: 0, scale: 1, opacity: 0.3 }

    const intensity = 1 - (distance / maxDistance)
    const moveX = (mousePosition.x - dotX) * intensity * 0.3
    const moveY = (mousePosition.y - dotY) * intensity * 0.3
    const scale = 1 + intensity * 0.5
    const opacity = 0.3 + intensity * 0.7

    return { x: moveX, y: moveY, scale, opacity }
  }

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-center overflow-hidden blur-[6px] cursor-pointer"
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          const random = Number(Math.random() > 0.03)
          const delay = (row + col) * random
          const isPink = Math.random() > 0.5
          const transform = getDotTransform(row, col, 24) // 24px dot size

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.3, 0.8, 0.2],
                scale: 1,
                x: transform.x,
                y: transform.y,
              }}
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
                x: { type: "spring", stiffness: 300, damping: 30 },
                y: { type: "spring", stiffness: 300, damping: 30 },
              }}
              className={`w-6 h-6 rounded-full ${isPink ? "bg-emerald-600" : "bg-teal-600"
                }`}
              style={{
                opacity: transform.opacity,
                scale: transform.scale,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}