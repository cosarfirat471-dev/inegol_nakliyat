// src/pages/Admin/pages/GalleryManager.tsx

import React, { useState } from 'react';
import AdminLayout from '../AdminLayout';
import { useData } from '../../../context/DataContext';
import { RiDeleteBinLine, RiImageAddLine, RiUploadCloud2Line, RiChatQuoteLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const { data, updateData } = useData();
  const [uploading, setUploading] = useState(false);
  
  // YENİ: Sekme Yönetimi (Fotoğraflar veya Yorumlar)
  const [activeTab, setActiveTab] = useState<'photos' | 'reviews'>('photos');

  // --- FOTOĞRAF İŞLEMLERİ ---
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scaleFactor = 800 / img.width;
          canvas.width = 800;
          canvas.height = img.height * scaleFactor;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading('Fotoğraf işleniyor...');
    try {
      const base64String = await convertToBase64(file);
      const currentGallery = Array.isArray(data.gallery) ? data.gallery : [];
      const newImage = {
        id: Date.now(),
        url: base64String,
        name: file.name,
        date: new Date().toLocaleDateString('tr-TR')
      };
      await updateData('gallery', [newImage, ...currentGallery]);
      toast.success('Fotoğraf galeriye eklendi!', { id: toastId });
    } catch (error) {
      toast.error('Yükleme başarısız oldu.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: any) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğine emin misin?')) return;
    const toastId = toast.loading('Siliniyor...');
    try {
      const currentGallery = Array.isArray(data.gallery) ? data.gallery : [];
      const newGallery = currentGallery.filter((img: any) => img.id !== image.id);
      await updateData('gallery', newGallery);
      toast.success('Fotoğraf silindi.', { id: toastId });
    } catch (error) {
      toast.error('Silme işlemi başarısız.', { id: toastId });
    }
  };

  // --- YORUM İŞLEMLERİ (YENİ) ---
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Bu yorumu silmek istediğine emin misin?')) return;
    const toastId = toast.loading('Yorum siliniyor...');
    try {
        const currentReviews = Array.isArray(data.reviews) ? data.reviews : [];
        const newReviews = currentReviews.filter((rev: any) => rev.id !== reviewId);
        await updateData('reviews', newReviews);
        toast.success('Yorum silindi.', { id: toastId });
    } catch (error) {
        toast.error('Hata oluştu.', { id: toastId });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Galeri & Yorum Yönetimi</h2>
          <p className="text-slate-400">Fotoğraf yükleyin veya müşteri yorumlarını yönetin.</p>
        </div>
        
        {/* TAB BUTONLARI */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'photos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                Fotoğraflar
            </button>
            <button 
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
                Yorumlar ({data.reviews?.length || 0})
            </button>
        </div>
      </div>

      {/* --- FOTOĞRAF SEKMESİ --- */}
      {activeTab === 'photos' && (
        <>
            <div className="mb-6 flex justify-end">
                <label className={`cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <RiImageAddLine className="text-xl" />
                    {uploading ? 'İşleniyor...' : 'Yeni Fotoğraf Ekle'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.gallery && data.gallery.length > 0 ? (
                data.gallery.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
                    <img src={img.url} alt="Galeri" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button onClick={() => handleDeleteImage(img)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transform hover:scale-110 transition-transform">
                        <RiDeleteBinLine className="text-xl" />
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <div className="col-span-full py-20 text-center text-slate-500 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
                    <RiUploadCloud2Line className="text-6xl mx-auto mb-4 opacity-50" />
                    <p>Henüz hiç fotoğraf yüklenmemiş.</p>
                </div>
                )}
            </div>
        </>
      )}

      {/* --- YORUMLAR SEKMESİ --- */}
      {activeTab === 'reviews' && (
          <div className="space-y-4">
              {data.reviews && data.reviews.length > 0 ? (
                  data.reviews.map((rev: any) => (
                      <div key={rev.id} className="bg-[#1e293b] border border-slate-700 p-4 rounded-xl flex justify-between items-start gap-4">
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white">{rev.name}</h4>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{rev.date}</span>
                              </div>
                              <p className="text-slate-300 text-sm">"{rev.text}"</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteReview(rev.id)} 
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                            title="Yorumu Sil"
                          >
                              <RiDeleteBinLine className="text-xl" />
                          </button>
                      </div>
                  ))
              ) : (
                  <div className="py-20 text-center text-slate-500 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
                      <RiChatQuoteLine className="text-6xl mx-auto mb-4 opacity-50" />
                      <p>Henüz müşteri yorumu yok.</p>
                  </div>
              )}
          </div>
      )}

    </AdminLayout>
  );
};

export default GalleryManager;