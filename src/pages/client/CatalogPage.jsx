import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import { Search, Loader, X } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams(); // Hook untuk URL params
  
  // Ambil query 'q' dari URL, jika tidak ada default ke ''
  const initialSearch = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('all');

  // Sinkronisasi state lokal 'search' jika URL berubah (misal dari Navbar)
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Gunakan state 'search' untuk mengambil data
        const data = await getProducts(category, search);
        setProducts(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
        fetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [category, search]);

  // Fungsi untuk update URL saat user mengetik di halaman ini
  const handleSearchChange = (val) => {
    setSearch(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* HEADER */}
      <div className="bg-white shadow-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] font-serif mb-2">Katalog Menu</h1>
          <p className="text-gray-500 mb-6">Temukan rasa favoritmu hari ini</p>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-100">
            
            {/* CATEGORY TOGGLES */}
            <div className="flex p-1 bg-white rounded-xl shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar">
              {['all', 'cookies', 'dessert'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`
                    flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap
                    ${category === cat 
                      ? 'bg-[#1e3a8a] text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }
                  `}
                >
                  {cat === 'all' ? 'Semua' : cat}
                </button>
              ))}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Cari di katalog..." 
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white shadow-sm text-sm"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              
              {/* Tombol Clear Search */}
              {search && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
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
          <div className="text-center py-20">
            <div className="bg-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Produk tidak ditemukan</h3>
            <p className="text-gray-500 mt-1">
              Tidak ada hasil untuk "{search}". Coba kata kunci lain.
            </p>
            <button 
              onClick={() => { clearSearch(); setCategory('all'); }} 
              className="mt-4 text-[#1e3a8a] font-semibold hover:underline"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}