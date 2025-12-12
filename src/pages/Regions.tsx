// src/pages/Regions.tsx

import React from 'react';
import { useData } from '../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { RiMapPin2Line, RiCheckDoubleLine, RiBuilding4Line } from 'react-icons/ri';

const Regions = () => {
  const { data } = useData();
  const regions = data?.regions || [];
  const about = data?.about || {};

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-6xl mx-auto">
      <Helmet>
        <title>Hakkımızda ve Hizmet Bölgeleri | İnegöl Nakliyat</title>
      </Helmet>

      <div className="text-center mb-12">
        <RiMapPin2Line className="text-6xl text-brand-blue mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Hizmet Bölgelerimiz</h1>
      </div>

      {/* HAKKIMIZDA KARTI */}
      <div className="glass-card p-8 mb-12 border-l-4 border-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <RiBuilding4Line className="text-9xl text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            {about.title || "Biz Kimiz?"}
        </h2>
        <p className="text-slate-300 leading-relaxed text-lg relative z-10">
            {about.content || "Hakkımızda yazısı yükleniyor..."}
        </p>
      </div>

      {/* BÖLGELER LİSTESİ */}
      <h3 className="text-xl font-bold text-slate-400 mb-6 border-b border-slate-700 pb-2">Aktif Hizmet Alanları</h3>
      
      {regions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {regions.map((region: string, index: number) => (
            <div key={index} className="glass-card p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <RiCheckDoubleLine />
              </div>
              <span className="text-white font-medium text-lg">{region}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500">
          Henüz bölge eklenmemiş.
        </div>
      )}
    </div>
  );
};

export default Regions;