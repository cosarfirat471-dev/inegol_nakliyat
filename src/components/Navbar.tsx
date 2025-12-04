import React, { useState } from 'react';
import './Navbar.css';

import { 
  RiHome5Line, RiHome5Fill,
  RiMapPinLine, RiMapPinFill,
  RiPhoneLine, RiPhoneFill,
  RiTruckLine, RiTruckFill 
} from 'react-icons/ri';

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
    if (onNavigate) onNavigate(tabName);
  };

  return (
    <div className="floating-navbar">
      
      {/* 1. PC GÖRÜNÜMÜ */}
      <div className="pc-left-brand">
        <div className="brand-circle">
           <RiTruckLine className="brand-icon" />
        </div>
        {/* Yazıyı stil için ayırdık */}
        <span className="brand-name">
          İNEGÖL <span className="highlight-text">NAKLİYAT</span>
        </span>
      </div>

      <div className="pc-nav-content">
        <div className="nav-group">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
            {activeTab === 'home' ? <RiHome5Fill /> : <RiHome5Line />}
            <span>Ana Sayfa</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => handleNavClick('fleet')}>
            {activeTab === 'fleet' ? <RiTruckFill /> : <RiTruckLine />}
            <span>Filomuz</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'regions' ? 'active' : ''}`} onClick={() => handleNavClick('regions')}>
            {activeTab === 'regions' ? <RiMapPinFill /> : <RiMapPinLine />}
            <span>Bölgeler</span>
          </button>
          
          <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
            {activeTab === 'contact' ? <RiPhoneFill /> : <RiPhoneLine />}
            <span>İletişim</span>
          </button>
        </div>
        <button className="btn-quote-pc" onClick={() => handleNavClick('quote')}>FİYAT AL</button>
      </div>


      {/* 2. MOBİL ÜST (MARKA) */}
      <div className="mobile-top-brand">
        <div className="brand-circle">
           <RiTruckLine className="brand-icon" />
        </div>
        <span className="brand-name">
          İNEGÖL <span className="highlight-text">NAKLİYAT</span>
        </span>
      </div>


      {/* 3. MOBİL ALT (NAV) */}
      <div className="mobile-bottom-nav">
        <div className="mobile-group">
           <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
            {activeTab === 'home' ? <RiHome5Fill /> : <RiHome5Line />}
            <span>Ana Sayfa</span>
          </button>
           <button className={`nav-link ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => handleNavClick('fleet')}>
            {activeTab === 'fleet' ? <RiTruckFill /> : <RiTruckLine />}
            <span>Filomuz</span>
          </button>
        </div>

        <div className="spacer"></div>

        <div className="mobile-group">
           <button className={`nav-link ${activeTab === 'regions' ? 'active' : ''}`} onClick={() => handleNavClick('regions')}>
            <RiMapPinFill />
            <span>Bölgeler</span>
          </button>
           <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
            <RiPhoneFill />
            <span>İletişim</span>
          </button>
        </div>

        <button className="btn-quote-mobile" onClick={() => handleNavClick('quote')}>
          FİYAT<br/>AL
        </button>
      </div>

    </div>
  );
};

export default Navbar;