// src/pages/Home.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async'; 
import { 
  RiTruckLine, RiBuilding4Line, RiBox3Line, 
  RiMapPinLine, RiTeamLine, RiShakeHandsLine, RiSteering2Line
} from 'react-icons/ri';
import truckImg from '../assets/truck.jpg';
import Testimonials from '../components/Testimonials';

const Home: React.FC = () => {
  return (
    <main className="w-full flex flex-col items-center">
      
      <Helmet>
        <title>İnegöl Evden Eve Nakliyat | Şehirler Arası & Asansörlü Taşıma</title>
        <meta name="description" content="İnegöl'ün ilk ve öncü nakliye firması. Yerli kadro ile evden eve, ofis taşıma ve asansörlü nakliyat hizmetleri. Sigortalı ve güvenilir taşımacılık." />
        <link rel="canonical" href="https://www.inegolevdenevenakliye.com/" />
        
        {/* Social Media Tags */}
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="İnegöl Evden Eve Nakliyat | Şehirler Arası & Asansörlü Taşıma" />
        <meta property="og:description" content="İnegöl'ün ilk ve öncü nakliye firması. Yerli kadro ile güvenilir taşıma." />
        <meta property="og:url" content="https://www.inegolevdenevenakliye.com/" />
        <meta property="og:image" content="https://www.inegolevdenevenakliye.com/og-image.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="İnegöl Evden Eve Nakliyat" />
        <meta name="twitter:description" content="İnegöl'ün güvenilir nakliye firması. Asansörlü ve sigortalı taşımacılık." />
        <meta name="twitter:image" content="https://www.inegolevdenevenakliye.com/og-image.jpg" />
      </Helmet>
      
      {/* HERO SECTION */}
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto mt-8 mb-24 px-4">
        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={truckImg} 
              alt="İnegöl Nakliyat Tır" 
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay gradient for better text readability - Increased darkness */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-lg">
              İnegöl'ün <span className="text-blue-500">İlk Nakliye Firması</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto drop-shadow-md font-medium">
              Tecrübe ve güvenle, tamamı <span className="text-blue-400 font-bold">yerli işçi</span> kadromuzla <br className="hidden md:block"/>
              İnegöl'den <span className="text-blue-400 font-bold">tüm Türkiye'ye</span> hizmet veriyoruz.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                <RiTruckLine className="text-xl" />
                Hemen Teklif Al
              </a>
              <a href="tel:+905555555555" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl transition-all border border-white/20 hover:scale-105 flex items-center justify-center gap-2">
                <RiShakeHandsLine className="text-xl" />
                Bize Ulaşın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="w-full max-w-6xl px-4 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: RiTruckLine, title: "Ev Nakliyesi", desc: "Eşyalarınızı kendi evimiz gibi özenle paketleyip taşıyoruz." },
          { icon: RiBuilding4Line, title: "Ofis Nakliyesi", desc: "İş yeriniz için profesyonel, hızlı ve planlı çözümler." },
          { icon: RiBox3Line, title: "Parça Eşya", desc: "Az miktardaki eşyalarınız için ekonomik taşıma." },
          { icon: RiSteering2Line, title: "Kamyon Kiralama", desc: "Şoförlü nakliye araçlarımız kiralıktır." }
        ].map((item, idx) => (
          <div key={idx} className="glass-card text-center hover:bg-white/5 hover:-translate-y-1 transition-all">
            <div className="text-4xl text-blue-500 mb-4 flex justify-center"><item.icon /></div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* AYRICALIKLAR */}
      <section className="w-full max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card flex flex-row items-center md:items-start gap-4 p-5">
                  <div className="text-3xl text-green-500"><RiTeamLine /></div>
                  <div className="text-left">
                    <h3 className="text-white font-bold mb-1">Yerli İşçi Kadrosu</h3>
                    <p className="text-slate-400 text-xs md:text-sm">Yabancı personel değil, sigortalı ve tecrübeli yerli işçilerimizle hizmet veriyoruz.</p>
                  </div>
              </div>

              <div className="glass-card flex flex-row items-center md:items-start gap-4 p-5">
                  <div className="text-3xl text-yellow-500"><RiShakeHandsLine /></div>
                  <div className="text-left">
                    <h3 className="text-white font-bold mb-1">Meslektaş Desteği</h3>
                    <p className="text-slate-400 text-xs md:text-sm">İl dışından gelen nakliyeci meslektaşlarımıza profesyonel eleman temini sağlıyoruz.</p>
                  </div>
              </div>

              <div className="glass-card flex flex-row items-center md:items-start gap-4 p-5">
                  <div className="text-3xl text-red-500"><RiMapPinLine /></div>
                  <div className="text-left">
                    <h3 className="text-white font-bold mb-1">81 İle Hizmet</h3>
                    <p className="text-slate-400 text-xs md:text-sm">İnegöl'den Türkiye'nin her noktasına asansörlü şehirler arası nakliyat.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

    </main>
  );
};

export default Home;