import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MapPin, 
  Phone, 
  Lock 
} from 'lucide-react';

import logoImage from '../../assets/logo-light.png'; 

const Footer = () => {
  return (
    // Class 'mt-auto' penting agar footer selalu di bawah jika konten sedikit
    // 'mb-16 md:mb-0' memberi ruang untuk Bottom Navigation Bar di tampilan mobile
    <footer className="bg-[#1e3a8a] text-white pt-16 pb-8 mt-auto mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Kolom 1: Brand & Social */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src={logoImage} 
                alt="Cooskie Logo" 
                className="h-10 w-auto mb-3 object-contain" 
              />
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Menyajikan kehangatan dalam setiap gigitan. Cookies dan dessert premium buatan tangan dengan bahan terbaik.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Instagram size={18}/>
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Facebook size={18}/>
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Twitter size={18}/>
              </button>
            </div>
          </div>

          {/* Kolom 2: Jelajahi */}
          <div>
            <h3 className="font-bold text-lg mb-4">Jelajahi</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Beranda</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-white hover:translate-x-1 transition-all inline-block">Katalog Menu</Link>
              </li>
              <li>
                {/* Di Cooskie.jsx viewnya 'outlets', jadi linknya ke /outlets */}
                <Link to="/outlets" className="hover:text-white hover:translate-x-1 transition-all inline-block">Lokasi Outlet</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tentang Kami</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Pelanggan */}
          <div>
            <h3 className="font-bold text-lg mb-4">Pelanggan</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li>
                <Link to="/tracking" className="hover:text-white hover:translate-x-1 transition-all inline-block">Lacak Pesanan</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white hover:translate-x-1 transition-all inline-block">Favorit Saya</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:translate-x-1 transition-all inline-block">Keranjang</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin size={18} className="shrink-0 mt-0.5"/>
                <span>Jl. Letjen S. Parman No.28, Jakarta Barat</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={18} className="shrink-0"/>
                <span>(021) 5698-5555</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-300">© 2025 Cooskie Indonesia. All rights reserved.</p>
          
          <Link 
            to="/login" 
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-white transition-colors px-3 py-1 rounded-full hover:bg-white/10"
          >
            <Lock size={12} /> Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;