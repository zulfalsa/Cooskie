import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Phone, ExternalLink, Store } from 'lucide-react';
import { getOutlets } from '../../services/outletService';

export default function OutletsPage() {
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    getOutlets().then(setOutlets).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-12">
          {/* Badge 'Our Stores' */}
          <span className="text-[#1e3a8a] font-bold tracking-wider text-sm uppercase bg-blue-50 px-3 py-1 rounded-full">
            Our Stores
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1e3a8a] mt-3 mb-4">
            Kunjungi Outlet Kami
          </h1>
          {/* Deskripsi tambahan */}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nikmati suasana hangat dan aroma cookies yang baru dipanggang langsung di toko kami.
          </p>
        </div>

        {/* ================= OUTLETS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outlets.map(outlet => (
            <div key={outlet.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
              
              {/* IMAGE AREA dengan Gradient Overlay & Title */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {outlet.image ? (
                  <img 
                    src={outlet.image} 
                    alt={outlet.name} 
                    // Efek Zoom saat hover
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Store size={48}/>
                  </div>
                )}
                
                {/* Gradient Hitam Transparan */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                
                {/* Judul Outlet (Ditaruh di atas gambar, pojok kiri bawah) */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{outlet.name}</h3>
                </div>
              </div>

              {/* CARD BODY (Hanya detail info, judul sudah dipindah ke atas) */}
              <div className="p-6">
                <div className="space-y-4 text-gray-600">
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-5 h-5 text-[#1e3a8a] shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{outlet.address}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Clock className="w-5 h-5 text-[#1e3a8a] shrink-0" />
                    <span className="text-sm font-medium">{outlet.hours}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone className="w-5 h-5 text-[#1e3a8a] shrink-0" />
                    <span className="text-sm">{outlet.phone}</span>
                  </div>
                </div>
                
                {/* Button Section */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                  <a 
                    // Menggunakan format link Google Maps standard
                    href={`https://www.google.com/maps/search/?api=1&query=${outlet.lat},${outlet.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 text-[#1e3a8a] py-2.5 rounded-xl text-sm font-bold text-center hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Lihat Peta
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}