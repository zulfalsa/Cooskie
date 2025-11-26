import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Package, CheckCircle, Search, Upload } from 'lucide-react';
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

  const isSuccess = location.state?.success; // Cek jika ini redirect dari checkout sukses

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
      navigate(`/tracking/${trackCode}`);
  };

  const handleUpload = async (e) => {
      const file = e.target.files[0];
      if(!file) return;
      
      setUploading(true);
      try {
          await uploadPaymentProof(order.id, file);
          alert('Bukti pembayaran berhasil diupload!');
          fetchOrder(trackCode); // Refresh data
      } catch (error) {
          alert('Gagal upload: ' + error.message);
      } finally {
          setUploading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8 px-4">
      <div className="max-w-lg mx-auto">
         {isSuccess && (
             <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2"/>
                 <h2 className="text-lg font-bold text-green-800">Pesanan Berhasil Dibuat!</h2>
                 <p className="text-green-700 text-sm">Simpan kode tracking ini: <b>{trackCode}</b></p>
             </div>
         )}

         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1e3a8a] mb-6">Lacak Pesanan</h1>
            <form onSubmit={handleTrack} className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Kode Tracking (CSK-...)" 
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none" 
                    value={trackCode} 
                    onChange={e => setTrackCode(e.target.value)}
                />
                <Button type="submit" disabled={loading}>Cari</Button>
            </form>
         </div>

         {order && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 animate-fade-in">
                 <div className="flex justify-between items-center border-b pb-4">
                     <div>
                         <p className="text-sm text-gray-500">Status Pesanan</p>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                             {getStatusLabel(order.status)}
                         </span>
                     </div>
                     <div className="text-right">
                         <p className="text-sm text-gray-500">Total</p>
                         <p className="font-bold text-[#1e3a8a]">{formatPrice(order.total_cents)}</p>
                     </div>
                 </div>

                 {/* Upload Bukti Bayar jika status waiting_verification */}
                 {order.status === 'waiting_verification' && !order.payments?.length && (
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                         <p className="text-sm text-blue-800 mb-3 font-medium">Silakan upload bukti transfer untuk memproses pesanan.</p>
                         <label className="cursor-pointer inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                             {uploading ? 'Mengupload...' : <><Upload size={16}/> Upload Bukti</>}
                             <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
                         </label>
                     </div>
                 )}
                 
                 {/* Jika sudah ada payment */}
                 {order.payments && (
                     <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 flex items-center gap-2">
                         <CheckCircle size={16} className="text-green-600"/> Bukti pembayaran telah diterima.
                     </div>
                 )}

                 <div>
                     <h3 className="font-bold text-gray-800 mb-3">Rincian Pesanan</h3>
                     <div className="space-y-3">
                         {order.order_items.map((item, i) => (
                             <div key={i} className="flex gap-3">
                                 <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                     {item.products?.image && <img src={item.products.image} alt="" className="w-full h-full object-cover"/>}
                                 </div>
                                 <div className="flex-1">
                                     <p className="font-medium text-sm">{item.products?.name || 'Produk'}</p>
                                     <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price_cents)}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
}