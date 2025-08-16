"use client"

import { ChevronRight } from "lucide-react"

interface TrickItemProps {
  trick: {
    detail: string
    variant: TrickItemProps['trick'][]
  }
  level?: number
}

export function TrickItem({ trick, level = 0 }: TrickItemProps) {
  const hasVariants = trick.variant && trick.variant.length > 0
  console.log(trick)

  return (
    <div className="w-full">
      <div 
        className={`p-3 rounded-lg mb-2 ${
          "bg-gray-700"
        }`}
        style={{ marginLeft: `${level * 1}rem` }}
      >
        <div className="flex items-start gap-2">
          <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
          <span className="text-sm leading-relaxed">{trick.detail}</span>
        </div>
      </div>

      {hasVariants && (
        <div className="pl-4 border-l-2 border-gray-600">
          {trick.variant.map((variant, index) => (
            <TrickItem 
              key={index} 
              trick={variant} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
