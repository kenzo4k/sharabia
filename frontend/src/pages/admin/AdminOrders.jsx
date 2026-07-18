import * as React from 'react';
import { ClipboardList, ChevronDown, ChevronUp, MapPin, Phone, User, Calendar, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/shared/Loader';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [expandedOrderId, setExpandedOrderId] = React.useState(null);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/orders?page=${currentPage}&limit=10`);
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleRowExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('تم تحديث حالة الطلب بنجاح');
      
      // Update local state directly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('فشل في تحديث حالة الطلب');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_approval':
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200">بانتظار الموافقة</Badge>;
      case 'processing':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">جاري التجهيز</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">تم الشحن</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 border-green-200">تم التوصيل</Badge>;
      case 'succeeded':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-250">مكتمل ناجح</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">فاشل / ملغي</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans text-right">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-800">إدارة الطلبات</h1>
        <p className="text-slate-500 text-xs mt-1">تتبع الطلبات الواردة، تحديث حالتها، وتفاصيل تسليمها.</p>
      </div>

      {/* ORDERS LIST */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20"><Loader /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              لا توجد أي طلبات مسجلة حالياً في النظام.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4 w-10"></th>
                    <th className="p-4 text-right">رقم الطلب</th>
                    <th className="p-4 text-right">العميل</th>
                    <th className="p-4 text-right">الهاتف</th>
                    <th className="p-4 text-right">الإجمالي</th>
                    <th className="p-4 text-right">حالة الطلب</th>
                    <th className="p-4 text-right">التاريخ</th>
                    <th className="p-4 text-center">تحديث الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    return (
                      <React.Fragment key={order._id}>
                        {/* Summary Row */}
                        <tr 
                          onClick={() => toggleRowExpand(order._id)}
                          className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                        >
                          <td className="p-4 text-center">
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          </td>
                          <td className="p-4 font-semibold text-slate-800 font-mono">{order.orderNumber}</td>
                          <td className="p-4 text-slate-700">{order.customer.name}</td>
                          <td className="p-4 text-slate-700 font-mono">{order.customer.phone}</td>
                          <td className="p-4 font-bold text-orange-600">{order.total} جنيه</td>
                          <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                          <td className="p-4 text-slate-400 font-mono text-xs">
                            {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="px-2 py-1.5 border border-slate-200 rounded text-xs text-right bg-transparent focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                              <option value="pending_approval">بانتظار الموافقة</option>
                              <option value="processing">جاري التجهيز</option>
                              <option value="shipped">تم الشحن</option>
                              <option value="delivered">تم التوصيل</option>
                              <option value="succeeded">مكتمل ناجح</option>
                              <option value="failed">فاشل / ملغي</option>
                            </select>
                          </td>
                        </tr>

                        {/* Collapsible Details Row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/30">
                            <td colSpan={8} className="p-6 border-b border-slate-200">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                
                                {/* Customer Shipping Details */}
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 flex-row-reverse border-b border-slate-100 pb-2">
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    <span>بيانات التوصيل والتواصل</span>
                                  </h4>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                      <User className="h-3.5 w-3.5 text-slate-400" />
                                      <span>الاسم: {order.customer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                                      <span>الهاتف: {order.customer.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-2 flex-row-reverse">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                                      <span className="leading-relaxed">العنوان: {order.customer.address}</span>
                                    </div>
                                    {order.customer.email && (
                                      <div className="text-[10px] text-slate-400 font-mono text-right mt-1">
                                        الإيميل: {order.customer.email}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Order Calculation Details */}
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 flex-row-reverse border-b border-slate-100 pb-2">
                                    <ClipboardList className="h-4 w-4 text-orange-500" />
                                    <span>ملخص الحساب</span>
                                  </h4>
                                  <div className="space-y-2 text-xs text-slate-600">
                                    <div className="flex justify-between flex-row-reverse">
                                      <span>المجموع الفرعي:</span>
                                      <span className="font-medium">{order.subtotal} جنيه</span>
                                    </div>
                                    <div className="flex justify-between flex-row-reverse">
                                      <span>الشحن:</span>
                                      <span className="font-medium">{order.shippingCost === 0 ? 'مجاني' : `${order.shippingCost} جنيه`}</span>
                                    </div>
                                    <div className="flex justify-between flex-row-reverse">
                                      <span>الضريبة (8%):</span>
                                      <span className="font-medium">{order.tax} جنيه</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-slate-100 pt-2 flex-row-reverse">
                                      <span>الإجمالي الكلي:</span>
                                      <span className="text-orange-600">{order.total} جنيه</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Items Ordered List */}
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 flex-row-reverse border-b border-slate-100 pb-2">
                                    <ClipboardList className="h-4 w-4 text-orange-500" />
                                    <span>المنتجات المطلوبة ({order.items.length})</span>
                                  </h4>
                                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-3 border-b border-slate-50 pb-2 last:border-b-0 last:pb-0 flex-row-reverse">
                                        <div className="h-9 w-9 rounded overflow-hidden border border-slate-100 shrink-0">
                                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-xs space-y-0.5">
                                          <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                                          <p className="text-[10px] text-slate-400">
                                            المواصفات: {item.size} • {item.color}
                                          </p>
                                        </div>
                                        <div className="text-left text-xs font-bold text-slate-700">
                                          {item.quantity}x
                                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                                            {item.price * item.quantity} ج
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 flex-row-reverse border-b border-slate-100 pb-2">
                                      <ClipboardList className="h-4 w-4 text-orange-500" />
                                      <span>إجراءات إدارية سريعة</span>
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                                      تواصل مع العميل لتنسيق الدفع الخارجي، ثم اعتمد أو ألغِ الطلب.
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2 mt-4">
                                    <Button
                                      onClick={() => {
                                        const phone = order.customer.phone;
                                        const cleanPhone = phone.startsWith('0') ? '2' + phone : phone.startsWith('+') ? phone.replace('+', '') : phone;
                                        const message = `مرحباً ${order.customer.name}، لقد تلقينا طلبك رقم ${order.orderNumber} بقيمة ${order.total} جنيه من شرابية ستور. نود تأكيد تفاصيل الشحن وطريقة الدفع...`;
                                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                      }}
                                      variant="outline"
                                      className="w-full text-xs font-bold h-9 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                      <span>تواصل واتساب 📲</span>
                                    </Button>

                                    {order.orderStatus === 'pending_approval' && (
                                      <>
                                        <Button
                                          onClick={() => handleStatusChange(order._id, 'processing')}
                                          className="w-full text-xs font-bold h-9 bg-orange-600 hover:bg-orange-500 text-white cursor-pointer"
                                        >
                                          <span>الموافقة وتجهيز الطلب</span>
                                        </Button>
                                        <Button
                                          onClick={() => handleStatusChange(order._id, 'failed')}
                                          variant="ghost"
                                          className="w-full text-xs font-bold h-9 text-red-500 hover:bg-red-50 cursor-pointer"
                                        >
                                          <span>رفض وإلغاء الطلب ❌</span>
                                        </Button>
                                      </>
                                    )}

                                    {order.orderStatus !== 'pending_approval' && (
                                      <div className="flex gap-2">
                                        {order.orderStatus !== 'succeeded' && (
                                          <Button
                                            onClick={() => handleStatusChange(order._id, 'succeeded')}
                                            className="flex-1 text-xs font-bold h-9 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                          >
                                            <span>مكتمل ناجح</span>
                                          </Button>
                                        )}
                                        {order.orderStatus !== 'failed' && (
                                          <Button
                                            onClick={() => handleStatusChange(order._id, 'failed')}
                                            className="flex-1 text-xs font-bold h-9 bg-red-650 hover:bg-red-750 text-white cursor-pointer"
                                          >
                                            <span>فاشل / ملغي</span>
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 flex-row-reverse">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="cursor-pointer"
          >
            السابق
          </Button>
          <span className="text-slate-600 text-xs font-semibold">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="cursor-pointer"
          >
            التالي
          </Button>
        </div>
      )}

    </div>
  );
}
