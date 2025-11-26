import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const navigate = useNavigate();
  const isFavorite = favorites.some(f => f.id === product.id);

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm"
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
        >
          <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-[#1e3a8a]">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-[#1e3a8a] font-bold text-lg">{formatPrice(product.price_cents)}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="bg-blue-50 text-[#1e3a8a] p-2 rounded-lg hover:bg-[#1e3a8a] hover:text-white transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}