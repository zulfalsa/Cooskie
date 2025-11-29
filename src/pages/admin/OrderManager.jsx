import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageCircle, Truck, Eye, Calendar, User, Box, ExternalLink, AlertTriangle, X } from 'lucide-react';
// Import fungsi deletePayment yang baru
import { getAdminOrders, updateOrderStatus, verifyPayment, deletePayment } from '../../services/adminService';
import { formatPrice, getStatusLabel } from '../../utils/helpers';
import Button from '../../components/common/Button';

// Helper styling badge status pesanan
const getStatusBadge = (status) => {
  const styles = {
    waiting_verification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
};

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State untuk modal bukti bayar

  const fetchOrders = () => getAdminOrders().then(setOrders).catch(console.error);

  useEffect(() => { fetchOrders(); }, []);

  // Handler ubah status pesanan manual
  const handleStatusChange = async (id, status) => {
    if (confirm(`Ubah status pesanan menjadi ${getStatusLabel(status)}?`)) {
        await updateOrderStatus(id, status);
        fetchOrders();
    }
  };

  // Handler validasi pembayaran (Updated Logic)
  const handlePaymentVerify = async (orderId, action) => {
    try {
        if (action === 'valid') {
            if (confirm('Terima pembayaran? Status Order -> "Diproses", Payment -> "Valid".')) {
                await verifyPayment(orderId);
                fetchOrders();
                setSelectedOrder(null);
            }
        } else if (action === 'invalid') {
            if (confirm('Tolak pembayaran? Data pembayaran akan DIHAPUS agar user upload ulang.')) {
                await deletePayment(orderId);
                fetchOrders();
                setSelectedOrder(null);
            }
        }
    } catch (error) {
        alert("Gagal memproses: " + error.message);
    }
  };

  const sendWhatsApp = (order) => {
    const message = `Halo Kak ${order.guest_name}, pesanan Cooskie Anda dengan ID *${order.tracking_code}* saat ini statusnya: *${getStatusLabel(order.status)}*. Terima kasih!`;
    const phone = order.phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Helper untuk mendapatkan objek payment dengan aman
  const getPaymentData = (order) => {
    if (!order.payments) return null;
    const payment = Array.isArray(order.payments) ? order.payments[0] : order.payments;
    return payment || null;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Pesanan</h1>
        <p className="text-gray-500">Pantau pembayaran masuk dan ubah status pengiriman.</p>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4">ID & Tanggal</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Item</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status Pesanan</th>
                <th className="p-4">Status Pembayaran</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => {
                const payment = getPaymentData(order);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-mono font-bold text-[#1e3a8a]">{order.tracking_code}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-900">{order.guest_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.outlet_id ? 'Pickup: ' + order.outlets?.name : 'Delivery'}</div>
                    </td>
                    <td className="p-4 align-top">
                       <div className="text-xs text-gray-600">
                          {order.order_items?.map((i, idx) => (
                            <div key={idx} className="whitespace-nowrap">• {i.quantity}x {i.products?.name}</div>
                          ))}
                       </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800 align-top">{formatPrice(order.total_cents)}</td>
                    <td className="p-4 align-top">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    {/* KOLOM STATUS PEMBAYARAN */}
                    <td className="p-4 align-top">
                      {payment ? (
                          <div className="flex flex-col items-start gap-2">
                            {payment.status === 'valid' ? (
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                    <CheckCircle size={14}/> Lunas
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-yellow-600 flex items-center gap-1">
                                    <AlertTriangle size={14}/> Perlu Cek
                                </span>
                            )}
                            <div className="flex gap-3 text-xs">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                >
                                   <Eye size={12}/> Lihat
                                </button>
                                {payment.image && (
                                  <a 
                                    href={payment.image}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1 transition-colors"
                                  >
                                    <ExternalLink size={12}/> Link
                                  </a>
                                )}
                            </div>
                          </div>
                      ) : (
                          <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-1 rounded">Belum Bayar</span>
                      )}
                    </td>
                    <td className="p-4 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => sendWhatsApp(order)} className="p-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors" title="Chat WA">
                          <MessageCircle size={16}/>
                        </button>
                        {order.status === 'processing' && (
                           <button onClick={() => handleStatusChange(order.id, 'shipped')} className="p-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors" title="Kirim Pesanan">
                              <Truck size={16}/>
                           </button>
                        )}
                        {order.status === 'shipped' && (
                           <button onClick={() => handleStatusChange(order.id, 'completed')} className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" title="Selesaikan Pesanan">
                              <CheckCircle size={16}/>
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {orders.map(order => {
           const payment = getPaymentData(order);
           return (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                <div>
                  <div className="font-mono font-bold text-[#1e3a8a] text-lg">{order.tracking_code}</div>
                  <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              {/* (Bagian detail item sama seperti sebelumnya...) */}
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <User size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{order.guest_name}</p>
                    <p className="text-xs text-gray-500">{order.outlet_id ? 'Pickup' : 'Delivery'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-lg font-bold text-[#1e3a8a]">{formatPrice(order.total_cents)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {payment ? (
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border w-full ${payment.status === 'valid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                    >
                        <Eye size={14}/> {payment.status === 'valid' ? 'Bukti (Lunas)' : 'Verifikasi'}
                    </button>
                 ) : (
                   <div className="flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
                     Belum Bayar
                   </div>
                 )}
                 <div className="flex gap-2 justify-end">
                    <button onClick={() => sendWhatsApp(order)} className="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-xl hover:bg-green-100 flex items-center justify-center">
                      <MessageCircle size={18}/>
                    </button>
                    {order.status === 'processing' && (
                        <button onClick={() => handleStatusChange(order.id, 'shipped')} className="flex-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-100 flex items-center justify-center">
                          <Truck size={18}/>
                        </button>
                    )}
                    {order.status === 'shipped' && (
                        <button onClick={() => handleStatusChange(order.id, 'completed')} className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 flex items-center justify-center">
                          <CheckCircle size={18}/>
                        </button>
                    )}
                 </div>
              </div>
            </div>
           );
        })}
      </div>

      {/* --- MODAL VALIDASI PEMBAYARAN --- */}
      {selectedOrder && getPaymentData(selectedOrder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
             
             {/* Use Helper Variable */}
             {(() => {
                const payment = getPaymentData(selectedOrder);
                return (
                  <>
                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">Verifikasi Pembayaran</h3>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedOrder.tracking_code}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="text-gray-500"/></button>
                    </div>
                    
                    <div className="p-5 overflow-y-auto bg-gray-50 flex-1">
                      <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm mb-4">
                          <img 
                            src={payment.image} 
                            alt="Bukti Bayar" 
                            className="w-full h-auto object-contain rounded-lg max-h-[40vh] mx-auto"
                          />
                      </div>
                      <a 
                        href={payment.image} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-[#1e3a8a] font-semibold hover:underline mb-6"
                      >
                        <ExternalLink size={16}/> Buka Gambar di Tab Baru
                      </a>
                      <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Tagihan</p>
                        <p className="text-2xl font-bold text-[#1e3a8a]">{formatPrice(selectedOrder.total_cents)}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Status saat ini: <span className="font-bold text-gray-600 uppercase">{payment.status}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl">
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                              // Tombol Tolak Merah Solid
                              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 border-transparent" 
                              onClick={() => handlePaymentVerify(selectedOrder.id, 'invalid')}
                            >
                              Tolak (Hapus)
                            </Button>
                            <Button 
                              className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 border-transparent" 
                              onClick={() => handlePaymentVerify(selectedOrder.id, 'valid')}
                            >
                              Terima (Valid)
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-3">
                          *Terima: Order Diproses. Tolak: Hapus Pembayaran.
                        </p>
                    </div>
                  </>
                );
             })()}
          </div>
        </div>
      )}
    </div>
  );
}