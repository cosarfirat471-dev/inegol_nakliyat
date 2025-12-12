// src/components/FloatingActions.tsx

import React from 'react';
import { RiWhatsappLine, RiPhoneFill } from 'react-icons/ri';
import { useData } from '../context/DataContext';

const FloatingActions: React.FC = () => {
  const { data } = useData();
  const phone = data?.general?.phone || '905XXXXXXXXXX';

  return (
    // DÜZELTME: 'left-4' yerine 'right-4' yapıldı. Artık SAĞ TARAFTA.
    // bottom-24: Mobilde alt menünün (Navbar) üstünde kalması için.
    // md:bottom-8: Bilgisayarda daha aşağıda durması için.
    <div className="fixed right-4 bottom-24 md:bottom-8 z-[9999] flex flex-col gap-3">
      
      {/* 1. TELEFON BUTONU (Mobilde Üstte) */}
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-transform hover:scale-110"
        aria-label="Telefonla Ara"
      >
        <RiPhoneFill className="text-2xl md:text-3xl" />
      </a>

      {/* 2. WHATSAPP BUTONU (Mobilde Altta) */}
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white shadow-[0_0_15px_rgba(37,211,102,0.5)] transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <RiWhatsappLine className="text-2xl md:text-3xl" />
      </a>

    </div>
  );
};

export default FloatingActions;