import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import logoImg from '@/assets/logo.png.jpg';

const loginSchema = z.object({
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
});

export default function AdminLoginPage() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const user = await login(data.email, data.password);
      if (user.role !== 'admin') {
        throw new Error('غير مصرح لك بالدخول كمسؤول.');
      }
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setApiError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans text-right">
      <div className="max-w-md w-full space-y-6">
        
        {/* LOGO & TITLE */}
        <div className="text-center space-y-2">
          <img src={logoImg} alt="شرابية ستور" className="h-16 w-16 mx-auto rounded-xl object-cover shadow-lg border border-orange-500/30" />
          <h1 className="text-2xl font-bold text-white tracking-tight">شرابية ستور</h1>
          <p className="text-slate-400 text-xs">تسجيل دخول المسؤول لإدارة المتجر</p>
        </div>

        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-300 text-xs">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sharabia.com"
                  className="bg-slate-900/50 border-slate-800 text-white placeholder-slate-600 focus:border-orange-500 focus:ring-orange-500 text-right h-10.5"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300 text-xs">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-900/50 border-slate-800 text-white placeholder-slate-600 focus:border-orange-500 focus:ring-orange-500 text-right h-10.5"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-400 text-[10px] mt-1">{errors.password.message}</p>
                )}
              </div>

              {apiError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {apiError}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-bold bg-orange-600 hover:bg-orange-500 text-white cursor-pointer mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري التحقق...</span>
                  </span>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
