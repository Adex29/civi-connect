"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  sublabel?: string
  disabled?: boolean
}

export interface MultiSelectComboboxProps {
  options: ComboboxOption[]
  selectedValues: string[]
  onSelectChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function MultiSelectCombobox({
  options,
  selectedValues,
  onSelectChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  className,
  disabled = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options
    const query = search.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    )
  }, [options, search])

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectChange(selectedValues.filter((v) => v !== value))
    } else {
      onSelectChange([...selectedValues, value])
    }
  }

  const selectAll = () => {
    const allSelectableValues = filteredOptions
      .filter((o) => !o.disabled)
      .map((o) => o.value)
    const combined = Array.from(new Set([...selectedValues, ...allSelectableValues]))
    onSelectChange(combined)
  }

  const clearAll = () => {
    onSelectChange([])
  }

  const removeValue = (e: React.MouseEvent, val: string) => {
    e.stopPropagation()
    onSelectChange(selectedValues.filter((v) => v !== val))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal h-auto min-h-10 py-1.5 px-3",
              selectedValues.length === 0 && "text-muted-foreground",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 items-center max-w-[calc(100%-2rem)]">
              {selectedValues.length === 0 && (
                <span>{placeholder}</span>
              )}
              {selectedValues.length > 0 && selectedValues.length <= 3 && (
                selectedValues.map((val) => {
                  const option = options.find((o) => o.value === val)
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 flex items-center gap-1 font-normal"
                    >
                      {option ? option.label : val}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-foreground text-muted-foreground"
                        onClick={(e) => removeValue(e, val)}
                      />
                    </Badge>
                  )
                })
              )}
              {selectedValues.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                  {selectedValues.length} selected
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        }
      />
      <PopoverContent className="w-[var(--anchor-width)] p-0 shadow-lg" align="start">
        <div className="p-2 border-b flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-none shadow-none focus-visible:ring-0 text-sm p-0"
          />
          {search && (
            <X
              className="h-4 w-4 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/30 text-xs">
          <span className="text-muted-foreground font-medium">
            {selectedValues.length} of {options.length} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-primary hover:underline font-medium"
            >
              Select All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground hover:underline font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <div
                  key={option.value}
                  onClick={() => !option.disabled && toggleOption(option.value)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm cursor-pointer transition-colors select-none",
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.sublabel && (
                      <span className="text-xs text-muted-foreground font-normal">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options
    const query = search.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query))
    )
  }, [options, search])

  const selectedOption = options.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal h-9 px-3 text-xs bg-background",
              !value && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : value || placeholder}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 ml-2" />
          </Button>
        }
      />
      <PopoverContent className="w-[var(--anchor-width)] min-w-[200px] p-0 shadow-lg z-50" align="start">
        <div className="p-2 border-b flex items-center gap-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 border-none shadow-none focus-visible:ring-0 text-xs p-0"
          />
          {search && (
            <X
              className="h-3.5 w-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      onValueChange(option.value)
                      setOpen(false)
                      setSearch("")
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors select-none",
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-[10px] text-muted-foreground font-normal truncate">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

