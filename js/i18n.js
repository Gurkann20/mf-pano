// Arayüz metinleri. İngilizce sürüm gerekirse buraya `en` nesnesi eklenir.
// (Sabit sayfa metinleri index.html içindedir.)

export const tr = {
  tur: {
    hepsi: "Tümü",
    kisi: "Kişiler",
    kurum: "Kurumlar",
    "dernek-vakif": "Dernek ve Vakıflar",
  },
  turTekil: { kisi: "Bağışçı", kurum: "Kurum", "dernek-vakif": "Dernek / Vakıf" },
  sonucVarsayilan: (dolu) => `${dolu} kurum ve kişi`,
  sonucSayisi: (n) => `${n} kayıt gösteriliyor`,
  sonucYok: "Bu aramayla eşleşen bir isim bulunamadı.",
  panoyaDon: "Panoya dön",
  onceki: "Önceki bağışçı",
  sonraki: "Sonraki bağışçı",
  katkiBaslik: "Fakülteye katkısı",
  katkiYok: "Katkı bilgisini derliyoruz.",
  hayatiBaslik: { kisi: "Hayatı", kurum: "Hakkında", "dernek-vakif": "Hakkında" },
  derleniyor: "Bu bağışçının hikâyesini derliyoruz. Bilgi ve fotoğraf paylaşmak isterseniz bize ulaşın.",
  bizeUlasin: "Bize ulaşın",
  kaynaklarBaslik: "Kaynaklar",
  panodakiYeri: "Panodaki yeri",
  yerMetni: (r, c) => `${r}. satır, ${c}. sütun`,
  paylas: "Paylaş",
  kopyalandi: "Bağlantı kopyalandı",
  bulunamadi: "Bu plaka bulunamadı.",
  durum: { dogrulandi: "Doğrulandı", "ekip-notu": "Kaynak bekleniyor", eksik: "Bilgi eksik" },
  yayindaDegil: "Canlıda biyografi gizli",
  tarihceBaslik: "Fakültenin hikâyesi",
  tarihceGiris: "1970'teki ilk girişimlerden bugünkü Pamukkale Üniversitesi Mühendislik Fakültesi'ne uzanan süreç.",
  kaynak: {
    belge: { ad: "Cafer Sadık Abalıoğlu Eğitim ve Kültür Vakfı Bülteni, Sayı 63 (Aralık 2021)", url: null },
    "pau-mf": { ad: "PAÜ Mühendislik Fakültesi – Tarihçe", url: "https://www.pau.edu.tr/mf/en/sayfa/history-3" },
    pau: { ad: "Pamukkale Üniversitesi", url: "https://www.pau.edu.tr" },
  },
  iletisim: { telefon: "Telefon", eposta: "E-posta", adres: "Adres" },
  epostaKonu: "Mühendislik Fakültesi Teşekkür Panosu – Katkı",
  sayfaBasligi: "Teşekkür Panosu · PAÜ Mühendislik Fakültesi",
};

export const t = tr;
