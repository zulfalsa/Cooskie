import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService'; // Sesuaikan path
import ProductCard from '../../components/product/ProductCard'; // Sesuaikan path
import { Search, Loader } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getProducts(category, search);
        setProducts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce sedikit untuk search agar tidak spam request (opsional)
    const timeoutId = setTimeout(() => {
        fetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* ================= HEADER SECTION ================= */}
      {/* Styling identik dengan Cooskie.jsx: Background putih & Shadow */}
      <div className="bg-white shadow-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] font-serif mb-2">Katalog Menu</h1>
          <p className="text-gray-500 mb-6">Temukan rasa favoritmu hari ini</p>
          
          {/* CONTROL BAR: Container abu-abu yang membungkus Kategori & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-100">
            
            {/* 1. CATEGORY TOGGLES (Gaya Segmented Control) */}
            <div className="flex p-1 bg-white rounded-xl shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'cookies', 'dessert'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`
                    flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap
                    ${category === cat 
                      ? 'bg-[#1e3a8a] text-white shadow-md' // Active State
                      : 'text-gray-500 hover:bg-gray-50'    // Inactive State
                    }
                  `}
                >
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              ))}
            </div>

            {/* 2. SEARCH INPUT (Disisipkan ke dalam control bar agar rapi) */}
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Cari cookies..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white shadow-sm text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

          </div>
        </div>
      </div>

      {/* ================= PRODUCT GRID SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-[#1e3a8a]" size={32} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          /* Tampilan jika produk tidak ditemukan (sesuai Cooskie.jsx) */
          <div className="text-center py-20">
            <div className="bg-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Produk tidak ditemukan</h3>
            <p className="text-gray-500 mt-1">Coba kata kunci lain atau ganti kategori.</p>
            <button 
              onClick={() => { setSearch(''); setCategory('all'); }} 
              className="mt-4 text-[#1e3a8a] font-semibold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}