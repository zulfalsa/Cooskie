import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Store, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Produk' },
    { path: '/admin/outlets', icon: Store, label: 'Outlet' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Pesanan' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        {/* Header Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#1e3a8a] font-serif tracking-wide">
            Cooskie <span className="text-xs text-gray-400 font-sans font-normal uppercase ml-1">Admin</span>
          </h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive(item.path) 
                  ? 'bg-blue-50 text-[#1e3a8a] shadow-sm ring-1 ring-blue-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? "stroke-[2.5px]" : "stroke-2"} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 md:ml-64 min-w-0 flex flex-col">
        {/* Mobile Header (Hanya muncul di layar kecil) */}
        <header className="bg-white border-b border-gray-200 h-16 flex md:hidden items-center justify-between px-4 sticky top-0 z-20">
          <span className="font-bold text-[#1e3a8a]">Cooskie Admin</span>
          <button onClick={handleLogout} className="p-2 text-gray-500"><LogOut size={20}/></button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {/* <Outlet /> adalah tempat halaman anak (Dashboard, Products, dll) dirender */}
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}