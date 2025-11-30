import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref untuk mencegah useEffect jalan 2x (React 18 Strict Mode)
  const hasInitialized = useRef(false);

  // Helper function: Ambil Role
  const getUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("Gagal ambil role, set ke user default:", error.message);
        return 'user';
      }
      return data?.role || 'user';
    } catch (err) {
      console.error('Role check error:', err);
      return 'user';
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        // 1. Cek sesi saat ini
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const role = await getUserRole(session.user.id);
          setUser({ ...session.user, role });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth Init Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listener perubahan Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log("Auth Event:", event); // Uncomment untuk debug

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session?.user) {
             // Cek apakah user di state sudah sama, kalau beda baru update role
             // Ini mencegah fetch role berulang-ulang
             setUser(prev => {
                if(prev?.id === session.user.id) return prev; 
                return session.user; // Update sementara, role menyusul
             });
             
             const role = await getUserRole(session.user.id);
             setUser({ ...session.user, role });
             setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token baru, update session user tapi pertahankan role lama jika ada
          if (session?.user) {
             setUser(prev => ({ ...session.user, role: prev?.role || 'user' }));
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Listener onAuthStateChange akan menangani setting user & role
    return data;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           {/* Spinner sederhana */}
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);