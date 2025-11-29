import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Store, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import logoImage from '../../assets/logo-dark.png'; 

export default function AdminLayout() {
  const { user, signOut } = useAuth(); // Menggunakan signOut sesuai context
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect jika tidak login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const menus = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Pesanan', icon: ShoppingCart },
    { path: '/admin/products', label: 'Produk', icon: Package },
    { path: '/admin/outlets', label: 'Outlet', icon: Store },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      
      {/* 1. MOBILE SIDEBAR OVERLAY (Background gelap saat sidebar terbuka) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="Cooskie Logo" 
              className="h-8 w-auto object-contain" 
            />
          </Link>
          <span className="text-xs text-gray-400 font-serif font-normal uppercase">Admin</span>
          {/* Tombol Close di Mobile */}
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        
        {/* Menu List */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {menus.map((menu) => {
            const active = location.pathname.startsWith(menu.path);
            return (
              <Link 
                key={menu.path} 
                to={menu.path} 
                onClick={() => setSidebarOpen(false)} // Tutup sidebar saat link diklik (mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active 
                    ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <menu.icon size={20} className={active ? 'stroke-[2.5px]' : 'stroke-2 group-hover:stroke-[2.5px]'} />
                <span className="font-medium">{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="px-4 mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Login Sebagai</p>
            <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header Topbar */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 flex-shrink-0 z-30">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setSidebarOpen(true)} 
               className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
             >
               <Menu size={24} />
             </button>
             <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={logoImage} 
                  alt="Cooskie Logo" 
                  className="h-10 w-auto object-contain" 
                />
              </Link>
           </div>
           {/* Optional: Profile pic or additional action here */}
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}