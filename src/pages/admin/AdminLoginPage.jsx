import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react'; // Import Icon Refresh
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabaseClient';

import logoImage from '../../assets/logo-dark.png'; 

const Input = (props) => (
  <div className="mb-4">
    <input 
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
      {...props} 
    />
  </div>
);

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("Mohon isi email dan password");

    setLoading(true);
    try {
      const { user } = await signIn(email, password);

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          alert('Akses Ditolak: Akun ini bukan akun Admin.');
          await supabase.auth.signOut(); 
        }
      }
    } catch (error) {
      alert('Login Gagal: ' + (error.message || 'Email atau password salah'));
    } finally {
      setLoading(false);
    }
  };

  // Fungsi darurat untuk membersihkan cache
  const handleClearCache = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    // Hapus local storage jika perlu (opsional, hati-hati jika ada data penting)
    // localStorage.clear(); 
    window.location.reload(true); // Hard reload
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1e3a8a]">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        
        <div className="flex justify-center">
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={logoImage} 
              alt="Cooskie Logo" 
              className="h-10 w-auto mb-3 object-contain" 
            />
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Admin Login</h2>
        <p className="text-gray-500 text-sm mb-8">Masuk untuk mengelola Cooskie</p>
        
        <Input 
          placeholder="Email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button className="w-full mb-4 py-3" onClick={handleLogin} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
        
        <div className="space-y-3">
            <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="w-full text-gray-400 hover:text-gray-600"
            >
            Kembali ke Toko
            </Button>

            {/* Tombol Darurat Reset Cache */}
            <button 
                onClick={handleClearCache}
                className="flex items-center justify-center gap-1 w-full text-[10px] text-gray-300 hover:text-red-400 transition-colors uppercase tracking-wider font-bold"
            >
                <RefreshCw size={10} /> Reset Aplikasi (Clear Cache)
            </button>
        </div>

      </div>
    </div>
  );
}