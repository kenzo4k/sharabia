import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ShoppingCart, Menu, Search, Flame, Layers, User, LogOut, LayoutDashboard } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import logoImg from "@/assets/logo.png.jpg"

export default function Navbar({ onToggleSidebar }) {
  const { cartCount } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchVal, setSearchVal] = React.useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "كل المنتجات", path: "/shop" },
    { name: "من نحن", path: "/about" },
    { name: "اتصل بنا", path: "/contact" }
  ]

  const getLinkClass = (link, isMobile = false) => {
    let isActive = false
    
    if (link.path === "/") {
      isActive = location.pathname === "/"
    } else if (link.path === "/shop") {
      isActive = location.pathname === "/shop"
    } else {
      isActive = location.pathname === link.path
    }
    
    const inactiveColor = isMobile ? "text-slate-600 hover:text-secondary" : "text-gray-300 hover:text-secondary"
    return isActive
      ? "text-secondary font-bold transition-colors"
      : `${inactiveColor} transition-colors`
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`)
    } else {
      navigate(`/shop`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#0F172A] border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 text-white group">
          <img src={logoImg} className="h-9 w-9 rounded-lg object-cover border border-secondary/50 shadow-md ml-2" alt="شرابية ستور" />
          <span className="text-xl font-bold tracking-tight text-white">
            شرابية{" "}<span className="text-secondary">ستور</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-sm font-medium mr-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className={getLinkClass(link, false)}>
              {link.name}
            </Link>
          ))}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 text-gray-300 hover:text-secondary cursor-pointer transition-colors font-medium"
          >
            <Layers className="h-4 w-4 text-orange-400" />
            <span>الأقسام</span>
          </button>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* SEARCH BAR (DESKTOP) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative ml-2">
            <input
              type="text"
              placeholder="ابحث هنا عن المنتجات..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-slate-800/80 text-white placeholder-slate-400 text-xs px-3.5 py-1.5 pr-8 rounded-full border border-slate-700 focus:outline-none focus:border-secondary focus:bg-slate-900 text-right w-48 transition-all"
            />
            <Search className="absolute right-2.5 h-3.5 w-3.5 text-gray-400" />
          </form>

          {/* USER ACCOUNT */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 flex-row-reverse text-xs">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs font-semibold bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                  title="لوحة التحكم"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">لوحة التحكم</span>
                </Link>
              )}
              
              <Link
                to="/profile"
                className="text-xs font-bold text-gray-300 hover:text-secondary transition-colors flex items-center gap-2 flex-row-reverse"
              >
                <div className="h-7 w-7 rounded-full bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center font-bold text-[10px] uppercase">
                  {user?.name ? user.name.slice(0, 2) : 'ح'}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">{user?.name}</span>
              </Link>
              
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-gray-450 hover:text-red-400 p-1.5 rounded-full transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-row-reverse">
              <Link
                to="/login"
                className="text-xs font-semibold text-gray-300 hover:text-secondary px-3 py-1.5 rounded-full border border-gray-700 hover:border-secondary transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" />
                <span>تسجيل الدخول</span>
              </Link>
              
              <Link
                to="/admin/login"
                className="hidden lg:inline text-[10px] font-semibold text-gray-550 hover:text-gray-350 transition-colors"
              >
                دخول المسؤول
              </Link>
            </div>
          )}

          {/* CART BADGE */}
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-secondary transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center animate-bounce shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-gray-300 hover:text-secondary cursor-pointer hover:bg-slate-800 rounded transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="bg-bg text-text-primary border-l border-border-subtle text-right">
          <div className="flex flex-col space-y-6 pt-10">
            <Link 
              to="/" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-2 space-x-reverse text-text-primary mb-6"
            >
              <img src={logoImg} className="h-8 w-8 rounded-lg object-cover" alt="شرابية ستور" />
              <span className="text-lg font-bold tracking-tight">شرابية ستور</span>
            </Link>

            {/* MOBILE SEARCH BAR */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="flex items-center relative w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-slate-100 text-text-primary placeholder-slate-400 text-xs px-3.5 py-2.5 pr-8 rounded-lg border border-border-subtle focus:outline-none focus:border-secondary w-full text-right"
              />
              <Search className="absolute right-2.5 h-4 w-4 text-gray-400" />
            </form>
            
            <nav className="flex flex-col space-y-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setMobileOpen(false)}
                  className={getLinkClass(link, true)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onToggleSidebar();
                }}
                className="flex items-center gap-2 text-slate-600 hover:text-secondary transition-colors font-medium text-right cursor-pointer w-fit"
              >
                <Layers className="h-5 w-5 text-orange-400" />
                <span>تصفح الأقسام</span>
              </button>
            </nav>

            <div className="border-t border-border-subtle/50 pt-6 space-y-3">
              <Button 
                variant="secondary" 
                className="w-full font-bold cursor-pointer"
                onClick={() => setMobileOpen(false)}
                asChild
              >
                <Link to="/shop">تسوق الآن</Link>
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full font-bold border-slate-300 hover:border-secondary cursor-pointer text-text-primary hover:text-secondary flex justify-center gap-2 items-center"
                    onClick={() => setMobileOpen(false)}
                    asChild
                  >
                    <Link to="/profile" className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      <span>حسابي ({user?.name})</span>
                    </Link>
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full font-bold border-orange-500/30 text-orange-500 hover:bg-orange-50 cursor-pointer flex justify-center gap-2 items-center"
                      onClick={() => setMobileOpen(false)}
                      asChild
                    >
                      <Link to="/admin" className="flex items-center justify-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full font-bold text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer flex justify-center gap-2 items-center"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full font-bold border-slate-300 hover:border-secondary cursor-pointer text-text-primary hover:text-secondary flex justify-center gap-2 items-center"
                    onClick={() => setMobileOpen(false)}
                    asChild
                  >
                    <Link to="/login" className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      <span>تسجيل الدخول</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full font-bold text-slate-405 hover:text-slate-605 cursor-pointer flex justify-center gap-2 items-center text-xs"
                    onClick={() => setMobileOpen(false)}
                    asChild
                  >
                    <Link to="/admin/login">دخول المسؤول</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
