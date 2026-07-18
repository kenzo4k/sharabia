import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Sparkles, Flame, ShieldCheck, Award } from "lucide-react"
import api from "@/services/api"
import ProductGrid from "@/components/product/ProductGrid"
import { Button } from "@/components/ui/button"
import cookwareSliderImg from "@/assets/cookware_slider.png"
import traditionalCookwareSliderImg from "@/assets/traditional_cookware_slider.png"
import kitchenUtensilsSliderImg from "@/assets/kitchen_utensils_slider.png"
import HeroSlider from "@/components/shared/HeroSlider"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const slides = [
    {
      image: cookwareSliderImg,
      badge: "أطقم حلل فاخرة",
      title: "أطقم طهي متكاملة لمطبخك",
      description: "اكتشف تشكيلتنا المتميزة من أطقم الحلل والمقالي ذات الجودة الفائقة والتصميم العصري المناسب لكل منزل.",
      buttonText: "تصفح أطقم الطهي",
      buttonLink: "/shop?category=اطقم"
    },
    {
      image: traditionalCookwareSliderImg,
      badge: "أدوات طهي بلدي أصيلة",
      title: "أواني ألومنيوم بلدي بلمسة عصرية",
      description: "صناعة مصرية بلدي متينة تدوم لسنوات طويلة. تلبي كل احتياجات الطهي الشرقي الأصيل بجميع المقاسات.",
      buttonText: "استكشف الأواني البلدي",
      buttonLink: "/shop?category=بلدي"
    },
    {
      image: kitchenUtensilsSliderImg,
      badge: "رفايع وأدوات المطبخ",
      title: "كل ما تحتاجه لتسهيل الطهي",
      description: "مجموعة متكاملة من رفايع المطبخ، المقالي المنفردة، الطاسات، وأدوات المطبخ اليومية بأسعار رائعة.",
      buttonText: "تسوق رفايع المطبخ",
      buttonLink: "/shop?category=رفايع"
    }
  ]

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.get("/products")
        // Filter featured items
        const featured = (data.products || []).filter(p => p.isFeatured)
        setFeaturedProducts(featured.slice(0, 4)) // Take top 4 featured
      } catch (err) {
        console.error("Error fetching featured products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    {
      name: "أطقم حلل وأدوات طهي كاملة",
      categoryName: "اطقم",
      description: "تشكيلة رائعة من أطقم الحلل والمقالي المتميزة لمطبخك واحتياجاتك.",
      image: "https://picsum.photos/id/1025/600/400",
      path: "/shop?category=اطقم"
    },
    {
      name: "رفايع وأدوات المطبخ المتنوعة",
      categoryName: "رفايع",
      description: "حلل مفردة، مقالي، طاسات، وأدوات طهي بلدي وافرنجي أساسية لكل مطبخ.",
      image: "https://picsum.photos/id/1060/600/400",
      path: "/shop?category=رفايع"
    }
  ]

  return (
    <div className="space-y-20 pb-20 animate-fade-in text-right">
      
      {/* HERO SLIDER SECTION */}
      <HeroSlider slides={slides} />

      {/* SLIDER BANNER TICKER */}
      <section className="bg-surface border-y border-border-subtle/50 py-4 overflow-hidden relative">
        <div className="flex w-max gap-8 whitespace-nowrap">
          <div className="flex gap-16 text-lg font-extrabold text-secondary tracking-wide select-none animate-marquee">
            <span>🔥 عروض قوية وحصرية</span>
            <span>🏠 أدوات منزلية لكل بيت</span>
            <span>💰 خصومات تصل إلى 50%</span>
            <span>🔥 عروض قوية وحصرية</span>
            <span>🏠 أدوات منزلية لكل بيت</span>
            <span>💰 خصومات تصل إلى 50%</span>
            <span>🔥 عروض قوية وحصرية</span>
            <span>🏠 أدوات منزلية لكل بيت</span>
            <span>💰 خصومات تصل إلى 50%</span>
            <span>🔥 عروض قوية وحصرية</span>
            <span>🏠 أدوات منزلية لكل بيت</span>
            <span>💰 خصومات تصل إلى 50%</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES CARD LINKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">تسوق حسب القسم</h2>
          <p className="text-text-secondary text-sm mt-2">استكشف مجموعاتنا الرائعة المصممة خصيصاً لاحتياجات مطبخك.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={cat.path} 
              className="group relative rounded-lg border border-border-subtle bg-surface hover:border-secondary overflow-hidden transition-all duration-300 flex flex-col h-85 shadow-sm"
            >
              {/* Image backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Content overlay */}
              <div className="relative z-20 mt-auto p-6 flex flex-col space-y-2 text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">تشكيلات</span>
                <h3 className="text-xl font-bold text-text-primary group-hover:text-secondary-light transition-colors">{cat.name}</h3>
                <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUE HIGHLIGHTS BANNER */}
      <section className="bg-surface/50 border-y border-border-subtle/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2 shadow-bronze">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-base">جودة فائقة وممتازة</h3>
            <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
              منتجات ألومنيوم قوية، أطقم حلل فاخرة ومواد معمرة مطابقة لأعلى المعايير.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2 shadow-bronze">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-base">تصميم فاخر وجذاب</h3>
            <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
              تفاصيل ذهبية عصرية وألوان أنيقة تناسب ديكور مطبخك وتمنحه مظهراً رائعاً.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2 shadow-bronze">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-base">طلب مباشر وسريع</h3>
            <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
              أكمل طلبك بكبسة زر وتواصل معنا مباشرة عبر واتساب مع الدفع عند الاستلام.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline sm:justify-between border-b border-border-subtle/30 pb-4 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">منتجاتنا المميزة</h2>
            <p className="text-text-secondary text-sm mt-1">الأكثر مبيعاً وطلباً بين عملائنا.</p>
          </div>
          <Link to="/shop" className="text-secondary hover:text-secondary-light font-bold text-sm flex items-center space-x-1 space-x-reverse hover:underline">
            <span>عرض جميع المنتجات</span>
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={loading} count={4} />
      </section>

    </div>
  )
}
