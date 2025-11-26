import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button'; // Sesuaikan path
import { useAuth } from '../../context/AuthContext'; // Asumsi kamu punya AuthContext

import iconImage from '../../assets/icon.png'; 

// Component Input sederhana agar styling konsisten dengan Cooskie.jsx
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
  const { login } = useAuth(); // Fungsi login dari context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulasi login sederhana (Ganti dengan logic auth backend sebenarnya)
    if (email === 'admin@cooskie.com' && password === 'admin123') {
      login({ role: 'admin', email }); 
      navigate('/admin/dashboard');
    } else {
      alert('Email atau password salah!');
    }
    setLoading(false);
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