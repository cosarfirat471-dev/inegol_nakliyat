// src/pages/Admin/pages/Dashboard.tsx

import React from 'react';
import AdminLayout from '../AdminLayout';
import { useData } from '../../../context/DataContext';
import { RiUser3Line, RiFileList3Line, RiWallet3Line } from 'react-icons/ri';

const Dashboard = () => {
  const { data } = useData();
  
  // Fiyat aralığını hesapla (En düşük min ve en yüksek max)
  const rooms = data?.prices?.rooms || {};
  const prices = Object.values(rooms).map((r: any) => r.min || 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  
  // Maksimum fiyatı da bulalım
  const maxPrices = Object.values(rooms).map((r: any) => r.max || 0);
  const maxPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : 0;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 ${color}`}>
        <Icon className="text-6xl" />
      </div>
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-2xl md:text-3xl font-black text-white mt-2">{value}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Hoş Geldin, Patron 👋</h2>
        <p className="text-slate-400 mt-2">İşte sitenin güncel durumu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Toplam Ziyaretçi" value={data?.general?.visitCount || 0} icon={RiUser3Line} color="text-blue-500" />
        <StatCard title="Alınan Teklifler" value={data?.general?.offerCount || 0} icon={RiFileList3Line} color="text-green-500" />
        {/* ESKİ TABAN FİYAT YERİNE SKALA GELDİ */}
        <StatCard 
          title="Hizmet Fiyat Skalası" 
          value={`${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} ₺`} 
          icon={RiWallet3Line} 
          color="text-purple-500" 
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;