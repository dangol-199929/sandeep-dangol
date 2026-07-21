"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const calcButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-[#DD6B20]/25 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0F2438] text-white shadow-[0_10px_30px_-12px_rgba(15,36,56,0.35)] hover:bg-[#16344E]",
        accent:
          "bg-[#DD6B20] text-white shadow-[0_10px_30px_-12px_rgba(221,107,32,0.5)] hover:bg-[#B8540E]",
        ghost:
          "bg-transparent text-[#5C6672] hover:bg-[#FCEBDC] hover:text-[#0F2438]",
      },
      size: {
        default: "h-12 px-5",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-14 px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

function CalcButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof calcButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(calcButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { CalcButton, calcButtonVariants }
