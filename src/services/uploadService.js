import { supabase } from '../config/supabaseClient';

export const uploadImage = async (file, folder = 'products') => {
  if (!file) return null;
  
  // Membuat nama file unik untuk menghindari duplikasi
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  // Upload ke bucket 'images' di Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('images') // Pastikan bucket bernama 'images' sudah dibuat di Supabase dan diset Public
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Mendapatkan URL publik agar gambar bisa ditampilkan di frontend
  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
};