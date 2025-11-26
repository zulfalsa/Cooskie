import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import DesktopNavbar from './components/layout/DesktopNavbar';
import Footer from './components/layout/Footer';
import MobileNavbar from './components/layout/MobileNavbar';

// Client Pages
import HomePage from './pages/client/HomePage';
import CatalogPage from './pages/client/CatalogPage';
import CheckoutPage from './pages/client/CheckoutPage';
import TrackingPage from './pages/client/TrackingPage'; // Anda bisa menyalin logika TrackingPage dari App.jsx sebelumnya ke file baru ini
import AboutPage from './pages/client/AboutPage'; // Anda bisa menyalin logika AboutPage dari App.jsx sebelumnya ke file baru ini
import OutletsPage from './pages/client/OutletsPage'; // Anda bisa menyalin logika OutletsPage dari App.jsx sebelumnya ke file baru ini
import FavoritesPage from './pages/client/FavoritesPage'; // Anda bisa menyalin logika FavoritesPage dari App.jsx sebelumnya ke file baru ini
import CartPage from './pages/client/CartPage'; // Anda bisa menyalin logika CartPage dari App.jsx sebelumnya ke file baru ini
import AdminLoginPage from './pages/admin/AdminLoginPage'; // Anda bisa menyalin logika AdminLoginPage dari App.jsx sebelumnya ke file baru ini

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
          <DesktopNavbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/tracking/:code" element={<TrackingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/outlets" element={<OutletsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<AdminLoginPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileNavbar />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;