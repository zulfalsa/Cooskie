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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Ringkasan performa toko Cooskie Anda.</p>
      </div>

      {/* Stats Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200 shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{stat.label}</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 truncate">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Banner */}
      <div className="bg-[#1e3a8a] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 pr-16 md:pr-0">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Selamat Datang Kembali, Admin!</h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">
            Kelola pesanan masuk, update stok produk, dan pantau outlet Anda dengan mudah melalui panel ini.
          </p>
        </div>
        {/* Decorative Icon */}
        <div className="absolute -right-4 -bottom-8 md:right-0 md:bottom-0 opacity-10 transform translate-x-4 translate-y-4 md:translate-x-10 md:translate-y-10">
           <ShoppingBag size={140} className="md:w-[200px] md:h-[200px]" />
        </div>
      </div>
    </div>
  );
}