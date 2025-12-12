// src/pages/Wizard.tsx

import React, { useState, useEffect } from 'react';
import './Wizard.css';
import { useData } from '../context/DataContext';
import { 
  RiCloseLine, RiTruckLine, 
  RiHome5Line, RiBuilding4Line, RiUserLocationLine, 
  RiCheckLine, RiLayoutMasonryLine, RiWhatsappLine, RiHotelLine,
  RiMapPinTimeLine, RiStairsLine, RiPhoneFill, RiInformationLine, RiErrorWarningLine
} from 'react-icons/ri';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Marker İkonları
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface WizardProps {
  onClose: () => void;
}

const ROOM_TYPES = [
  { id: '1+0', label: '1+0 Stüdyo', desc: 'Minimal', icon: <RiHotelLine /> },
  { id: '2+0', label: '2+0 Daire', desc: 'Az Eşya', icon: <RiHome5Line /> },
  { id: '1+1', label: '1+1 Daire', desc: 'Standart', icon: <RiHome5Line /> },
  { id: '2+1', label: '2+1 Daire', desc: 'Aile Evi', icon: <RiLayoutMasonryLine /> },
  { id: '3+1', label: '3+1 Daire', desc: 'Geniş', icon: <RiLayoutMasonryLine /> },
  { id: '4+1', label: '4+1 Daire', desc: 'Büyük', icon: <RiBuilding4Line /> },
  { id: '5+1', label: '5+1 Daire', desc: 'Çok Geniş', icon: <RiBuilding4Line /> },
  { id: '6+1', label: '6+1 Villa', desc: 'Komple', icon: <RiBuilding4Line /> },
];

const SearchField = () => {
  const map = useMap();
  useEffect(() => {
    // @ts-ignore
    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false, 
      keepResult: true,
      searchLabel: 'Adres ara...',
    });
    map.addControl(searchControl);
    return () => { map.removeControl(searchControl); };
  }, [map]);
  return null;
};

const LocationMarker = ({ points, setPoints }: { points: any[], setPoints: any }) => {
  useMapEvents({
    click(e) {
      if (points.length < 2) {
        setPoints([...points, e.latlng]);
      } else {
        setPoints([e.latlng]);
      }
    },
  });
  return null;
};

const Wizard: React.FC<WizardProps> = ({ onClose }) => {
  const { data } = useData(); 
  const phone = data?.general?.phone || '905XXXXXXXXXX';

  const [step, setStep] = useState(1);
  const [mapCenter] = useState<[number, number]>([40.076, 29.51]); 
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [distanceDisplay, setDistanceDisplay] = useState("0");
  const [routePath, setRoutePath] = useState<[number, number][]>([]); 
  const [calculating, setCalculating] = useState(false);
  const [isRealRoad, setIsRealRoad] = useState(true); // Yol gerçek mi kuş uçuşu mu?

  const [selectedRoom, setSelectedRoom] = useState<string>('2+1');
  const [buildingData, setBuildingData] = useState({
    floorFrom: '', elevatorFrom: false,
    floorTo: '', elevatorTo: false,
  });

  // --- GARANTİLİ ROTA VE MESAFE HESAPLAMA ---
  useEffect(() => {
    const calculateRoute = async () => {
      if (points.length !== 2) {
        setDistanceDisplay("0");
        setRoutePath([]);
        return;
      }

      const p1 = points[0];
      const p2 = points[1];
      setCalculating(true);
      setIsRealRoad(true);

      // 1. ADIM: OSRM Public Sunucusunu Dene
      // Dikkat: OSRM [Lng, Lat] ister. Leaflet [Lat, Lng] verir.
      const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Gerçek Yolu Bulduk
          setDistanceDisplay((route.distance / 1000).toFixed(2));
          const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]); // Ters çevir
          setRoutePath(coords);
        } else {
          throw new Error("API boş döndü");
        }
      } catch (err) {
        console.warn("Gerçek yol bulunamadı, matematiksel hesap yapılıyor...", err);
        setIsRealRoad(false);
        
        // 2. ADIM: FALLBACK (Matematiksel Hesaplama)
        // Harita servisi bozuksa müşteriyi yarı yolda bırakma.
        
        // Mesafe Hesabı (Haversine Formülü - Kuş Uçuşu)
        const R = 6371; // Dünya yarıçapı km
        const dLat = (p2.lat - p1.lat) * Math.PI / 180;
        const dLon = (p2.lng - p1.lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const birdDist = R * c;
        
        // Yol Payı Ekle (%30 sapma payı)
        const roadDist = birdDist * 1.3;
        setDistanceDisplay(roadDist.toFixed(2));

        // Düz Çizgi Çiz (Leaflet Polyline)
        setRoutePath([[p1.lat, p1.lng], [p2.lat, p2.lng]]);
      } finally {
        setCalculating(false);
      }
    };

    calculateRoute();
  }, [points]);

  const sendToWhatsApp = () => {
    if (points.length < 2) return;
    const p1 = points[0];
    const p2 = points[1];
    const googleMapsUrl = `http://googleusercontent.com/maps.google.com/dir/${p1.lat},${p1.lng}/${p2.lat},${p2.lng}`;

    const message = `👋 Merhaba, web sitenizden taşınma için bilgi almak istiyorum.

🏠 *Ev Tipi:* ${selectedRoom}
🛣️ *Yol Mesafesi:* ${distanceDisplay} km

🏢 *MEVCUT EV:* ${buildingData.floorFrom || 'Giriş'}. Kat (${buildingData.elevatorFrom ? '✅ Mobil Asansör' : '❌ Merdiven'})
🏢 *YENİ EV:* ${buildingData.floorTo || 'Giriş'}. Kat (${buildingData.elevatorTo ? '✅ Mobil Asansör' : '❌ Merdiven'})

📍 *HARİTA LİNKİ:*
${googleMapsUrl}

Fiyat teklifi alabilir miyim?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col md:items-center md:justify-center bg-black/90 backdrop-blur-sm p-0 md:p-4">
      
      <div className="w-full h-full md:h-[90vh] md:max-w-4xl bg-[#111] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 bg-[#161b22]">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-white">
              {step === 1 && "1. Adım: Konum Seçimi"}
              {step === 2 && "2. Adım: Ev Tipi"}
              {step === 3 && "3. Adım: Bina Durumu"}
              {step === 4 && "4. Adım: Özet & Teklif"}
            </h2>
            <p className="text-xs text-slate-400">Adımları tamamlayarak hızlıca fiyat alın.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-red-500/20 hover:text-red-500 transition-colors">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          
          {/* ADIM 1: HARİTA */}
          {step === 1 && (
            <div className="flex flex-col h-full gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-sm text-blue-200 flex gap-2 items-center">
                <RiInformationLine className="text-lg flex-shrink-0" />
                <span>Haritaya dokunarak <b>Mevcut Ev</b> ve <b>Yeni Ev</b> konumlarını işaretleyin.</span>
              </div>
              
              <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-white/10 relative z-0">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', background:'#0f172a' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                  <SearchField />
                  <LocationMarker points={points} setPoints={setPoints} />
                  
                  {points.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                      <Popup>{idx === 0 ? "MEVCUT EV" : "YENİ EV"}</Popup>
                    </Marker>
                  ))}

                  {/* ROTA ÇİZGİSİ */}
                  {routePath.length > 0 && (
                    <Polyline 
                      key={routePath.length} 
                      positions={routePath} 
                      pathOptions={{ 
                        color: isRealRoad ? '#007aff' : '#f59e0b', // Gerçekse Mavi, Yedekse Turuncu
                        weight: 6, 
                        opacity: 0.9,
                        dashArray: isRealRoad ? undefined : '10, 10', // Yedekse kesikli çizgi
                        lineJoin: 'round'
                      }} 
                    />
                  )}
                </MapContainer>

                {calculating && (
                   <div className="absolute inset-0 bg-black/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
                     <div className="bg-slate-900 px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/10">
                       <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-sm font-medium">Hesaplanıyor...</span>
                     </div>
                   </div>
                )}

                {/* MESAFE GÖSTERGESİ */}
                {!calculating && parseFloat(distanceDisplay) > 0 && (
                  <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-green-500/30 px-4 py-2 rounded-xl z-[900]">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Mesafe</div>
                    <div className="text-xl font-bold text-green-400 flex items-center gap-1">
                      <RiTruckLine /> {distanceDisplay} km
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ... DİĞER ADIMLAR AYNI KALIYOR ... */}
          {/* Adım 2: Oda Seçimi */}
          {step === 2 && (
            <div className="h-full">
              <h3 className="text-center text-white text-lg font-bold mb-6">Eviniz kaç odalı?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ROOM_TYPES.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`cursor-pointer rounded-xl p-4 border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedRoom === room.id 
                      ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(0,122,255,0.4)] transform scale-105' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`text-3xl ${selectedRoom === room.id ? 'text-white' : 'text-slate-500'}`}>{room.icon}</div>
                    <div className="text-white font-bold text-sm">{room.label}</div>
                    {selectedRoom === room.id && <RiCheckLine className="text-white bg-white/20 rounded-full p-0.5 w-5 h-5 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adım 3: Bina */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
                <RiInformationLine className="text-yellow-500 text-xl mt-0.5 flex-shrink-0" />
                <span className="text-sm text-yellow-100/80">
                  <strong>Önemli:</strong> 2. kat ve üzerindeki taşımalarda bina asansörü kullanılamıyorsa <u>Mobil Asansör</u> kurulumu gerekir.
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* MEVCUT EV */}
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-400 font-bold mb-4">
                    <RiUserLocationLine className="text-xl"/> Mevcut Ev
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Bulunduğu Kat</label>
                      <input type="number" placeholder="Örn: 3" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        value={buildingData.floorFrom} onChange={e => setBuildingData({...buildingData, floorFrom: e.target.value})}
                      />
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${buildingData.elevatorFrom ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/10'}`}
                      onClick={() => setBuildingData({...buildingData, elevatorFrom: !buildingData.elevatorFrom})}
                    >
                      <span className="text-sm text-white">Mobil Asansör Gerekir</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${buildingData.elevatorFrom ? 'border-green-500 bg-green-500 text-white' : 'border-slate-500'}`}>
                        {buildingData.elevatorFrom && <RiCheckLine className="text-sm" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* YENİ EV */}
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-purple-400 font-bold mb-4">
                    <RiBuilding4Line className="text-xl"/> Yeni Ev
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Taşınacak Kat</label>
                      <input type="number" placeholder="Örn: 5" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                        value={buildingData.floorTo} onChange={e => setBuildingData({...buildingData, floorTo: e.target.value})}
                      />
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${buildingData.elevatorTo ? 'bg-green-500/10 border-green-500/50' : 'bg-black/20 border-white/10'}`}
                      onClick={() => setBuildingData({...buildingData, elevatorTo: !buildingData.elevatorTo})}
                    >
                      <span className="text-sm text-white">Mobil Asansör Gerekir</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${buildingData.elevatorTo ? 'border-green-500 bg-green-500 text-white' : 'border-slate-500'}`}>
                        {buildingData.elevatorTo && <RiCheckLine className="text-sm" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Adım 4: Özet */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-white mb-6">Taşınma Özeti</h2>
              <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><RiHome5Line/> Ev Tipi</span>
                  <span className="text-white font-bold">{selectedRoom}</span>
                </div>
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2"><RiMapPinTimeLine/> Mesafe</span>
                  <span className="text-white font-bold">{distanceDisplay} km</span>
                </div>
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Mevcut Ev</span>
                  <span className="text-white text-sm">
                    {buildingData.floorFrom || 'Giriş'}. Kat • {buildingData.elevatorFrom ? 'Asansörlü' : 'Merdiven'}
                  </span>
                </div>
                <div className="p-4 bg-white/5">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Yeni Ev</span>
                  <span className="text-white text-sm">
                    {buildingData.floorTo || 'Giriş'}. Kat • {buildingData.elevatorTo ? 'Asansörlü' : 'Merdiven'}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-6 text-center max-w-xs">
                Bu bilgiler doğrultusunda en uygun fiyat teklifini almak için bize WhatsApp'tan ulaşın.
              </p>
            </div>
          )}

        </div>

        {/* FOOTER ACTION BAR */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-[#161b22] flex gap-3 justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 font-bold transition-colors">
              Geri
            </button>
          ) : (
            <div className="w-20"></div> 
          )}

          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              // DÜZELTME: Sadece 2 nokta yoksa kilitle, rota hatası varsa bile devam etsin (Çünkü matematiksel hesapladık)
              disabled={step === 1 && (points.length < 2)}
              className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {step === 1 ? "Konumu Onayla" : "Devam Et"}
            </button>
          ) : (
            <div className="flex gap-3 flex-1 md:w-auto">
                <a href={`tel:${phone}`} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
                    <RiPhoneFill /> Ara
                </a>
                <button onClick={sendToWhatsApp} className="flex-1 py-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform">
                    <RiWhatsappLine className="text-xl"/> WhatsApp
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Wizard;