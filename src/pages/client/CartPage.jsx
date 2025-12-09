import React, { useState } from 'react';
import { ShoppingBag, Trash2, Minus, Plus, History, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, orderHistory } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' atau 'history'
  
  const currentCart = cart || [];
  
  // Kalkulasi Total
  const subtotal = currentCart.reduce((sum, item) => sum + (item.price_cents * item.qty), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header dengan Tab */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
            {activeTab === 'cart' ? <ShoppingBag /> : <History />}
            {activeTab === 'cart' ? 'Keranjang Belanja' : 'Riwayat Pesanan'}
          </h1>
          
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'cart' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1e3a8a]'
              }`}
            >
              Keranjang ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === 'history' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1e3a8a]'
              }`}
            >
              Riwayat
            </button>
          </div>
        </div>
        
        {/* --- KONTEN TAB KERANJANG --- */}
        {activeTab === 'cart' && (
          <>
            {currentCart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-6">Keranjangmu masih kosong.</p>
                <div className="flex justify-center">
                  <Button variant="secondary" onClick={() => navigate('/catalog')}>
                    Mulai Belanja
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {currentCart.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`p-4 md:p-6 flex gap-4 items-center ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                    >
                      <img 
                        src={item.image} 
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover bg-gray-100" 
                        alt={item.name} 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[#1e3a8a] text-base md:text-lg">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{formatPrice(item.price_cents)}</p>
                        <div className="flex items-center gap-3 bg-gray-50 w-max rounded-lg p-1">
                          <button 
                            onClick={() => updateQty(item.id, -1)} 
                            className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[#1e3a8a]"
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
                  <Button className="w-full py-3.5" onClick={handleCheckout}>
                    Lanjut Checkout
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- KONTEN TAB RIWAYAT --- */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            {(!orderHistory || orderHistory.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada riwayat pesanan.</p>
              </div>
            ) : (
              orderHistory.map((order, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Kode Pesanan</p>
                      <p className="text-lg font-mono font-bold text-[#1e3a8a]">{order.tracking_code}</p>
                    </div>
                    <span className="bg-blue-50 text-[#1e3a8a] text-[10px] px-2 py-1 rounded font-bold uppercase border border-blue-100">
                      {order.status || 'Tersimpan'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400"/>
                      {new Date(order.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </div>
                    <div className="w-px h-3 bg-gray-200"></div>
                    <div>Total: <span className="font-bold text-gray-800">{formatPrice(order.total_cents)}</span></div>
                  </div>

                  <button 
                    onClick={() => navigate(`/tracking/${order.tracking_code}`)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#1e3a8a] bg-gray-50 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Lacak / Detail <ArrowRight size={16}/>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}