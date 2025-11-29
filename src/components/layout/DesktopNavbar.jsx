import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Heart, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

import logoImage from '../../assets/logo-dark.png'; 

export default function DesktopNavbar() {
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Katalog' },
    { path: '/outlets', label: 'Lokasi' },
    { path: '/track', label: 'Lacak Pesanan' },
  ];

  const handleSearch = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="Cooskie Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          
          {/* 2. CENTER LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  isActive(link.path) 
                    ? 'text-[#1e3a8a]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1e3a8a] rounded-full animate-fade-in"></span>
                )}
              </Link>
            ))}
          </div>

          {/* 3. RIGHT ICONS & SEARCH */}
          <div className="flex items-center gap-5">
            
            {/* Search Bar - Dibungkus Form agar support Enter & Mobile Go Button */}
            <form onSubmit={handleSearch} className="relative group hidden lg:block">
              <input 
                type="text" 
                placeholder="Cari cookies atau dessert..." 
                className="pl-10 pr-4 py-1.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-60 transition-all focus:w-72 placeholder:text-gray-400 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <Link 
                to="/favorites" 
                className={`relative transition-all duration-300 ${isActive('/favorites') ? 'text-[#1e3a8a] scale-110' : 'text-gray-500 hover:text-[#1e3a8a] hover:scale-105'}`}
                title="Favorit Saya"
              >
                <Heart 
                  size={22} 
                  className={`transition-all ${isActive('/favorites') ? 'fill-[#1e3a8a]' : ''}`}
                  strokeWidth={isActive('/favorites') ? 2.2 : 2}
                />
              </Link>

              <Link 
                to="/about" 
                className={`relative transition-all duration-300 ${isActive('/about') ? 'text-[#1e3a8a] scale-110' : 'text-gray-500 hover:text-[#1e3a8a] hover:scale-105'}`}
                title="Tentang Kami"
              >
                <Info 
                  size={22} 
                  strokeWidth={isActive('/about') ? 2.2 : 2}
                />
              </Link>

              <Link 
                to="/cart" 
                className={`relative transition-all duration-300 ${isActive('/cart') ? 'text-[#1e3a8a] scale-110' : 'text-gray-500 hover:text-[#1e3a8a] hover:scale-105'}`}
                title="Keranjang"
              >
                <ShoppingBag 
                  size={22} 
                  strokeWidth={isActive('/cart') ? 2 : 2}
                  className={isActive('/cart') ? 'fill-[#1e3a8a]/10' : ''}
                />
                
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white animate-bounce-short">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
}