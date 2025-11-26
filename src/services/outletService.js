import { supabase } from '../config/supabaseClient';

export const getOutlets = async () => {
  const { data, error } = await supabase.from('outlets').select('*');
  if (error) throw error;
  return data;
};