import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { currencies as defaultCurrencies, COMMON_CURRENCIES, type Currency } from "@/lib/currencies"

interface CustomCurrency extends Currency {
  isCustom?: boolean
}

interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
}

function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [customCurrency, setCustomCurrency] = useState({
    code: "",
    symbol: "",
    symbolNative: "",
    name: "",
  })
  const [currencies, setCurrencies] = useState<Record<string, CustomCurrency>>(defaultCurrencies)

  // Load custom currencies from localStorage on mount
  useEffect(() => {
    const loadCustomCurrencies = () => {
      const stored = localStorage.getItem("customCurrencies")
      if (stored) {
        try {
          const customCurrencies = JSON.parse(stored)
          setCurrencies((prevCurrencies) => ({
            ...prevCurrencies,
            ...customCurrencies,
          }))
        } catch (e) {
          console.error("Failed to parse custom currencies:", e)
        }
      }
    }

    loadCustomCurrencies()
  }, [])

  // Get the current currency details
  const selectedCurrency = useMemo(() => {
    return (
      currencies[value] || {
        code: value,
        symbol: value,
        name: value,
      }
    )
  }, [value, currencies])

  // Filter and group currencies based on search
  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.toLowerCase()

    // Filter currencies based on search query
    const filtered = Object.values(currencies).filter(
      (currency) =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query) ||
        currency.namePlural?.toLowerCase().includes(query),
    )

    // Group currencies
    const common = filtered.filter((c) => COMMON_CURRENCIES.includes(c.code))
    const custom = filtered.filter((c) => c.isCustom)
    const others = filtered.filter((c) => !COMMON_CURRENCIES.includes(c.code) && !c.isCustom)

    return { common, custom, others }
  }, [searchQuery, currencies])

  const handleCustomCurrencySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newCurrency: CustomCurrency = {
      ...customCurrency,
      decimalDigits: 2,
      namePlural: `${customCurrency.name}s`,
      isCustom: true,
    }

    // Update currencies state
    setCurrencies((prevCurrencies) => ({
      ...prevCurrencies,
      [customCurrency.code]: newCurrency,
    }))

    // Update localStorage
    const storedCustomCurrencies = JSON.parse(localStorage.getItem("customCurrencies") || "{}")
    const updatedCustomCurrencies = {
      ...storedCustomCurrencies,
      [customCurrency.code]: newCurrency,
    }
    localStorage.setItem("customCurrencies", JSON.stringify(updatedCustomCurrencies))
    window.dispatchEvent(new Event("storage"))

    onChange(customCurrency.code)

    setCustomDialogOpen(false)
    setOpen(false)

    setCustomCurrency({
      code: "",
      symbol: "",
      symbolNative: "",
      name: "",
    })
  }

  const handleDeleteCurrency = (currencyCode: string) => {
    // Remove from currencies state
    setCurrencies((prevCurrencies) => {
      const newCurrencies = { ...prevCurrencies }
      delete newCurrencies[currencyCode]
      return newCurrencies
    })

    // Remove from localStorage
    const storedCustomCurrencies = JSON.parse(localStorage.getItem("customCurrencies") || "{}")
    delete storedCustomCurrencies[currencyCode]
    localStorage.setItem("customCurrencies", JSON.stringify(storedCustomCurrencies))
    window.dispatchEvent(new Event("storage"))

    // If the deleted currency was selected, reset the selection
    if (value === currencyCode) {
      onChange("USD")
    }
  }

  return (
    <>
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Add Custom Currency</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCustomCurrencySubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Currency Code</Label>
                <Input
                  id="code"
                  value={customCurrency.code}
                  onChange={(e) =>
                    setCustomCurrency((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g., GHS"
                  maxLength={3}
                  required
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <Label htmlFor="name">Currency Name</Label>
                <Input
                  id="name"
                  value={customCurrency.name}
                  onChange={(e) =>
                    setCustomCurrency((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Ghanaian Cedi"
                  required
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">International Symbol</Label>
                <Input
                  id="symbol"
                  value={customCurrency.symbol}
                  onChange={(e) =>
                    setCustomCurrency((prev) => ({
                      ...prev,
                      symbol: e.target.value,
                    }))
                  }
                  placeholder="e.g., GH₵"
                  required
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <Label htmlFor="symbolNative">Native Symbol</Label>
                <Input
                  id="symbolNative"
                  value={customCurrency.symbolNative}
                  onChange={(e) =>
                    setCustomCurrency((prev) => ({
                      ...prev,
                      symbolNative: e.target.value,
                    }))
                  }
                  placeholder="e.g., ₵"
                  required
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" onClick={(e) => e.stopPropagation()}>
              Add Currency
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedCurrency ? (
              <span className="flex items-center gap-2">
                <span>{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.code}</span>
                <span className="text-gray-500">-</span>
                <span>{selectedCurrency.name}</span>
              </span>
            ) : (
              "Select currency..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-96 p-0">
          <Command>
            <CommandInput placeholder="Search currencies..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandEmpty>
              <div className="p-2">
                <p className="text-sm text-gray-500">No currency found.</p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    setCustomDialogOpen(true)
                    setOpen(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Currency
                </Button>
              </div>
            </CommandEmpty>
            {filteredCurrencies.common.length > 0 && (
              <CommandGroup heading="Common Currencies">
                {filteredCurrencies.common.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => {
                      onChange(currency.code)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === currency.code ? "opacity-100" : "opacity-0")} />
                    <span className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-gray-500">-</span>
                      <span>{currency.name}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {filteredCurrencies.custom.length > 0 && (
              <CommandGroup heading="Custom Currencies">
                {filteredCurrencies.custom.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => {
                      onChange(currency.code)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Check className={cn("mr-2 h-4 w-4", value === currency.code ? "opacity-100" : "opacity-0")} />
                        <span className="flex items-center gap-2">
                          <span>{currency.symbol}</span>
                          <span>{currency.code}</span>
                          <span className="text-gray-500">-</span>
                          <span>{currency.name}</span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCurrency(currency.code)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {filteredCurrencies.others.length > 0 && (
              <CommandGroup heading="All Currencies">
                {filteredCurrencies.others.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => {
                      onChange(currency.code)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === currency.code ? "opacity-100" : "opacity-0")} />
                    <span className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-gray-500">-</span>
                      <span>{currency.name}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup className="border-t pt-2">
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  setCustomDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Currency
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default CurrencySelect
