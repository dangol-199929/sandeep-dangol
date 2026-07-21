"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function CalcSelect(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />
}

function CalcSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-lg border-[1.5px] border-[#D2CCC0] bg-white px-3.5 py-2 text-left text-[15px] font-medium text-[#262B32] outline-none transition-[border-color,box-shadow] hover:border-[#8A939E] focus-visible:border-[#DD6B20] focus-visible:ring-4 focus-visible:ring-[#DD6B20]/25 data-[placeholder]:text-[#8A939E]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 text-[#5C6672]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function CalcSelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-[#E3DFD7] bg-white p-1 text-[#262B32] shadow-[0_16px_40px_-14px_rgba(15,36,56,0.24)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function CalcSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-lg py-2.5 pr-8 pl-3 text-sm outline-none data-[highlighted]:bg-[#FCEBDC] data-[highlighted]:text-[#B8540E]",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

const CalcSelectValue = SelectPrimitive.Value

export {
  CalcSelect,
  CalcSelectContent,
  CalcSelectItem,
  CalcSelectTrigger,
  CalcSelectValue,
}
