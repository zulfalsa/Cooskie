import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Button from '../../components/common/Button';
import { Loader, ChevronLeft, Minus, Plus, Heart, Share2, Star, Check } from 'lucide-react';

// Simple Toast Component lokal
const Toast = ({ message, show }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <Check size={16} className="text-green-400" />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, favorites, toggleFavorite } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Ambil data produk berdasarkan ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          // Jika produk tidak ditemukan (misal ID salah)
          alert("Produk tidak ditemukan");
          navigate('/catalog');
        }
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // Cek apakah produk ini ada di favorit
  const isFavorite = product && favorites.some(f => f.id === product.id);

  // Helper Toast
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Handle tambah ke keranjang
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
        addToCart(product);
    }
    showToast("Berhasil masuk keranjang!");
  };

  const handleShare = async () => {
    // Karena sekarang menggunakan HashRouter, URL ini aman untuk dishare (tidak 404)
    const shareData = {
      title: product.name,
      text: `Cek ${product.name} di Cooskie!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Link produk disalin!");
      } catch (err) {
        // Fallback untuk browser lama atau iframe yang memblokir clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = shareData.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast("Link produk disalin!");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-[#1e3a8a]" size={40} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 relative">
      <Toast message={toast.message} show={toast.show} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/catalog" className="hover:text-[#1e3a8a] flex items-center gap-1">
            <ChevronLeft size={16} /> Kembali
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* KOLOM KIRI: FOTO PRODUK */}
            <div className="md:w-1/2 bg-gray-50 relative group">
              <div className="aspect-square md:aspect-auto md:h-full relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Tombol Favorit & Share Floating */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button 
                  onClick={() => toggleFavorite(product)}
                  className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all"
                >
                  <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all text-gray-500 hover:text-[#1e3a8a]"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* KOLOM KANAN: DETAIL INFO */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
              
              <div className="mb-auto">
                {/* Kategori Badge */}
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  {product.category}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating Dummy (bisa dikembangkan) */}
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">(4.9)</span>
                </div>

                <div className="text-3xl font-bold text-[#1e3a8a] mb-6">
                  {formatPrice(product.price_cents)}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="border-t border-gray-100 pt-8 mt-4">
                
                {/* Selector QTY */}
                <div className="flex items-center gap-6 mb-6">
                  <span className="font-bold text-gray-700">Jumlah</span>
                  <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#1e3a8a] disabled:opacity-50"
                      disabled={qty <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-bold w-4 text-center">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-[#1e3a8a]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Stok: <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{product.stock}</span>
                  </div>
                </div>

                {/* Tombol Beli */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 py-4 text-lg shadow-lg shadow-blue-900/10"
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? `+ Keranjang - ${formatPrice(product.price_cents * qty)}` : 'Stok Habis'}
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}