"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, Search, X } from "lucide-react"

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
    const seen = new Set<string>()
    const unique = options.filter((opt) => {
      if (!opt.value || seen.has(opt.value)) return false
      seen.add(opt.value)
      return true
    })
    if (!search.trim()) return unique
    const query = search.toLowerCase()
    return unique.filter(
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

  const displayText = React.useMemo(() => {
    if (selectedValues.length === 0) return placeholder
    if (selectedValues.length === 1) {
      const option = options.find((o) => o.value === selectedValues[0])
      return option ? option.label : selectedValues[0]
    }
    const clean = placeholder
      .replace(/^(Filter|Select|Choose)\s+/i, "")
      .replace(/\.{3}$/, "")
      .replace(/\(s\)/i, "")
      .trim()
    return clean ? clean : `${selectedValues.length} selected`
  }, [selectedValues, options, placeholder])

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
              "w-full justify-between font-normal h-10 px-3 text-xs bg-card border-surface-border shadow-none overflow-hidden",
              selectedValues.length === 0 && "text-muted-foreground",
              className
            )}
          >
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <span className={cn("truncate", selectedValues.length > 0 && "font-medium text-foreground")}>
                {displayText}
              </span>
              {selectedValues.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary border border-primary/25 shrink-0">
                  {selectedValues.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1.5 text-muted-foreground">
              {selectedValues.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    clearAll()
                  }}
                  className="rounded-full p-0.5 hover:bg-muted hover:text-foreground cursor-pointer"
                  title="Clear filter"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </div>
          </Button>
        }
      />
      <PopoverContent className="w-[var(--anchor-width)] min-w-[240px] p-0 shadow-lg z-50" align="start">
        <div className="p-2 border-b flex items-center gap-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 border-none shadow-none focus-visible:ring-0 text-xs p-0 bg-transparent"
          />
          {search && (
            <X
              className="h-3.5 w-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
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
            <div className="py-6 text-center text-xs text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((option, i) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <div
                  key={`${option.value}-${i}`}
                  onClick={() => !option.disabled && toggleOption(option.value)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors select-none",
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent/60 text-foreground"
                  )}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-[10px] text-muted-foreground font-normal truncate">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0",
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
  allowCustom?: boolean
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
  allowCustom = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    const seen = new Set<string>()
    const unique = options.filter((opt) => {
      if (!opt.value || seen.has(opt.value)) return false
      seen.add(opt.value)
      return true
    })
    if (!search.trim()) return unique
    const query = search.toLowerCase()
    return unique.filter(
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && allowCustom && search.trim()) {
                e.preventDefault()
                onValueChange(search.trim())
                setOpen(false)
                setSearch("")
              }
            }}
            className="h-7 border-none shadow-none focus-visible:ring-0 text-xs p-0 bg-transparent"
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
            allowCustom && search.trim() ? (
              <div
                onClick={() => {
                  onValueChange(search.trim())
                  setOpen(false)
                  setSearch("")
                }}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs cursor-pointer hover:bg-accent/60 text-primary font-medium select-none"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Use "{search.trim()}"</span>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">
                {emptyText}
              </div>
            )
          ) : (
            filteredOptions.map((option, i) => {
              const isSelected = option.value === value
              return (
                <div
                  key={`${option.value}-${i}`}
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
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-accent/60 text-foreground"
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

export interface BadgeComboboxOption {
  value: string
  label: string
  sublabel?: string
  disabled?: boolean
}

export interface BadgeComboboxProps {
  values: string[]
  onValuesChange: (values: string[]) => void
  options?: BadgeComboboxOption[]
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  allowCustom?: boolean
  maxItems?: number
  badgeVariant?: "default" | "secondary" | "outline"
  id?: string
}

export function BadgeCombobox({
  values = [],
  onValuesChange,
  options = [],
  placeholder = "",
  emptyText = "No options found.",
  className,
  disabled = false,
  allowCustom = true,
  maxItems,
  badgeVariant = "secondary",
  id,
}: BadgeComboboxProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const hasOptions = Boolean(options && options.length > 0)

  // Filter options based on typed input and exclude already selected items & duplicates
  const filteredOptions = React.useMemo(() => {
    if (!hasOptions) return []
    const query = inputValue.trim().toLowerCase()
    const seen = new Set<string>()

    return options.filter((opt) => {
      if (!opt.value || seen.has(opt.value)) return false
      seen.add(opt.value)
      if (values.includes(opt.value) || values.includes(opt.label)) return false
      if (!query) return true
      return (
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
        opt.value.toLowerCase().includes(query)
      )
    })
  }, [hasOptions, options, inputValue, values])

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [filteredOptions.length])

  // Handle outside click to close dropdown
  React.useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const handleAdd = (val: string) => {
    const trimmed = val.trim()
    if (!trimmed) return
    if (maxItems && values.length >= maxItems) return
    if (!values.includes(trimmed)) {
      onValuesChange([...values, trimmed])
    }
    setInputValue("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleRemove = (valToRemove: string) => {
    onValuesChange(values.filter((v) => v !== valToRemove))
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // If dropdown is open and an option is highlighted, choose it
      if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleAdd(filteredOptions[highlightedIndex].value)
        return
      }
      // If user typed something and custom values are allowed (or no options exist)
      if (inputValue.trim() && (allowCustom || !hasOptions)) {
        handleAdd(inputValue.trim())
        return
      }
      // If there is exactly one filtered option and user pressed enter
      if (isOpen && filteredOptions.length === 1) {
        handleAdd(filteredOptions[0].value)
        return
      }
    } else if (e.key === "Backspace") {
      // If input is empty, delete the last badge
      if (!inputValue && values.length > 0) {
        handleRemove(values[values.length - 1])
      }
    } else if (e.key === "ArrowDown") {
      if (hasOptions) {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          )
        }
      }
    } else if (e.key === "ArrowUp") {
      if (isOpen && hasOptions) {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // Handle paste to split comma or newline separated values
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text")
    if (paste && (paste.includes(",") || paste.includes("\n"))) {
      e.preventDefault()
      const items = paste
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (items.length > 0) {
        const unique = Array.from(new Set([...values, ...items]))
        const limited = maxItems ? unique.slice(0, maxItems) : unique
        onValuesChange(limited)
        setInputValue("")
        setIsOpen(false)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-10 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs transition-colors",
          "flex flex-wrap items-center gap-1.5 cursor-text",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background",
          disabled && "opacity-50 cursor-not-allowed bg-muted/40",
          className
        )}
      >
        {values.map((val, idx) => (
          <Badge
            key={`${val}-${idx}`}
            variant={badgeVariant}
            className="gap-1.5 py-1 px-2.5 text-xs font-normal bg-primary/10 text-foreground border border-primary/20 shrink-0 max-w-full"
          >
            <span className="truncate max-w-[240px]">{val}</span>
            {!disabled && (
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(val)
                }}
                className="text-muted-foreground hover:text-destructive rounded-full p-0.5 hover:bg-destructive/10 transition-colors shrink-0"
                aria-label={`Remove ${val}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {!disabled && (!maxItems || values.length < maxItems) && (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (hasOptions) setIsOpen(true)
            }}
            onFocus={() => {
              if (hasOptions) setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={values.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[120px] bg-transparent border-0 p-0 text-xs shadow-none outline-none focus-visible:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* Dropdown menu for options when available */}
      {isOpen && hasOptions && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg z-50 text-xs">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => {
              const isHighlighted = i === highlightedIndex
              return (
                <div
                  key={`${opt.value}-${i}`}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleAdd(opt.value)
                  }}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors select-none",
                    isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/60 text-foreground"
                  )}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate font-medium">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] text-muted-foreground truncate">{opt.sublabel}</span>
                    )}
                  </div>
                  {values.includes(opt.value) && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />
                  )}
                </div>
              )
            })
          ) : inputValue.trim() && allowCustom ? (
            <div
              onMouseDown={(e) => {
                e.preventDefault()
                handleAdd(inputValue.trim())
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-primary hover:bg-primary/10 cursor-pointer rounded-md font-medium select-none"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add "{inputValue.trim()}"</span>
            </div>
          ) : (
            <div className="py-3 text-center text-xs text-muted-foreground">
              {emptyText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const BadgeInput = BadgeCombobox


