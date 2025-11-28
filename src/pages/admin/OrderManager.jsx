import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageCircle, Truck, Package, Eye } from 'lucide-react';
import { getAdminOrders, updateOrderStatus, verifyPayment } from '../../services/adminService';
import { formatPrice, getStatusLabel } from '../../utils/helpers';
import Button from '../../components/common/Button';

// Helper status badge styling
const getStatusBadge = (status) => {
  const styles = {
    waiting_verification: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
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
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Masuk</h1>
      <p className="text-gray-500 mb-8">Kelola status pesanan dan verifikasi pembayaran</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID & Tanggal</th>
                <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600">Item</th>
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
                     <div className="text-xs text-gray-600 max-w-[200px] leading-relaxed">
                        {order.order_items?.map((i, idx) => (
                          <div key={idx}>• {i.quantity}x {i.products?.name}</div>
                        ))}
                     </div>
                  </td>
                  <td className="p-4 font-medium align-top">{formatPrice(order.total_cents)}</td>
                  <td className="p-4 align-top">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusBadge(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    {order.payments?.[0] ? (
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${order.payments[0].status === 'valid' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                        >
                           <Eye size={14}/> {order.payments[0].status === 'valid' ? 'Lunas' : 'Cek Bukti'}
                        </button>
                    ) : <span className="text-xs text-gray-400 italic">Belum Bayar</span>}
                  </td>
                  <td className="p-4 text-right align-top">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => sendWhatsApp(order)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Hubungi WA">
                        <MessageCircle size={18}/>
                      </button>
                      
                      {order.status === 'processing' && (
                         <button onClick={() => handleStatusChange(order.id, 'shipped')} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors" title="Tandai Dikirim">
                            <Truck size={18}/>
                         </button>
                      )}
                      
                      {order.status === 'shipped' && (
                         <button onClick={() => handleStatusChange(order.id, 'completed')} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Tandai Selesai">
                            <CheckCircle size={18}/>
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">Belum ada pesanan masuk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Verifikasi Pembayaran */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Bukti Pembayaran</h3>
                  <p className="text-xs text-gray-500">{selectedOrder.tracking_code} - {formatPrice(selectedOrder.total_cents)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-full"><XCircle className="text-gray-500"/></button>
             </div>
             
             <div className="mb-6 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center min-h-[200px]">
                {selectedOrder.payments[0]?.image ? (
                  <img src={selectedOrder.payments[0].image} alt="Bukti Bayar" className="w-full h-full object-contain max-h-[60vh]"/>
                ) : (
                  <p className="text-gray-400">Gambar tidak dimuat</p>
                )}
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <Button className="bg-red-100 text-red-700 hover:bg-red-200 border border-red-200" onClick={() => handlePaymentVerify(selectedOrder.id, 'invalid')}>Tolak (Invalid)</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handlePaymentVerify(selectedOrder.id, 'valid')}>Terima (Valid)</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}