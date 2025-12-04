import React from 'react';
import { RiRocketLine, RiShieldStarLine, RiCustomerService2Line, RiBox3Line } from 'react-icons/ri';

const Home: React.FC = () => {
  return (
    <div className="home-page" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px', marginBottom: '60px', marginTop: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
          Güvenli ve Hızlı <br />
          <span className="highlight">Modern Taşımacılık</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#a1a1aa', lineHeight: '1.6' }}>
          İnegöl Nakliyat ile eşyalarınız emin ellerde. iOS 18 estetiğiyle tasarlanmış 
          yeni nesil fiyatlandırma ve takip sistemiyle tanışın.
        </p>
      </section>

      {/* ÖZELLİKLER GRID */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px', 
        width: '90%', 
        maxWidth: '1200px',
        paddingBottom: '50px'
      }}>
        
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
    </div>
  );
};

export default Home;