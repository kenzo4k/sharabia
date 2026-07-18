import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { Filter, SlidersHorizontal } from "lucide-react"
import api from "@/services/api"
import ProductGrid from "@/components/product/ProductGrid"
import ProductFilters from "@/components/product/ProductFilters"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  // Initialize filter state from search params
  const [filters, setFilters] = React.useState({
    categories: searchParams.get("category") ? [searchParams.get("category")] : [],
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || ""
  })

  // Synchronize category and search state when search params change
  React.useEffect(() => {
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search") || ""
    setFilters((prev) => ({
      ...prev,
      categories: categoryParam ? [categoryParam] : [],
      search: searchParam
    }))
  }, [searchParams])

  // Fetch products from API based on filters
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        
        // Pass single category to API if exactly 1 is selected
        if (filters.categories.length === 1) {
          queryParams.set("category", filters.categories[0])
        }
        
        if (filters.minPrice) queryParams.set("minPrice", filters.minPrice)
        if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice)
        if (filters.sort) queryParams.set("sort", filters.sort)
        if (filters.search) queryParams.set("search", filters.search)

        const data = await api.get(`/products?${queryParams.toString()}`)
        let resultProducts = data.products || []

        // If multiple categories are checked, filter them on the client side
        if (filters.categories.length > 1) {
          resultProducts = resultProducts.filter(p => filters.categories.includes(p.category))
        }

        setProducts(resultProducts)
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  const handleClearAll = () => {
    setFilters({
      categories: [],
      minPrice: "",
      maxPrice: "",
      sort: "newest"
    })
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-subtle/30 pb-5 gap-4 flex-row-reverse">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            {filters.search ? `نتائج البحث عن "${filters.search}"` : 'معرض المنتجات'}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {filters.search ? 'نتائج البحث المطابقة في أقسام شرابية ستور.' : 'تصفح أحدث وأفضل المنتجات والأطقم المنزلية البلدي والافرنجي.'}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <Button
          variant="outline"
          className="md:hidden flex items-center space-x-2 space-x-reverse border-border-subtle hover:border-secondary cursor-pointer"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 ml-1" />
          <span>تصفية</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24">
          <div className="flex items-center space-x-2 space-x-reverse text-text-primary font-bold text-sm uppercase tracking-wider mb-3 px-1">
            <Filter className="h-4 w-4 text-secondary ml-1" />
            <span>تصفية المنتجات</span>
          </div>
          <ProductFilters 
            filters={filters} 
            setFilters={setFilters} 
            onClear={handleClearAll} 
          />
        </aside>

        {/* PRODUCT GRID CONTAINER */}
        <div className="flex-grow w-full">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-4 px-1 flex-row-reverse">
            <span>يتم عرض {products.length} منتج</span>
            <span>شرابية ستور</span>
          </div>
          
          <ProductGrid products={products} isLoading={loading} count={8} />
        </div>
      </div>

      {/* MOBILE FILTER SHEET DRAWER */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="right" className="bg-bg text-text-primary border-l border-border-subtle text-right">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2 space-x-reverse text-right">
              <SlidersHorizontal className="h-5 w-5 text-secondary ml-1" />
              <span>تصفية المنتجات</span>
            </SheetTitle>
          </SheetHeader>
          <div className="pt-6 h-full flex flex-col justify-between">
            <ProductFilters 
              filters={filters} 
              setFilters={setFilters} 
              onClear={handleClearAll} 
            />
            <div className="border-t border-border-subtle/50 pt-4 mt-6">
              <Button 
                variant="secondary" 
                className="w-full h-11 cursor-pointer font-bold"
                onClick={() => setMobileFiltersOpen(false)}
              >
                تطبيق التصفية
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}
