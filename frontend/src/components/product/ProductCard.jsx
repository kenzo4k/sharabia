import * as React from "react"
import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCard({ product, isLoading = false }) {
  const { addItem } = useCart()

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
        <Skeleton className="h-56 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const handleQuickAdd = (e) => {
    e.preventDefault() // prevent navigating to product detail
    
    // Quick Add defaults: first size, first color, quantity 1
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "One Size"
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : "Default"
    
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size,
      color,
      image: product.images[0]
    })
  }

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group rounded-xl border border-border-subtle bg-surface hover:border-secondary hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm"
    >
      <div>
        {/* Image wrapper */}
        <div className="relative h-56 w-full overflow-hidden bg-surface-light">
          <img 
            src={product.images[0] || 'https://picsum.photos/600/450?random=1'} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-secondary hover:bg-secondary-dark text-white font-bold border-none text-[10px]"
          >
            عرض 🔥
          </Badge>
          
          <Badge 
            variant="outline" 
            className="absolute top-3 left-3 bg-[#0F172A] text-white font-bold border-none text-[10px] px-2 py-0.5"
          >
            {product.category === "اطقم" ? "أطقم" : "رفايع"}
          </Badge>
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded tracking-wider shadow">
                نفذت الكمية
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2 text-right">
          <h3 className="font-semibold text-text-primary text-base group-hover:text-secondary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between flex-row-reverse">
          <span className="text-lg font-bold text-text-primary">{product.price} جنيه</span>
          <span className="text-xs text-text-secondary font-medium">
            {product.stock > 0 ? `${product.stock} متوفر` : 'غير متوفر'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center space-x-1 space-x-reverse border-border-subtle hover:border-secondary hover:bg-orange-50/50 hover:text-secondary h-9 px-2 text-xs font-semibold cursor-pointer rounded-lg"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-3.5 w-3.5 ml-1" />
            <span>أضف للسلة</span>
          </Button>

          <Button 
            variant="primary" 
            className="flex-1 flex items-center justify-center h-9 px-2 text-xs font-bold cursor-pointer rounded-lg"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              const text = `عايز أشتري ${product.name} بسعر ${product.price} جنيه`;
              window.open(`https://wa.me/201234567890?text=${encodeURIComponent(text)}`, "_blank");
            }}
          >
            <span>⚡ اشتري الآن</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}
