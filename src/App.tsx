import React, { useState } from 'react';
import Navbar from './components/Navbar'; // components/Navbar.tsx
import Home from './pages/Home';         // pages/Home.tsx
import Wizard from './pages/Wizard';     // pages/Wizard.tsx
// import Admin from './pages/Admin';    // İleride eklersin
// import Login from './pages/Login';    // İleride eklersin
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [showWizard, setShowWizard] = useState(false);

  // Navbar'dan gelen sinyalleri yönet
  const handleNav = (page: string) => {
    if (page === 'quote') {
      setShowWizard(true);
    } else {
      setActivePage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="App">
      
      {/* Navbar her zaman var */}
      <Navbar onNavigate={handleNav} />

      {/* Wizard (Modal) Sadece tetiklenince açılır */}
      {showWizard && <Wizard onClose={() => setShowWizard(false)} />}

      <div className="app-container">
        {/* Sayfa Yönlendirmeleri */}
        {activePage === 'home' && <Home />}
        
        {/* Diğer sayfaları (Filo, İletişim vs.) Home gibi pages/ altına açıp buraya ekleyebilirsin */}
        {activePage === 'fleet' && <div style={{textAlign:'center', marginTop:'50px'}}><h1>Filo Sayfası Yapım Aşamasında</h1></div>}
        {activePage === 'contact' && <div style={{textAlign:'center', marginTop:'50px'}}><h1>İletişim Sayfası Yapım Aşamasında</h1></div>}
      
      </div>
    </div>
  );
}

export default App;