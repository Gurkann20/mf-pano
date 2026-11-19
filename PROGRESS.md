# MF-QR — Çalışma Günlüğü (Claude)

> Claude'un nerede kaldığını takip etmesi için. Her oturumda güncellenir.
> **Spesifikasyon: `CLAUDE.md`** (tek kaynak). Bu dosya yalnızca durum/ilerleme içindir.

## Durum özeti (2026-11-18)
Site + yönetim paneli + QR aracı çalışır durumda, yerelde test edildi. **Henüz yayında değil** (GitHub deposu yok).

## 2026-11-19 (3): İşlemeli çerçeve + cetvel hep otomatik
- Kullanıcının tarayıcısı eski CSS'i önbellekten gösteriyordu → tools/sunucu.py (önbelleksiz) + tüm CSS/JS'e `?v=` sürüm etiketi (şu an 20261119e)
- Cetvel: fare üstü / klavye odağı / reduced-motion artık durdurmuyor; yalnızca durdur düğmesi, ekran dışı ve gizli sekme bekletir (test edildi)
- Çerçeve (pano + kadife panolar): dışta boncuk-makara işleme (assets/doku/boncuk.svg, border-image), şampanya-gümüş fırçalı pervaz, altın burgu (assets/doku/burgu.svg), velvet kenarında altın şerit; açılışta çerçeveden altın ışık geçer
- Pano madalyonu büyütüldü: clamp(136px, 24vw, 268px) ≈ panonun dörtte biri (fotoğraftaki oran)

## 2026-11-19 (2): Tuğla zemin + büyük logolar + yeni isim
- Yeni fotoğrafta panoya eklenmiş 31. isim: **Mehmet Hilmi Serter** (8. satır, 3. sütun) → JSON'a eklendi, bilgi yok (durum: eksik)
- Resmi fakülte logosu indirildi (pau.edu.tr duyurusu: d.pau.edu.tr/e5KRm PNG 827 px, d.pau.edu.tr/q8P5L vektör .cdr) → assets/logo/muhendislik-logo.webp (69 KB). Vektör CorelDraw formatında; web'de kullanılmadı
- Bütün sitenin zemini tuğla duvar: assets/doku/tugla.svg (fotoğraftaki renklerden, rastgele tonlu tuğlalar) + ışık/gölge katmanı (body::before, `isolation:isolate` şart)
- Açılış: PAÜ ve MF logoları büyük beyaz diskler (panodaki madalyon gibi), ortalı başlık; ana sayfada üst çubuk gizli
- Tarihçe ve kişi sayfası duvara asılı kadife panolar (.kadife-pano)
- Sayı: PDF "32 isim" diyordu; panoda şu an 31 var

## 2026-11-19: PDF verisi + logolar + "hâlâ çok sade"
- Araştırma PDF'i ilk kez okundu (önceki oturumda okunmamıştı; veri zip'teki JSON'dan geliyordu)
- Tarihçe 13 → 16 olay: Ocak 1976 MEB bildirimi, 20 Şubat 1976, 1976–77 ilk dersler, 11 Temmuz 1992 (3837 sayılı Kanun), 2006–07 Kınıklı; 1974/1976-77 tutarları, 1982 kamulaştırma eklendi
- Bağışçılar: Yükseköğretim Vakfı kurucuları, Valilik 1976 katkısı, Abalıoğlu eğitim kurumları, Özkardeş DTO, Çelikkol görevleri, Kalaycıoğlu okulu, Özsoy okulu, Arı Kiremit bugünü, Zorlu doğum tarihi, Tano tanıtımı (yayinla:false)
- PDF "32 isim" diyor; panoda ve JSON'da 30 var → dekanlığa sorulmalı
- Logolar 46 → 64 (telefon) / 84 px (masaüstü); fakülte logosu 113 px kaynaktan 4x büyütüldü (assets/logo/muhendislik-logo@4x.webp, 50 KB) — resmi yüksek çözünürlüklü dosya hâlâ lazım
- Tasarım: pano gerçek tuğla duvar üzerinde (.duvar, spot ışığı); masaüstünde kaydırınca pano eğik açıdan karşıya döner; başlık gümüş + açılışta tek ışık; cetvelde yakın işaretler basamaklı

## Cetvel otomatik ilerleme (2026-11-18)
- js/timeline.js: SURE=8000 ms; imleç + `.cetvel__gecen` çizgisi doğrusal kayar, varınca olay değişir, sonda başa döner
- Durdur/oynat düğmesi; fare üstü / klavye odağı / ekran dışı / sekme gizli → bekler, kaldığı yerden devam eder (test edildi)
- Bilinen küçük nokta: telefonda uzak olaya (ör. 1978→1982) kayarken imleç bir süre ekran dışında kalabiliyor

## Tasarım revizyonu 2 (2026-11-18): "yapay zekâ yapmış gibi, kartlar kötü"
- Tarihçe kartları → **ölçüm cetveli** (js/timeline.js `cetvelCiz`): büyük gümüş yıl + metin, altta yıl çentikli cetvel, işaretler ay hassasiyetinde; oklar/klavye/kaydırma
- Font: Space Grotesk + Inter → tek aile **Archivo** (geniş kesim başlıklar). Eski font dosyaları silindi.
- Renk: lacivert-siyah + camgöbeği → logonun laciverti #0b1f3f + gümüş; mavi yalnızca etkileşimde
- Kaldırılanlar: büyük harfli üst etiketler, blueprint ızgara, imleç ışığı, parallax, kayarak belirişler, "→"lar, sekme sayıları, "30 kurum ve kişi" satırı
- Hareket: açılışta plakalar kazınır → bitince panonun üzerinden tek ışık geçer (`.pano-cerceve.isildi`)
- Süzgeç: tek çerçeveli segment; seçili olan gümüş plaka gibi
- Masaüstünde başlık tek satır "Teşekkür Panosu"
- `#/tarihce` ayrı sayfası kaldırıldı → ana sayfadaki cetvele kaydırır

## Tasarım revizyonu 1 (2026-11-18, Gürkan'ın geri bildirimi)
Beğenilmeyenler → yapılan:
- Büyük "50", "Akademinin 50. yılı", "1976–2026" rozeti → **kaldırıldı**; tarihçeden "2026 / 50. yıl" olayı da silindi
- 26 boş plakayı öne çıkarma (nefes efekti, davet bölümü, isim önizleme) → **kaldırıldı**; sitede boş plaka yok
- "Valilik, belediye… birlikte çalıştılar" cümlesi ve "Bu fakülteyi bir şehir kurdu" → **kaldırıldı**
- Sol çizgili boş zaman tüneli → **kart düzeni** (telefonda yana kaydırmalı, masaüstünde 3 sütun); kişi sayfası katkı listesi de çizgisiz
- Sayfa artık doğrudan "Teşekkür Panosu" başlığı + panoyla açılıyor
- Alt bilgiye dekanlık tel/e-posta eklendi
Not: Gürkan'ın tasarım zevki → sade, kurumsal, abartısız; boşluk hissi veren uzun boş alanlardan kaçın.

## Yapım sırası (CLAUDE.md §11)
- [x] 1. İskelet: index.html, tokens.css, router, JSON yükleme
- [x] 2. Dijital pano: 4×14 grid (masaüstünde fiziksel konumlar birebir), gümüş plaka, filtre sekmeleri, Türkçe duyarsız arama
- [x] 3. Kişi sayfası: monogram, katkı zaman çizgisi, biyografi / "derliyoruz" notu, kaynaklar, mini pano konumu, önceki/sonraki, paylaş
- [x] 4. Giriş: "Teşekkür Panosu" başlığı + pano ilk ekranda (revizyon sonrası)
- [x] 5. Tarihçe: ölçüm cetveli (tüm olaylar, kaynaklar, bağışçı adları otomatik link)
- [—] 6. Boş plakalar: revizyonla kaldırıldı
- [x] 7. Efektler: eğim, parıltı, lazer kazıma, sıralı beliriş, sayaçlar, çizgi çizimi, parallax, imleç ışığı, View Transitions; reduced-motion
- [~] 8. Demo modu ✔, OG etiketleri ✔ (hash sayfalarında sosyal medya önizlemesi yalnızca ana sayfa için çalışır — teknik sınır), erişilebilirlik temel ✔. **Lighthouse ölçümü yapılmadı.**
- [ ] 9. GitHub Pages yayını + gerçek telefonda (iOS Safari + Android Chrome) test

## Spec dışı eklenenler (kullanıcı isteği: "personel isim ekleyip çıkarabilmeli")
- `yonetim/` paneli: mini pano üzerinden ekle/düzenle/kaldır, konum çakışma kontrolü, fotoğraf yükleme (izin kutusu zorunlu, WebP'ye küçültür), iletişim bilgisi düzenleme, "Siteye yayınla" (GitHub API commit) / "JSON indir".
- `tools/qr.html`: QR üretici (logo ortada, H hata düzeltme), SVG/PNG indir, yazdırılabilir etiket, kişiye özel QR.
- `data/site.json`: iletişim, son güncelleme tarihi.
- **İç notlar** `ozel/notlar.json`'a taşındı (gitignore). Sebep: ücretsiz GitHub Pages = herkese açık depo → notlar herkes tarafından okunabilirdi.

## Test sonuçları (yerel, headless Chrome)
- Mobil ilk yükleme ~0,8 sn; toplam ağırlık (foto hariç) ~322 KB
- 30 plaka; arama "ozkardes", "inceoglu", "İnceoğlu", "CELIKKOL" ✔
- `yayinla:false` canlıda bio göstermiyor, `?demo=1` gösteriyor + TASLAK etiketi ✔
- Sayfada iç not metni yok ✔; konsol hatası yok ✔
- Panel: ekleme, otomatik id (ayse-yilmaz-ozturk), çakışma engeli ✔ (GitHub'a gerçek commit henüz denenmedi)
- Test betikleri scratchpad'de (oturuma özel): puppeteer-core + yüklü Chrome

## Açık sorular / Gürkan'dan beklenenler
- [ ] GitHub hesabı + depo adı → yayın (Settings → Pages → main / root)
- [ ] Personel için fine-grained token (yalnızca bu depo, Contents: Read & write)
- [ ] Kalıcı adres (PAÜ alt alan adı?) — QR bu netleşmeden basılmamalı
- [ ] Fakülte logosunun SVG / yüksek çözünürlüklü hâli (şu an 113 px PNG)
- [ ] İletişim: şimdilik fakültenin genel tel/e-postası (0258 296 20 00, muhendislik@pau.edu.tr) — dekanlık onaylamalı; adresteki "Kınıklı Kampüsü" doğrulanmalı
- [ ] Panodaki isim yazımları dekanlıkla teyit (fotoğraftan okunanla JSON birebir uyuşuyor)
- [ ] Ahmet Nazif Zorlu kartının dili (yakın zamanda vefat) — dekanlıkla
- [ ] İngilizce sürüm gerekli mi?

## Sıradaki adımlar
1. Gürkan GitHub deposunu açınca: push, Pages'i aç, gerçek telefonda test, panelden bir deneme commit'i.
2. Lighthouse mobil ölçümü (hedef Perf ≥ 90, A11y ≥ 95).
3. Kalıcı adres netleşince `tools/qr.html` ile QR'ı üret, baskıya ver.

## Yerelde çalıştırma
```
python tools/sunucu.py
```
(Önbelleksiz sunucu. `python -m http.server` kullanma: tarayıcı eski CSS'i gösterip yeni tasarımı bozuk gösteriyor — 2026-11-19'da tam olarak bu yaşandı.)

**Önemli:** CSS/JS her değiştiğinde `index.html` ve `js/*.js` içindeki `?v=` değerini artır (şu an `20261119b`). GitHub Pages dosyaları ~10 dk önbellekte tutar; sürüm etiketi değişmezse ziyaretçi eski tasarımı görür.
→ http://localhost:8765 (site) · /yonetim/ (panel) · /tools/qr.html (QR) · /?demo=1 (sunum modu)
(Dosyaya çift tıklayarak açmak çalışmaz; fetch için sunucu gerekir.)

## 2026-11-19 (4): Başlık karartması + cetvel başa dönüş
- Giriş yazıları `.giris__yazi` bloğuna alındı; arkasında kenarsız radyal koyu karartma (tuğla üzerinde okunurluk).
- Cetvel: otomatik döngü 16/16'dan 1/16'ya dönerken imleç ve şerit geriye kaymıyor, anında başa atlıyor (`basaDonus`, `konumla(px, -1)` → transition none, scroll instant). Test: telefon + masaüstü.
- Sürüm `?v=20261119g`.

## 2026-11-19 (5): Karartma geri alındı + başa dönüş takılması düzeltildi
- Gürkan karartmayı beğenmedi → `.giris__yazi` sarmalayıcısı ve CSS'i kaldırıldı (eski hâl).
- Takılma sebebi: anında atlama ile ardından gelen 8 sn'lik kayma aynı karede uygulanıyor, tarayıcı imleci 2006'dan geri sürüklüyordu. Atlamadan sonra `void imlec.offsetWidth` ile zorla işletiliyor.
- Son olayda imleç artık durmuyor, cetvelin sonuna kayıyor; sonra başa atlıyor.
- Test (kare kare ölçüm, telefon + masaüstü): son olayda ileri, başa dönüşte ilk karede başta, sonra hep ileri.
- Sürüm `?v=20261119h`.

## 2026-11-19 (6): Yayın + telefon düzeni
- GitHub: https://github.com/Gurkann20/mf-pano (public), Pages açık → https://gurkann20.github.io/mf-pano/ . Commit kimliği yalnızca bu depoda: Gürkan Aktaş / öğrenci e-postası (Gürkan onayladı).
- QR görselleri masaüstünde: QR-site.png, QR-sunum-demo.png (?demo=1). Geçici adres; kalıcı QR basılmadı.
- Gürkan iPhone'da "telefon görüntüsü kötü" dedi → ≤600px: ince çerçeve (--cerceve 12px), 96px madalyon, plaka 58px, küçük yazı, 6px aralık. Bir ekrana ~12 satır sığıyor (önce ~7). Sürüm ?v=20261119i.
- Sonraki: hocanın geri bildirimi; telefondaki görüntüde başka neyi beğenmediğini sor.

## 2026-11-19 (7): Telefonda 4 sütun, akıcılık, tarihçe sığdırma
- Pano telefonda da 4 sütun, fiziksel konumlarla; plaka adı Archivo dar kesim (font-stretch 75%).
- Takılma sebebi: pano gizlenip geri açılınca (kişi sayfasından dönüş) ~450 harf animasyonu + çerçeve ışığı + başlık ışığı baştan oynuyordu. Kazıma bitince `kazinacak/kaziniyor` sınıfları kaldırılıyor; `isildi` 2.9 sn sonra kaldırılıyor; başlık ışığı `body.acilis-bitti` ile tek sefer. Dönüşte artık yalnızca sayfa geçişi çalışıyor.
- Telefonda kazıma harf harf değil, plaka başına tek beliriş (lazer çizgisi aynı).
- Tarihçe cetveli telefonda genişliğe sığıyor (YIL_PX ≈ 8), etiketler 5 yılda bir. Sürüm ?v=20261119l.

## 2026-11-19 (8): iPhone düzeltmeleri
- Gürkan'ın iPhone'u eski sürümü gösteriyordu (GitHub Pages index.html'i ~10 dk önbellekte tutuyor). Not: değişiklikten sonra telefonda görmek için 10 dk bekle / sekmeyi kapatıp aç.
- Plaka etrafında kalan çerçeve: iOS'ta :hover dokunulan plakada takılı kalıyordu → hover yalnızca @media (hover:hover). Dönüşteki otomatik odak `sessiz-odak` sınıfıyla çerçevesiz (odak yine plakada, ekran okuyucu için).
- Cetvel: yalnızca yıl verilen olaylar yılın ortası yerine tam yıl çizgisine oturuyor (konum +0). Sürüm ?v=20261119m.

## 2026-11-19 (9): Telefonda eşit aralıklı cetvel
- Telefonda zamanla orantılı cetvelde 1974–77 olayları iç içe geçiyordu → telefonda olaylar eşit aralıkla (`ARALIK`, `ox(i)`), yalnızca seçili olayın yılı işaretin altında. Sonda bir boş aralık: imleç son olaydan sonra da kayıyor. Masaüstü değişmedi. Sürüm ?v=20261119o.
