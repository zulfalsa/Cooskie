import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageCircle, Truck, Eye, Calendar, User, Box } from 'lucide-react';
import { getAdminOrders, updateOrderStatus, verifyPayment } from '../../services/adminService';
import { formatPrice, getStatusLabel } from '../../utils/helpers';
import Button from '../../components/common/Button';

// Helper status badge styling
const getStatusBadge = (status) => {
  const styles = {
    waiting_verification: 'bg-yellow-100 text-center text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-center text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-center text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-center text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-center text-red-700 border-red-200'
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
};

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => getAdminOrders().then(setOrders).catch(console.error);

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    if (confirm(`Ubah status pesanan menjadi ${getStatusLabel(status)}?`)) {
        await updateOrderStatus(id, status);
        fetchOrders();
    }
  };

  const handlePaymentVerify = async (orderId, status) => {
    await verifyPayment(orderId, status);
    fetchOrders();
    setSelectedOrder(null);
  };

  const sendWhatsApp = (order) => {
    const message = `Halo Kak ${order.guest_name}, pesanan Cooskie Anda dengan ID *${order.tracking_code}* saat ini statusnya: *${getStatusLabel(order.status)}*. Terima kasih!`;
    const phone = order.phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Masuk</h1>
        <p className="text-gray-500">Kelola status pesanan dan verifikasi pembayaran</p>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID & Tanggal</th>
                <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600 min-w-[200px]">Item</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Pembayaran</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-mono font-bold text-[#1e3a8a]">{order.tracking_code}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(order.created_at)}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold text-gray-900">{order.guest_name}</div>
                    <div className="text-xs text-gray-500">{order.outlet_id ? 'Pickup: ' + order.outlets?.name : 'Delivery'}</div>
                  </td>
                  <td className="p-4 align-top">
                     <div className="text-xs text-gray-600 leading-relaxed whitespace-normal">
                        {order.order_items?.map((i, idx) => (
                          <div key={idx}>• {i.quantity}x {i.products?.name}</div>
                        ))}
                     </div>
                  </td>
                  <td className="p-4 font-medium align-top">{formatPrice(order.total_cents)}</td>
                  <td className="p-4 align-top">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    {order.payments?.[0] ? (
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${order.payments[0].status === 'valid' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                        >
                           <Eye size={14}/> {order.payments[0].status === 'valid' ? 'Lunas' : 'Cek Bukti'}
                        </button>
                    ) : <span className="text-xs text-gray-400 italic">Belum Bayar</span>}
                  </td>
                  <td className="p-4 text-right align-top">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => sendWhatsApp(order)} className="p-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors" title="Hubungi WA">
                        <MessageCircle size={18}/>
                      </button>
                      
                      {order.status === 'processing' && (
                         <button onClick={() => handleStatusChange(order.id, 'shipped')} className="p-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors" title="Tandai Dikirim">
                            <Truck size={18}/>
                         </button>
                      )}
                      
                      {order.status === 'shipped' && (
                         <button onClick={() => handleStatusChange(order.id, 'completed')} className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" title="Tandai Selesai">
                            <CheckCircle size={18}/>
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARD LIST) --- */}
      <div className="md:hidden space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-[#1e3a8a] text-lg">{order.tracking_code}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Calendar size={12}/> {formatDate(order.created_at)}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusBadge(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Body Info */}
            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <User size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                <div>
                  <p className="text-sm font-bold text-gray-800">{order.guest_name}</p>
                  <p className="text-xs text-gray-500">{order.outlet_id ? 'Ambil di: ' + order.outlets?.name : 'Dikirim ke Alamat'}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Box size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                <div className="text-sm text-gray-600">
                   {order.order_items?.map((i, idx) => (
                      <div key={idx} className="flex justify-between w-full gap-4">
                        <span>{i.products?.name}</span>
                        <span className="font-mono text-gray-400">x{i.quantity}</span>
                      </div>
                   ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Total Tagihan</span>
                <span className="text-lg font-bold text-[#1e3a8a]">{formatPrice(order.total_cents)}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="grid grid-cols-2 gap-3">
               {/* Kolom Kiri: Status Pembayaran */}
               {order.payments?.[0] ? (
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border w-full ${order.payments[0].status === 'valid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                  >
                      <Eye size={14}/> {order.payments[0].status === 'valid' ? 'Lunas' : 'Verifikasi'}
                  </button>
               ) : (
                 <div className="flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
                   Belum Bayar
                 </div>
               )}

               {/* Kolom Kanan: Action Buttons */}
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
        ))}
        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Box size={48} className="mx-auto mb-2 opacity-20"/>
            Belum ada pesanan
          </div>
        )}
      </div>

      {/* Mobile Friendly Modal for Payment Verification */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-fade-in max-h-[90vh]">
             
             <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Bukti Pembayaran</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedOrder.tracking_code}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XCircle className="text-gray-500"/></button>
             </div>
             
             <div className="p-5 overflow-y-auto bg-gray-50">
               <div className="bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center min-h-[250px]">
                  {selectedOrder.payments[0]?.image ? (
                    <img src={selectedOrder.payments[0].image} alt="Bukti Bayar" className="w-full h-auto max-h-[50vh] object-contain rounded-lg"/>
                  ) : (
                    <p className="text-gray-400">Gambar tidak dimuat</p>
                  )}
               </div>
               <div className="mt-3 text-center">
                 <p className="text-sm text-gray-600 font-medium">Total Tagihan: <span className="text-[#1e3a8a] font-bold text-lg">{formatPrice(selectedOrder.total_cents)}</span></p>
               </div>
             </div>
             
             <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-white text-red-600 border border-red-200 hover:bg-red-50" onClick={() => handlePaymentVerify(selectedOrder.id, 'invalid')}>
                      Tolak
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20" onClick={() => handlePaymentVerify(selectedOrder.id, 'valid')}>
                      Terima Valid
                    </Button>
                </div>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}