import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, X, Loader, Image as ImageIcon, Search, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminOutlets, upsertOutlet, deleteOutlet } from '../../services/adminService';
import { uploadImage } from '../../services/uploadService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function OutletManager() {
  const [outlets, setOutlets] = useState([]);
  const [filteredOutlets, setFilteredOutlets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');

  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchOutlets = () => getAdminOutlets().then(data => {
    setOutlets(data || []);
    setFilteredOutlets(data || []);
  }).catch(console.error);

  useEffect(() => { fetchOutlets(); }, []);

  // Update filter & Reset halaman saat search berubah
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredOutlets(outlets.filter(o => 
      (o.name || '').toLowerCase().includes(lower) || 
      (o.address || '').toLowerCase().includes(lower)
    ));
    setCurrentPage(1);
  }, [search, outlets]);

  // Logic Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOutlets = filteredOutlets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOutlets.length / itemsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (file) {
        imageUrl = await uploadImage(file, 'outlets');
      }

      await upsertOutlet({ ...form, image: imageUrl });
      setIsModalOpen(false);
      setForm({});
      setFile(null);
      fetchOutlets();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus outlet ini?')) {
      await deleteOutlet(id);
      fetchOutlets();
    }
  };

  const openModal = (outlet = {}) => {
    setForm(outlet);
    setFile(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Outlet</h1>
          <p className="text-gray-500 text-sm">Atur lokasi toko fisik Cooskie</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari outlet..." 
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm w-full shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button onClick={() => openModal()} className="whitespace-nowrap shadow-lg shadow-blue-900/20">
            <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 w-24">Foto</th>
                <th className="p-4 font-semibold text-gray-600">Nama Outlet</th>
                <th className="p-4 font-semibold text-gray-600">Alamat</th>
                <th className="p-4 font-semibold text-gray-600">Kontak & Jam</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentOutlets.map(outlet => (
                <tr key={outlet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                      {outlet.image ? <img src={outlet.image} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="m-auto mt-3 text-gray-400" size={20}/>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#1e3a8a] text-base">{outlet.name}</td>
                  <td className="p-4">
                    <div className="flex gap-2 items-start max-w-xs text-gray-600 whitespace-normal">
                      <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400"/> 
                      <span className="line-clamp-2">{outlet.address || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 space-y-1">
                    <div className="text-xs">📞 {outlet.phone || '-'}</div>
                    <div className="text-xs">🕒 {outlet.hours || '-'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(outlet)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(outlet.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARD LIST) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentOutlets.map(outlet => (
          <div key={outlet.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gray-100 relative">
               {outlet.image ? <img src={outlet.image} className="w-full h-full object-cover" alt=""/> : <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={32}/></div>}
               <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => openModal(outlet)} className="p-2 bg-white/90 rounded-lg text-blue-600 shadow-sm"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(outlet.id)} className="p-2 bg-white/90 rounded-lg text-red-600 shadow-sm"><Trash2 size={16}/></button>
               </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#1e3a8a] text-lg mb-2">{outlet.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex gap-2 items-start">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400"/>
                  <span>{outlet.address || '-'}</span>
                </div>
                <div className="flex gap-4 pt-2 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-1.5"><Phone size={14}/> {outlet.phone || '-'}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14}/> {outlet.hours || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {currentOutlets.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <MapPin size={48} className="mx-auto mb-2 opacity-20"/>
            Tidak ada outlet
          </div>
        )}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium text-gray-600">
          Halaman {currentPage} dari {totalPages || 1}
        </span>
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-[#1e3a8a]">{form.id ? 'Edit Outlet' : 'Tambah Outlet'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nama Outlet" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all min-h-[80px]" 
                    value={form.address || ''} 
                    onChange={e => setForm({...form, address: e.target.value})} 
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <Input label="Telepon" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
                   <Input label="Jam Operasional" value={form.hours || ''} onChange={e => setForm({...form, hours: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Input label="Latitude" type="number" step="any" value={form.lat || ''} onChange={e => setForm({...form, lat: e.target.value})} placeholder="-6.xxxx" />
                   <Input label="Longitude" type="number" step="any" value={form.lng || ''} onChange={e => setForm({...form, lng: e.target.value})} placeholder="106.xxxx" />
                </div>

                <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Foto Outlet</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files[0])} />
                      <div className="pointer-events-none">
                         <ImageIcon className="mx-auto text-gray-400 group-hover:text-[#1e3a8a] mb-2" size={24}/>
                         <p className="text-sm text-gray-500 font-medium truncate">
                           {file ? file.name : 'Klik untuk upload'}
                         </p>
                      </div>
                   </div>
                </div>

                <Button type="submit" className="w-full mt-4 py-3.5 shadow-lg" disabled={loading}>
                  {loading ? <Loader className="animate-spin mx-auto"/> : 'Simpan Outlet'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}