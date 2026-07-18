import * as React from "react"
import { Link } from "react-router-dom"
import { X, Layers, Flame, Utensils, PhoneCall, ChevronLeft } from "lucide-react"

export default function CategorySidebar({ isOpen, onClose }) {
  const categories = [
    {
      name: "أطقم حلل وأدوات طهي",
      id: "اطقم",
      description: "تشكيلة رائعة من أطقم الحلل والمقالي المتميزة لمطبخك واحتياجاتك.",
      icon: Layers,
      color: "text-orange-500 bg-orange-500/10"
    },
    {
      name: "أواني وأدوات بلدي",
      id: "بلدي",
      description: "أواني ألومنيوم بلدي أصيلة بجميع المقاسات.",
      icon: Flame,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      name: "رفايع وأدوات المطبخ",
      id: "رفايع",
      description: "حلل مفردة، مقالي، طاسات، وأدوات المطبخ المتنوعة.",
      icon: Utensils,
      color: "text-blue-500 bg-blue-500/10"
    }
  ]

  // Add event listener to close sidebar on ESC key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent body scrolling when open
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel (Slides in from the right) */}
      <aside
        className={`fixed top-0 right-0 h-full w-[320px] sm:w-[380px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out text-right ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">أقسام المنتجات</span>
            <span className="text-xs bg-orange-500/15 text-orange-400 font-bold px-2 py-0.5 rounded-full">شرابية ستور</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close categories sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Categories List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">اختر القسم للتسوق</p>
          
          <div className="space-y-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  onClick={onClose}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-orange-500/40 hover:bg-slate-800/85 transition-all duration-300"
                >
                  <div className={`p-3 rounded-lg ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors flex items-center gap-1 justify-between">
                      <span>{cat.name}</span>
                      <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-[-4px] transition-all" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar Footer / Contact Section */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <PhoneCall className="h-4.5 w-4.5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-200">تحتاج مساعدة في الطلب؟</h5>
                <p className="text-[10px] text-slate-400">تواصل معنا مباشرة عبر الواتساب</p>
              </div>
            </div>
            <a
              href="https://wa.me/201090600300"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-orange-505 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <span>تواصل واتساب</span>
            </a>
          </div>
          <div className="text-center mt-4 text-[10px] text-slate-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} شرابية ستور
          </div>
        </div>
      </aside>
    </>
  )
}
