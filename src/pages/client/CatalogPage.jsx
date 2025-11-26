import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
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
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-6 font-serif">Katalog Menu</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              type="text" 
              placeholder="Cari cookies..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'cookies', 'dessert'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${category === cat ? 'bg-[#1e3a8a] text-white' : 'bg-white text-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader className="animate-spin text-[#1e3a8a]" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}