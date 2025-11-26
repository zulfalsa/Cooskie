import { supabase } from '../config/supabaseClient';

export const createOrder = async (orderData, cartItems) => {
  // 1. Buat Order Header
  // Menggunakan .select() untuk mendapatkan ID order yang baru dibuat
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      tracking_code: orderData.tracking_code,
      guest_name: orderData.guest_name,
      phone: orderData.phone,
      email: orderData.email,
      address: orderData.address,
      outlet_id: orderData.outlet_id,
      total_cents: orderData.total_cents,
      status: 'waiting_verification'
    }])
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Masukkan Item Order (Bulk Insert)
  const itemsToInsert = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    price_cents: item.price_cents, // Snapshot harga saat beli
    quantity: item.qty
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
      // Idealnya ada rollback logic di sini jika item gagal insert,
      // tapi Supabase client-side tidak support transaksi SQL langsung.
      // Di production, gunakan Supabase RPC (Postgres Functions) untuk transaksi atomik.
      console.error("Error inserting order items:", itemsError);
      throw itemsError;
  }

  return order;
};

export const getOrderByTracking = async (code) => {
  // Join tables untuk detail lengkap
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      outlets (name, address),
      order_items (
        quantity,
        price_cents,
        products (name, image)
      ),
      payments (status, image) 
    `)
    .eq('tracking_code', code)
    .single();

  if (error) throw error;
  return data;
};

export const uploadPaymentProof = async (orderId, file) => {
  try {
      // 1. Upload Image to Storage Bucket 'payment-proofs'
      // Pastikan Anda sudah membuat bucket 'payment-proofs' di Supabase Dashboard dan set policy public/auth
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;

      // 3. Insert ke tabel payments (One-to-One dengan orders)
      const { error: dbError } = await supabase
        .from('payments')
        .insert([{
          order_id: orderId,
          image: publicUrl,
          status: 'waiting_verification', // Default status
          notes: 'Uploaded by user'
        }]);

      if (dbError) throw dbError;

      return publicUrl;
  } catch (error) {
      console.error("Error uploading payment:", error);
      throw error;
  }
};