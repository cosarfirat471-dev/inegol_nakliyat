// src/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultData = {
  general: {
    phone: "905XXXXXXXXXX",
    title: "İnegöl Nakliyat",
    visitCount: 0,
    offerCount: 0
  },
  contact: {
    address: "Osmaniye Mah. Altay Cad. No:1, İnegöl / BURSA",
    email: "info@inegolnakliyat.com",
    mapEmbedUrl: ""
  },
  footer: {
    description: "İnegöl ve çevresinde yılların tecrübesiyle, sigortalı ve asansörlü taşımacılık hizmeti sunuyoruz.",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    copyrightText: "İnegöl Nakliyat"
  },
  regions: [
    "Yeniceköy Mahallesi", "Akhisar Mahallesi", "Alanyurt", "Cerrah"
  ],
  prices: {
    kmPrice: 50,       
    elevatorCost: 400, 
    stairsCost: 600,   
    
    // YENİ YAPI: MİN - MAX ARALIKLI FİYATLAR
    rooms: {
      '1+0': { min: 4000, max: 6000 },
      '2+0': { min: 5000, max: 7000 },
      '1+1': { min: 6000, max: 8000 },
      '2+1': { min: 8000, max: 10000 },
      '3+1': { min: 10000, max: 12000 },
      '4+1': { min: 14000, max: 17000 },
      '5+1': { min: 18000, max: 22000 },
      '6+1': { min: 22000, max: 30000 }
    }
  },
  gallery: [] 
};

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteContent", "mainData"), (docSnap) => {
      if (docSnap.exists()) {
        const incomingData = docSnap.data();
        
        // Veri yapısını güvenli birleştirme
        // Eğer veritabanında eski (tek sayı) fiyatlar varsa, bunları min-max yapısına çevirmemiz gerekebilir
        // Ancak admin panelden bir kere kaydet basınca düzeleceği için burayı basit tutuyoruz.
        
        setData({ ...defaultData, ...incomingData });
      } else {
        setDoc(doc(db, "siteContent", "mainData"), defaultData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateData = async (section: string, newData: any) => {
    const docRef = doc(db, "siteContent", "mainData");
    await updateDoc(docRef, { [section]: newData });
  };

  const incrementStat = (field: string) => {
    if (loading || !data || !data.general) return;
    const currentVal = Number(data.general[field]) || 0;
    updateData('general', { ...data.general, [field]: currentVal + 1 });
  };

  return (
    <DataContext.Provider value={{ data, updateData, incrementStat, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);