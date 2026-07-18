import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/services/api"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, MessageSquare, ChevronRight } from "lucide-react"

// Zod validation schema for shipping details (Arabic)
const shippingSchema = z.object({
  name: z.string().trim().min(2, "الرجاء إدخال الاسم بالكامل"),
  phone: z.string().trim().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  address: z.string().trim().min(5, "الرجاء إدخال العنوان بالتفصيل")
})

function CheckoutForm() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('checkout_start');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  })

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user, reset])

  // Calculations
  const shippingCost = 0 // Free shipping
  const tax = Math.round((cartTotal * 0.08) * 100) / 100
  const orderTotal = Math.round((cartTotal + shippingCost + tax) * 100) / 100

  const onSubmit = async (shippingData) => {
    if (cart.length === 0) return
    setLoading(true)
    setError(null)

    try {
      // Step 1: Create order in local database (MOCK or Real)
      const orderPayload = {
        customer: {
          name: shippingData.name,
          phone: shippingData.phone,
          address: shippingData.address
        },
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shippingMethod: "standard",
        utmSource: sessionStorage.getItem("analytics_utm_source") || "direct"
      }

      const orderResponse = await api.post("/orders", orderPayload)
      const orderId = orderResponse.order._id

      // Track purchase event
      if (window.trackAnalyticsEvent) {
        window.trackAnalyticsEvent('purchase');
      }

      // Step 2: Construct WhatsApp Message
      let message = `طلب جديد من شرابية ستور 🛒:\n\n`;
      cart.forEach(item => {
        message += `• ${item.name} × ${item.quantity}`;
        if (item.size && item.size !== 'One Size') message += ` (${item.size})`;
        if (item.color && item.color !== 'Default') message += ` (${item.color})`;
        message += `\n`;
      });
      message += `\nإجمالي الحساب: ${orderTotal} جنيه\n\n`;
      message += `الاسم: ${shippingData.name}\n`;
      message += `الهاتف: ${shippingData.phone}\n`;
      message += `العنوان: ${shippingData.address}`;

      // Step 3: Open WhatsApp Link
      const whatsappNumber = "201121193709" // Sharabia Store Contact Number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      
      window.open(whatsappUrl, "_blank")

      // Step 4: Clear cart and redirect to order success page
      clearCart()
      navigate(`/order-success?orderId=${orderId}`)
      
    } catch (err) {
      console.error("Checkout process failed:", err)
      setError(err.message || "فشلت عملية حفظ الطلب، يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-right">
      
      {/* LEFT: SHIPPING FORM */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2 space-x-reverse">
              <span className="h-6 w-6 rounded-full bg-secondary text-bg font-extrabold text-xs flex items-center justify-center ml-2">1</span>
              <span>بيانات التوصيل</span>
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input id="name" placeholder="محمد علي" className="text-right" {...register("name")} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الهاتف (واتساب)</Label>
                <Input id="phone" placeholder="01234567890" className="text-right" {...register("phone")} />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">العنوان بالتفصيل (المحافظة/المدينة/الشارع)</Label>
                <Input id="address" placeholder="القاهرة، المهندسين، شارع جامعة الدول العربية" className="text-right" {...register("address")} />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-md text-center mt-4">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: ORDER SUMMARY */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-text-primary text-base uppercase tracking-wider">طلبك</h3>
            
            {/* Cart Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs flex-row-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-text-secondary bg-surface-light px-1.5 py-0.5 rounded border border-border-subtle/50 font-bold ml-2">
                      {item.quantity}x
                    </span>
                    <span className="text-text-primary font-medium line-clamp-1">{item.name}</span>
                  </div>
                  <span className="text-text-primary font-bold">{item.price * item.quantity} جنيه</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Calculations summary */}
            <div className="space-y-2.5 text-xs text-text-secondary">
              <div className="flex justify-between flex-row-reverse">
                <span>المجموع الفرعي</span>
                <span className="text-text-primary font-medium">{cartTotal} جنيه</span>
              </div>
              <div className="flex justify-between flex-row-reverse">
                <span>الشحن</span>
                <span className="text-text-primary font-medium">مجاني</span>
              </div>
              <div className="flex justify-between flex-row-reverse">
                <span>ضريبة المبيعات (8%)</span>
                <span className="text-text-primary font-medium">{tax} جنيه</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-bold text-text-primary flex-row-reverse">
                <span>الإجمالي</span>
                <span className="text-secondary">{orderTotal} جنيه</span>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full text-base font-bold h-12 mt-4 cursor-pointer"
              disabled={loading || cart.length === 0}
            >
              {loading ? (
                <span className="flex items-center space-x-2 justify-center">
                  <span className="h-4 w-4 border-2 border-bg border-t-transparent rounded-full animate-spin ml-2"></span>
                  <span>جاري معالجة الطلب...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2 space-x-reverse justify-center">
                  <MessageSquare className="h-4.5 w-4.5 ml-2" />
                  <span>تأكيد الطلب عبر واتساب 📲</span>
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-text-secondary pt-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>توصيل سريع ودفع عند الاستلام</span>
            </div>
          </CardContent>
        </Card>
      </div>

    </form>
  )
}

export default function CheckoutPage() {
  const { cart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">السلة فارغة</h2>
        <p className="text-text-secondary text-sm">
          يجب إضافة منتجات إلى سلتك قبل الذهاب إلى صفحة إتمام الطلب.
        </p>
        <Button variant="secondary" asChild className="cursor-pointer">
          <Link to="/shop">الذهاب للمتجر</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      
      {/* BACK TO CART LINK */}
      <Link to="/cart" className="inline-flex items-center text-xs text-text-secondary hover:text-secondary transition-colors space-x-1 space-x-reverse uppercase tracking-wider font-bold">
        <ChevronRight className="h-4 w-4 ml-1" />
        <span>الرجوع للسلة</span>
      </Link>

      <div className="border-b border-border-subtle/30 pb-5">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">إتمام الطلب</h1>
        <p className="text-text-secondary text-sm mt-1">
          أدخل بيانات التوصيل وسيتم فتح محادثة واتساب لتأكيد طلبك وتفاصيل الشحن.
        </p>
      </div>

      <CheckoutForm />
    </div>
  )
}
