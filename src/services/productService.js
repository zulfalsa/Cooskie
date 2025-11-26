import { supabase } from '../config/supabaseClient';

export const getProducts = async (category = 'all', searchQuery = '') => {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};