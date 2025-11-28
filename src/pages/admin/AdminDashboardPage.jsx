import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminService';
import { formatPrice } from '../../utils/helpers';
import { ShoppingBag, Package, Users, TrendingUp, Loader } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Pendapatan', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Total Pesanan', value: stats.ordersCount, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Produk', value: stats.productsCount, icon: Package, color: 'bg-orange-500' },
    { label: 'Admin Users', value: stats.usersCount, icon: Users, color: 'bg-purple-500' },
  ];

  if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-[#1e3a8a]" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500">Ringkasan performa toko Cooskie Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e3a8a] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali, Admin!</h2>
          <p className="text-blue-100 max-w-xl">
            Kelola pesanan masuk, update stok produk, dan pantau outlet Anda dengan mudah melalui panel ini.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
           <ShoppingBag size={200} />
        </div>
      </div>
    </div>
  );
}