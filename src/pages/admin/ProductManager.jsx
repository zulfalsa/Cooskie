import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader, Image as ImageIcon, Search, CheckCircle, Package } from 'lucide-react';
import { getAdminProducts, upsertProduct, deleteProduct } from '../../services/adminService';
import { uploadImage } from '../../services/uploadService';
import { formatPrice } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = () => getAdminProducts().then(data => {
    setProducts(data || []);
    setFilteredProducts(data || []);
  }).catch(console.error);

  useEffect(() => { fetchProducts(); }, []);

  // --- PERBAIKAN 1: SEARCH LOGIC YANG AMAN ---
  // Menambahkan ( ... || '') untuk mencegah error "Cannot read properties of null (reading 'toLowerCase')"
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredProducts(products.filter(p => 
      (p.name || '').toLowerCase().includes(lower) || 
      (p.category || '').toLowerCase().includes(lower)
    ));
  }, [search, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;
      if (file) {
        imageUrl = await uploadImage(file, 'products');
      }

      // --- PERBAIKAN 2: SLUG GENERATION YANG AMAN ---
      const productName = form.name || '';
      const generatedSlug = productName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

      await upsertProduct({ 
        ...form, 
        slug: form.slug || generatedSlug, 
        image: imageUrl, 
        price_cents: parseInt(form.price_cents || 0),
        stock: parseInt(form.stock || 0)
      });
      
      setIsModalOpen(false);
      setForm({});
      setFile(null);
      fetchProducts();
    } catch (error) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const openModal = (product = {}) => {
    setForm(product);
    setFile(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
          <p className="text-gray-500 text-sm">Kelola katalog menu cookies dan dessert</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari produk..." 
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

      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 w-20">Gambar</th>
                <th className="p-4 font-semibold text-gray-600">Nama Produk</th>
                <th className="p-4 font-semibold text-gray-600">Kategori</th>
                <th className="p-4 font-semibold text-gray-600">Harga</th>
                <th className="p-4 font-semibold text-gray-600">Stok</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                      {p.image ? <img src={p.image} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="m-auto mt-3 text-gray-400" size={20}/>}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{p.name}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${p.category === 'cookies' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-pink-50 text-pink-700 border-pink-100'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600 font-medium">{formatPrice(p.price_cents)}</td>
                  <td className="p-4">
                    <span className={`font-bold ${p.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(p)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
               {p.image ? <img src={p.image} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 text-sm truncate pr-2">{p.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${p.category === 'cookies' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-pink-50 text-pink-700 border-pink-100'}`}>
                    {p.category}
                  </span>
                </div>
                <p className="text-[#1e3a8a] font-bold font-mono text-sm">{formatPrice(p.price_cents)}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Package size={12}/> Stok: <span className={p.stock < 10 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{p.stock}</span>
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => openModal(p)} 
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 py-1.5 rounded-lg text-xs font-bold active:bg-blue-100"
                >
                  <Edit size={14}/> Edit
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="w-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg text-xs active:bg-red-100"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Package size={48} className="mx-auto mb-2 opacity-20"/>
            Tidak ada produk
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h3 className="text-xl font-bold text-[#1e3a8a]">{form.id ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500"/>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Nama Produk" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white transition-all appearance-none" 
                      value={form.category || 'cookies'} 
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option value="cookies">Cookies</option>
                      <option value="dessert">Dessert</option>
                    </select>
                  </div>
                  <Input label="Harga (Rp)" type="number" value={form.price_cents || ''} onChange={e => setForm({...form, price_cents: e.target.value})} required />
                </div>

                <Input label="Stok" type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: e.target.value})} />

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files[0])} />
                      <div className="pointer-events-none">
                        <ImageIcon className="mx-auto text-gray-400 group-hover:text-[#1e3a8a] mb-2 transition-colors" size={32}/>
                        <p className="text-sm text-gray-500 font-medium truncate px-2">
                          {file ? file.name : (form.image ? 'Ganti Gambar' : 'Klik untuk upload gambar')}
                        </p>
                      </div>
                   </div>
                   {(form.image || file) && (
                     <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                       <CheckCircle size={12}/> Gambar terpilih
                     </p>
                   )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all min-h-[100px]" 
                    value={form.description || ''} 
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Jelaskan rasa dan tekstur produk..."
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full py-3.5 text-lg shadow-lg" disabled={loading}>
                  {loading ? <Loader className="animate-spin mx-auto" size={24}/> : 'Simpan Produk'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}