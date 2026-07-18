import * as React from "react"
import { useParams, Link } from "react-router-dom"
import { ShoppingCart, Plus, Minus, ArrowLeft, Heart, ShieldCheck, RefreshCw } from "lucide-react"
import api from "@/services/api"
import { useCart } from "@/context/CartContext"
import ProductImageGallery from "@/components/product/ProductImageGallery"
import ProductGrid from "@/components/product/ProductGrid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/shared/Loader"

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem } = useCart()

  const [product, setProduct] = React.useState(null)
  const [relatedProducts, setRelatedProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  // Selection states
  const [selectedSize, setSelectedSize] = React.useState("")
  const [selectedColor, setSelectedColor] = React.useState("")
  const [quantity, setQuantity] = React.useState(1)
  const [isAdding, setIsAdding] = React.useState(false)

  // Scroll to top on slug change
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Fetch product data
  React.useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.get(`/products/slug/${slug}`)
        const prod = data.product
        setProduct(prod)
        
        // Default selections
        if (prod.sizes && prod.sizes.length > 0) {
          setSelectedSize(prod.sizes[0])
        } else {
          setSelectedSize("One Size")
        }
        
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0])
        } else {
          setSelectedColor("Default")
        }

        // Fetch related products in the same category
        const relData = await api.get(`/products?category=${prod.category}`)
        const filteredRelated = (relData.products || [])
          .filter(p => p._id !== prod._id) // Exclude current product
          .slice(0, 4) // Show 4 related items
        setRelatedProducts(filteredRelated)

      } catch (err) {
        console.error("Error fetching product details:", err)
        setError(err.message || "Product not found")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProductDetails()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    
    setIsAdding(true)
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]
    })
    
    // Simulate button feedback animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  if (loading) {
    return <Loader fullPage={true} />
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Failed to Load Product</h2>
        <p className="text-text-secondary text-sm">{error || "Product could not be retrieved."}</p>
        <Button variant="secondary" asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 text-right">
      
      {/* BACK LINK */}
      <Link to="/shop" className="inline-flex items-center text-xs text-text-secondary hover:text-secondary transition-colors space-x-1 space-x-reverse uppercase tracking-wider font-bold">
        <ArrowLeft className="h-4 w-4 ml-1" />
        <span>الرجوع للمعرض</span>
      </Link>

      {/* SPLIT PRODUCT LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: IMAGES */}
        <div>
          <ProductImageGallery images={product.images} />
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold text-[#0F172A] bg-slate-50 border-slate-200">
              {product.category === "اطقم" ? "أطقم" : "رفايع"}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 pt-1 justify-start">
              <span className="text-2xl lg:text-3xl font-extrabold text-secondary">{product.price} جنيه</span>
              <Badge variant={product.stock > 0 ? "success" : "error"} className="text-[10px] uppercase font-bold tracking-wide">
                {product.stock > 0 ? "متوفر" : "نفذت الكمية"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">وصف المنتج</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selectors (capacity/dimension for kitchenware) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">اختر المقاس / الحجم</h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-semibold rounded border cursor-pointer transition-all ${
                      selectedSize === sz
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-border-subtle hover:border-text-secondary text-text-primary"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selectors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">اختر اللون / المظهر</h3>
              <div className="flex flex-wrap gap-2 justify-start">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 text-xs font-semibold rounded border cursor-pointer transition-all ${
                      selectedColor === col
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-border-subtle hover:border-text-secondary text-text-primary"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">الكمية</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Selector */}
              <div className="flex items-center gap-1 bg-surface border border-border-subtle rounded-md p-1 self-start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded text-text-primary active:scale-95 cursor-pointer"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-10 text-center font-semibold text-sm text-text-primary">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded text-text-primary active:scale-95 cursor-pointer"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-1 w-full">
                <Button
                  variant="secondary"
                  className="flex-1 h-11 text-base font-bold cursor-pointer"
                  disabled={product.stock === 0}
                  onClick={() => {
                    const text = `عايز أشتري ${product.name} بسعر ${product.price} جنيه`;
                    window.open(`https://wa.me/201234567890?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                >
                  ⚡ اشتري الآن
                </Button>

                <Button
                  variant="primary"
                  className={`flex-1 h-11 text-base font-bold transition-all cursor-pointer ${
                    isAdding ? "bg-green-600 hover:bg-green-600 text-white" : ""
                  }`}
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  {isAdding ? (
                    <span>تمت الإضافة!</span>
                  ) : (
                    <span className="flex items-center space-x-2 space-x-reverse justify-center">
                      <ShoppingCart className="h-4.5 w-4.5 ml-2" />
                      <span>أضف للسلة</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-amber-500 font-medium">متبقي {product.stock} قطع فقط في المخزن!</p>
            )}
          </div>

          <Separator />

          {/* Bullet trust props */}
          <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-secondary ml-1" />
              <span>جودة فائقة وممتازة</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-secondary ml-1" />
              <span>مواد معمرة وتوزيع حراري مثالي</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-border-subtle/30 text-right">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">منتجات قد تعجبك أيضاً</h2>
          <ProductGrid products={relatedProducts} isLoading={false} count={4} />
        </section>
      )}

    </div>
  )
}
