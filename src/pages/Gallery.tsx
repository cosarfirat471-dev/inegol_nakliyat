// src/pages/Gallery.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RiImage2Line, RiZoomInLine, RiUploadCloud2Line } from 'react-icons/ri';
import { useData } from '../context/DataContext';

const Gallery: React.FC = () => {
  const { data } = useData(); 

  // Veri henüz yüklenmediyse veya boşsa boş dizi döner
  const galleryImages = data?.gallery || [];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <Helmet>
        <title>Galeri | İnegöl Nakliyat Çalışmalarımızdan Kareler</title>
        <meta name="description" content="İnegöl evden eve nakliyat, asansörlü taşıma, ofis taşıma ve paketleme işlemlerimizden gerçek fotoğraflar. Referanslarımızı inceleyin." />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {galleryImages.map((img: any, index: number) => (
            <div 
              key={img.id} 
              className="group relative h-72 rounded-2xl overflow-hidden border border-glass-border-dark cursor-pointer shadow-glass hover:shadow-neon-blue transition-all duration-500"
            >
              {/* SEO DÜZELTMESİ: Alt etiketi artık dinamik ve açıklayıcı */}
              <img 
                src={img.url} 
                alt={`İnegöl Nakliyat Referans Çalışması ${index + 1} - ${img.date || 'Evden Eve Taşıma'}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover Efekti */}
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
        // Fotoğraf Yoksa
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
          <RiUploadCloud2Line className="text-6xl mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-xl">Henüz galeriye fotoğraf yüklenmedi.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;