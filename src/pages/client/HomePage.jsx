import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService'; // Sesuaikan path ini
import ProductCard from '../../components/product/ProductCard'; // Sesuaikan path ini
import Button from '../../components/common/Button'; // Sesuaikan path ini

import cookieImage from '../../assets/homepage-cookie.png';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      // Mengambil data produk (asumsi function ini sudah benar)
      const data = await getProducts('all', ''); 
      setProducts(data || []);
    };
    fetch();
  }, []);

  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      
      {/* ================= HERO SECTION ================= */}
      {/* Styling background kuning & overflow hidden */}
      <div className="bg-[#fefce8] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
          
          {/* Kolom Kiri: Teks */}
          <div className="flex-1 relative z-10 text-center md:text-left">
            <span className="text-[#1e3a8a] font-bold tracking-wider text-sm uppercase mb-2 block animate-fade-in">
              Handcrafted with Love
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e3a8a] mb-6 leading-tight font-serif">
              Cooskie <br/>
              <span className="text-[#6079C0]">Cookies & Dessert</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Nikmati kelembutan cookies premium dan dessert istimewa. Dibuat fresh setiap hari untuk menemani momen manismu.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/catalog">
                <Button>Pesan Sekarang</Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary">Tentang Kami</Button>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Gambar Hero (Bagian yang hilang di kodemu sebelumnya) */}
          <div className="flex-1 relative">
            {/* Background Blob Kuning */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#94A7DC] rounded-full blur-3xl"></div>
            
            {/* Gambar Utama dengan efek rotasi & shadow */}
            <img 
              src={cookieImage} 
              className="relative w-64 h-64 md:w-96 md:h-96 rounded-full object-cover shadow-2xl rotate-12 border-8 border-white mx-auto hover:rotate-6 transition-transform duration-700" 
              alt="Hero Cookie" 
            />
          </div>

        </div>
      </div>

      {/* ================= FEATURED SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Header Section (Judul & Link 'Lihat Semua') */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] font-serif">Favorit Minggu Ini</h2>
            <p className="text-gray-500 mt-1">Pilihan terbaik yang paling dicintai pelanggan kami</p>
          </div>
          {/* Link Desktop */}
          <Link to="/catalog" className="text-sm font-bold text-[#1e3a8a] hover:underline hidden md:block">
            Lihat Semua →
          </Link>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(p => (
            /* Pastikan ProductCard menerima props yang sesuai */
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Tombol Mobile (Muncul hanya di layar kecil) */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/catalog">
            <Button variant="ghost">Lihat Menu Lengkap</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}