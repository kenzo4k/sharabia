import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export default function PolicyPage({ type }) {
  const getPolicyContent = () => {
    switch (type) {
      case 'shipping':
        return {
          title: 'سياسة الشحن والتوصيل',
          icon: Truck,
          content: (
            <div className="space-y-4">
              <p>يسعدنا في **شرابية ستور** توفير خدمة توصيل سريعة وموثوقة لجميع المحافظات المصرية.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">1. مدة وتكاليف التوصيل</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mr-4">
                <li>**القاهرة والجيزة:** التوصيل خلال 24 - 48 ساعة عمل. الشحن مجاني لجميع الطلبات.</li>
                <li>**الإسكندرية ومحافظات الدلتا والقناة:** التوصيل خلال 2 - 4 أيام عمل. الشحن مجاني.</li>
                <li>**محافظات الصعيد والحدودية:** التوصيل خلال 3 - 6 أيام عمل. الشحن مجاني.</li>
              </ul>
              <h3 className="font-bold text-slate-800 text-sm mt-4">2. الدفع عند الاستلام</h3>
              <p>نوفر خدمة **الدفع عند الاستلام** لجميع عملائنا. يمكنك فحص المنتجات والتأكد من مطابقتها للمواصفات والجودة المطلوبة قبل دفع ثمنها لمندوب الشحن.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">3. تأكيد الطلب</h3>
              <p>بمجرد إتمام طلبك، سيقوم فريق الدعم لدينا بالتواصل معك عبر واتساب لتأكيد العنوان وموعد التسليم قبل خروج الشحنة.</p>
            </div>
          )
        };
      case 'returns':
        return {
          title: 'سياسة الاستبدال والاسترجاع',
          icon: RotateCcw,
          content: (
            <div className="space-y-4">
              <p>نحرص في **شرابية ستور** على تقديم منتجات بأعلى مستويات الجودة، وإذا لم تكن راضياً تماماً عن منتجك، يسعدنا مساعدتك في استبداله أو استرجاعه.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">1. الشروط والأحكام</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mr-4">
                <li>فترة الاسترجاع أو الاستبدال هي **14 يوماً** من تاريخ استلام الطلب.</li>
                <li>يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، وبغلافه الأصلي كاملاً بدون أي تلف.</li>
                <li>يجب إرفاق فاتورة الشراء أو إثبات الطلب (رقم الطلب).</li>
              </ul>
              <h3 className="font-bold text-slate-800 text-sm mt-4">2. تكاليف الشحن عند الاسترجاع</h3>
              <p>إذا كان الاسترجاع بسبب عيب صناعة أو وصول منتج خاطئ، نتحمل نحن كافة تكاليف شحن الاسترجاع. وإذا كان الاسترجاع لرغبة العميل وبدون عيب في المنتج، يتحمل العميل تكلفة الشحن.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">3. كيفية بدء طلب الاسترجاع</h3>
              <p>تواصل معنا مباشرة عبر واتساب على الرقم **01121193709** مع تزويدنا برقم طلبك وصورة المنتج وسنقوم بجدولة مندوب لاستلام المنتج منك في أقرب وقت.</p>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'شروط الخدمة والاستخدام',
          icon: FileText,
          content: (
            <div className="space-y-4">
              <p>مرحباً بك في موقع **شرابية ستور**. يرجى قراءة شروط الخدمة هذه بعناية قبل استخدام موقعنا أو إجراء الطلبات.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">1. الشروط العامة</h3>
              <p>باستخدامك للموقع أو إتمام أي طلب شراء، فإنك توافق على الالتزام الكامل بشروط الاستخدام المذكورة هنا. نحتفظ بحق تعديل أو تغيير هذه الشروط في أي وقت دون إشعار مسبق.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">2. تفاصيل المنتجات والأسعار</h3>
              <p>نحاول توفير أقصى درجات الدقة في صور وأوصاف وأسعار المنتجات. جميع الأسعار المعروضة بالجنيه المصري وشاملة للضرائب المحلية. في حال حدوث خطأ غير مقصود في تسعير منتج، نحتفظ بالحق في إلغاء أو تعديل الطلب بعد التواصل مع العميل وتوضيح الأمر.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">3. إخلاء المسؤولية</h3>
              <p>جميع منتجاتنا مصنعة ومجهزة للاستخدام المنزلي والطهي العادي. يرجى اتباع إرشادات الغسيل والتنظيف الخاصة بكل نوع (ألومنيوم، جرانيت، تيفال) لضمان الحفاظ على سلامة المنتج وجودته.</p>
            </div>
          )
        };
      case 'privacy':
      default:
        return {
          title: 'سياسة الخصوصية وحماية البيانات',
          icon: ShieldCheck,
          content: (
            <div className="space-y-4">
              <p>نحن في **شرابية ستور** نولي سرية وحماية بيانات عملائنا أهمية قصوى. نوضح هنا كيفية التعامل مع بياناتك عند الشراء من متجرنا.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">1. البيانات التي نجمعها</h3>
              <p>عند إتمام طلب شراء، نقوم بجمع معلوماتك الأساسية الضرورية لإجراء الشحن والتواصل معك فقط، وتشمل:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mr-4">
                <li>الاسم بالكامل.</li>
                <li>رقم الهاتف (للتواصل عبر واتساب أو الاتصال المباشر).</li>
                <li>العنوان بالتفصيل (لتوصيل المنتج).</li>
              </ul>
              <h3 className="font-bold text-slate-800 text-sm mt-4">2. كيف نستخدم بياناتك؟</h3>
              <p>نستخدم بياناتك لتجهيز الطلبات وشحنها وتزويدك بتحديثات التوصيل. نحن **لا نقوم بمشاركة أو بيع بياناتك** لأي طرف ثالث بغرض التسويق، ونحتفظ بها بشكل آمن في قواعد بياناتنا المشفرة.</p>
              <h3 className="font-bold text-slate-800 text-sm mt-4">3. حقوقك وتحديث بياناتك</h3>
              <p>يمكنك في أي وقت طلب تعديل أو حذف بياناتك من سجلاتنا عن طريق التواصل مع فريق خدمة العملاء مباشرة عبر واتساب.</p>
            </div>
          )
        };
    }
  };

  const policy = getPolicyContent();
  const Icon = policy.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans text-right">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 md:p-10 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-4 flex-row-reverse border-b border-slate-100 pb-5">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{policy.title}</h1>
              <p className="text-slate-400 text-xs mt-1">تاريخ التحديث: يوليو 2026</p>
            </div>
          </div>

          {/* Render Policy Text */}
          <div className="text-slate-600 leading-relaxed text-sm space-y-4">
            {policy.content}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
