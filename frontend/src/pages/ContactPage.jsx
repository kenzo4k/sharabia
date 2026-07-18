import * as React from 'react';
import { Phone, Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const whatsappNumber = '201121193709'; // Egyptian country code + number
  const whatsappMsg = encodeURIComponent('مرحباً شرابية ستور، أود الاستفسار عن بعض المنتجات.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans text-right space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">اتصل بنا</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          فريق خدمة العملاء جاهز لمساعدتك والإجابة على جميع استفساراتك على مدار الساعة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4 flex-row-reverse">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-800 text-xs">اتصال مباشر / واتساب</h3>
                <p className="text-slate-600 text-sm font-mono direction-ltr">01121193709</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4 flex-row-reverse">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-800 text-xs">البريد الإلكتروني</h3>
                <p className="text-slate-600 text-sm font-mono">info@sharabia.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4 flex-row-reverse">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-800 text-xs">ساعات العمل للدعم</h3>
                <p className="text-slate-600 text-xs">يومياً من الساعة 9:00 صباحاً وحتى 10:00 مساءً</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action card */}
        <Card className="border-slate-200 shadow-sm flex flex-col justify-between p-6 bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-0 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">تواصل مباشر عبر الواتساب 📲</h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              تعتبر محادثة الواتساب هي أسرع وسيلة للتواصل معنا. يمكنك طلب المنتجات مباشرة، تتبع الشحنات، أو تقديم شكاوى واستفسارات عامة.
            </p>
          </CardContent>
          
          <Button 
            variant="primary" 
            asChild
            className="w-full h-11 text-sm font-bold bg-green-600 hover:bg-green-500 text-white mt-6 cursor-pointer"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 flex-row-reverse">
              <MessageSquare className="h-4.5 w-4.5" />
              <span>محادثة واتساب مباشرة</span>
            </a>
          </Button>
        </Card>

      </div>

    </div>
  );
}
