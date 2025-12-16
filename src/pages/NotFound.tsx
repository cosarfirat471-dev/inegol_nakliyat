// src/pages/NotFound.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { RiHome5Line, RiErrorWarningLine } from 'react-icons/ri';
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <Helmet>
        <title>Sayfa Bulunamadı | İnegöl Nakliyat</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <RiErrorWarningLine className="text-8xl text-red-500 mb-6 opacity-80" />
      
      <h1 className="text-6xl font-black text-white mb-2">404</h1>
      <h2 className="text-2xl text-slate-300 font-bold mb-6">Aradığınız Sayfa Bulunamadı</h2>
      
      <p className="text-slate-400 max-w-md mb-8">
        Gitmek istediğiniz sayfa taşınmış veya silinmiş olabilir. Ana sayfaya dönerek işlemlerinize devam edebilirsiniz.
      </p>

      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/30"
      >
        <RiHome5Line className="text-xl" /> Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default NotFound;