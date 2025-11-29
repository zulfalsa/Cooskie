import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { getReviewsByProductId, createReview } from '../../services/reviewService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Loader, ChevronLeft, Minus, Plus, Heart, Share2, Star, Check, User, MessageSquare, ChevronRight } from 'lucide-react';

// Simple Toast Component
const Toast = ({ message, show }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-xl transition-all duration-300 z-50 flex items-center gap-3 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <div className="bg-green-500 rounded-full p-0.5">
      <Check size={14} className="text-white" strokeWidth={3} />
    </div>
    <span className="text-sm font-medium">{message}</span>
  </div>
);

// Komponen Bintang (Read Only & Input)
const StarRating = ({ rating, setRating, interactive = false, size = 16 }) => {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        >
          <Star 
            size={size} 
            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} transition-colors`} 
          />
        </button>
      ))}
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, favorites, toggleFavorite } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '' });

  // State untuk Review & Pagination
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ guest_name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3; // Menampilkan 3 review per halaman

  // Ambil data produk & review
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          
          // Ambil review
          const reviewsData = await getReviewsByProductId(id);
          setReviews(reviewsData || []);
          
          // Hitung rata-rata rating
          if (reviewsData && reviewsData.length > 0) {
            const total = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
            setAvgRating((total / reviewsData.length).toFixed(1));
          } else {
            setAvgRating(0);
          }
        } else {
          alert("Produk tidak ditemukan");
          navigate('/catalog');
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const isFavorite = product && favorites.some(f => f.id === product.id);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
        addToCart(product);
    }
    showToast("Berhasil masuk keranjang!");
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Cek ${product.name} di Cooskie!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Link produk disalin!");
      }
    } catch (err) {
      console.log('Error sharing', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.guest_name.trim() || !reviewForm.comment.trim()) {
      return alert("Mohon lengkapi nama dan komentar.");
    }

    setSubmittingReview(true);
    try {
      const newReview = await createReview({
        product_id: product.id,
        ...reviewForm
      });
      
      // Update state lokal agar tidak perlu refresh
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      
      // Reset ke halaman pertama saat review baru masuk
      setCurrentPage(1);
      
      // Recalculate average
      const total = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
      setAvgRating((total / updatedReviews.length).toFixed(1));

      // Reset Form
      setReviewForm({ guest_name: '', rating: 5, comment: '' });
      showToast("Terima kasih atas ulasan Anda!");
    } catch (error) {
      alert("Gagal mengirim ulasan: " + error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Logic Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-[#1e3a8a]" size={40} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-6 relative font-sans">
      <Toast message={toast.message} show={toast.show} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link to="/catalog" className="hover:text-[#1e3a8a] flex items-center gap-1 transition-colors">
            <ChevronLeft size={16} /> Kembali
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* KOLOM KIRI: PRODUK UTAMA (Card menyatu seperti referensi gambar) */}
          <div className="lg:w-2/3 w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-full">
              {/* Foto Produk */}
              <div className="md:w-1/2 bg-gray-50 relative group min-h-[350px] md:min-h-full">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                  <button onClick={() => toggleFavorite(product)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-105">
                    <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>
                  <button onClick={handleShare} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all transform hover:scale-105 text-gray-500 hover:text-[#1e3a8a]">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Detail Info */}
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a8a] text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {product.category}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1 leading-tight">{product.name}</h1>
                  
                  {/* Rating Display Kecil */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                       {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={`${star <= Math.round(avgRating) ? 'fill-gray-300 text-gray-300' : 'text-gray-200 fill-gray-200'}`} />
                       ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {reviews.length > 0 ? `(${reviews.length} ulasan)` : '(Belum ada ulasan)'}
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-[#1e3a8a] mb-6">
                    {formatPrice(product.price_cents)}
                  </div>
                  
                  <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed line-clamp-4 md:line-clamp-none">
                    <p>{product.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quantity & Stock */}
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-700 text-sm ml-2">Jumlah</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => setQty(Math.max(1, qty - 1))} 
                            disabled={qty <= 1} 
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1e3a8a] disabled:opacity-30 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-bold w-8 text-center text-gray-900">{qty}</span>
                          <button 
                            onClick={() => setQty(qty + 1)} 
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1e3a8a] transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-500 font-medium mr-1">
                        Stok: <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>{product.stock}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full py-4 text-base font-bold shadow-lg shadow-blue-900/20 rounded-xl hover:-translate-y-0.5 transition-transform" 
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? `+ Keranjang - ${formatPrice(product.price_cents * qty)}` : 'Stok Habis'}
                  </Button>
                </div>
              </div>
          </div>

          {/* KOLOM KANAN: REVIEW SECTION */}
          <div className="lg:w-1/3 w-full space-y-6">
            
            {/* Form Review Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <MessageSquare size={18} className="text-[#1e3a8a]"/> Tulis Ulasan
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Rating</label>
                  <StarRating 
                    rating={reviewForm.rating} 
                    setRating={(r) => setReviewForm({...reviewForm, rating: r})} 
                    interactive={true} 
                    size={28}
                  />
                </div>
                <Input 
                  placeholder="Nama Anda (Guest)" 
                  value={reviewForm.guest_name} 
                  onChange={(e) => setReviewForm({...reviewForm, guest_name: e.target.value})}
                  required
                  className="bg-white border-gray-200 focus:border-[#1e3a8a] text-sm"
                />
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none text-sm bg-white min-h-[100px] resize-none transition-all"
                  placeholder="Ceritakan pengalaman rasa Anda..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  required
                ></textarea>
                <Button type="submit" className="w-full rounded-xl py-3 text-sm font-bold" disabled={submittingReview}>
                  {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </Button>
              </form>
            </div>

            {/* List Review Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[200px] flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <h3 className="font-bold text-gray-800 text-sm">Ulasan Pelanggan ({reviews.length})</h3>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400 flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare size={20} className="text-gray-300"/>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Belum ada ulasan.</p>
                  <p className="text-xs text-gray-400 mt-1">Jadilah yang pertama mengulas!</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    {currentReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0 animate-fade-in">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1e3a8a]/5 text-[#1e3a8a] flex items-center justify-center shrink-0 border border-[#1e3a8a]/10">
                              <User size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 line-clamp-1">{review.guest_name}</p>
                              <div className="flex items-center gap-2">
                                <StarRating rating={review.rating} size={10} />
                                <span className="text-[10px] text-gray-400">• {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 pl-11 leading-relaxed">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {reviews.length > reviewsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft size={16}/>
                      </button>
                      
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg min-w-[60px] text-center">
                        {currentPage} / {totalPages}
                      </span>

                      <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronRight size={16}/>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}