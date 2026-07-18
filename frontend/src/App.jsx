import * as React from "react"
import { Routes, Route, Outlet } from "react-router-dom"

// Layouts
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import AdminLayout from "@/components/layout/AdminLayout"
import CategorySidebar from "@/components/layout/CategorySidebar"
import { Layers } from "lucide-react"

// Storefront Pages
import HomePage from "@/pages/HomePage"
import ShopPage from "@/pages/ShopPage"
import ProductDetailPage from "@/pages/ProductDetailPage"
import CartPage from "@/pages/CartPage"
import CheckoutPage from "@/pages/CheckoutPage"
import OrderSuccessPage from "@/pages/OrderSuccessPage"
import AboutPage from "@/pages/AboutPage"
import PolicyPage from "@/pages/PolicyPage"
import ContactPage from "@/pages/ContactPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProfilePage from "@/pages/ProfilePage"

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminProducts from "@/pages/admin/AdminProducts"
import AdminOrders from "@/pages/admin/AdminOrders"
import AdminTraffic from "@/pages/admin/AdminTraffic"

// Shared
import NotFoundPage from "@/components/shared/NotFoundPage"
import TrafficTracker from "@/components/shared/TrafficTracker"

// Nested Layout for Storefront
function StorefrontLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary">
      {/* Client Analytics Tracker */}
      <TrafficTracker />

      {/* GLOBAL NAVBAR */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col w-full relative">
        <Outlet />
      </main>

      {/* GLOBAL CATEGORY SIDEBAR */}
      <CategorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* FLOATING ACTION TAB FOR CATEGORIES */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 px-2 rounded-l-xl shadow-2xl border-y border-l border-slate-750 hover:border-orange-500 transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer group"
        title="تصفح الأقسام"
        aria-label="Open categories sidebar"
      >
        <Layers className="h-5 w-5 text-orange-400 group-hover:text-white group-hover:scale-110 transition-all" />
        <span className="text-[10px] [writing-mode:vertical-rl] tracking-widest font-bold">الأقسام</span>
      </button>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Admin Pages (No storefront Navbar/Footer) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="traffic" element={<AdminTraffic />} />
      </Route>

      {/* Storefront Layout Wrapper */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Static Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="shipping-policy" element={<PolicyPage type="shipping" />} />
        <Route path="returns" element={<PolicyPage type="returns" />} />
        <Route path="terms" element={<PolicyPage type="terms" />} />
        <Route path="privacy" element={<PolicyPage type="privacy" />} />
        <Route path="contact" element={<ContactPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
