import { supabase } from '../config/supabaseClient';

// --- DASHBOARD STATS ---
export const getDashboardStats = async () => {
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true }); 
  
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_cents')
    .in('status', ['completed', 'shipped']);
  
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.total_cents, 0) || 0;

  return { productsCount, ordersCount, usersCount, totalRevenue };
};

// --- PRODUCTS ---
export const getAdminProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const upsertProduct = async (product) => {
  if (!product.id) delete product.id;
  const { data, error } = await supabase.from('products').upsert(product).select().single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

// --- OUTLETS ---
export const getAdminOutlets = async () => {
  const { data, error } = await supabase.from('outlets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const upsertOutlet = async (outlet) => {
  if (!outlet.id) delete outlet.id;
  const { data, error } = await supabase.from('outlets').upsert(outlet).select().single();
  if (error) throw error;
  return data;
};

export const deleteOutlet = async (id) => {
  const { error } = await supabase.from('outlets').delete().eq('id', id);
  if (error) throw error;
};

// --- ORDERS ---
export const getAdminOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      outlets (name),
      payments (image, status),
      order_items (
        quantity,
        price_cents,
        products (name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
};

// --- PAYMENT ACTIONS ---

// 1. Terima Pembayaran (Valid)
export const verifyPayment = async (orderId) => {
  // Update status di tabel payments menjadi 'valid'
  const { error: payError } = await supabase
    .from('payments')
    .update({ status: 'valid' })
    .eq('order_id', orderId);
  
  if (payError) throw payError;

  // Otomatis update status pesanan menjadi 'processing'
  await updateOrderStatus(orderId, 'processing');
};

// 2. Tolak Pembayaran (Hapus Data Payment)
export const deletePayment = async (orderId) => {
  // Opsional: Hapus file dari storage jika perlu (memerlukan nama file)
  // const { data: payment } = await supabase.from('payments').select('image').eq('order_id', orderId).single();
  // if (payment?.image) { ... logic hapus storage ... }

  // Hapus record dari tabel payments
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('order_id', orderId);

  if (error) throw error;

  // Kembalikan status pesanan ke 'waiting_verification' (agar user bisa upload ulang)
  // Atau biarkan tetap 'waiting_verification' (default)
  await updateOrderStatus(orderId, 'waiting_verification');
};