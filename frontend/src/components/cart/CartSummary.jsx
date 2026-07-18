import * as React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, Truck } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CartSummary({ 
  showCheckoutBtn = true, 
  shippingCost = 0, 
  taxRate = 0.08 
}) {
  const { cartTotal, cart } = useCart()

  const calculatedTax = Math.round((cartTotal * taxRate) * 100) / 100
  const calculatedTotal = Math.round((cartTotal + shippingCost + calculatedTax) * 100) / 100
  const isCartEmpty = cart.length === 0

  return (
    <div className="bg-surface border border-border-subtle p-6 rounded-lg shadow-sm space-y-6 text-right">
      <h3 className="font-bold text-text-primary text-lg border-b border-border-subtle/50 pb-3">
        ملخص الطلب
      </h3>

      <div className="space-y-4 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between flex-row-reverse">
          <span className="text-text-secondary">المجموع الفرعي</span>
          <span className="font-medium text-text-primary">{cartTotal} جنيه</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between flex-row-reverse">
          <span className="text-text-secondary">الشحن</span>
          <span className="font-medium text-text-primary">
            {shippingCost === 0 ? "مجاني" : `${shippingCost} جنيه`}
          </span>
        </div>

        {/* Estimated Tax */}
        <div className="flex justify-between flex-row-reverse">
          <span className="text-text-secondary">ضريبة المبيعات (8%)</span>
          <span className="font-medium text-text-primary">{calculatedTax} جنيه</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-bold flex-row-reverse">
          <span className="text-text-primary">إجمالي الطلب</span>
          <span className="text-secondary">{calculatedTotal} جنيه</span>
        </div>
      </div>

      {showCheckoutBtn && (
        <div className="space-y-4 pt-2">
          <Button
            variant="primary"
            className="w-full text-base font-bold h-12 cursor-pointer"
            disabled={isCartEmpty}
            asChild
          >
            <Link to="/checkout">إتمام الطلب 💳</Link>
          </Button>

          <div className="flex items-center gap-2 text-[11px] text-text-secondary justify-center pt-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>تأكيد فوري للطلب عبر واتساب والدفع عند الاستلام.</span>
          </div>
        </div>
      )}
    </div>
  )
}
