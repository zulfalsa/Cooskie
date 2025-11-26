import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import { supabase } from '../../config/supabaseClient';
import { generateTrackingCode, formatPrice } from '../../utils/helpers';
import Button from '../../components/common/Button';
import { Store, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', type: 'pickup', outlet_id: '' });

  useEffect(() => {
    const fetchOutlets = async () => {
      const { data } = await supabase.from('outlets').select('*');
      if(data) setOutlets(data);
    };
    fetchOutlets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      tracking_code: generateTrackingCode(),
      guest_name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.type === 'delivery' ? form.address : null,
      outlet_id: form.type === 'pickup' ? form.outlet_id : null,
      total_cents: cartTotal,
    };

    try {
      const order = await createOrder(orderData, cart);
      clearCart();
      navigate(`/tracking/${order.tracking_code}`);
    } catch (error) {
      alert('Gagal membuat pesanan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if(cart.length === 0) return <div className="p-8 text-center">Keranjang Kosong</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setForm({...form, type: 'pickup'})} className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col items-center ${form.type === 'pickup' ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200'}`}>
              <Store /> <span className="font-bold">Pickup</span>
            </div>
            <div onClick={() => setForm({...form, type: 'delivery'})} className={`p-4 border-2 rounded-xl cursor-pointer flex flex-col items-center ${form.type === 'delivery' ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200'}`}>
              <Truck /> <span className="font-bold">Delivery</span>
            </div>
          </div>

          <input className="w-full p-3 border rounded-lg" placeholder="Nama Lengkap" required onChange={e => setForm({...form, name: e.target.value})} />
          <input className="w-full p-3 border rounded-lg" placeholder="Email" type="email" required onChange={e => setForm({...form, email: e.target.value})} />
          <input className="w-full p-3 border rounded-lg" placeholder="WhatsApp" required onChange={e => setForm({...form, phone: e.target.value})} />
          
          {form.type === 'delivery' ? (
             <textarea className="w-full p-3 border rounded-lg" placeholder="Alamat Lengkap" required onChange={e => setForm({...form, address: e.target.value})} />
          ) : (
            <select className="w-full p-3 border rounded-lg" required onChange={e => setForm({...form, outlet_id: e.target.value})}>
              <option value="">Pilih Outlet...</option>
              {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          )}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}