import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import DesktopNavbar from './components/layout/DesktopNavbar';
import Footer from './components/layout/Footer';
import MobileNavbar from './components/layout/MobileNavbar';
import AdminLayout from './components/layout/AdminLayout';
import ErrorBoundary from './components/common/ErrorBoundary'; 
import PWABadge from './PWABadge'; 

// Client Pages
import HomePage from './pages/client/HomePage';
import CatalogPage from './pages/client/CatalogPage';
import ProductDetailPage from './pages/client/ProductDetailPage';
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

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isClientPage = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col">
      {isClientPage && <DesktopNavbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      {isClientPage && <Footer />}
      {isClientPage && <MobileNavbar />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/track" element={<TrackingPage />} />
                <Route path="/tracking/:code" element={<TrackingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/outlets" element={<OutletsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/login" element={<AdminLoginPage />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} /> 
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={
                    <ErrorBoundary>
                      <ProductManager />
                    </ErrorBoundary>
                  } />
                  <Route path="outlets" element={
                    <ErrorBoundary>
                      <OutletManager />
                    </ErrorBoundary>
                  } />
                  <Route path="orders" element={
                    <ErrorBoundary>
                      <OrderManager />
                    </ErrorBoundary>
                  } />
                </Route>
              </Routes>
            </AppLayout>
            <PWABadge />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;