import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader } from 'lucide-react';
import { supabase } from '../../config/supabaseClient'; // Sesuaikan path
import { formatPrice } from '../../utils/helpers'; // Sesuaikan path
import Button from '../../components/common/Button'; // Sesuaikan path
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State untuk produk
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch Data (Orders & Products)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });
      
      // 2. Get Products (Untuk tab products)
      const { data: productsData } = await supabase
        .from('products')
        .select('*');

      if (ordersData) setOrders(ordersData);
      if (productsData) setProducts(productsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistic Update UI
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Update Backend
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* HEADER DASHBOARD */}
      <div className="bg-[#1e3a8a] text-white p-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button onClick={handleLogout} className="hover:bg-blue-800 p-2 rounded-lg transition-colors">
            <LogOut size={20}/>
          </button>
        </div>
        
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setTab('orders')} 
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              tab === 'orders' ? 'bg-white text-[#1e3a8a]' : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
            }`}
          >
            Orders
          </button>
          <button 
            onClick={() => setTab('products')} 
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              tab === 'products' ? 'bg-white text-[#1e3a8a]' : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
            }`}
          >
            Products
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 max-w-4xl mx-auto">
        {loading ? (
           <div className="bg-white p-8 rounded-xl shadow-sm text-center">
             <Loader className="animate-spin mx-auto text-[#1e3a8a]" />
           </div>
        ) : (
          <>
            {/* --- TAB ORDERS --- */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10 p-8 bg-white rounded-xl shadow-sm">
                    No orders found.
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-[#1e3a8a] font-mono">{order.tracking_code}</span>
                        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                          order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-gray-900">{order.guest_name}</span> 
                        <span className="mx-2 text-gray-300">|</span> 
                        {formatPrice(order.total_cents)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                        {order.status === 'waiting_verification' && (
                          <Button 
                            variant="primary" 
                            className="flex-1 text-xs py-2 bg-green-600 hover:bg-green-700" 
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                          >
                            Verify Payment
                          </Button>
                        )}
                        {order.status === 'paid' && (
                          <Button 
                            variant="primary" 
                            className="flex-1 text-xs py-2" 
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                          >
                            Mark Shipped
                          </Button>
                        )}
                         {order.status === 'shipped' && (
                          <Button 
                            variant="primary" 
                            className="flex-1 text-xs py-2 bg-gray-500 cursor-not-allowed opacity-50" 
                            disabled
                          >
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- TAB PRODUCTS --- */}
            {tab === 'products' && (
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="aspect-square w-full bg-gray-100 rounded-lg mb-2 overflow-hidden">
                      <img src={p.image} className="w-full h-full object-cover" alt={p.name}/>
                    </div>
                    <div className="font-bold text-sm truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{formatPrice(p.price_cents)}</div>
                    <div className="mt-auto flex justify-end">
                      <button className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
                
                {/* Add New Button Placeholder */}
                <div className="bg-gray-50 rounded-xl flex items-center justify-center h-48 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors group">
                  <span className="text-gray-400 font-bold group-hover:text-gray-600">+ Add New</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}