// src/pages/Contact.tsx

import React from 'react';
import { useData } from '../context/DataContext';
import { Helmet } from 'react-helmet-async';
import { RiMapPinLine, RiPhoneLine, RiMailLine, RiWhatsappLine } from 'react-icons/ri';

const Contact = () => {
  const { data } = useData();
  const contact = data?.contact || {};
  const phone = data?.general?.phone || '';

  return (
    <div className="min-h-screen pt-4 md:pt-10 pb-20 px-4 w-full max-w-6xl mx-auto flex flex-col items-center">
      <Helmet>
        <title>İletişim & Adres | İnegöl Nakliyat</title>
        <meta name="description" content="İnegöl Nakliyat telefon numarası, adres ve konum bilgileri. 7/24 WhatsApp hattımızdan nakliye fiyat teklifi alabilirsiniz." />
        <link rel="canonical" href="https://www.inegolevdenevenakliye.com/contact" />
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">Bize Ulaşın</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* SOL: BİLGİLER */}
        <div className="space-y-4">
          <div className="glass-card flex items-start gap-4 p-5">
            <RiMapPinLine className="text-2xl text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white">Adresimiz</h3>
              <p className="text-slate-400 text-sm mt-1">{contact.address || 'Adres bilgisi girilmedi.'}</p>
            </div>
          </div>

          <div className="glass-card flex items-start gap-4 p-5">
            <RiPhoneLine className="text-2xl text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white">Telefon</h3>
              <a href={`tel:${phone}`} className="text-slate-400 text-sm mt-1 block hover:text-white transition-colors">
                {phone}
              </a>
            </div>
          </div>

          <div className="glass-card flex items-start gap-4 p-5">
            <RiMailLine className="text-2xl text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white">E-posta</h3>
              <a href={`mailto:${contact.email}`} className="text-slate-400 text-sm mt-1 block hover:text-white transition-colors">
                {contact.email || 'info@inegolnakliyat.com'}
              </a>
            </div>
          </div>
          
          <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-center font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2">
            <RiWhatsappLine className="text-2xl" /> WhatsApp'tan Yaz
          </a>
        </div>

        {/* SAĞ: HARİTA */}
        <div className="glass-card p-1 h-[300px] md:h-auto overflow-hidden rounded-2xl relative min-h-[300px]">
          {contact.mapEmbedUrl ? (
            <iframe 
              src={contact.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Harita yüklenmedi.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;