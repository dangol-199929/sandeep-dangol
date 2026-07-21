import * as React from "react"

import { cn } from "@/lib/utils"

function CalcInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full min-w-0 rounded-lg border-[1.5px] border-[#D2CCC0] bg-white px-3.5 py-2 text-[15px] font-medium text-[#262B32] outline-none transition-[border-color,box-shadow] placeholder:text-[#8A939E] hover:border-[#8A939E] focus-visible:border-[#DD6B20] focus-visible:ring-4 focus-visible:ring-[#DD6B20]/25 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { CalcInput }
