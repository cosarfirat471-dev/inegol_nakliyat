// src/pages/Home.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async'; 
import { RiRocketLine, RiShieldStarLine, RiCustomerService2Line, RiBox3Line, RiMapPinLine, RiStarLine } from 'react-icons/ri';

const Home: React.FC = () => {
  return (
    // SEO DÜZELTMESİ: 'div' yerine 'main' kullanıldı.
    <main className="home-page" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. SEO Helmet */}
      <Helmet>
        <title>İnegöl Nakliyat 📦 | Sigortalı, Asansörlü Evden Eve Taşımacılık</title>
        <meta name="description" content="Bursa İnegöl ve çevresinde profesyonel, sigortalı ve asansörlü evden eve nakliyat hizmeti. En hızlı ve güvenilir taşıma için hemen fiyat teklifi alın." />
      </Helmet>
      
      {/* 2. HERO SECTION */}
      {/* SEO DÜZELTMESİ: 'section' etiketi ve 'aria-label' eklendi. */}
      <section 
        aria-label="Giriş Bölümü" 
        style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px', marginBottom: '60px', marginTop: '60px' }}
      >
        
        {/* H1 Başlık */}
        <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
          İnegöl Evden Eve <br />
          <span className="highlight">Asansörlü Taşımacılık</span>
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#a1a1aa', lineHeight: '1.6' }}>
          İnegöl Nakliyat ile eşyalarınız emin ellerde. Sigortalı, güvenilir ve yeni nesil fiyatlandırma sistemiyle tanışın.
        </p>
      </section>

      {/* 3. ÖZELLİKLER GRID */}
      <section 
        aria-label="Hizmet Özellikleri"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '25px', 
          width: '90%', 
          maxWidth: '1200px',
          paddingBottom: '50px'
        }}
      >
        
        <div className="glass-card">
          <div style={{ fontSize: '2.5rem', color: '#007aff', marginBottom: '15px' }}><RiRocketLine /></div>
          <h3>Hızlı Teslimat</h3>
          <p style={{ color: '#a1a1aa' }}>Optimize edilmiş rotalarla en hızlı teslimat garantisi.</p>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '2.5rem', color: '#007aff', marginBottom: '15px' }}><RiShieldStarLine /></div>
          <h3>Sigortalı Taşıma</h3>
          <p style={{ color: '#a1a1aa' }}>Tüm eşyalarınız AXA Sigorta güvencesi altındadır.</p>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '2.5rem', color: '#007aff', marginBottom: '15px' }}><RiCustomerService2Line /></div>
          <h3>7/24 Destek</h3>
          <p style={{ color: '#a1a1aa' }}>Müşteri temsilcilerimize dilediğiniz zaman ulaşabilirsiniz.</p>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '2.5rem', color: '#a855f7', marginBottom: '15px' }}><RiBox3Line /></div>
          <h3>Özel Paketleme</h3>
          <p style={{ color: '#a1a1aa' }}>Eşyalarınızı darbelere karşı özel malzemelerle koruyoruz.</p>
        </div>

      </section>

      {/* 4. YEREL OTORİTE BÖLÜMÜ */}
      <section 
        aria-label="Neden Biz"
        style={{ 
            width: '90%', 
            maxWidth: '1200px', 
            padding: '60px 20px', 
            textAlign: 'center' 
        }}
      >
          <h2 className="text-3xl font-bold text-white mb-8">
              <span className="highlight">İnegöl'ün En Güvenilir</span> Nakliyat Çözümleri
          </h2>
          
          <div style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '20px',
              textAlign: 'left'
          }}>
              
              <div className="glass-card">
                  <div style={{ fontSize: '2rem', color: '#007aff', marginBottom: '10px' }}><RiMapPinLine /></div>
                  <h3 className="text-white font-semibold mb-2">Mahalle Odaklı Hizmet</h3>
                  <p className="text-text-muted text-sm">Yeniceköy, Akhisar, Cerrah ve İnegöl'ün tüm bölgelerinde özel mobil asansör ve güzergah planlaması.</p>
              </div>

              <div className="glass-card">
                  <div style={{ fontSize: '2rem', color: '#007aff', marginBottom: '10px' }}><RiShieldStarLine /></div>
                  <h3 className="text-white font-semibold mb-2">K3 Yetki Belgeli Firma</h3>
                  <p className="text-text-muted text-sm">Ulaştırma Bakanlığı'ndan onaylı K3 yetki belgemizle yasal ve güvenilir taşımacılık garantisi sunuyoruz.</p>
              </div>

              <div className="glass-card">
                  <div style={{ fontSize: '2rem', color: '#007aff', marginBottom: '10px' }}><RiStarLine /></div>
                  <h3 className="text-white font-semibold mb-2">Müşteri Puanı</h3>
                  <p className="text-text-muted text-sm">Google İşletme Profili üzerinde **4.9/5.0** ortalama puanımız ile İnegöl'de en çok tavsiye edilen firmayız.</p>
              </div>

          </div>
      </section>

    </main>
  );
};

export default Home;