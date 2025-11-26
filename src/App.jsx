import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import DesktopNavbar from './components/layout/DesktopNavbar';
import Footer from './components/layout/Footer';
import MobileNavbar from './components/layout/MobileNavbar';

// Client Pages
import HomePage from './pages/client/HomePage';
import CatalogPage from './pages/client/CatalogPage';
import CheckoutPage from './pages/client/CheckoutPage';
import TrackingPage from './pages/client/TrackingPage';
import AboutPage from './pages/client/AboutPage';
import OutletsPage from './pages/client/OutletsPage';
import FavoritesPage from './pages/client/FavoritesPage';
import CartPage from './pages/client/CartPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Asumsi path ini

// ==========================================
// Component Layout Khusus
// ==========================================
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Daftar path yang TIDAK BOLEH menampilkan Navbar & Footer
  // Kita menggunakan .startsWith agar '/admin/dashboard' juga otomatis tersembunyi
  const hideLayoutPaths = ['/login', '/admin'];
  
  const shouldHideLayout = hideLayoutPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      {/* Hanya tampilkan Navbar jika BUKAN halaman login/admin */}
      {!shouldHideLayout && <DesktopNavbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {/* Hanya tampilkan Footer & MobileNavbar jika BUKAN halaman login/admin */}
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && <MobileNavbar />}
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
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/tracking/:code" element={<TrackingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/outlets" element={<OutletsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              
              {/* Admin Routes */}
              <Route path="/login" element={<AdminLoginPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                   // Sebaiknya gunakan komponen AdminDashboardPage yang sudah kamu buat sebelumnya
                   <AdminDashboardPage />
                } 
              />
            </Routes>
          </AppLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;