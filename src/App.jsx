import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import DesktopNavbar from './components/layout/DesktopNavbar';
import Footer from './components/layout/Footer';
import MobileNavbar from './components/layout/MobileNavbar';
import AdminLayout from './components/layout/AdminLayout';

// Client Pages
import HomePage from './pages/client/HomePage';
import CatalogPage from './pages/client/CatalogPage';
import ProductDetailPage from './pages/client/ProductDetailPage'; // Import Halaman Detail
import CheckoutPage from './pages/client/CheckoutPage';
import TrackingPage from './pages/client/TrackingPage';
import AboutPage from './pages/client/AboutPage';
import OutletsPage from './pages/client/OutletsPage';
import FavoritesPage from './pages/client/FavoritesPage';
import CartPage from './pages/client/CartPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductManager from './pages/admin/ProductManager';
import OutletManager from './pages/admin/OutletManager';
import OrderManager from './pages/admin/OrderManager';

// ==========================================
// Component Layout Khusus Client
// ==========================================
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Sembunyikan Navbar/Footer Client jika berada di rute /login atau /admin
  const isClientPage = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      {/* Navbar Client */}
      {isClientPage && <DesktopNavbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Client */}
      {isClientPage && <Footer />}
      {isClientPage && <MobileNavbar />}
    </div>
  );
};

// ==========================================
// Main App Component
// ==========================================
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* --- Public Routes (Client) --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              {/* Route Baru untuk Detail Produk */}
              <Route path="/product/:id" element={<ProductDetailPage />} />
              
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/tracking/:code" element={<TrackingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/outlets" element={<OutletsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              
              {/* --- Auth Route --- */}
              <Route path="/login" element={<AdminLoginPage />} />
              
              {/* --- Admin Routes (Protected by AdminLayout) --- */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Redirect /admin ke /admin/dashboard handled inside layout or index */}
                <Route index element={<AdminDashboardPage />} /> 
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="outlets" element={<OutletManager />} />
                <Route path="orders" element={<OrderManager />} />
              </Route>
            </Routes>
          </AppLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;