import * as React from "react"

import { cn } from "@/lib/utils"

function CalcCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E3DFD7] bg-white shadow-[0_1px_2px_rgba(15,36,56,0.05),0_1px_1px_rgba(15,36,56,0.04)]",
        className,
      )}
      {...props}
    />
  )
}

export { CalcCard }
