import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Package, CheckCircle, Upload, Search, ChevronLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { getOrderByTracking, uploadPaymentProof } from '../../services/orderService';
import { formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';

export default function TrackingPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trackCode, setTrackCode] = useState(code || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cek jika ini redirect dari checkout sukses
  const isSuccess = location.state?.success; 

  const fetchOrder = async (codeToFetch) => {
    if(!codeToFetch) return;
    setLoading(true);
    try {
      const data = await getOrderByTracking(codeToFetch);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setOrder(null);
      if(!isSuccess) alert('Pesanan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(code) {
      setTrackCode(code);
      fetchOrder(code);
    }
  }, [code]);

  const handleTrack = (e) => {
    e.preventDefault();
    if(trackCode.trim()) {
      navigate(`/tracking/${trackCode}`);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    setUploading(true);
    try {
      await uploadPaymentProof(order.id, file);
      alert('Bukti pembayaran berhasil diupload!');
      fetchOrder(trackCode);
    } catch (error) {
      alert('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- TAMPILAN 1: SUKSES CHECKOUT (Gaya TrackingSuccessPage) ---
  if (isSuccess && order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Diterima!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah memesan di Cooskie.</p>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-2">Kode Tracking Anda</p>
            <div 
              className="font-mono text-3xl font-bold text-[#1e3a8a] select-all cursor-pointer"
              onClick={() => navigator.clipboard.writeText(trackCode)}
            >
              {trackCode}
            </div>
            <p className="text-[10px] text-blue-400 mt-2">Ketuk kode untuk menyalin</p>
          </div>

          <div className="space-y-3">
            {/* Tombol ini akan mereload halaman tanpa state 'success' untuk melihat detail tracking */}
            <Button onClick={() => navigate(`/tracking/${trackCode}`, { replace: true })} className="w-full">
              Lihat Detail Pesanan
            </Button>
            <Link to="/">
              <Button variant="ghost" className="w-full">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: FORM TRACKING & DETAIL (Gaya TrackingPage) ---
  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8 px-4">
      <div className="max-w-lg mx-auto">
        
        {/* Header Judul */}
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6 text-center">Lacak Pesanan</h1>

        {/* Kotak Pencarian (Identik dengan Cooskie.jsx) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
          <Package size={48} className="text-blue-200 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Masukkan kode tracking yang Anda dapatkan saat checkout.</p>
          
          <form onSubmit={handleTrack} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Kode Tracking (Contoh: CSK-...)" 
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" 
              value={trackCode} 
              onChange={e => setTrackCode(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? '...' : 'Lacak'}
            </Button>
          </form>
        </div>

        {/* Detail Pesanan (Muncul jika ada data order) */}
        {order && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
            {/* Header Detail */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total</p>
                <p className="font-bold text-[#1e3a8a] text-lg">{formatPrice(order.total_cents)}</p>
              </div>
            </div>

            {/* Upload Bukti Bayar Section */}
            {order.status === 'waiting_verification' && !order.payments?.length && (
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center">
                <p className="text-sm text-blue-800 mb-4 font-medium leading-relaxed">
                  Pesanan belum dibayar. Silakan transfer dan upload bukti pembayaran Anda.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl hover:bg-blue-900 transition-all shadow-md active:scale-95">
                  {uploading ? (
                    <span className="text-sm">Mengupload...</span>
                  ) : (
                    <>
                      <Upload size={18}/> 
                      <span className="font-bold text-sm">Upload Bukti Transfer</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
                </label>
              </div>
            )}
            
            {/* Notifikasi jika sudah bayar */}
            {order.payments?.length > 0 && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3 text-green-700">
                <CheckCircle size={20} className="fill-green-600 text-white shrink-0"/> 
                <span className="text-sm font-medium">Bukti pembayaran telah diterima dan sedang diverifikasi.</span>
              </div>
            )}

            {/* Daftar Item Produk */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Item Pesanan</h3>
              <div className="space-y-4">
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      {item.products?.image ? (
                        <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={20}/></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.products?.name || 'Produk dihapus'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.quantity} x <span className="text-[#1e3a8a] font-medium">{formatPrice(item.price_cents)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informasi Pengiriman */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wider">Info Pengiriman</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium text-gray-900">Penerima:</span> {order.customer_name}</p>
                <p><span className="font-medium text-gray-900">Telepon:</span> {order.customer_phone}</p>
                {order.delivery_type === 'delivery' ? (
                  <p><span className="font-medium text-gray-900">Alamat:</span> {order.customer_address}</p>
                ) : (
                  <p><span className="font-medium text-gray-900">Metode:</span> Ambil di Toko (Pickup)</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}