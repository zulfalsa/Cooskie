import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function DesktopNavbar() {
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-gray-900';

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">C</div>
            <span className="font-serif text-2xl font-bold text-[#1e3a8a] hidden md:block">Cooskie</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/catalog" className={isActive('/catalog')}>Katalog</Link>
            <Link to="/outlets" className={isActive('/outlets')}>Lokasi</Link>
            <Link to="/track" className={isActive('/track')}>Lacak</Link>
            <Link to="/about" className={isActive('/about')}>Tentang Kami</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-[#1e3a8a]">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}