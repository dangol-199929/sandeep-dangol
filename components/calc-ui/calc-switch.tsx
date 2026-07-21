"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function CalcSwitch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-4 w-8 shrink-0 items-center rounded-full bg-[#C9CFD6] outline-none transition-colors focus-visible:ring-4 focus-visible:ring-[#DD6B20]/25 data-[state=checked]:bg-[#DD6B20] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-5 translate-x-[0px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform data-[state=checked]:translate-x-[15px] data-[state=checked]:shadow-white/30 border-2 border-[#DD6B20]"
      />
    </SwitchPrimitive.Root>
  )
}

export { CalcSwitch }
