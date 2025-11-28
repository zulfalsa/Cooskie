import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi saat ini saat aplikasi dimuat
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await checkAdminRole(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getSession();

    // Listener untuk perubahan status auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await checkAdminRole(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi untuk memeriksa apakah user adalah admin
  const checkAdminRole = async (authUser) => {
    try {
      // Cek tabel users sesuai schema database baru
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (data && data.role === 'admin') {
        setUser({ ...authUser, role: 'admin' });
      } else {
        // Jika user login tapi bukan admin, set sebagai user biasa
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setUser({ ...authUser, role: 'user' });
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);