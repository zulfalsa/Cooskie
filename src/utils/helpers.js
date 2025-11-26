export const formatPrice = (cents) => {
  // Asumsi price_cents di DB adalah Rupiah penuh (misal 15000), bukan sen dolar
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(cents);
};

export const generateTrackingCode = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CSK-${random}-${timestamp}`;
};

// Helper untuk enum status agar lebih user friendly
export const getStatusLabel = (status) => {
  const labels = {
    waiting_verification: 'Menunggu Verifikasi',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
    const colors = {
        waiting_verification: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}