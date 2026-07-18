import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function ProductFilters({ filters, setFilters, onClear }) {
  const categories = ["بلدي", "اطقم", "رفايع"]
  const categoryLabels = {
    "بلدي": "بلدي",
    "اطقم": "أطقم",
    "رفايع": "رفايع"
  }

  const handleCategoryChange = (category, checked) => {
    setFilters((prev) => {
      let nextCategories = [...(prev.categories || [])]
      if (checked) {
        nextCategories.push(category)
      } else {
        nextCategories = nextCategories.filter((c) => c !== category)
      }
      return { ...prev, categories: nextCategories }
    })
  }

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value
    }))
  }

  const filtersContent = (
    <div className="space-y-6 text-right">
      {/* Category filter */}
      <div>
        <h4 className="font-semibold text-text-primary text-sm uppercase tracking-wider mb-4 border-b border-border-subtle/50 pb-2">
          الأقسام
        </h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-3 justify-start cursor-pointer">
              <Checkbox
                id={`cat-${category}`}
                checked={(filters.categories || []).includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              />
              <Label 
                htmlFor={`cat-${category}`} 
                className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer select-none"
              >
                {categoryLabels[category]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div>
        <h4 className="font-semibold text-text-primary text-sm uppercase tracking-wider mb-4 border-b border-border-subtle/50 pb-2">
          نطاق السعر (جنيه)
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="min-price" className="sr-only">السعر الأدنى</Label>
            <Input
              id="min-price"
              type="number"
              placeholder="الأقل"
              value={filters.minPrice || ""}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              className="text-xs text-right"
              min="0"
            />
          </div>
          <span className="text-text-secondary text-sm">—</span>
          <div className="flex-1">
            <Label htmlFor="max-price" className="sr-only">السعر الأقصى</Label>
            <Input
              id="max-price"
              type="number"
              placeholder="الأعلى"
              value={filters.maxPrice || ""}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              className="text-xs text-right"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Sort order filter */}
      <div>
        <h4 className="font-semibold text-text-primary text-sm uppercase tracking-wider mb-4 border-b border-border-subtle/50 pb-2">
          ترتيب حسب
        </h4>
        <Select 
          value={filters.sort || "newest"} 
          onChange={handleSortChange}
          className="text-right"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل للأعلى</option>
          <option value="price_desc">السعر: من الأعلى للأقل</option>
        </Select>
      </div>

      {/* Clear Filters CTA */}
      <Button 
        variant="outline" 
        className="w-full text-xs font-bold hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
        onClick={onClear}
      >
        مسح جميع الفلاتر
      </Button>
    </div>
  )

  return (
    <div className="bg-surface border border-border-subtle p-6 rounded-lg shadow-sm">
      {filtersContent}
    </div>
  )
}
