import * as React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, LogOut, ArrowRight, Store, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { isAdmin, loading, logout, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <Loader fullPage={true} />;
  }

  if (!isAdmin) {
    return null;
  }

  const navLinks = [
    { name: 'الرئيسية', path: '/admin', icon: LayoutDashboard },
    { name: 'المنتجات', path: '/admin/products', icon: ShoppingBag },
    { name: 'الطلبات', path: '/admin/orders', icon: ClipboardList },
    { name: 'حركة المرور', path: '/admin/traffic', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row-reverse text-right font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-l border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          
          {/* Logo & Admin Status */}
          <div className="flex items-center justify-between flex-row-reverse pb-6 border-b border-slate-800">
            <Link to="/admin" className="flex items-center space-x-2 space-x-reverse text-white">
              <span className="text-lg font-bold tracking-tight text-white">
                لوحة <span className="text-orange-500">التحكم</span>
              </span>
            </Link>
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] px-2 py-0.5 rounded font-bold">
              مسؤول
            </span>
          </div>

          {/* Welcome Info */}
          <div className="text-slate-400 text-xs">
            مرحباً بك، <span className="text-white font-semibold">{user?.name || 'المدير'}</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex-row-reverse cursor-pointer ${
                      isActive
                        ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="pt-6 border-t border-slate-800 space-y-3 mt-8 md:mt-0">
          
          {/* View Live Store */}
          <Button
            variant="outline"
            className="w-full h-10 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 text-xs font-medium cursor-pointer"
            asChild
          >
            <Link to="/" className="flex items-center justify-center gap-2 flex-row-reverse">
              <Store className="h-4 w-4" />
              <span>الذهاب للمتجر</span>
            </Link>
          </Button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 flex-row-reverse cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
