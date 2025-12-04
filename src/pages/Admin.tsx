import React, { useState } from 'react';
import { RiSettings4Fill, RiMacbookLine, RiSunLine, RiBuilding2Line, RiCloseLine } from 'react-icons/ri';

interface AdminProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

const Admin: React.FC<AdminProps> = ({ currentTheme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`admin-panel ${isOpen ? 'open' : ''}`}>
      
      {/* Açma/Kapama Butonu */}
      <button className="admin-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <RiCloseLine /> : <RiSettings4Fill className="spin-icon" />}
      </button>

      <div className="admin-header">
        YÖNETİCİ PANELİ
      </div>

      {/* Tema Seçimi */}
      <div className="admin-section">
        <div className="admin-label">Tasarım Teması</div>
        
        <button 
          className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <RiMacbookLine style={{marginRight:10}}/> iOS 18 Dark (Mevcut)
        </button>

        <button 
          className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
        >
          <RiSunLine style={{marginRight:10}}/> Modern Light
        </button>

        <button 
          className={`theme-btn ${currentTheme === 'classic' ? 'active' : ''}`}
          onClick={() => setTheme('classic')}
        >
          <RiBuilding2Line style={{marginRight:10}}/> Kurumsal Klasik
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-label">İstatistikler (Demo)</div>
        <div style={{background:'#222', padding:'10px', borderRadius:'8px', marginBottom:'5px', border:'1px solid #333'}}>
            <div style={{fontSize:'0.8rem', color:'#888'}}>Günlük Ziyaretçi</div>
            <div style={{fontSize:'1.2rem', fontWeight:'bold', color:'#fff'}}>1,240</div>
        </div>
        <div style={{background:'#222', padding:'10px', borderRadius:'8px', border:'1px solid #333'}}>
            <div style={{fontSize:'0.8rem', color:'#888'}}>Alınan Teklif</div>
            <div style={{fontSize:'1.2rem', fontWeight:'bold', color:'#007aff'}}>45</div>
        </div>
      </div>

      <div style={{fontSize:'0.7rem', color:'#555', marginTop:'50px'}}>
        v2.0.1 - İnegöl Nakliyat Admin
      </div>

    </div>
  );
};

export default Admin;