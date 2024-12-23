"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AnimatedNumberInput({ initialValue = 0, min = 0, max = 100, step = 1, onChange }: {
  initialValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}) {
  const [value, setValue] = useState(initialValue)

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    setValue(newValue)
    onChange?.(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue)) {
      setValue(Math.max(Math.min(newValue, max), min))
      onChange?.(value)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-4 w-full">
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease value"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="relative w-20 h-14">
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 no-spinners"
          min={min}
          max={max}
          step={step}
        />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-background rounded-full">
          <AnimatePresence initial={false}>
            <motion.span
              key={value}
              className="absolute text-2xl font-bold text-primary-foreground dark:text-white"
              initial={{ y: value > initialValue ? 20 : -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: value > initialValue ? -20 : 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <Button
        className="rounded-full"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase value"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}