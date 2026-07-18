import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ClipboardList, TrendingUp, ArrowLeft, Clock } from 'lucide-react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/shared/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    recentOrders: []
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products?limit=1000'),
          api.get('/orders?limit=10')
        ]);

        const products = productsRes.products || [];
        const orders = ordersRes.orders || [];

        // Total sales from paid or processing orders
        const sales = orders.reduce((sum, order) => sum + order.total, 0);

        setStats({
          totalProducts: products.length,
          totalOrders: ordersRes.pagination?.totalOrders || orders.length,
          totalSales: Math.round(sales),
          recentOrders: orders.slice(0, 5) // Show latest 5
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const statCards = [
    {
      title: 'إجمالي المبيعات',
      value: `${stats.totalSales} جنيه`,
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders,
      icon: ClipboardList,
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    },
    {
      title: 'عدد المنتجات بالمتجر',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">جاري التجهيز</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">تم الشحن</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 border-green-200">تم التوصيل</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-800">مرحباً بك في لوحة الإشراف</h1>
        <p className="text-slate-500 text-xs mt-1">نظرة عامة على نشاط متجرك وإحصاءات المبيعات.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between flex-row-reverse">
                <div className={`h-12 w-12 rounded-lg border ${card.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">{card.title}</p>
                  <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RECENT ORDERS TABLE */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center flex-row-reverse">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 flex-row-reverse">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>آخر الطلبات المستلمة</span>
            </h2>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1 flex-row-reverse">
              <span>عرض كل الطلبات</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                لا توجد طلبات مستلمة حالياً في النظام.
              </div>
            ) : (
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="pb-3 text-right">رقم الطلب</th>
                    <th className="pb-3 text-right">العميل</th>
                    <th className="pb-3 text-right">الهاتف</th>
                    <th className="pb-3 text-right">قيمة الطلب</th>
                    <th className="pb-3 text-right">حالة الطلب</th>
                    <th className="pb-3 text-right">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 font-semibold text-slate-800 font-mono">{order.orderNumber}</td>
                      <td className="py-3.5 text-slate-700">{order.customer.name}</td>
                      <td className="py-3.5 text-slate-700 font-mono">{order.customer.phone}</td>
                      <td className="py-3.5 font-bold text-orange-600">{order.total} جنيه</td>
                      <td className="py-3.5">{getStatusBadge(order.orderStatus)}</td>
                      <td className="py-3.5 text-slate-400 text-xs font-mono">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
