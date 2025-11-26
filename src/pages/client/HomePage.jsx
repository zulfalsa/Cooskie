import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProducts('all', '');
      setProducts(data || []);
    };
    fetch();
  }, []);

  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      <div className="bg-[#fefce8] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 relative z-10 text-center md:text-left">
            <span className="text-[#1e3a8a] font-bold tracking-wider text-sm uppercase mb-2 block">Handcrafted with Love</span>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e3a8a] mb-6 leading-tight font-serif">
              Cooskie <br/><span className="text-orange-500">Cookies & Dessert</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Nikmati kelembutan cookies premium dan dessert istimewa. Dibuat fresh setiap hari untuk menemani momen manismu.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/catalog"><Button>Pesan Sekarang</Button></Link>
              <Link to="/about"><Button variant="secondary">Tentang Kami</Button></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] font-serif mb-8">Menu Favorit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}