import * as React from "react"
import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Mail, HelpCircle, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Footer() {

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800 mt-auto text-slate-400">
      
      {/* MOCK VALUE PROPS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-800 text-sm">
        <div className="flex items-center space-x-3 space-x-reverse justify-center md:justify-start">
          <Truck className="h-6 w-6 text-secondary ml-3" />
          <div>
            <h4 className="font-semibold text-white text-right">شحن سريع</h4>
            <p className="text-xs text-right">شحن سريع لكافة المحافظات والدفع عند الاستلام.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse justify-center">
          <Shield className="h-6 w-6 text-secondary ml-3" />
          <div>
            <h4 className="font-semibold text-white text-right">طلب سهل وآمن</h4>
            <p className="text-xs text-right">أكمل طلبك في ثوانٍ وتواصل معنا مباشرة عبر واتساب.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse justify-center md:justify-end">
          <HelpCircle className="h-6 w-6 text-secondary ml-3" />
          <div>
            <h4 className="font-semibold text-white text-right">ضمان الجودة الفائقة</h4>
            <p className="text-xs text-right">أدوات منزلية مختارة بعناية ومصممة لتدوم طويلاً.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        
        {/* About column */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white font-bold text-lg tracking-tight">شرابية ستور</h3>
          <p className="text-sm leading-relaxed">
            نوفر أفضل وأرقى الأدوات المنزلية والأطقم البلدي والافرنجي التي تجمع بين الأصالة والجودة العالية والتصميم الفاخر لمطبخك.
          </p>
          <div className="flex space-x-4 space-x-reverse">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors ml-4">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors ml-4">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links column */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">أقسام المتجر</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">كل المنتجات</Link>
            </li>
            <li>
              <Link to="/shop?category=بلدي" className="hover:text-white transition-colors">بلدي</Link>
            </li>
            <li>
              <Link to="/shop?category=اطقم" className="hover:text-white transition-colors">أطقم</Link>
            </li>
            <li>
              <Link to="/shop?category=رفايع" className="hover:text-white transition-colors">رفايع</Link>
            </li>
          </ul>
        </div>

        {/* Support column */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">خدمة العملاء</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shipping-policy" className="hover:text-white transition-colors">سياسة الشحن والتوصيل</Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white transition-colors">الاستبدال والاسترجاع</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition-colors">شروط الخدمة والاستخدام</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية وحماية البيانات</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">اتصل بنا</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-slate-950 py-6 border-t border-slate-900 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-slate-500">
          <p>&copy; {new Date().getFullYear()} شرابية ستور. جميع الحقوق محفوظة.</p>
          <div className="flex space-x-6 space-x-reverse">
            <Link to="/privacy" className="hover:underline ml-6">الخصوصية</Link>
            <Link to="/terms" className="hover:underline ml-6">الشروط</Link>
            <Link to="/contact" className="hover:underline ml-6">اتصل بنا</Link>
            <Link to="/admin/login" className="hover:underline">دخول المسؤول</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
