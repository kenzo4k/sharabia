import * as React from 'react';
import { 
  TrendingUp, Coins, Users, ShoppingBag, Eye, ShoppingCart, 
  CreditCard, Plus, X, Percent, Megaphone, Calendar 
} from 'lucide-react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/shared/Loader';
import { toast } from 'sonner';

export default function AdminTraffic() {
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState(7);
  const [data, setData] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('health');

  // Ad Spend Form State
  const [spendForm, setSpendForm] = React.useState({
    channel: 'facebook',
    spend: '',
    impressions: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/report?days=${timeRange}`);
      setData(res.report || null);
    } catch (err) {
      console.error(err);
      toast.error('فشل في تحميل الإحصاءات والتقارير');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSpendInputChange = (e) => {
    const { name, value } = e.target;
    setSpendForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSpendSubmit = async (e) => {
    e.preventDefault();
    if (!spendForm.spend || spendForm.spend === '') {
      toast.error('الرجاء إدخال قيمة الإنفاق');
      return;
    }

    try {
      await api.post('/analytics/ad-spend', {
        ...spendForm,
        spend: Number(spendForm.spend),
        impressions: Number(spendForm.impressions || 0)
      });
      toast.success('تم حفظ التكلفة الإعلانية بنجاح');
      setIsModalOpen(false);
      // Reset form
      setSpendForm({
        channel: 'facebook',
        spend: '',
        impressions: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'فشلت العملية');
    }
  };

  if (loading && !data) {
    return <div className="py-20"><Loader /></div>;
  }

  const { businessHealth, marketingEfficiency, funnel } = data || {
    businessHealth: {},
    marketingEfficiency: [],
    funnel: []
  };

  // Convert Funnel count array to structured funnel percentages
  const funnelSteps = funnel.map((step, idx) => {
    const prevCount = idx === 0 ? step.count : funnel[idx - 1].count;
    const dropoff = prevCount > 0 ? Math.round((1 - (step.count / prevCount)) * 100) : 0;
    const totalRetention = funnel[0]?.count > 0 ? Math.round((step.count / funnel[0].count) * 100) : 0;

    return {
      ...step,
      dropoff: idx === 0 ? 0 : dropoff,
      retention: totalRetention
    };
  });

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">تحليلات حركة المرور والمبيعات</h1>
          <p className="text-slate-500 text-xs mt-1">مراقبة الأداء المالي والقنوات التسويقية وتجربة العملاء.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector */}
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="px-3 h-10 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-orange-500"
          >
            <option value={7}>آخر 7 أيام</option>
            <option value={30}>آخر 30 يوم</option>
            <option value={90}>آخر 90 يوم</option>
          </select>

          <Button 
            variant="outline" 
            onClick={() => setIsModalOpen(true)}
            className="border-slate-200 text-slate-600 hover:text-orange-600 font-bold h-10 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>تسجيل تكاليف التسويق</span>
          </Button>
        </div>
      </div>

      {/* DASHBOARDS TABS SELECTION */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('health')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'health' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          صحة الأعمال (المالية)
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'marketing' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          كفاءة التسويق (القنوات)
        </button>
        <button
          onClick={() => setActiveTab('funnel')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'funnel' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          مسار التحويل (Funnel)
        </button>
      </div>

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : (
        <>
          {/* TAB 1: BUSINESS HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Coins className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold text-right">إجمالي المبيعات</p>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1">{businessHealth.totalRevenue || 0} جنيه</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold text-right">متوسط قيمة الطلب (AOV)</p>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1">{businessHealth.aov || 0} جنيه</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Percent className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold text-right">معدل التحويل العام</p>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1">{businessHealth.conversionRate || 0}%</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-500 font-semibold text-right">نشط الآن (الزوار)</p>
                      <div className="flex items-center gap-1.5 justify-end mt-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-800">{businessHealth.activeUsers || 0} زوار</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SECONDARY KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">مؤشرات الجودة المالية</h3>
                  <div className="divide-y divide-slate-100">
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-600 text-sm">متوسط القطع بالطلب الواحد</span>
                      <span className="text-slate-800 font-bold">{businessHealth.itemsPerOrder || 0} قطع / طلب</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-600 text-sm">معدل فشل / إلغاء الدفع والطلبات</span>
                      <span className="text-red-500 font-bold">{businessHealth.cancellationRate || 0}%</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-slate-600 text-sm">إجمالي عدد الطلبات المدفوعة</span>
                      <span className="text-slate-800 font-bold">{businessHealth.totalOrders || 0} طلبات</span>
                    </div>
                  </div>
                </Card>

                <Card className="border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <TrendingUp className="h-10 w-10 text-orange-500" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">استقرار الصحة التجارية</h4>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs leading-relaxed">
                      يعتمد معدل التحويل العام على الزوار الفريدين المسجلين خلال الـ {timeRange} يوماً الماضية مقارنة بالطلبات المدفوعة.
                    </p>
                  </div>
                </Card>
              </div>

            </div>
          )}

          {/* TAB 2: MARKETING EFFICIENCY */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              
              {/* CAMPAIGN ATTRIBUTION GRID */}
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="p-4">القناة التسويقية</th>
                          <th className="p-4 text-center">النقرات (الزيارات)</th>
                          <th className="p-4 text-center">المشاهدات (الظهور)</th>
                          <th className="p-4 text-center">نسبة النقر (CTR)</th>
                          <th className="p-4 text-center">الإنفاق الإعلاني</th>
                          <th className="p-4 text-center">المبيعات المحققة</th>
                          <th className="p-4 text-center">التحويلات (الطلبات)</th>
                          <th className="p-4 text-center">تكلفة الاستحواذ (CPA)</th>
                          <th className="p-4 text-center">العائد الإعلاني (ROAS)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {marketingEfficiency.map((item) => (
                          <tr key={item.channel} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-800 capitalize">
                              {item.channel === 'google' && 'جوجل (Google Ads)'}
                              {item.channel === 'facebook' && 'فيسبوك (Facebook Ads)'}
                              {item.channel === 'email' && 'البريد الإلكتروني (Email)'}
                              {item.channel === 'direct' && 'مباشر (Direct/Organic)'}
                            </td>
                            <td className="p-4 text-center font-mono">{item.clicks}</td>
                            <td className="p-4 text-center font-mono">{item.impressions || '—'}</td>
                            <td className="p-4 text-center font-mono text-slate-600">{item.ctr > 0 ? `${item.ctr}%` : '—'}</td>
                            <td className="p-4 text-center font-mono font-bold text-slate-800">{item.spent} جنيه</td>
                            <td className="p-4 text-center font-mono font-bold text-orange-600">{item.revenue} جنيه</td>
                            <td className="p-4 text-center font-mono text-slate-600">{item.conversions}</td>
                            <td className="p-4 text-center font-mono text-slate-600">
                              {item.cpa > 0 ? `${item.cpa} جنيه` : '—'}
                            </td>
                            <td className="p-4 text-center">
                              {item.roas > 0 ? (
                                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                  item.roas >= 4 ? 'bg-green-50 text-green-700' : 
                                  item.roas >= 2 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                }`}>
                                  {item.roas}x
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* INFORMATION WIDGET */}
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-start gap-3">
                <Megaphone className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>نصيحةattribution:</strong> يتم إسناد القنوات التسويقية عبر تتبع المعامل <code>?utm_source=channel_name</code> في الرابط الخاص بالمتجر. على سبيل المثال، قم بإدراج <code>?utm_source=facebook</code> في روابط إعلانات فيسبوك ليقوم النظام بجدولة مبيعات وعملاء هذا الإعلان تلقائياً وحساب عائد الإنفاق بدقة.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: FUNNEL ON-SITE EXPERIENCE */}
          {activeTab === 'funnel' && (
            <div className="space-y-6">
              
              {/* VISUAL FUNNEL */}
              <Card className="border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="font-bold text-slate-800 text-sm">مسار إتمام عمليات الشراء (التحويل)</h3>

                <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
                  {funnelSteps.map((step, idx) => {
                    // Width of bar decreases as funnel goes deeper
                    const widthPercent = funnelSteps[0].count > 0 ? (step.count / funnelSteps[0].count) * 100 : 0;
                    
                    return (
                      <div key={step.name} className="space-y-1.5">
                        <div className="flex justify-between items-baseline text-xs font-semibold">
                          <span className="text-slate-800">{step.name}</span>
                          <span className="font-mono text-slate-600 flex gap-2">
                            <span>{step.count} زائر</span>
                            {idx > 0 && (
                              <span className="text-red-500 font-bold">({step.dropoff}% تسرب)</span>
                            )}
                          </span>
                        </div>
                        <div className="h-7 w-full bg-slate-100 rounded-lg overflow-hidden relative">
                          <div 
                            style={{ width: `${Math.max(4, widthPercent)}%` }}
                            className={`h-full transition-all duration-1000 ${
                              idx === 4 ? 'bg-orange-600' :
                              idx === 3 ? 'bg-orange-500' :
                              idx === 2 ? 'bg-amber-500' :
                              idx === 1 ? 'bg-amber-400' : 'bg-slate-700'
                            }`}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-white font-bold">
                            {step.retention}% بقاء
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* FUNNEL ANNOTATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-slate-200 shadow-sm p-4 space-y-2 text-center">
                  <Eye className="h-6 w-6 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-700">اهتمام بالمنتجات</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    نسبة الزوار الذين انتقلوا من الصفحة الرئيسية إلى تصفح صفحة منتج واحد على الأقل.
                  </p>
                </Card>
                <Card className="border-slate-200 shadow-sm p-4 space-y-2 text-center">
                  <ShoppingCart className="h-6 w-6 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-700">التخلي عن السلة</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    احرص على تقليل الخطوات في السلة وعرض تكاليف واضحة لتجنب خروج الزوار قبل الشراء.
                  </p>
                </Card>
                <Card className="border-slate-200 shadow-sm p-4 space-y-2 text-center">
                  <CreditCard className="h-6 w-6 text-orange-600 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-700">إتمام الطلب</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    تأكيد إرسال الطلب وإصدار كود المتابعة لفتح محادثة واتساب للتأكيد الفعلي.
                  </p>
                </Card>
              </div>

            </div>
          )}
        </>
      )}

      {/* AD SPEND INPUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 text-right space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">تسجيل التكلفة الإعلانية</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSpendSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="channel">القناة الإعلانية</Label>
                <select
                  id="channel"
                  name="channel"
                  value={spendForm.channel}
                  onChange={handleSpendInputChange}
                  className="w-full px-3 h-10.5 border border-slate-200 rounded-lg text-sm text-right bg-white focus:outline-none focus:border-orange-500"
                >
                  <option value="facebook">فيسبوك (Facebook Ads)</option>
                  <option value="google">جوجل (Google Ads)</option>
                  <option value="email">البريد الإلكتروني / النشرة</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="spend">قيمة الإنفاق (جنيه) <span className="text-red-500">*</span></Label>
                <Input 
                  id="spend" 
                  name="spend" 
                  type="number"
                  value={spendForm.spend} 
                  onChange={handleSpendInputChange} 
                  placeholder="500" 
                  className="text-right"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="impressions">عدد مرات الظهور (Impressions - اختياري)</Label>
                <Input 
                  id="impressions" 
                  name="impressions" 
                  type="number"
                  value={spendForm.impressions} 
                  onChange={handleSpendInputChange} 
                  placeholder="25000" 
                  className="text-right"
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date">التاريخ</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date"
                  value={spendForm.date} 
                  onChange={handleSpendInputChange} 
                  className="text-right"
                  required
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 justify-start pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold h-11 px-6 cursor-pointer"
                >
                  حفظ البيانات
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-200 text-slate-500 hover:bg-slate-50 h-11 px-6 cursor-pointer"
                >
                  إلغاء
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
