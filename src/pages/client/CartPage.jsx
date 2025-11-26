import React, { useState } from 'react';
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatPrice } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function CartPage({ cart, updateQty, removeFromCart }) {
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price_cents * item.qty), 0);
  const tax = subtotal * 0.1; // Pajak 10%
  const total = subtotal + tax;

  const handleCheckout = () => {
      navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
          <ShoppingBag /> Keranjang Belanja
        </h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-6">Keranjangmu masih kosong.</p>
            <Button variant="secondary" onClick={() => navigate('/catalog')}>Mulai Belanja</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {cart.map((item, idx) => (
                <div key={item.id} className={`p-4 md:p-6 flex gap-4 items-center ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
                  <img src={item.image} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100" alt={item.name} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#1e3a8a] text-base md:text-lg">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{formatPrice(item.price_cents)}</p>
                    <div className="flex items-center gap-3 bg-gray-50 w-max rounded-lg p-1">
                      <button 
                        onClick={() => updateQty(item.id, -1)} 
                        className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#1e3a8a]"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={14}/>
                      </button>
                      <span className="font-mono w-8 text-center font-bold text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, 1)} 
                        className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#1e3a8a]"
                      >
                        <Plus size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600">
                <span>Pajak (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 my-4"></div>
              <div className="flex justify-between mb-6 text-xl font-bold text-[#1e3a8a]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full py-3.5" onClick={handleCheckout}>Lanjut Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}