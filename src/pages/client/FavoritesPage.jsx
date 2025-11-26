import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button'; // Sesuaikan path
import ProductCard from '../../components/product/ProductCard'; // Sesuaikan path
import { useCart } from '../../context/CartContext'; // Sesuaikan path context

export default function FavoritesPage() {
  const { favorites, addToCart, toggleFavorite } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#1e3a8a] mb-2">
            Favorit Saya
          </h1>
          <p className="text-gray-500">
            Menu yang Anda simpan untuk dinikmati nanti.
          </p>
        </div>

        {/* Content Section */}
        {favorites.length === 0 ? (
          /* EMPTY STATE (Disesuaikan dengan Cooskie.jsx) */
          /* Menghilangkan shadow-sm, menghapus background circle icon, menyederhanakan teks */
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Heart size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada favorit.</p>
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/catalog')} 
                className="mt-4"
              >
                Cari Menu
              </Button>
            </div>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(product)}
                onAddToCart={() => addToCart(product)}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}