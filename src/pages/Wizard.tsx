// src/pages/Wizard.tsx

import React, { useState, useEffect } from 'react';
import './Wizard.css';
import { useData } from '../context/DataContext';
import { 
  RiCloseLine, RiTruckLine, 
  RiHome5Line, RiBuilding4Line, RiUserLocationLine, 
  RiCheckLine, RiLayoutMasonryLine, RiWhatsappLine, RiHotelLine,
  RiMapPinTimeLine, RiStairsLine
} from 'react-icons/ri';

// Harita Kütüphaneleri
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet Marker İkon Düzeltmesi
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

// GENİŞLETİLMİŞ ODA SEÇENEKLERİ
const ROOM_TYPES = [
  { id: '1+0', label: '1+0 Stüdyo', desc: 'Minimal eşya', icon: <RiHotelLine /> },
  { id: '2+0', label: '2+0 Daire', desc: 'Az eşyalı', icon: <RiHome5Line /> },
  { id: '1+1', label: '1+1 Daire', desc: 'Standart', icon: <RiHome5Line /> },
  { id: '2+1', label: '2+1 Daire', desc: 'Ortalama aile evi', icon: <RiLayoutMasonryLine /> },
  { id: '3+1', label: '3+1 Daire', desc: 'Geniş aile evi', icon: <RiLayoutMasonryLine /> },
  { id: '4+1', label: '4+1 Daire', desc: 'Büyük daire', icon: <RiBuilding4Line /> },
  { id: '5+1', label: '5+1 Daire', desc: 'Çok geniş', icon: <RiBuilding4Line /> },
  { id: '6+1', label: '6+1 / Villa', desc: 'Komple villa', icon: <RiBuilding4Line /> },
];

// Arama Bileşeni
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

// Tıklama Bileşeni
const LocationMarker = ({ points, setPoints }: { points: any[], setPoints: any }) => {
  useMapEvents({
    click(e) {
      if (points.length < 2) {
        setPoints([...points, e.latlng]);
      } else {
        setPoints([e.latlng]); // 3. tıklamada sıfırla
      }
    },
  });
  return null;
};

const Wizard: React.FC<WizardProps> = ({ onClose }) => {
  const { data } = useData(); 
  const prices = data?.prices || {};
  const phone = data?.general?.phone || '905XXXXXXXXXX';

  const [step, setStep] = useState(1);
  const [mapCenter] = useState<[number, number]>([40.076, 29.51]); // İnegöl
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [routePath, setRoutePath] = useState<[number, number][]>([]); 
  const [selectedRoom, setSelectedRoom] = useState<string>('2+1');
  
  const [buildingData, setBuildingData] = useState({
    floorFrom: '', elevatorFrom: false,
    floorTo: '', elevatorTo: false,
  });
  
  // Detaylı Fiyat State'i
  const [priceDetails, setPriceDetails] = useState({
    roomMin: 0,
    roomMax: 0,
    distanceCost: 0,
    totalFloorsCost: 0,
    floorFromCost: 0,
    floorToCost: 0,
    grandTotalMin: 0,
    grandTotalMax: 0
  });

  // --- ROTA HESAPLAMA (OSRM - GERÇEK YOL) ---
  useEffect(() => {
    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      
      // OSRM Araba Yolu Servisi
      const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            // 1. KM Hesapla
            const km = Math.round(route.distance / 1000);
            setDistanceKm(km < 3 ? 3 : km); 
            
            // 2. Yol Çizgisi Koordinatları (GeoJSON lng/lat verir, Leaflet lat/lng ister, ters çeviriyoruz)
            const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRoutePath(coords);
          }
        })
        .catch((err) => {
          console.error("Rota alınamadı, düz çizgi çiziliyor.", err);
          // Hata olursa kuş bakışı çiz
          setDistanceKm(Math.round(p1.distanceTo(p2) / 1000));
          setRoutePath([[p1.lat, p1.lng], [p2.lat, p2.lng]]);
        });
    } else {
      setDistanceKm(0);
      setRoutePath([]);
    }
  }, [points]);

  // --- DETAYLI FİYAT HESAPLAMA ---
  useEffect(() => {
    if (step === 4) {
      // 1. Oda Fiyat Aralığı (Admin panelinden min-max)
      const roomPriceData = prices.rooms?.[selectedRoom] || { min: 0, max: 0 };
      
      // 2. Mesafe Maliyeti
      const kmCostPerUnit = Number(prices.kmPrice) || 50;
      const distanceTotal = distanceKm * kmCostPerUnit;

      // 3. Kat Maliyetleri
      const elevatorP = Number(prices.elevatorCost) || 400;
      const stairsP = Number(prices.stairsCost) || 600;

      const flFrom = buildingData.floorFrom ? parseInt(buildingData.floorFrom) : 0;
      const flTo = buildingData.floorTo ? parseInt(buildingData.floorTo) : 0;
      
      const costFrom = buildingData.elevatorFrom ? (flFrom * elevatorP) : (flFrom * stairsP);
      const costTo = buildingData.elevatorTo ? (flTo * elevatorP) : (flTo * stairsP);
      const totalFloorCost = costFrom + costTo;

      // Toplam Aralık
      const totalMin = roomPriceData.min + distanceTotal + totalFloorCost;
      const totalMax = roomPriceData.max + distanceTotal + totalFloorCost;

      setPriceDetails({
        roomMin: roomPriceData.min,
        roomMax: roomPriceData.max,
        distanceCost: distanceTotal,
        totalFloorsCost: totalFloorCost,
        floorFromCost: costFrom,
        floorToCost: costTo,
        grandTotalMin: Math.round(totalMin / 100) * 100, 
        grandTotalMax: Math.round(totalMax / 100) * 100
      });
    }
  }, [step, distanceKm, selectedRoom, buildingData, prices]);

  // --- WHATSAPP GÖNDERME ---
  const sendToWhatsApp = () => {
    if (points.length < 2) return;
    const p1 = points[0];
    const p2 = points[1];
    // Google Maps Rota Linki
    const googleMapsUrl = `https://www.google.com/maps/dir/${p1.lat},${p1.lng}/${p2.lat},${p2.lng}`;

    const message = `👋 Merhaba, web sitenizden detaylı fiyat teklifi aldım.

📋 *HİZMET DETAYLARI*
━━━━━━━━━━━━━━━━━━
🏠 *Ev Tipi:* ${selectedRoom}
   └ Baz Fiyat: ${priceDetails.roomMin} - ${priceDetails.roomMax} ₺

📏 *Mesafe:* ${distanceKm} KM
   └ Yol Ücreti: +${priceDetails.distanceCost} ₺

🏢 *KAT BİLGİLERİ*
• Mevcut: ${buildingData.floorFrom || 'Giriş'}. Kat (${buildingData.elevatorFrom ? '✅ Mobil Asansör' : '❌ Merdiven'})
• Yeni: ${buildingData.floorTo || 'Giriş'}. Kat (${buildingData.elevatorTo ? '✅ Mobil Asansör' : '❌ Merdiven'})
   └ Kat Farkları: +${priceDetails.totalFloorsCost} ₺

💰 *TOPLAM TAHMİNİ TUTAR*
━━━━━━━━━━━━━━━━━━
👉 *${priceDetails.grandTotalMin.toLocaleString('tr-TR')} ₺ - ${priceDetails.grandTotalMax.toLocaleString('tr-TR')} ₺*

📍 *HARİTA & ROTA:*
${googleMapsUrl}

Müsaitlik durumunuz nedir?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="wizard-page">
      <div className="wizard-container">
        
        {/* HEADER */}
        <div className="wizard-header">
          <div className="wizard-title">
            {step === 1 && "Nereden Nereye?"}
            {step === 2 && "Eşya Yoğunluğu"}
            {step === 3 && "Bina Durumu"}
            {step === 4 && "Fiyat Detayı"}
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', color:'#aaa', fontSize:'1.5rem', cursor:'pointer'}}>
            <RiCloseLine />
          </button>
        </div>

        <div className="wizard-content">
          
          {/* ADIM 1: HARİTA */}
          {step === 1 && (
            <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
              <p style={{color:'#aaa', marginBottom:'10px', fontSize:'0.9rem'}}>
                 Lütfen haritadan <strong>Eski Ev</strong> ve <strong>Yeni Ev</strong> konumlarını işaretleyin.
              </p>
              <div className="map-wrapper">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', background:'#111' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='© CARTO' />
                  <SearchField />
                  <LocationMarker points={points} setPoints={setPoints} />
                  
                  {points.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                      <Popup>{idx === 0 ? "MEVCUT EV" : "YENİ EV"}</Popup>
                    </Marker>
                  ))}

                  {/* DÜZ MAVİ YOL ÇİZGİSİ (NOKTA NOKTA DEĞİL) */}
                  {routePath.length > 0 && (
                    <Polyline 
                      positions={routePath} 
                      pathOptions={{ 
                        color: '#007aff', // Mavi
                        weight: 6,        // Kalınlık
                        opacity: 0.9,
                        lineCap: 'round',
                        lineJoin: 'round'
                        // dashArray YOK -> DÜZ ÇİZGİ
                      }} 
                    />
                  )}
                </MapContainer>
                {distanceKm > 0 && (
                  <div className="map-overlay-info">
                    <div style={{fontSize:'0.8rem', color:'#aaa'}}>MESAFE</div>
                    <div className="distance-value"><RiTruckLine style={{verticalAlign:'middle'}}/> {distanceKm} KM</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADIM 2: ODA SEÇİMİ */}
          {step === 2 && (
            <div className="h-full flex flex-col items-center">
              <h3 className="text-white text-xl mb-6 font-bold text-center">Eviniz kaç odalı?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl overflow-y-auto pr-2" style={{maxHeight:'60vh'}}>
                {ROOM_TYPES.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col items-center text-center gap-2 ${
                      selectedRoom === room.id 
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(0,122,255,0.3)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`text-3xl ${selectedRoom === room.id ? 'text-blue-400' : 'text-slate-500'}`}>
                      {room.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold">{room.label}</div>
                      <div className="text-slate-400 text-xs mt-1">{room.desc}</div>
                    </div>
                    {selectedRoom === room.id && (
                      <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        <RiCheckLine />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADIM 3: BİNA & ASANSÖR */}
          {step === 3 && (
            <div className="building-split">
              <div className="building-col">
                <div style={{color:'#007aff', fontWeight:'bold', marginBottom:'15px'}}><RiUserLocationLine /> Mevcut Ev</div>
                <input type="number" placeholder="Bulunduğu Kat" className="input-glass-lg"
                  value={buildingData.floorFrom} onChange={e => setBuildingData({...buildingData, floorFrom: e.target.value})}
                />
                <div className={`toggle-row ${buildingData.elevatorFrom ? 'active' : ''}`} 
                     onClick={() => setBuildingData({...buildingData, elevatorFrom: !buildingData.elevatorFrom})}>
                  <div style={{flex:1}}>
                    <span style={{color:'white', fontWeight:'bold', display:'block'}}>Mobil Asansör</span>
                    <span style={{color:'#aaa', fontSize:'0.75rem'}}>Kurulabilir mi?</span>
                  </div>
                  <div className={`checkbox-circle ${buildingData.elevatorFrom ? 'checked' : ''}`}>
                    {buildingData.elevatorFrom && <RiCheckLine />}
                  </div>
                </div>
              </div>

              <div className="building-col">
                <div style={{color:'#007aff', fontWeight:'bold', marginBottom:'15px'}}><RiBuilding4Line /> Yeni Ev</div>
                <input type="number" placeholder="Taşınacak Kat" className="input-glass-lg"
                  value={buildingData.floorTo} onChange={e => setBuildingData({...buildingData, floorTo: e.target.value})}
                />
                <div className={`toggle-row ${buildingData.elevatorTo ? 'active' : ''}`} 
                     onClick={() => setBuildingData({...buildingData, elevatorTo: !buildingData.elevatorTo})}>
                  <div style={{flex:1}}>
                    <span style={{color:'white', fontWeight:'bold', display:'block'}}>Mobil Asansör</span>
                    <span style={{color:'#aaa', fontSize:'0.75rem'}}>Kurulabilir mi?</span>
                  </div>
                  <div className={`checkbox-circle ${buildingData.elevatorTo ? 'checked' : ''}`}>
                    {buildingData.elevatorTo && <RiCheckLine />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADIM 4: FİYAT VE TABLO */}
          {step === 4 && (
            <div style={{textAlign:'center', marginTop:'30px'}}>
              <div style={{color:'#888', letterSpacing:'2px'}}>TAHMİNİ FİYAT ARALIĞI</div>
              
              <div style={{fontSize:'3.5rem', fontWeight:'900', color:'white', textShadow:'0 0 40px #007aff', lineHeight:'1.2', marginTop:'10px'}}>
                {priceDetails.grandTotalMin.toLocaleString('tr-TR')} 
                <span style={{fontSize:'2rem', color:'#666', margin:'0 10px'}}>-</span>
                {priceDetails.grandTotalMax.toLocaleString('tr-TR')}
                <span style={{fontSize:'2rem', color:'#007aff', marginLeft:'10px'}}>₺</span>
              </div>
              
              {/* DETAYLI FİYAT DÖKÜM TABLOSU */}
              <div style={{maxWidth:'500px', margin:'30px auto', background:'rgba(255,255,255,0.05)', padding:'25px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.1)'}}>
                
                {/* 1. ODA FİYATI */}
                <div className="price-row">
                  <div className="flex items-center gap-3">
                    <RiHome5Line className="text-blue-500 text-xl"/>
                    <span className="text-slate-300">{selectedRoom} Baz Fiyat</span>
                  </div>
                  <span className="text-white font-bold">
                    {priceDetails.roomMin.toLocaleString()} - {priceDetails.roomMax.toLocaleString()} ₺
                  </span>
                </div>

                {/* 2. MESAFE */}
                <div className="price-row mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <RiMapPinTimeLine className="text-green-500 text-xl"/>
                    <span className="text-slate-300">Mesafe ({distanceKm} km)</span>
                  </div>
                  <span className="text-green-400 font-bold">+{priceDetails.distanceCost.toLocaleString()} ₺</span>
                </div>

                {/* 3. KAT FARKLARI */}
                <div className="price-row mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <RiStairsLine className="text-orange-500 text-xl"/>
                    <span className="text-slate-300">Kat & Asansör Farkı</span>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-400 font-bold block">+{priceDetails.totalFloorsCost.toLocaleString()} ₺</span>
                    <span className="text-xs text-slate-500">
                      (Mevcut: {priceDetails.floorFromCost} + Yeni: {priceDetails.floorToCost})
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        <div className="wizard-footer">
          {step > 1 ? (
            <button className="btn-action btn-ghost" onClick={() => setStep(step - 1)}>Geri</button>
          ) : (<div></div>)}

          {step < 4 ? (
            <button className="btn-action btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && points.length < 2}>
              {step === 1 && points.length < 2 ? "Konum Seçin" : "Devam Et"}
            </button>
          ) : (
            <button className="btn-action btn-whatsapp" onClick={sendToWhatsApp}>
              <RiWhatsappLine style={{marginRight:5, fontSize:'1.2rem'}}/> WhatsApp ile Fiyat Al
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Wizard;