import React from 'react';
import { Star, Heart, Truck } from 'lucide-react';
import Button from '../../components/common/Button';

import bakeryImage from '../../assets/bakery.png';
import bakingImage from '../../assets/baking.png';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="relative h-64 md:h-80 bg-[#1e3a8a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img src={bakeryImage} alt="Baking" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Tentang Cooskie</h1>
          <p className="text-blue-100 text-lg">Cerita manis di balik setiap gigitan</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4 font-serif">Awal Mula Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Berawal dari dapur kecil di tahun 2020, Cooskie didirikan dengan satu misi sederhana: menciptakan cookies yang tidak hanya enak, tetapi juga membawa kebahagiaan.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami percaya bahwa bahan-bahan terbaik menghasilkan rasa terbaik. Itulah mengapa kami hanya menggunakan cokelat premium, mentega asli, dan buah-buahan segar tanpa bahan pengawet buatan.
            </p>
          </div>
          <div className="flex-1 relative">
            <img src={bakingImage} className="rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-all duration-500" alt="Baker" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center mb-20">
          {[
            { icon: Star, title: 'Kualitas Premium', desc: 'Bahan baku pilihan tanpa kompromi.' },
            { icon: Heart, title: 'Dibuat Dengan Cinta', desc: 'Dipanggang fresh setiap hari oleh tim ahli.' },
            { icon: Truck, title: 'Pengiriman Aman', desc: 'Dikemas rapi agar sampai dengan utuh.' }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-[#1e3a8a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#fefce8] rounded-3xl p-8 md:p-12 text-center border border-amber-100">
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">Bergabunglah dengan Perjalanan Kami</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">Ikuti kami di media sosial untuk update terbaru, promo menarik, dan intip proses di balik layar dapur Cooskie.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.open('https://instagram.com', '_blank')}>Ikuti Instagram</Button>
          </div>
        </div>
      </div>
    </div>
  );
}