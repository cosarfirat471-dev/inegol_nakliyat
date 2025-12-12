// src/components/Footer.tsx

import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom'; // Router Link'i
import { 
  RiMapPinLine, RiPhoneLine, RiMailLine, 
  RiInstagramLine, RiFacebookCircleLine, RiArrowRightSLine 
} from 'react-icons/ri';
import logoLarge from '../assets/logo-lg.png'; 

const Footer: React.FC = () => {
  const { data } = useData();
  const contact = data?.contact || {};
  const general = data?.general || {};
  const footer = data?.footer || {};

  return (
    <footer className="relative z-50 bg-[#020617] border-t border-white/10 pt-16 pb-32 md:pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* MARKA */}
          <div className="space-y-6 text-center md:text-left">
            <img src={logoLarge} alt="Logo" className="h-64 w-auto object-contain mx-auto md:mx-0 md:h-52 -mt-4" />
            <p className="text-slate-400 text-sm leading-relaxed">
              {footer.description || "İnegöl ve çevresinde profesyonel taşıma."}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              {footer.instagram && (
                <a href={footer.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                  <RiInstagramLine className="text-xl" />
                </a>
              )}
              {footer.facebook && (
                <a href={footer.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                  <RiFacebookCircleLine className="text-xl" />
                </a>
              )}
            </div>
          </div>

          {/* HIZLI ERİŞİM (LİNKLER DÜZELTİLDİ) */}
          <div className="md:mt-8">
            <h3 className="text-white font-bold text-lg mb-6">Hızlı Erişim</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-brand-blue flex items-center gap-2 transition-colors"><RiArrowRightSLine /> Ana Sayfa</Link></li>
              <li><Link to="/gallery" className="text-slate-400 hover:text-brand-blue flex items-center gap-2 transition-colors"><RiArrowRightSLine /> Galeri</Link></li>
              <li><Link to="/regions" className="text-slate-400 hover:text-brand-blue flex items-center gap-2 transition-colors"><RiArrowRightSLine /> Bölgeler</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-brand-blue flex items-center gap-2 transition-colors"><RiArrowRightSLine /> İletişim</Link></li>
            </ul>
          </div>

          {/* HİZMETLER */}
          <div className="md:mt-8">
            <h3 className="text-white font-bold text-lg mb-6">Hizmetlerimiz</h3>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm">Evden Eve Nakliyat</li>
              <li className="text-slate-400 text-sm">Asansörlü Taşımacılık</li>
              <li className="text-slate-400 text-sm">Şehirler Arası Nakliye</li>
              <li className="text-slate-400 text-sm">Ofis ve Büro Taşıma</li>
            </ul>
          </div>

          {/* İLETİŞİM */}
          <div className="md:mt-8">
            <h3 className="text-white font-bold text-lg mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <RiMapPinLine className="text-brand-blue text-xl flex-shrink-0 mt-1" />
                <span className="text-sm">{contact.address || '...'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <RiPhoneLine className="text-brand-blue text-xl flex-shrink-0" />
                <a href={`tel:${general.phone}`} className="text-sm hover:text-white transition-colors">{general.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <RiMailLine className="text-brand-blue text-xl flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-sm hover:text-white transition-colors">{contact.email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} <b>{footer.copyrightText || general.title}</b>. Tüm hakları saklıdır.
          </p>
          <div className="text-slate-600 text-xs text-center md:text-right">
            Web Developer: <span className="text-slate-400 font-medium hover:text-white transition-colors cursor-default">Talha Atalay Körlü</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;