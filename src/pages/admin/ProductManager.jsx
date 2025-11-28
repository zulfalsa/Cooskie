import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader, Image as ImageIcon, Search, CheckCircle } from 'lucide-react';
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
    setProducts(data);
    setFilteredProducts(data);
  }).catch(console.error);

  useEffect(() => { fetchProducts(); }, []);

  // Search Logic
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredProducts(products.filter(p => 
      p.name.toLowerCase().includes(lower) || 
      p.category.toLowerCase().includes(lower)
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

      await upsertProduct({ 
        ...form, 
        image: imageUrl, 
        price_cents: parseInt(form.price_cents),
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
          <p className="text-gray-500 text-sm">Kelola katalog menu cookies dan dessert</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] outline-none text-sm w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button onClick={() => openModal()}>
            <Plus size={18} /> <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
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
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
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
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(p)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Tidak ada produk ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#1e3a8a]">{form.id ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Nama Produk" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none bg-white transition-all" 
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
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
                    <ImageIcon className="mx-auto text-gray-400 mb-2" size={24}/>
                    <p className="text-sm text-gray-500 font-medium">{file ? file.name : (form.image ? 'Ganti Gambar' : 'Upload Gambar')}</p>
                 </div>
                 {(form.image || file) && <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium"><CheckCircle size={12}/> Gambar terpilih</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all" 
                  rows="3" 
                  value={form.description || ''} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Jelaskan rasa dan tekstur produk..."
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full py-3" disabled={loading}>
                {loading ? <Loader className="animate-spin mx-auto" size={20}/> : 'Simpan Produk'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}