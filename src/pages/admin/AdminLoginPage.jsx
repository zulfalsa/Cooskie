import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext'; // Pastikan path ini benar
import { supabase } from '../../config/supabaseClient'; // Tambahkan import supabase untuk cek role manual

import iconImage from '../../assets/icon.png'; 

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
  const { signIn } = useAuth(); // Gunakan 'signIn', bukan 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("Mohon isi email dan password");

    setLoading(true);
    try {
      // 1. Login ke Supabase Auth
      const { user } = await signIn(email, password);

      if (user) {
        // 2. Cek Role Admin secara manual untuk keamanan ganda sebelum redirect
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          alert('Akses Ditolak: Akun ini bukan akun Admin.');
          // Opsional: Logout paksa jika bukan admin
          await supabase.auth.signOut(); 
        }
      }
    } catch (error) {
      // Pesan error dari Supabase (misal: Invalid login credentials)
      alert('Login Gagal: ' + (error.message || 'Email atau password salah'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1e3a8a]">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
        
        {/* Logo Icon */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={iconImage} 
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
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="w-full text-gray-400 hover:text-gray-600"
        >
          Kembali ke Toko
        </Button>

      </div>
    </div>
  );
}