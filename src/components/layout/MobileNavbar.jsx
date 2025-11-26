import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, MapPin, Package, Heart } from 'lucide-react';

export default function MobileNavbar() {
  const location = useLocation();
  
  // Logika active state menggunakan pathname
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/catalog', label: 'Menu', icon: Store },
    { path: '/outlets', label: 'Lokasi', icon: MapPin },
    { path: '/track', label: 'Lacak', icon: Package },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 md:hidden pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const active = isActive(item.path);
        
        return (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              active ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon 
              size={22} 
              // Stroke tebal (2.5) saat aktif, normal (2) saat tidak
              strokeWidth={active ? 2.5 : 2} 
              // Efek naik sedikit (-translate-y-1) saat aktif
              className={`transition-transform ${active ? '-translate-y-1' : ''}`} 
            />
            {/* Label hanya muncul saat aktif */}
            {active && (
              <span className="text-[12px] mt-0.5 font-bold">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}