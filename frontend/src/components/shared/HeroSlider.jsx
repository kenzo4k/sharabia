import * as React from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSlider({ slides = [], autoPlayInterval = 5000 }) {
  const [current, setCurrent] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    if (slides.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)
    return () => clearInterval(timer)
  }, [slides.length, autoPlayInterval, isHovered])

  if (!slides || slides.length === 0) return null

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div 
      className="relative w-full h-[450px] sm:h-[520px] md:h-[600px] overflow-hidden bg-slate-950 group select-none text-right"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/10 z-10"></div>
            
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[8000ms] ease-out"
            />

            {/* Slide Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl text-center flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 space-x-reverse bg-orange-500/10 border border-orange-500/30 rounded-full px-3.5 py-1.5 text-xs font-bold text-orange-400 mb-6 shadow-sm backdrop-blur-md animate-fade-in">
                  <span>✨ {slide.badge || "أدوات منزلية راقية"}</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
                  {slide.title}
                </h2>
                
                <p className="text-slate-300 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed drop-shadow">
                  {slide.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto h-12 text-base font-bold cursor-pointer" asChild>
                    <Link to={slide.buttonLink} className="flex items-center justify-center space-x-2 space-x-reverse">
                      <span>{slide.buttonText}</span>
                      <ArrowLeft className="h-4.5 w-4.5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/40 hover:bg-orange-500 text-white hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none cursor-pointer border border-slate-700/50 hover:border-orange-500"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/40 hover:bg-orange-500 text-white hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none cursor-pointer border border-slate-700/50 hover:border-orange-500"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === current ? "w-8 bg-orange-500" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
