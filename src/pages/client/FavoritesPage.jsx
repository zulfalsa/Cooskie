import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ProductCard from '../../components/product/ProductCard';
import { useCart } from '../../context/CartContext';

export default function FavoritesPage() {
  const { favorites, addToCart, toggleFavorite } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#1e3a8a] mb-2">
            Favorit Saya
          </h1>
          <p className="text-gray-500">
            Menu yang Anda simpan untuk dinikmati nanti.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada favorit</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Jelajahi katalog kami dan simpan menu yang Anda suka dengan menekan tombol hati.
            </p>
            <Button variant="secondary" onClick={() => navigate('/catalog')}>
              Cari Menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true} // Always true in favorites page
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