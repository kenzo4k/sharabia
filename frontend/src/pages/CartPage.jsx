import * as React from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import CartItem from "@/components/cart/CartItem"
import CartSummary from "@/components/cart/CartSummary"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()
  const isCartEmpty = cart.length === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-subtle/30 pb-5 gap-4 flex-row-reverse">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">سلة المشتريات</h1>
          <p className="text-text-secondary text-sm mt-1">
            راجع المنتجات التي اخترتها قبل إتمام طلبك.
          </p>
        </div>
        
        {!isCartEmpty && (
          <Button
            variant="ghost"
            onClick={clearCart}
            className="text-xs text-text-secondary hover:text-red-400 hover:bg-red-500/10 flex items-center space-x-1 space-x-reverse uppercase tracking-wider font-bold rounded cursor-pointer"
          >
            <Trash2 className="h-4 w-4 ml-1" />
            <span>تفريغ السلة</span>
          </Button>
        )}
      </div>

      {isCartEmpty ? (
        
        /* EMPTY CART STATE */
        <div className="text-center py-20 bg-surface rounded-lg border border-border-subtle max-w-lg mx-auto p-8 animate-slide-up">
          <div className="h-16 w-16 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-bronze">
            <ShoppingBag className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">سلة المشتريات فارغة 🛒</h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            لم تقم بإضافة أي منتجات إلى سلتك حتى الآن. ابدأ بتصفح المعرض وأضف ما يناسبك.
          </p>
          <Button variant="secondary" className="h-11 px-6 font-bold cursor-pointer" asChild>
            <Link to="/shop" className="flex items-center space-x-2 space-x-reverse justify-center">
              <span>تصفح معرض المنتجات</span>
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
        </div>
      ) : (
        
        /* CART CONTENT GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: LIST OF ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <CartItem
                key={`${item.productId}-${item.size}-${item.color}-${index}`}
                item={item}
                index={index}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
            
            <div className="pt-4">
              <Button variant="outline" className="border-border-subtle hover:border-secondary hover:text-white cursor-pointer font-bold" asChild>
                <Link to="/shop" className="flex items-center space-x-2 space-x-reverse">
                  <span>الاستمرار في التسوق</span>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <CartSummary showCheckoutBtn={true} />
          </div>
        </div>
      )}

    </div>
  )
}
