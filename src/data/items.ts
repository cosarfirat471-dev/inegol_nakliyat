// src/data/items.ts

export type ItemType = {
  id: string;
  name: string;
  category: 'salon' | 'yatak' | 'beyaz-esya' | 'diger';
  points: number; // Hacim puanı (fiyat hesaplamada kullanılacak)
};

export const moveItems: ItemType[] = [
  // SALON
  { id: 'koltuk-3', name: '3\'lü Koltuk', category: 'salon', points: 15 },
  { id: 'koltuk-2', name: '2\'li Koltuk', category: 'salon', points: 10 },
  { id: 'masa', name: 'Yemek Masası', category: 'salon', points: 12 },
  { id: 'tv-unite', name: 'TV Ünitesi', category: 'salon', points: 10 },
  
  // YATAK ODASI
  { id: 'yatak-cift', name: 'Çift Kişilik Yatak', category: 'yatak', points: 20 },
  { id: 'dolap-surgulu', name: 'Sürgülü Gardırop', category: 'yatak', points: 25 },
  { id: 'komodin', name: 'Komodin', category: 'yatak', points: 3 },
  
  // BEYAZ EŞYA
  { id: 'buzdolabi', name: 'Buzdolabı', category: 'beyaz-esya', points: 15 },
  { id: 'camasir', name: 'Çamaşır Makinesi', category: 'beyaz-esya', points: 8 },
  { id: 'bulasik', name: 'Bulaşık Makinesi', category: 'beyaz-esya', points: 8 },
  
  // DİĞER
  { id: 'koli', name: 'Koli (Adet)', category: 'diger', points: 1 },
];