import * as React from 'react';
import { Link } from 'react-router-dom';
import { Award, Flame, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/logo.png.jpg';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-right font-sans">
      
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <img src={logoImg} alt="شرابية ستور" className="h-20 w-20 mx-auto rounded-2xl object-cover shadow-md border border-orange-500/20" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">من نحن — شرابية ستور</h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          نسعى جاهدين لتقديم أفضل وأحدث مستلزمات المطبخ والأطقم الفاخرة التي تجمع بين الجودة العالية والجمال الشرقي الأصيل.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-4 leading-relaxed text-sm text-slate-600">
          <h2 className="text-xl font-bold text-slate-800">قصتنا وشغفنا بالطهي</h2>
          <p>
            تأسس متجر **شرابية ستور** ليكون الوجهة الأولى لكل عائلة تبحث عن التميز والراحة في تحضير أشهى المأكولات. نحن نؤمن بأن المطبخ هو قلب المنزل، وأن استخدام الأدوات المناسبة يجعل من الطهي تجربة ممتعة لا تُنسى.
          </p>
          <p>
            بدأنا بفكرة بسيطة: توفير حلل وأطقم طهي بلدي وافرنجي معمرة، مصنعة من مواد مطابقة لأعلى المعايير الصحية والبيئية، وتقديمها بأسعار ممتازة وتنافسية تناسب جميع البيوت المصرية.
          </p>
        </div>
        <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
          <img 
            src="https://picsum.photos/id/1060/600/400" 
            alt="شرابية ستور" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-xl text-center space-y-3 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">جودة مضمونة</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            نحن نختار كل منتج بعناية فائقة ونختبره للتأكد من متانته وقدرته على تحمل الاستخدام اليومي لسنوات.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-xl text-center space-y-3 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <Flame className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">أصالة وتنوع</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            نوفر تشكيلة واسعة تناسب المطبخ البلدي التقليدي والأكلات العصرية بمقاسات ومواصفات متعددة.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-xl text-center space-y-3 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">رضا العملاء</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            خدمتكم وسعادتكم هي هدفنا الأساسي. نوفر شحناً سريعاً ودعماً مباشراً عبر واتساب لتلبية جميع احتياجاتكم.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Button variant="primary" asChild className="cursor-pointer">
          <Link to="/shop" className="flex items-center justify-center gap-2 flex-row-reverse mx-auto">
            <span>تصفح تشكيلتنا الآن</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

    </div>
  );
}
