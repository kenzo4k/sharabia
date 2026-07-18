import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, LogIn } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  phone: z.string().trim().min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل').optional().or(z.literal('')),
  address: z.string().trim().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').optional().or(z.literal(''))
});

export default function RegisterPage() {
  const { register: signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setApiError(null);
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password, data.phone, data.address);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Customer signup error:', err);
      setApiError(err.response?.data?.message || err.message || 'فشل إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center px-4 py-16 font-sans text-right">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            إنشاء <span className="text-secondary">حساب جديد</span>
          </h1>
          <p className="text-text-secondary text-sm">انضم إلينا واستمتع بتجربة تسوق سريعة ومميزة في شرابية ستور.</p>
        </div>

        <Card className="border-border-subtle bg-white shadow-xl shadow-slate-100">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-text-primary text-xs font-bold">الاسم بالكامل *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="محمد أحمد"
                  className="bg-slate-50 border-border-subtle text-text-primary placeholder-slate-400 focus:border-secondary focus:ring-secondary text-right h-10.5"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-text-primary text-xs font-bold">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-slate-50 border-border-subtle text-text-primary placeholder-slate-400 focus:border-secondary focus:ring-secondary text-right h-10.5"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-text-primary text-xs font-bold">كلمة المرور *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-50 border-border-subtle text-text-primary placeholder-slate-400 focus:border-secondary focus:ring-secondary text-right h-10.5"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-text-primary text-xs font-bold">رقم الهاتف (اختياري)</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="01234567890"
                  className="bg-slate-50 border-border-subtle text-text-primary placeholder-slate-400 focus:border-secondary focus:ring-secondary text-right h-10.5"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-text-primary text-xs font-bold">عنوان التوصيل الافتراضي (اختياري)</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="المحافظة، المدينة، الشارع بالتفصيل"
                  className="bg-slate-50 border-border-subtle text-text-primary placeholder-slate-400 focus:border-secondary focus:ring-secondary text-right h-10.5"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.address.message}</p>
                )}
              </div>

              {apiError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center mt-2 leading-relaxed">
                  {apiError}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-bold bg-secondary hover:bg-secondary-dark text-white cursor-pointer mt-6 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري الإنشاء...</span>
                  </span>
                ) : (
                  <>
                    <UserPlus className="h-4.5 w-4.5 ml-1" />
                    <span>إنشاء الحساب</span>
                  </>
                )}
              </Button>

            </form>

            <div className="mt-6 pt-6 border-t border-border-subtle text-center text-xs">
              <span className="text-text-secondary">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-secondary hover:underline font-bold inline-flex items-center gap-1">
                <span>تسجيل الدخول</span>
                <LogIn className="h-3.5 w-3.5 mr-0.5" />
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
