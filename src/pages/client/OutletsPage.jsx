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
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1e3a8a] mt-3 mb-4">Kunjungi Outlet Kami</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outlets.map(outlet => (
            <div key={outlet.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                 {outlet.image ? (
                     <img src={outlet.image} alt={outlet.name} className="w-full h-full object-cover" />
                 ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-400"><Store size={48}/></div>
                 )}
              </div>
              <div className="p-6">
                 <h3 className="font-bold text-lg mb-4 text-[#1e3a8a]">{outlet.name}</h3>
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
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                  <a 
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