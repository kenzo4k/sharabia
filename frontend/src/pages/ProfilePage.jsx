import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  Phone, 
  MapPin, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  CreditCard,
  LogOut
} from 'lucide-react';

const profileUpdateSchema = z.object({
  name: z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل').optional().or(z.literal('')),
  address: z.string().trim().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').optional().or(z.literal('')),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').optional().or(z.literal(''))
});

function OrderCard({ order }) {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_approval':
        return <Badge className="bg-slate-500 hover:bg-slate-655 text-white font-bold border-none text-[10px] px-2 py-0.5">بانتظار موافقة الإدارة</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-none text-[10px] px-2 py-0.5">جاري تجهيز الطلب</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-none text-[10px] px-2 py-0.5">تم الشحن</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold border-none text-[10px] px-2 py-0.5">تم التوصيل</Badge>;
      case 'succeeded':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-none text-[10px] px-2 py-0.5">مكتمل ناجح</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold border-none text-[10px] px-2 py-0.5">فاشل / ملغي</Badge>;
      default:
        return <Badge className="bg-slate-400 hover:bg-slate-500 text-white font-bold border-none text-[10px] px-2 py-0.5">{status}</Badge>;
    }
  };

  const getPaymentStatus = (status) => {
    return status === 'paid' ? 'مدفوع' : 'عند الاستلام';
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-sm overflow-hidden text-right">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors flex-row-reverse"
      >
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="p-2.5 bg-orange-100 text-secondary rounded-lg">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-primary">رقم الطلب: {order.orderNumber}</h4>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1 flex-row-reverse">
              <Calendar className="h-3.5 w-3.5" />
              <span>{orderDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="text-left md:text-right">
            <span className="text-xs text-text-secondary block">الإجمالي</span>
            <span className="font-extrabold text-secondary text-base">{order.total} جنيه</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1.5">
            {getStatusBadge(order.orderStatus)}
            <span className="text-[10px] text-text-secondary font-medium">{getPaymentStatus(order.paymentStatus)}</span>
          </div>
          {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <CardContent className="p-5 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-text-primary flex-row-reverse">
            
            {/* Customer & Shipping info */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
              <h5 className="font-bold text-sm text-text-primary mb-2 flex items-center gap-1.5 flex-row-reverse">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>تفاصيل الشحن</span>
              </h5>
              <p><span className="text-text-secondary">الاسم:</span> {order.customer.name}</p>
              <p><span className="text-text-secondary">الهاتف:</span> {order.customer.phone}</p>
              <p><span className="text-text-secondary">العنوان:</span> {order.customer.address}</p>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg flex flex-col justify-center">
              <div className="flex justify-between flex-row-reverse">
                <span className="text-text-secondary">المجموع الفرعي</span>
                <span className="font-semibold">{order.subtotal} جنيه</span>
              </div>
              <div className="flex justify-between flex-row-reverse">
                <span className="text-text-secondary">تكلفة الشحن</span>
                <span className="font-semibold">{order.shippingCost === 0 ? 'مجاني' : `${order.shippingCost} جنيه`}</span>
              </div>
              <div className="flex justify-between flex-row-reverse">
                <span className="text-text-secondary">الضريبة (8%)</span>
                <span className="font-semibold">{order.tax} جنيه</span>
              </div>
              <div className="border-t border-slate-200 my-1 pt-1 flex justify-between font-bold text-sm flex-row-reverse">
                <span className="text-text-primary">الإجمالي النهائي</span>
                <span className="text-secondary">{order.total} جنيه</span>
              </div>
            </div>

          </div>

          {/* Items List */}
          <div className="space-y-3.5">
            <h5 className="font-bold text-xs text-text-primary uppercase tracking-wider">المنتجات المطلوبة</h5>
            <div className="divide-y divide-slate-100 border border-slate-150 rounded-lg overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4 flex-row-reverse hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5 flex-row-reverse">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-12 w-12 rounded-md object-cover border border-slate-200" 
                      />
                    )}
                    <div>
                      <h6 className="font-bold text-xs text-text-primary line-clamp-1">{item.name}</h6>
                      <div className="flex flex-wrap gap-2.5 text-[10px] text-text-secondary mt-1 flex-row-reverse">
                        {item.size && item.size !== 'One Size' && (
                          <span>الحجم: {item.size}</span>
                        )}
                        {item.color && item.color !== 'Default' && (
                          <span>اللون: {item.color}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left font-bold text-xs">
                    <span className="text-text-secondary font-medium ml-2 text-[10px]">{item.quantity}x</span>
                    <span className="text-text-primary">{item.price} جنيه</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      )}
    </Card>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = React.useState([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [updateError, setUpdateError] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user orders
  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      setOrdersLoading(true);
      try {
        const response = await api.get('/orders/my');
        setOrders(response.orders || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      password: ''
    }
  });

  // Sync default values when user loads
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        password: ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    try {
      // Clean request data
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address
      };
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password;
      }
      await updateProfile(payload);
      setUpdateSuccess(true);
    } catch (err) {
      console.error('Profile update failed:', err);
      setUpdateError(err.response?.data?.message || err.message || 'فشل تحديث البيانات. يرجى التحقق وإعادة المحاولة.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-right">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDE BAR / ACCOUNT OVERVIEW */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-slate-100 shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-20 w-20 bg-orange-100 text-secondary text-2xl font-bold flex items-center justify-center rounded-full mx-auto uppercase">
                {user.name ? user.name.slice(0, 2) : 'ح'}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-text-primary mt-1">{user.name}</h3>
                <span className="text-xs text-text-secondary">{user.email}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-between flex-row-reverse cursor-pointer ${
                    activeTab === 'orders' 
                      ? 'bg-secondary text-white shadow-sm'
                      : 'hover:bg-slate-50 text-text-primary'
                  }`}
                >
                  <span className="flex items-center gap-2 flex-row-reverse">
                    <ShoppingBag className="h-4 w-4" />
                    <span>طلباتي</span>
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white text-secondary' : 'bg-slate-100 text-text-secondary'}`}>
                    {orders.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2 flex-row-reverse cursor-pointer ${
                    activeTab === 'profile' 
                      ? 'bg-secondary text-white shadow-sm'
                      : 'hover:bg-slate-50 text-text-primary'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>تعديل الحساب</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 flex-row-reverse cursor-pointer mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONTENT MAIN TAB */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-text-primary">طلبات الشراء الخاصة بك</h2>
                <p className="text-text-secondary text-xs mt-1">تتبع حالة طلباتك وتفاصيل شحن منتجاتك.</p>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <Card className="border border-dashed border-slate-200">
                  <CardContent className="p-12 text-center space-y-4">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-text-secondary">ليس لديك أي طلبات سابقة بعد.</p>
                    <Button variant="secondary" className="cursor-pointer" onClick={() => navigate('/shop')}>
                      تصفح المنتجات وتسوق الآن
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-text-primary">إعدادات الملف الشخصي</h2>
                <p className="text-text-secondary text-xs mt-1">تحديث معلومات الاتصال وعنوان الشحن الخاص بك.</p>
              </div>

              <Card className="border border-slate-100 shadow-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-text-primary">الاسم بالكامل</Label>
                        <Input
                          id="name"
                          type="text"
                          className="bg-slate-50/50 border-slate-200 focus:border-secondary focus:ring-secondary text-right h-10.5 text-xs"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-text-primary">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-slate-50/50 border-slate-200 focus:border-secondary focus:ring-secondary text-right h-10.5 text-xs"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold text-text-primary flex items-center gap-1 flex-row-reverse">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span>رقم الهاتف (واتساب)</span>
                        </Label>
                        <Input
                          id="phone"
                          type="text"
                          className="bg-slate-50/50 border-slate-200 focus:border-secondary focus:ring-secondary text-right h-10.5 text-xs"
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-text-primary flex items-center gap-1 flex-row-reverse">
                          <Lock className="h-3.5 w-3.5 text-gray-400" />
                          <span>تغيير كلمة المرور (اتركه فارغاً للاحتفاظ بالحالية)</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-50/50 border-slate-200 focus:border-secondary focus:ring-secondary text-right h-10.5 text-xs"
                          {...register('password')}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.password.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-xs font-bold text-text-primary flex items-center gap-1 flex-row-reverse">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span>عنوان الشحن الافتراضي</span>
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        className="bg-slate-50/50 border-slate-200 focus:border-secondary focus:ring-secondary text-right h-10.5 text-xs"
                        {...register('address')}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    {updateSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-xs font-bold text-center rounded-lg">
                        تم تحديث بيانات ملفك الشخصي بنجاح!
                      </div>
                    )}

                    {updateError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center rounded-lg">
                        {updateError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="h-10 text-xs font-bold px-6 bg-secondary hover:bg-secondary-dark text-white cursor-pointer flex items-center justify-center gap-2"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <span>حفظ التعديلات</span>
                      )}
                    </Button>

                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
