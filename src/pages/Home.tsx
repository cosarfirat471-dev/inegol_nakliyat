// src/pages/Home.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async'; 
import { 
  RiTruckLine, RiBuilding4Line, RiBox3Line, 
  RiMapPinLine, RiTeamLine, RiShakeHandsLine, RiSteering2Line
} from 'react-icons/ri';

const Home: React.FC = () => {
  return (
    <main className="w-full flex flex-col items-center">
      
      <Helmet>
        <title>İnegöl Evden Eve Nakliyat | Şehirler Arası & Asansörlü Taşıma</title>
        <meta name="description" content="İnegöl'ün ilk ve öncü nakliye firması. Yerli kadro ile evden eve, ofis taşıma ve asansörlü nakliyat hizmetleri. Sigortalı ve güvenilir taşımacılık." />
        <link rel="canonical" href="https://www.inegolevdenevenakliye.com/" />
      </Helmet>
      
      {/* HERO SECTION */}
      <section className="text-center w-full max-w-4xl px-4 my-12 md:my-20">
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white">
          İnegöl'ün <span className="highlight">İlk Nakliye Firması</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Tecrübe ve güvenle, tamamı <span className="text-white font-bold">yerli işçi</span> kadromuzla İnegöl'den <span className="text-white font-bold">tüm Türkiye'ye</span> hizmet veriyoruz.
        </p>
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

    </main>
  );
};

export default Home;