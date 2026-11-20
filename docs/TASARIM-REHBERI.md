# Teşekkür Panosu: Tasarım ve Yapım Rehberi

Bu belge, PAÜ Mühendislik Fakültesi Teşekkür Panosu sitesinde neyi **neden** öyle yaptığımızı anlatır. Amaç, aynı yaklaşımı başka bir projede tekrar kullanabilmek.

Yeni projede Claude Code'la çalışırken bu dosyayı projeye kopyalayıp şöyle diyebilirsin: "Bu rehberdeki yaklaşımı kullan, ama malzemeyi/renkleri yeni konuya göre seç."

Canlı örnek: https://gurkann20.github.io/mf-pano/ · Kaynak kod: https://github.com/Gurkann20/mf-pano

---

## 1. Ana fikir: gerçek nesnenin malzemesi

Tasarım dört revizyondan geçti. Her seferinde öğrendiğimiz şey aynıydı:

| Denediğimiz | Gürkan'ın tepkisi | Ders |
| --- | --- | --- |
| Koyu lacivert zemin, mavi ışıklar, sayaçlar, "50" rozeti | "Yapay zekâ yapmış gibi duruyor" | Hazır "teknolojik site" kalıbı herkese aynı görünür. |
| Sade, kurumsal lacivert | "Hâlâ çok sade" | Sadelik tek başına kimlik vermez. |
| **Fakülte girişindeki gerçek duvar ve pano**: kırmızı tuğla, gümüş plakalar, siyah kadife, altın işlemeli çerçeve | Beğenildi | Zenginlik süsle değil, **gerçek nesnenin malzemesiyle** gelir. |

**Kural:** Yeni bir projede önce sor: "Bu sitenin anlattığı şeyin gerçek dünyadaki karşılığı ne? Hangi malzemeden yapılmış, nerede duruyor?" Tasarımı o nesneden kur. QR'ı okutan kişi panonun önünde duruyor; telefonda da aynı duvarı ve aynı panoyu görüyor.

Kaçındıklarımız:
- Her bölümde aşağıdan kayarak beliren kartlar ve her yere hover efekti.
- Büyük sayı + küçük etiket sayaçları, gradyanlı rozetler, "→" ok işaretli butonlar.
- Pazarlama dili ("Bu fakülteyi bir şehir kurdu" gibi). Ton sade ve kurumsal.

## 2. Görsel sistem

### Renkler (`css/tokens.css`, tek yer)

| Ad | Değer | Nerede |
| --- | --- | --- |
| Tuğla | `#8f4330` + `assets/doku/tugla.svg` | Sayfanın zemini |
| Kadife | `#07090d` | Pano ve tarihçe panosunun içi |
| Gümüş plaka | `#eef1f5` → `#d6dce4` → `#b9c1cc` | Plakalar, başlık panosu |
| Gümüş | `#c9d1db` | Çerçeve çizgileri, büyük yıl rakamları |
| Plaka yazısı | `#1d2633` | Gümüş üzerinde koyu yazı (WCAG AA) |
| PAÜ mavisi | `#0085d0`, `#004684` | Bağlantı, seçili nokta (pau.edu.tr'den alındı) |
| Sıcak ışık | `rgba(255,226,170,…)` | Spot ışıkları, duvar aydınlığı |

Kurumsal renkleri tahmin etme: kurumun kendi sitesinin CSS dosyasından al.

### Yazı tipi

- **Tek aile: Archivo** (değişken kalınlık + genişlik). Kendi sunucumuzda, `latin-ext` dahil (ğ, ş, İ, ı).
- Başlıklar **geniş kesim** (`font-stretch: 125%`): plakaya kazınmış yazı hissi verir. Metin normal genişlikte.
- Telefonda dar plakalarda `font-stretch: 75%` ile sıkıştırılmış kesim kullanılıyor; böylece uzun dernek adları 4 sütuna sığıyor.
- Ölçek 1.25 oranlı: `.8 / 1 / 1.25 / 1.56rem`, başlıklar `clamp()` ile ekrana göre.

### Malzemeler (hepsi CSS ve SVG, fotoğraf yok)

- **Tuğla duvar:** Python ile üretilmiş tekrarlanan SVG (`assets/doku/tugla.svg`), `background: url(...) 404px 248px repeat`.
- **Fırçalanmış gümüş:** Üç katman üst üste:
  1. SVG `feTurbulence` gürültüsü, yatay frekansı çok düşük: `baseFrequency='.004 .9'` (fırça izi).
  2. Çapraz bir ışık şeridi (`linear-gradient(100deg, …)`).
  3. Üstten alta gümüş gradyan.
- **Kadife:** Siyah zemin + çok hafif beyaz gürültü (`opacity` düşük) + iç gölge.
- **İşlemeli çerçeve:**
  - Dış kenar: `border-image` ile boncuk SVG.
  - İçte: ikinci bir `border-image` ile altın burgu şeridi.
  - Kat kat `inset box-shadow` ile pervaz profili.
  - Duvara düşen iki katmanlı gölge.
- **Spot lambalar** (Atatürk bölümü):
  - Ray `::before` ile çizilmiş.
  - Lamba, `div` + gradyanlı silindir; merceği ise `radial-gradient` + `box-shadow` parıltısı.
  - Işık konisi `clip-path: polygon(...)` + sıcak gradyan + `mix-blend-mode: screen` + hafif `blur`.

Bu teknikler başka malzemelere de uyarlanabilir: ahşap, mermer, cam, kâğıt vb.

## 3. Hareket kuralları

1. **Tek bir açılış anı.** Plakalardaki adlar harf harf kazınır, sonra panonun üzerinden tek bir ışık geçer. Başka bir yerde kendiliğinden hareket yok.
2. **Geri kalan her hareket kullanıcıya tepkidir:**
   - Plaka fareyle eğilir (en fazla 8°), telefonda dokununca kısa bir eğilip geri gelir.
   - Üzerine gelince metal parıltı geçer.
   - Plakaya tıklanınca büyüyerek kişi sayfasına dönüşür (View Transitions API).
3. **Bir kez olan sahne:** Atatürk bölümü ekrana girince spotlar soldan sağa sırayla yanar. `IntersectionObserver` ile bir kez tetiklenir.
4. **Tarihçe slayt gibi ilerler:**
   - Her olay 3,5 sn ekranda kalır.
   - Bölüm ekranda değilken, sekme gizliyken ve klavyeyle gezinirken bekler.
5. **Yalnızca `transform` ve `opacity`.** Düzeni bozan (layout tetikleyen) animasyon yok; telefonda takılmaz.
6. **`prefers-reduced-motion`:** Hareket kapanır, içerik doğrudan görünür. Işıklar baştan açıktır.
7. **Hover yalnızca fareli cihazlarda:** `@media (hover: hover)`. Yoksa iPhone'da dokunulan öğe "üzerinde" takılı kalır.

## 4. Mimari

| Karar | Neden |
| --- | --- |
| Düz HTML + CSS + JavaScript (ES modülleri), framework yok, build yok | Telefonda hızlı açılır; benden sonra gelen herkes dosyayı açıp düzenleyebilir. |
| Veri JSON'da (`data/bagiscilar.json`, `tarihce.json`, `site.json`) | İsim eklemek için kod değil veri değişir. Kodda tek bir isim yok. |
| Hash yönlendirme (`#/kisi/<id>`) | GitHub Pages'te sunucu ayarı gerekmez; her kaydın kalıcı bir linki olur (ileride kişiye özel QR). |
| GitHub Pages | Ücretsiz, HTTPS otomatik, `git push` = yayın. Kalıcı adres için alt alan adı + DNS CNAME. |
| `?v=20261120f` sürüm eki (CSS/JS/import'larda) | iPhone Safari eski dosyaları önbellekte tutuyordu. Her yayında sürüm değişir. |
| Sayfa ağırlığı < 500 KB, fontlar kendi sunucumuzda, analytics/çerez yok | Hız ve gizlilik. |

Klasör yapısı:

```
index.html
css/   tokens.css (tek renk/font yeri) · base.css · components.css
js/    main.js (yönlendirme) · data.js · board.js · person.js · timeline.js · effects.js
data/  *.json
yonetim/  personel paneli
assets/   logo/ · fonts/ · doku/ (SVG dokular) · foto/ · ataturk/
tools/    qr.html (QR üretici) · sunucu.py (önbelleksiz yerel sunucu)
docs/     TEKNIK-OZET.md · openapi.yaml + swagger.html · bu dosya
ozel/     iç notlar — .gitignore'da, asla yüklenmez
```

## 5. Sunucusuz yönetim paneli (tekrar kullanılabilir parça)

Kod bilmeyen personelin içerik eklemesi için:

- `yonetim/` sayfası:
  - Form + panonun 4×14 mini haritası; aynı yere iki isim konamaz.
  - "Siteye yayınla" düğmesi, **GitHub Contents API** ile JSON dosyasını commit'ler.
- **Giriş (sunucu olmadan):**
  - GitHub fine-grained token (yalnızca bu depo, yalnızca Contents yazma) kullanıcı adı ve şifreyle şifrelenir: PBKDF2-SHA256 600.000 tur + AES-256-GCM, tarayıcının Web Crypto API'siyle.
  - Şifreli hâli `yonetim/giris.json` olarak depoda durur. Doğru şifre token'ı çözer, yanlış şifre çözemez.
  - Şifre hiçbir yerde saklanmaz; oturum `sessionStorage`'da tutulur, tarayıcı kapanınca biter.
- Kurulum ve şifre değiştirme: `yonetim/kurulum.html`.
- Yedek: yayınlama hata verirse JSON indirilip elle gönderilir.

Sınırı: Bu, gerçek bir sunucu girişi kadar güçlü değildir; şifre güçlü olmalıdır (en az 12 karakter). Küçük kurum siteleri için yeterli ve ücretsiz bir çözümdür.

## 6. İçerik ve gizlilik kuralları

- Biyografiler kaynaktan bilgi alınarak **kendi cümlelerimizle** yazılır; kaynaklar her sayfada listelenir.
- Fotoğraf yalnızca aile veya kurum izniyle eklenir. İnternetten kişi fotoğrafı alınmaz. Atatürk fotoğrafları ve imzası Wikimedia Commons'tan, **kamu malı** olanlar seçildi.
- Cenaze, sağlık, aile içi ayrıntılar yazılmaz.
- Yapay zekâ sohbetinden gelen "araştırma" metinleri doğrulanmadan yazılmaz. Haber veya resmî kaynakla teyit edilir; teyit edilemeyen bilgi sorumlu kişiye sorulur.
- İç notlar herkese açık depoya hiç girmez (`ozel/`, `.gitignore`).
- Kişi itiraz ederse panelden tek tıkla biyografisi gizlenir (`yayinla: false`).

## 7. Mobil öncelik ve kalite

- Önce telefon tasarlandı: 390 px genişlikte 16 px kenar boşluğu, yatay kaydırma yok.
- Telefonda da gerçek panodaki gibi 4 sütun. Uzun adlar için sıkıştırılmış font kullanılıyor.
- Erişilebilirlik:
  - Plakalar gerçek `<a>` öğeleri, klavyeyle gezilebilir ve odak halkası görünür.
  - `lang="tr"`, ekran okuyucu etiketleri, görsellerde `alt` var.
- **Görünüm, JavaScript'ten önce belli olmalı.** `<body data-gorunum="ana">` HTML'de yazıyor. Yoksa veri yüklenene kadar yanlış parçalar bir an görünüyordu (sol üstte logo yanıp sönmesi).
- Test:
  - Başsız Chrome ile telefon ve masaüstü ekran görüntüsü alındı, Puppeteer ile otomatik kontroller yapıldı (plaka yerleri, Türkçe karakterli arama: "inceoglu" → "İnceoğlu").
  - Gerçek iPhone'da denendi.

## 8. QR

- QR yalnızca adresi içerir: süresi dolmaz, uygulama gerekmez. `tools/qr.html` baskı için SVG üretir.
- İnternetteki "dinamik QR" sitelerini kullanma; kendi sunucularından yönlendirir, deneme süresi bitince ya da şirket kapanınca basılı QR çalışmaz olur.
- **Kalıcı adres netleşmeden QR basılmaz.** Kalıcı adres için alt alan adı alınır, DNS'te `ad.pau.edu.tr CNAME gurkann20.github.io` kaydı eklenir.
- Önce A4'e basılıp farklı telefonlarla gerçek mesafeden denenir. En az 3×3 cm olmalı, 4–5 cm daha rahat okunur.

## 9. Yeni projede adım adım

1. **Konuyu ve gerçek nesneyi belirle.** Ne anlatılıyor, gerçek dünyada neye benziyor, hangi malzemeden yapılmış? Fotoğrafını çek.
2. **`tokens.css` yaz:** 4–6 renk (malzemeden ve kurumun kendi sitesinden), tek font ailesi, ölçek.
3. **Veriyi koddan ayır:** JSON şeması + `CLAUDE.md`'de veri modeli tablosu.
4. **İskeleti kur:** `index.html`, hash yönlendirme, JSON yükleme. Önce düz liste olarak çalışsın.
5. **Malzemeyi giydir:** zemin dokusu (SVG), ana nesne (CSS gradyan + gürültü + gölge).
6. **Tek bir açılış anı** ekle; geri kalan hareketleri kullanıcı etkileşimine bağla. Hareketi azaltma tercihine uy.
7. **Telefonda dene:** 390 px ekran görüntüsü + gerçek cihaz. `?v=` sürüm ekini unutma.
8. **Yönetim gerekiyorsa** `yonetim/` klasörünü kopyala; depo adını ve JSON alanlarını değiştir.
9. **Yayınla:** GitHub Pages → alt alan adı → QR.

Her adımın sonunda çalışan bir sürümü commit'le. Kararlar değiştikçe önce `CLAUDE.md`'yi, sonra kodu güncelle. Yapılanları tarihli olarak `PROGRESS.md`'ye yaz.
