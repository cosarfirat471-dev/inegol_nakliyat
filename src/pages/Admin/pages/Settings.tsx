// src/pages/Admin/pages/Settings.tsx

import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { useData } from '../../../context/DataContext';
import toast from 'react-hot-toast';
import { 
  RiSave3Line, RiTruckLine, RiHomeGearLine, 
  RiMapPinLine, RiAddLine, RiCloseLine 
} from 'react-icons/ri';

const Settings = () => {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('prices');
  const [newRegion, setNewRegion] = useState(''); 

  useEffect(() => {
    if (data) setFormData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const handleSave = async () => {
    const loadingToast = toast.loading('Ayarlar kaydediliyor...');
    try {
      await updateData('general', formData.general);
      await updateData('prices', formData.prices);
      await updateData('contact', formData.contact);
      await updateData('regions', formData.regions);
      await updateData('footer', formData.footer);
      toast.success('Başarıyla Güncellendi!', { id: loadingToast });
    } catch (error) {
      toast.error('Kaydetme başarısız.', { id: loadingToast });
    }
  };

  const addRegion = () => {
    if(!newRegion.trim()) return;
    setFormData({ ...formData, regions: [...(formData.regions || []), newRegion] });
    setNewRegion('');
  };

  const removeRegion = (index: number) => {
    const newRegions = [...formData.regions];
    newRegions.splice(index, 1);
    setFormData({ ...formData, regions: newRegions });
  };

  if (!formData) return <AdminLayout><div className="text-white p-8">Yükleniyor...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Ayarlar</h2>
          <p className="text-slate-400">Fiyat aralıklarını ve site bilgilerini yönetin.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
          <RiSave3Line className="text-xl" /> KAYDET
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-700 mb-8 overflow-x-auto">
        {['prices', 'general', 'contact', 'footer'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400'}`}>
            {tab === 'prices' ? 'FİYATLANDIRMA' : 
             tab === 'general' ? 'GENEL' :
             tab === 'contact' ? 'İLETİŞİM' : 'FOOTER'}
          </button>
        ))}
      </div>

      <div className="max-w-4xl animate-fadeIn">
        
        {/* FİYATLAR SEKMESİ */}
        {activeTab === 'prices' && (
          <div className="space-y-6">
            
            {/* ODA FİYATLARI */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><RiHomeGearLine className="text-purple-500"/> Oda Bazlı Fiyat Aralıkları</h3>
               <p className="text-slate-400 text-sm mb-4">
                 Her oda tipi için <b>En Düşük</b> ve <b>En Yüksek</b> taşıma ücretini giriniz. Müşteriye bu aralık sunulacaktır.
               </p>
               
               <div className="space-y-3">
                 <div className="grid grid-cols-12 gap-4 text-xs text-slate-500 px-3 uppercase font-bold tracking-wider">
                    <div className="col-span-4">Oda Tipi</div>
                    <div className="col-span-4 text-center">Min Fiyat (₺)</div>
                    <div className="col-span-4 text-center">Max Fiyat (₺)</div>
                 </div>
                 <RoomRangeInput label="1+0 (Stüdyo)" id="1+0" data={formData} set={setFormData} />
                 <RoomRangeInput label="2+0 Daire" id="2+0" data={formData} set={setFormData} />
                 <RoomRangeInput label="1+1 Daire" id="1+1" data={formData} set={setFormData} />
                 <RoomRangeInput label="2+1 Daire" id="2+1" data={formData} set={setFormData} />
                 <RoomRangeInput label="3+1 Daire" id="3+1" data={formData} set={setFormData} />
                 <RoomRangeInput label="4+1 Daire" id="4+1" data={formData} set={setFormData} />
                 <RoomRangeInput label="5+1 Daire" id="5+1" data={formData} set={setFormData} />
                 <RoomRangeInput label="6+1 / Villa" id="6+1" data={formData} set={setFormData} />
               </div>
            </div>

            {/* EK MALİYETLER */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><RiTruckLine className="text-green-500"/> Ek Maliyetler</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">KM Başına (₺)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                    value={formData.prices.kmPrice}
                    onChange={e => setFormData({...formData, prices: {...formData.prices, kmPrice: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Asansörlü Kat (₺)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                    value={formData.prices.elevatorCost}
                    onChange={e => setFormData({...formData, prices: {...formData.prices, elevatorCost: Number(e.target.value)}})}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Merdivenli Kat (₺)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                    value={formData.prices.stairsCost}
                    onChange={e => setFormData({...formData, prices: {...formData.prices, stairsCost: Number(e.target.value)}})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GENEL, İLETİŞİM, FOOTER SEKMELERİ AYNI KALIYOR... */}
        {/* ... (Bu kısımlar önceki kodla aynı, buraya tekrar kopyalamana gerek yok, sadece RoomRangeInput ekledik) ... */}
        {activeTab === 'general' && (
             <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <label className="text-slate-400 text-sm">WhatsApp Telefon (90...)</label>
                 <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                   value={formData.general.phone} onChange={e => setFormData({...formData, general: {...formData.general, phone: e.target.value}})}
                 />
               </div>
               <div>
                 <label className="text-slate-400 text-sm">Site Başlığı</label>
                 <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                   value={formData.general.title} onChange={e => setFormData({...formData, general: {...formData.general, title: e.target.value}})}
                 />
               </div>
             </div>
          </div>
        )}
        
         {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
              <label className="text-slate-400 text-sm">Adres</label>
              <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                value={formData.contact?.address} onChange={e => setFormData({...formData, contact: {...formData.contact, address: e.target.value}})}
              />
              <label className="text-slate-400 text-sm mt-4 block">Harita Linki (Embed)</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1 text-xs"
                value={formData.contact?.mapEmbedUrl} onChange={e => setFormData({...formData, contact: {...formData.contact, mapEmbedUrl: e.target.value}})}
              />
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
              <div className="flex gap-2 mb-4">
                <input type="text" className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Bölge Ekle"
                  value={newRegion} onChange={e => setNewRegion(e.target.value)} onKeyPress={e => e.key === 'Enter' && addRegion()}
                />
                <button onClick={addRegion} className="bg-green-600 text-white px-4 rounded-lg"><RiAddLine/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.regions?.map((r: string, i: number) => (
                  <span key={i} className="bg-slate-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {r} <button onClick={() => removeRegion(i)} className="text-red-400"><RiCloseLine/></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
         {activeTab === 'footer' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 space-y-4">
            <div>
              <label className="text-slate-400 text-sm">Footer Açıklama</label>
              <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-1"
                value={formData.footer?.description} onChange={e => setFormData({...formData, footer: {...formData.footer, description: e.target.value}})}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Instagram URL" className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                value={formData.footer?.instagram} onChange={e => setFormData({...formData, footer: {...formData.footer, instagram: e.target.value}})}
              />
              <input type="text" placeholder="Facebook URL" className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
                value={formData.footer?.facebook} onChange={e => setFormData({...formData, footer: {...formData.footer, facebook: e.target.value}})}
              />
            </div>
             <div className="mt-4 pt-4 border-t border-slate-700">
                <label className="text-slate-400 text-sm font-bold text-cyan-400">Copyright Metni</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white mt-2 focus:border-cyan-500 outline-none"
                  value={formData.footer?.copyrightText || ''}
                  onChange={e => setFormData({...formData, footer: {...formData.footer, copyrightText: e.target.value}})}
                />
              </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

// YENİ: Oda Aralığı Input Bileşeni
const RoomRangeInput = ({ label, id, data, set }: any) => {
    // Veri yoksa güvenli boş obje verelim
    const roomData = data.prices.rooms?.[id] || { min: 0, max: 0 };

    return (
      <div className="grid grid-cols-12 gap-4 items-center bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-blue-500/30 transition-colors">
        <div className="col-span-4 text-slate-300 font-bold text-sm">{label}</div>
        
        <div className="col-span-4 relative">
          <input type="number" placeholder="Min" className="w-full bg-slate-800 text-white text-center p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={roomData.min || ''}
            onChange={(e) => {
              const newVal = { ...roomData, min: Number(e.target.value) };
              const newRooms = { ...data.prices.rooms, [id]: newVal };
              set({ ...data, prices: { ...data.prices, rooms: newRooms } });
            }}
          />
        </div>
        
        <div className="col-span-4 relative">
          <input type="number" placeholder="Max" className="w-full bg-slate-800 text-white text-center p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            value={roomData.max || ''}
            onChange={(e) => {
              const newVal = { ...roomData, max: Number(e.target.value) };
              const newRooms = { ...data.prices.rooms, [id]: newVal };
              set({ ...data, prices: { ...data.prices, rooms: newRooms } });
            }}
          />
        </div>
      </div>
    );
};

export default Settings;