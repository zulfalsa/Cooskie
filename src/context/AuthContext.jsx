import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasInitialized = useRef(false);
  const isCheckingRole = useRef(false);

  // FIX: Cek Role sekali saja
  const checkAdminRole = async (authUser) => {
    if (!authUser || isCheckingRole.current) return;

    isCheckingRole.current = true;

    try {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();

      setUser({ ...authUser, role: data?.role || 'user' });
    } catch (err) {
      console.error('role check failed:', err);
      setUser({ ...authUser, role: 'user' });
    } finally {
      isCheckingRole.current = false;
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return; // FIX: cegah double init
    hasInitialized.current = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          await checkAdminRole(session.user);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Abaikan TOKEN_REFRESHED → perbaiki WSOD
        if (event === 'TOKEN_REFRESHED') return;

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session?.user) await checkAdminRole(session.user);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    await checkAdminRole(data.user);
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);

    // ❗ PWA-SAFE: jangan full reload
    // React akan rerender tanpa user = logout aman
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
