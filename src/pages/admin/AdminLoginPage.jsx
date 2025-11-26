import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Button';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { formatPrice } from '../../utils/helpers';

export default function AdminLoginPage({ setUser, setView }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1e3a8a]">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl mx-auto mb-6">C</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Login</h2>
        <p className="text-gray-500 text-sm mb-8">Masuk untuk mengelola Cooskie</p>
        
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        
        <Button className="w-full mb-4 py-3" onClick={() => { setUser({ role: 'admin' }); setView('admin_dashboard'); }}>Masuk</Button>
        <Button variant="ghost" onClick={() => setView('home')} className="w-full text-gray-400 hover:text-gray-600">Kembali ke Toko</Button>
      </div>
    </div>
  );
}

export function AdminDashboardPage({ orders, setOrders, setView }) {
  const [tab, setTab] = useState('orders');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-[#1e3a8a] text-white p-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button onClick={() => setView('home')}><LogOut size={20}/></button>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab==='orders' ? 'bg-white text-[#1e3a8a]' : 'bg-blue-800 text-blue-200'}`}>Orders</button>
          <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-full text-sm font-bold ${tab==='products' ? 'bg-white text-[#1e3a8a]' : 'bg-blue-800 text-blue-200'}`}>Products</button>
        </div>
      </div>

      <div className="px-4 -mt-6">
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-[#1e3a8a]">{order.tracking_code}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{order.status}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{order.customer.name} - {formatPrice(order.total)}</div>
                
                <div className="flex gap-2 mt-4">
                  {order.status === 'waiting_verification' && (
                    <Button variant="primary" className="flex-1 text-xs py-2" onClick={() => {
                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'paid' } : o));
                    }}>Verify Payment</Button>
                  )}
                  {order.status === 'paid' && (
                    <Button variant="primary" className="flex-1 text-xs py-2" onClick={() => {
                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'shipped' } : o));
                    }}>Mark Shipped</Button>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="text-center text-gray-400 mt-10">No orders yet.</div>}
          </div>
        )}

        {tab === 'products' && (
          <div className="grid grid-cols-2 gap-4">
            {MOCK_PRODUCTS.map(p => (
              <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm">
                <img src={p.image} className="w-full h-32 object-cover rounded-lg mb-2" alt={p.name}/>
                <div className="font-bold text-sm truncate">{p.name}</div>
                <div className="text-xs text-gray-500">{formatPrice(p.price_cents)}</div>
                <div className="flex justify-end mt-2">
                  <button className="text-blue-600 text-xs font-bold">Edit</button>
                </div>
              </div>
            ))}
            <div className="bg-gray-200 rounded-xl flex items-center justify-center h-48 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors">
              <span className="text-gray-400 font-bold">+ Add New</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}