import React, { useState, useEffect } from 'react';
import './Wizard.css';
import { 
  RiCloseLine, RiArrowRightLine, RiTruckLine, 
  RiSofaLine, RiTvLine, RiArchiveDrawerLine, RiFridgeLine,
  RiCheckLine, RiBuilding4Line, RiUserLocationLine, RiLayoutGridFill,
  RiTShirtLine, RiRestaurantLine, RiBox3Line
} from 'react-icons/ri';

// HARİTA
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ARAMA
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// İKON DÜZELTMESİ
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

// --- ARAMA BİLEŞENİ (DÜZELTİLDİ) ---
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
      searchLabel: 'Adres veya Dükkan ara...',
    });

    map.addControl(searchControl);
    return () => { map.removeControl(searchControl); };
  }, [map]);

  return null;
};

// TIKLAMA BİLEŞENİ
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

// --- WIZARD ANA BİLEŞENİ ---
const Wizard: React.FC<WizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [mapCenter] = useState<[number, number]>([40.076, 29.51]); 
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);

  // OSRM ROTA HESAPLAMA
  useEffect(() => {
    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const km = Math.round(route.distance / 1000);
            setDistanceKm(km < 3 ? 3 : km);
            const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRoutePath(coords);
          }
        })
        .catch(() => {
          setDistanceKm(Math.round(p1.distanceTo(p2) / 1000));
          setRoutePath([[p1.lat, p1.lng], [p2.lat, p2.lng]]);
        });
    } else {
      setDistanceKm(0); setRoutePath([]);
    }
  }, [points]);

  return (
    <div className="wizard-page">
      <div className="wizard-container">
        
        {/* HEADER */}
        <div className="wizard-header">
          <div className="wizard-title">
            {step === 1 ? "Nereden Nereye?" : "Detaylar"}
          </div>
          <button onClick={onClose} style={{background:'none', border:'none', color:'#fff', fontSize:'1.5rem', cursor:'pointer'}}>
            <RiCloseLine />
          </button>
        </div>

        {/* CONTENT */}
        <div className="wizard-content">
          {step === 1 && (
            <div style={{height:'100%', display:'flex', flexDirection:'column'}}>
              <div className="map-wrapper" style={{flex:1, position:'relative'}}>
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', background:'#111' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                  <SearchField />
                  <LocationMarker points={points} setPoints={setPoints} />
                  
                  {points.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                      <Popup>{idx === 0 ? "MEVCUT EV" : "YENİ EV"}</Popup>
                    </Marker>
                  ))}
                  {routePath.length > 0 && <Polyline positions={routePath} pathOptions={{ color: '#007aff', weight: 5 }} />}
                </MapContainer>

                {distanceKm > 0 && (
                  <div className="map-overlay-info">
                    <div style={{fontSize:'0.8rem', color:'#aaa'}}>ROTA</div>
                    <div className="distance-value"><RiTruckLine style={{verticalAlign:'middle'}}/> {distanceKm} KM</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Diğer stepler aynı kalabilir veya sadeleştirebilirsin */}
          {step > 1 && <div style={{textAlign:'center', color:'white', marginTop:'50px'}}>Diğer adımlar burada...</div>}
        </div>

        {/* FOOTER */}
        <div className="wizard-footer">
          {step > 1 ? <button className="btn-action btn-ghost" onClick={() => setStep(step - 1)}>Geri</button> : <div></div>}
          <button className="btn-action btn-primary" onClick={() => step < 4 ? setStep(step + 1) : onClose()}>
            {step === 4 ? "Tamamla" : "Devam Et"} <RiArrowRightLine style={{verticalAlign:'middle'}}/>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Wizard;