import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-16 pb-8 mt-auto mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1e3a8a] font-serif font-bold text-lg">C</div>
              <span className="font-serif text-2xl font-bold tracking-wide">Cooskie</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Menyajikan kehangatan dalam setiap gigitan. Cookies dan dessert premium buatan tangan dengan bahan terbaik.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Jelajahi</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li><Link to="/" className="hover:text-white hover:translate-x-1 transition-all">Beranda</Link></li>
              <li><Link to="/catalog" className="hover:text-white hover:translate-x-1 transition-all">Katalog Menu</Link></li>
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Pelanggan</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li><Link to="/track" className="hover:text-white hover:translate-x-1 transition-all">Lacak Pesanan</Link></li>
              <li><Link to="/favorites" className="hover:text-white hover:translate-x-1 transition-all">Favorit Saya</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex gap-3 items-start"><MapPin size={18} className="shrink-0 mt-0.5"/><span>Jl. Letjen S. Parman No.28, Jakarta Barat</span></li>
              <li className="flex gap-3 items-center"><Phone size={18} className="shrink-0"/><span>(021) 5698-5555</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-8 flex justify-between items-center">
          <p className="text-xs text-blue-300">© 2025 Cooskie Indonesia.</p>
          <Link to="/login" className="text-xs text-blue-400 flex items-center gap-1"><Lock size={12}/> Admin</Link>
        </div>
      </div>
    </footer>
  );
}