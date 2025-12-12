// src/App.tsx

import React, { Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import FloatingActions from './components/FloatingActions';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import ScrollToTop from './ScrollToTop'; 
import { DataProvider } from './context/DataContext';
import './App.css';

const Home = React.lazy(() => import('./pages/Home'));
const Wizard = React.lazy(() => import('./pages/Wizard'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Regions = React.lazy(() => import('./pages/Regions'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Admin/Login'));
const Dashboard = React.lazy(() => import('./pages/Admin/pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Admin/pages/Settings'));
const Leads = React.lazy(() => import('./pages/Admin/pages/Leads'));
const GalleryManager = React.lazy(() => import('./pages/Admin/pages/GalleryManager'));

const AdminLoader = () => (
  <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Yükleniyor...</div>
);

const Layout = () => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="App flex flex-col min-h-screen">
      
      {/* DÜZELTME: Eğer showWizard FALSE ise butonları göster, TRUE ise GİZLE */}
      {!showWizard && <FloatingActions />}
      
      <Navbar onOpenWizard={() => setShowWizard(true)} />
      
      <div className="flex-grow">
        <Suspense fallback={<Preloader />}>
          {showWizard && <Wizard onClose={() => setShowWizard(false)} />}
          <div className="app-container">
            <Outlet />
          </div>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="regions" element={<Regions />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/admin" element={<Suspense fallback={<AdminLoader />}><Login /></Suspense>} />
          <Route path="/admin/dashboard" element={<Suspense fallback={<AdminLoader />}><Dashboard /></Suspense>} />
          <Route path="/admin/settings" element={<Suspense fallback={<AdminLoader />}><Settings /></Suspense>} />
          <Route path="/admin/leads" element={<Suspense fallback={<AdminLoader />}><Leads /></Suspense>} />
          <Route path="/admin/gallery" element={<Suspense fallback={<AdminLoader />}><GalleryManager /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;