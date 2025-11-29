import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Package, CheckCircle, Upload, Search, ChevronLeft, AlertCircle, Copy, Home } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import { getOrderByTracking, uploadPaymentProof } from '../../services/orderService.js';
import { formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers.js';

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

  // --- TAMPILAN 1: SUKSES CHECKOUT ---
  if (isSuccess && order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 pb-24">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-gray-100 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Diterima!</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Terima kasih telah memesan.<br/>Pesanan Anda sedang kami proses.
          </p>
          
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Kode Tracking</p>
            <div 
              className="flex items-center justify-center gap-2 font-mono text-3xl font-bold text-[#1e3a8a] cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigator.clipboard.writeText(trackCode)}
            >
              {trackCode} <Copy size={16} className="opacity-50"/>
            </div>
            <p className="text-[10px] text-blue-400 mt-2">Ketuk kode untuk menyalin</p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate(`/tracking/${trackCode}`, { replace: true })} className="w-full py-3.5 shadow-lg shadow-blue-900/20">
              Lihat Detail Pesanan
            </Button>
            <Link to="/" className="block">
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                <Home size={18}/> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: FORM TRACKING & DETAIL ---
  return (
    // Update: pb-24 untuk menghindari tabrakan dengan Mobile Navbar
    <div className="min-h-screen bg-gray-50 pb-24 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        
        <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6 text-center">Lacak Pesanan</h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3a8a]">
             <Package size={32} />
          </div>
          <p className="text-gray-600 mb-6 text-sm">Masukkan kode tracking yang Anda dapatkan saat checkout.</p>
          
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Contoh: CSK-XXXX" 
                  // Update: text-base agar tidak auto-zoom di iOS
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all text-base uppercase font-mono placeholder:normal-case placeholder:font-sans" 
                  value={trackCode} 
                  onChange={e => setTrackCode(e.target.value.toUpperCase())}
                />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto py-3">
              {loading ? '...' : 'Lacak'}
            </Button>
          </form>
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            {/* Header Detail */}
            <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Status Pesanan</p>
                <span className={`inline-flex items-center px-1 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                <p className="font-bold text-[#1e3a8a] text-lg">{formatPrice(order.total_cents)}</p>
              </div>
            </div>

            <div className="p-5 space-y-6">
                {/* --- PREVIEW BUKTI PEMBAYARAN (Jika Ada) --- */}
                {order.payments && order.payments.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600"/>
                      Bukti Pembayaran Terkirim
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <img 
                        src={order.payments[0].image} 
                        alt="Bukti Transfer" 
                        className="w-full h-48 object-contain rounded-md bg-gray-100" 
                      />
                    </div>
                    {/* Pesan status pembayaran khusus */}
                    {order.status === 'waiting_verification' && (
                      <p className="text-xs text-yellow-700 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100 font-medium">
                        Sedang diverifikasi oleh admin.
                      </p>
                    )}
                    {order.status === 'pending_payment' && order.payments[0].status === 'invalid' && (
                      <p className="text-xs text-red-700 mt-2 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-1 font-medium">
                        <AlertCircle size={14}/> Bukti ditolak. Silakan upload ulang.
                      </p>
                    )}
                  </div>
                )}

                {/* --- LOGIC UPLOAD BUKTI --- */}
                {(order.status === 'pending_payment' || (order.status === 'waiting_verification' && (!order.payments || order.payments.length === 0))) && (
                  <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-center">
                    <p className="text-sm text-orange-800 mb-4 font-medium leading-relaxed">
                      Pesanan dibuat. Silakan transfer dan upload bukti pembayaran untuk diproses.
                    </p>
                    <label className="cursor-pointer flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-5 py-3 rounded-xl hover:bg-blue-900 transition-all shadow-md active:scale-95 w-full">
                      {uploading ? (
                        <span className="text-sm font-bold">Mengupload...</span>
                      ) : (
                        <>
                          <Upload size={20}/> 
                          <span className="font-bold text-sm">Upload Bukti Transfer</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
                    </label>
                  </div>
                )}

                {/* Daftar Item Produk */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Package size={16}/> Item Pesanan
                  </h3>
                  <div className="space-y-3">
                    {order.order_items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
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

                {/* Info Pengiriman */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3 text-xs uppercase tracking-wider">Info Pengiriman</h3>
                  <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Penerima</span>
                        <span className="font-medium text-gray-900 text-right">{order.guest_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Telepon</span>
                        <span className="font-medium text-gray-900 text-right">{order.phone}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {order.delivery_type === 'delivery' ? (
                      <div>
                        <span className="text-gray-400 block mb-1">Alamat Pengiriman</span>
                        <p className="font-medium text-gray-900">{order.address}</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-gray-400 block mb-1">Metode Pengiriman</span>
                        <p className="font-medium text-gray-900 mb-2">Ambil di Toko (Pickup)</p>
                        {order.outlets && (
                          <div className="text-xs text-[#1e3a8a] bg-blue-50 p-2 rounded border border-blue-100">
                            Lokasi: <b>{order.outlets.name}</b><br/>{order.outlets.address}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}