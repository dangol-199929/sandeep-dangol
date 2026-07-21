"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function CalcRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} />
}

function CalcRadioCard({
  className,
  title,
  description,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  title: string
  description?: string
}) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "group flex min-h-14 w-full flex-col items-start justify-center rounded-lg border-[1.5px] border-[#D2CCC0] bg-white px-4 py-3 text-left text-[#262B32] outline-none transition-all hover:border-[#8A939E] focus-visible:border-[#DD6B20] focus-visible:ring-4 focus-visible:ring-[#DD6B20]/25 data-[state=checked]:border-[#DD6B20] data-[state=checked]:bg-[#FCEBDC] data-[state=checked]:text-[#B8540E]",
        className,
      )}
      {...props}
    >
      <span className="text-sm font-semibold">{title}</span>
      {description ? (
        <span className="mt-0.5 text-[11.5px] font-medium text-[#8A939E] group-data-[state=checked]:text-[#B8540E]/80">
          {description}
        </span>
      ) : null}
    </RadioGroupPrimitive.Item>
  )
}

export { CalcRadioCard, CalcRadioGroup }
