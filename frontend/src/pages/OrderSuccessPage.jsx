import * as React from "react"
import { useSearchParams, Link } from "react-router-dom"
import { CheckCircle2, ShoppingBag, MapPin, ClipboardList, HelpCircle } from "lucide-react"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Loader from "@/components/shared/Loader"
import { Badge } from "@/components/ui/badge"

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false)
        setError("Missing Order ID")
        return
      }
      try {
        const data = await api.get(`/orders/${orderId}`)
        setOrder(data.order)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Could not retrieve order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return <Loader fullPage={true} />
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4 text-right">
        <h2 className="text-2xl font-bold text-text-primary">الطلب غير موجود</h2>
        <p className="text-text-secondary text-sm">{error || "الطلب المحدد غير موجود في النظام."}</p>
        <Button variant="secondary" asChild className="cursor-pointer">
          <Link to="/shop">تصفح المنتجات</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-slide-up text-right">
      
      {/* THANK YOU BANNER */}
      <div className="text-center space-y-4">
        <div className="h-16 w-16 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          شكراً لك، {order.customer.name}!
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          تم إرسال طلبك بنجاح. سنقوم بالتواصل معك قريباً لتأكيد الطلب وتجهيز عملية الشحن والتسليم.
        </p>
        <div className="inline-flex items-center space-x-2 space-x-reverse bg-surface border border-border-subtle px-4 py-2 rounded-full text-xs font-semibold">
          <span className="text-text-secondary">رقم الطلب:</span>
          <span className="text-secondary font-mono tracking-wider">{order.orderNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-6">
        
        {/* LEFT/MID COLUMN: ITEMS & SHIPPING ADDRESS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Purchased Items */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider flex items-center space-x-2 space-x-reverse">
                <ClipboardList className="h-5 w-5 text-secondary ml-2" />
                <span>المنتجات المطلوبة</span>
              </h3>
              
              <div className="divide-y divide-border-subtle/30">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0 gap-4 flex-row-reverse">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="h-12 w-12 rounded overflow-hidden border border-border-subtle/50 bg-surface-light shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-text-secondary uppercase mt-0.5 font-bold">
                          الحجم: {item.size} • اللون: {item.color}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-text-secondary font-bold block">{item.quantity}x</span>
                      <span className="text-sm font-bold text-text-primary">{item.price * item.quantity} جنيه</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address confirmation */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider flex items-center space-x-2 space-x-reverse">
                <MapPin className="h-5 w-5 text-secondary ml-2" />
                <span>عنوان التوصيل</span>
              </h3>
              
              <div className="text-sm text-text-secondary space-y-1">
                <p className="font-semibold text-text-primary">{order.customer.name}</p>
                <p>{order.customer.address}</p>
                {order.customer.phone && <p className="pt-2 text-xs">رقم الهاتف: {order.customer.phone}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: CALCULATIONS SUMMARY */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">ملخص الحساب</h3>
              
              <div className="space-y-3 text-xs text-text-secondary">
                <div className="flex justify-between flex-row-reverse">
                  <span>المجموع الفرعي</span>
                  <span className="text-text-primary font-medium">{order.subtotal} جنيه</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span>الشحن</span>
                  <span className="text-text-primary font-medium">مجاني</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span>ضريبة المبيعات (8%)</span>
                  <span className="text-text-primary font-medium">{order.tax} جنيه</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-sm font-bold text-text-primary flex-row-reverse">
                  <span>الإجمالي المستحق</span>
                  <span className="text-secondary">{order.total} جنيه</span>
                </div>

                <div className="flex justify-between items-center pt-2 flex-row-reverse">
                  <span>حالة الدفع</span>
                  <Badge 
                    variant="warning"
                    className="text-[9px] uppercase font-bold text-amber-500 bg-amber-500/10 border-amber-500/20"
                  >
                    الدفع عند الاستلام
                  </Badge>
                </div>
              </div>

              <Separator className="my-2" />

              <Button variant="secondary" className="w-full cursor-pointer font-bold" asChild>
                <Link to="/shop" className="flex items-center justify-center space-x-2 space-x-reverse">
                  <ShoppingBag className="h-4.5 w-4.5 ml-2" />
                  <span>الاستمرار في التسوق</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Need help sidebar */}
          <div className="bg-surface/50 border border-border-subtle p-4 rounded-lg flex items-start space-x-3 space-x-reverse text-xs text-right">
            <HelpCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5 ml-2" />
            <div className="space-y-1">
              <h4 className="font-semibold text-text-primary">هل تحتاج إلى مساعدة؟</h4>
              <p className="text-text-secondary leading-relaxed">
                إذا كان لديك أي استفسار بخصوص طلبك، يرجى التواصل معنا مباشرة عبر واتساب على الرقم <a href="https://wa.me/201121193709" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">201121193709</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
