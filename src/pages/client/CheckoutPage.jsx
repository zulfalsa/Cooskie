import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 
import { createOrder } from '../../services/orderService'; 
import { supabase } from '../../config/supabaseClient'; 
import { generateTrackingCode, formatPrice } from '../../utils/helpers'; 
import Button from '../../components/common/Button'; 
import { Store, Truck, ChevronLeft, CheckCircle } from 'lucide-react';

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
      {...props} 
    />
  </div>
);

export default function CheckoutPage() {
  // Ambil addOrderToHistory dari context
  const { cart, cartTotal, clearCart, addOrderToHistory } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [outlets, setOutlets] = useState([]);
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '', 
    type: 'pickup', 
    outlet_id: '' 
  });

  useEffect(() => {
    const fetchOutlets = async () => {
      const { data } = await supabase.from('outlets').select('*');
      if (data) setOutlets(data);
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
      delivery_type: form.type 
    };

    try {
      const order = await createOrder(orderData, cart);
      
      // --- SIMPAN KE LOCAL STORAGE HISTORY ---
      addOrderToHistory({
        id: order.id,
        tracking_code: order.tracking_code,
        created_at: new Date().toISOString(), // Simpan waktu saat ini
        total_cents: order.total_cents,
        status: 'waiting_verification', // Status awal
        item_count: cart.length // Informasi tambahan untuk tampilan
      });

      clearCart();
      navigate(`/tracking/${order.tracking_code}`, { state: { success: true } });
    } catch (error) {
      alert('Gagal membuat pesanan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
        <p className="text-gray-500 mb-4">Keranjang Anda kosong.</p>
        <Button onClick={() => navigate('/catalog')}>Belanja Sekarang</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-xl mx-auto px-4">
        
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] mb-6 font-medium"
        >
          <ChevronLeft size={20}/> Kembali
        </button>

        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">Pengiriman & Pembayaran</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setForm({ ...form, type: 'pickup' })} 
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 transition-all ${
                form.type === 'pickup' 
                  ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              <Store size={24} />
              <span className="font-bold">Ambil Sendiri</span>
            </div>
            
            <div 
              onClick={() => setForm({ ...form, type: 'delivery' })} 
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 transition-all ${
                form.type === 'delivery' 
                  ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              <Truck size={24} />
              <span className="font-bold">Delivery</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Informasi Kontak</h3>
            <Input 
              placeholder="Nama Lengkap" 
              required 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
             <Input 
              placeholder="Email" 
              type="email"
              required 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
            />
            <Input 
              placeholder="Nomor Telepon (WhatsApp)" 
              type="tel" 
              required 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})} 
            />
          </div>

          {form.type === 'delivery' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Alamat Pengiriman</h3>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all bg-gray-50 min-h-[100px]" 
                placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan..." 
                required 
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})}
              ></textarea>
            </div>
          )}

          {form.type === 'pickup' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Pilih Outlet</h3>
              <div className="space-y-3">
                {outlets.map(outlet => (
                  <div 
                    key={outlet.id} 
                    onClick={() => setForm({...form, outlet_id: outlet.id})} 
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-all ${
                      form.outlet_id === outlet.id ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-800">{outlet.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{outlet.address}</div>
                    </div>
                    {form.outlet_id === outlet.id && <CheckCircle className="text-[#1e3a8a]" size={20}/>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
             <div className="flex justify-between text-lg font-bold mb-6 text-[#1e3a8a]">
              <span>Total Pembayaran</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            <Button type="submit" className="w-full py-4 shadow-lg text-lg" disabled={loading}>
              {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}