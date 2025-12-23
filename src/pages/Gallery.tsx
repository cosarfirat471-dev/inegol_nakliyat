// src/pages/Gallery.tsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  RiImage2Line, RiZoomInLine, RiUploadCloud2Line, 
  RiChatQuoteLine, RiUser3Line, RiSendPlaneFill, RiTimeLine 
} from 'react-icons/ri';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const Gallery: React.FC = () => {
  const { data, updateData } = useData(); 
  const galleryImages = data?.gallery || [];
  const reviews = data?.reviews || [];

  // Yorum Formu State'leri
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error('Lütfen isim ve yorum yazınız.');
      return;
    }

    setSending(true);
    try {
      const newReview = {
        id: Date.now(),
        name: name.trim(),
        text: comment.trim(),
        date: new Date().toLocaleDateString('tr-TR'),
        // Rastgele renkli avatar
        avatarColor: `hsl(${Math.random() * 360}, 70%, 50%)` 
      };

      // Mevcut yorumların başına yenisini ekle
      const updatedReviews = [newReview, ...reviews];
      
      // Veritabanını güncelle
      await updateData('reviews', updatedReviews);
      
      toast.success('Yorumunuz başarıyla eklendi!');
      setName('');
      setComment('');
    } catch (error) {
      console.error(error);
      toast.error('Yorum gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <Helmet>
        <title>Galeri & Müşteri Yorumları | İnegöl Nakliyat</title>
        <meta name="description" content="İnegöl Nakliyat araç filosu, tamamlanan taşımalarımız ve gerçek müşteri yorumları. Referanslarımızı inceleyin ve siz de yorum yapın." />
        <link rel="canonical" href="https://www.inegolevdenevenakliye.com/gallery" />
        
        {/* Social Media Tags */}
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Galeri & Müşteri Yorumları | İnegöl Nakliyat" />
        <meta property="og:description" content="Referanslarımız ve müşteri yorumları. İnegöl Nakliyat güvencesi." />
        <meta property="og:url" content="https://www.inegolevdenevenakliye.com/gallery" />
        <meta property="og:image" content="https://www.inegolevdenevenakliye.com/og-image.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galeri ve Referanslar | İnegöl Nakliyat" />
        <meta name="twitter:description" content="Mutlu müşterilerimiz ve araç filomuz." />
        <meta name="twitter:image" content="https://www.inegolevdenevenakliye.com/og-image.jpg" />
      </Helmet>

      <header className="text-center mb-12">
        <RiImage2Line className="text-6xl text-brand-blue mx-auto mb-4 shadow-neon-blue rounded-xl p-2" />
        <h1 className="text-4xl font-extrabold text-white mb-3">Fotoğraf Galerisi</h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Sözle değil, icraatle konuşuyoruz. Tamamladığımız taşımalardan ve geniş araç filomuzdan kareler.
        </p>
      </header>

      {/* GALERİ GRID */}
      {galleryImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
          {galleryImages.map((img: any, index: number) => (
            <div 
              key={img.id} 
              className="group relative h-72 rounded-2xl overflow-hidden border border-glass-border-dark cursor-pointer shadow-glass hover:shadow-neon-blue transition-all duration-500"
            >
              <img 
                src={img.url} 
                alt={`İnegöl Nakliyat Referans ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {img.date || 'Referans'}
                </span>
                <RiZoomInLine className="text-3xl text-text-muted mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700 mb-20">
          <RiUploadCloud2Line className="text-6xl mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-xl">Henüz galeriye fotoğraf yüklenmedi.</p>
        </div>
      )}

      {/* --- MÜŞTERİ YORUMLARI BÖLÜMÜ --- */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <RiChatQuoteLine className="text-5xl text-green-500 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-white">Müşteri Yorumları</h2>
          <p className="text-slate-400">Hizmetimiz hakkında düşüncelerinizi paylaşın.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* YORUM YAPMA FORMU */}
          <div className="glass-card p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <RiSendPlaneFill className="text-brand-blue" /> Yorum Yap
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">İsim Soyisim</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all"
                  placeholder="Adınız..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Düşünceleriniz</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-all resize-none"
                  placeholder="Hizmetimizden memnun kaldınız mı?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={300}
                />
              </div>
              <button 
                disabled={sending}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-neon-blue disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? 'Gönderiliyor...' : (
                    <>
                        <RiSendPlaneFill /> Yorumu Gönder
                    </>
                )}
              </button>
            </form>
          </div>

          {/* YORUM LİSTESİ */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev: any) => (
                <div key={rev.id} className="bg-[#111] border border-slate-800 p-5 rounded-2xl hover:border-slate-600 transition-colors animate-fadeIn">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{ backgroundColor: rev.avatarColor || '#007aff' }}
                    >
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <RiTimeLine /> {rev.date}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                <RiUser3Line className="text-4xl mx-auto mb-2 opacity-50" />
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Gallery;