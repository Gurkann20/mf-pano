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

## 2026-11-19 (10): Sade cetvel
- Sol okta bozulma: geri animasyon sınıfı `geri`, kişi sayfasındaki `.geri` bağlantı stiliyle çakışıyordu (display:inline-flex) → sınıf adı `ters`.
- Cetvel yeniden: eşit aralıklı noktalar, tek çizgi, çentik/iğne/imleç yok; yıllar yalnızca gerektiği yerde (masaüstü: her yılın ilk olayı, telefon: seçili). Oynat/durdur düğmesi kaldırıldı. Mavi çizgi 8 sn'lik sürünme yerine olay değişince 0,45 sn'de uzanıyor. Sürüm ?v=20261119p.

## 2026-11-19 (11): Tarihçe slayt sunusu
- Pano olay metnine göre boy değiştiriyordu → bütün olaylar `.cetvel__slayt` olarak aynı grid hücresinde üst üste; yükseklik en uzun olaya göre sabit (telefon 716px, masaüstü 580px; test edildi). Görünmeyen slaytlar `inert` + aria-hidden.
- Gürkan "1-2 saniyede bir kendi geçen slayt sunusu" istedi → SURE 2500 ms, olaylar yana kayarak (0,6 sn) değişiyor; ileri sağdan, geri soldan. Not: uzun metinler 2,5 sn'de okunmayabilir; gerekirse SURE artırılır (js/timeline.js).
- Sürüm ?v=20261119r.

## 2026-11-19 (12): Teknik özet + Swagger
- docs/TEKNIK-OZET.md: hocaya anlatım için diller, mimari, barındırma, yönetim, gizlilik, test, olası sorular.
- docs/openapi.yaml + docs/swagger.html: statik JSON uçları (bagiscilar/tarihce/site) ve yönetim panelinin GitHub Contents API çağrıları (GET sha, PUT). Swagger UI 5.17.14 (jsdelivr). "Try it out" denendi: 200.

## 2026-11-19 (13): İŞKUR araştırması işlendi
- Kaynak: proje klasöründeki "İŞKUR ARAŞTIRMA.docx" (arkadaşın araştırması). *.docx .gitignore'a eklendi.
- Kaynak sayfalar web-fetch ile kontrol edildi: Ali Yağlı vefat 2024 (Hizmet Gazetesi), Muhsin Özcan vefat 2026 (d20haber), Erhan Boyvat (EMS Makina), Şemsettin Terzioğlu (şirket sitesi), İrfan Yolcular (Ekonomim) doğrulandı. Açılmayan: J-GLOBAL/researchmap (Tano), PAÜ fahri doktora (Zorlu).
- bagiscilar.json: Ali Yağlı, Ceyhan Saldanlı, Muhsin Özcan, Ahmet Nazif Zorlu, Erhan Boyvat, Şemsettin Terzioğlu, İrfan Yolcular, Nihat Kömürcüoğlu Vakfı, İnceoğlu Makine biyografileri (kendi cümlelerimizle). Hayattakiler ve kaynağı zayıf olanlar yayinla:false.
- Doğrulanamayanlar siteye konmadı, ozel/notlar.json'a yazıldı (Tano'nun Nihon Üni., Terzioğlu doğum/okul, Saldanlı ELDER, İrfan Yolcular kimlik eşleşmesi, Boyvat'ın sponsorluğu).
- Hâlâ bilgi yok: Faruk Basmacı, Nalan Devrent, Emirayşe – Ramazan Özen, Mehmet Hilmi Serter.
- Karar bekleyen: Ali Yağlı ve Ahmet Nazif Zorlu vefat ettiği için yayinla:true yapılabilir (Gürkan/dekanlık).
- Gürkan: vefat edenlerin biyografisi de yayınlansın → Ali Yağlı ve Ahmet Nazif Zorlu yayinla:true. Özkardeşler ve Sait Kalaycıoğlu kaynak eksikliği yüzünden hâlâ gizli.
- Gürkan "hepsini aç" dedi (AskUserQuestion): 16 gizli biyografi yayinla:true (hayattakiler ve kaynağı eksik ekip notları dahil). İtiraz gelirse ilgili kayıt yayinla:false. Hiç bilgisi olmayan 7 kişi: Tahsin Cem, Orhan Koru, Mehmet Küçüker, Faruk Basmacı, Nalan Devrent, Emirayşe–Ramazan Özen, Mehmet Hilmi Serter.

## 2026-11-19 (14): Katkı taraması
- PAÜ haberlerinden doğrulandı: Şemsettin Terzioğlu → Deprem Bilimi ve Mühendisliği Laboratuvarı bağışı (protokol Nisan 2021, lab onun adını taşıyor). Ömer Aydan → bu laboratuvara deprem sarsma masası (PAÜ Haber 6.9.2022).
- Bulunamadı (dekanlığa sorulacak): Ali Yağlı, Ceyhan Saldanlı, Ahmet Nazif Zorlu, Erhan Boyvat, Hisataka Tano, Nihat Kömürcüoğlu Vakfı, İrfan Yolcular, Nalan Devrent, Emirayşe–Ramazan Özen, Mehmet Hilmi Serter katkıları; Tahsin Cem, Orhan Koru, Mehmet Küçüker, Faruk Basmacı hayatları.
- Dekanlık için soru listesi: ozel/DEKANLIGA-SORULAR.md (git dışı)

## 2026-11-19 (15): Demo modu kaldırıldı, personel bağlantısı
- Gürkan: sunum normal siteden yapılacak, ayrı link gereksiz → ?demo=1 ve TASLAK etiketi koddan kaldırıldı (ayrıca yayinla:false kayıtları herkese açıyordu).
- Gürkan: yönetim paneli ayrı link olunca unutulur → sitenin alt bilgisinde küçük "Personel: panoyu düzenle" bağlantısı (yonetim/). Token olmadan panel hiçbir şey değiştiremiyor. Panel depo sahibi/adını adresten kendisi dolduruyor, token tarayıcıda hatırlanıyor (localStorage). Yönetim sayfasına favicon eklendi. Sürüm ?v=20261119s.

## 2026-11-19 (16): Yönetim paneli kilidi
- Gürkan: "buraya herkes girebilir, güvenli değil gibi" → panel artık kilitli açılıyor (body.kilitli): anahtar yoksa yalnızca "Personel girişi" (anahtar alanı + katlanmış depo bilgisi, adresten dolu). Anahtarsız JSON-indir modu kaldırıldı. 401'de anahtar silinip yeniden kilitleniyor. "Bağlantıyı kes" → "Çıkış yap". Test: telefon + masaüstü, sahte anahtar reddedildi, localStorage'a bir şey yazılmadı.

## 2026-11-19 (17): Kullanıcı adı + şifreyle giriş
- Gürkan anahtar ekranını "saçma" buldu, tek kullanıcı + güçlü şifre istedi. Statik sitede sunucu yok → GitHub token kullanıcı adı+şifreyle şifrelenip yonetim/giris.json'a konuyor (yonetim/sifreleme.js: PBKDF2-SHA256 600k + AES-256-GCM). Giriş ekranı: kullanıcı adı + şifre. Oturum sessionStorage (tarayıcı kapanınca biter); eski localStorage anahtarı siliniyor. "Bağlantı ayarları" penceresi kaldırıldı, yerine "Çıkış yap".
- yonetim/kurulum.html: proje sorumlusu token + kullanıcı adı + şifre girer; token test edilir, şifrelenir, doğrulanır ve giris.json depoya yazılır. Şifre ≥12 karakter, harf+rakam.
- Test (sahte token): yanlış şifre/kullanıcı reddedildi; doğru şifre çözdü, GitHub 401 → kilitli kaldı; dosyada token düz metin yok.
- Yönetim dosyalarına da ?v= eklendi (Gürkan'ın tarayıcısı eski yonetim.js'i gösteriyordu). Sürüm değişince yonetim/index.html ve kurulum.html'deki ?v= de güncellenmeli.
- SIRADAKİ: Gürkan GitHub'da fine-grained token oluşturup kurulum.html ile girişi kuracak (henüz giris.json yok → panel "Panel henüz kurulmadı" der).

## 2026-11-20: Giriş kuruldu, kaldır düğmesi
- Gürkan kurulum sayfasıyla girişi kurdu (yonetim/giris.json depoda) ve panelden test kaydı ekledi: "Gürkan Aktaş" (8. satır 4. sütun) — kaldırılması gerekebilir.
- "Panodan kaldır" yalnızca form başlığında küçük düğmeydi, Gürkan bulamadı → formun altına, Vazgeç/Uygula yanına taşındı. Yönetim sürümü ?v=20261120a.
- İŞKUR belgesi yeniden karşılaştırıldı (Gürkan sordu): doğrulanamadığı için dışarıda bırakılan kısımlar "hepsini aç" kararı üzerine eklendi: Terzioğlu (1951 Babadağ, 1975 Ege Üni., büro), Saldanlı (ELDER 2004-2012, 1975-80 kamu), Tano (Nihon Üni., alanlar), Özcan (okul projelerine katkı), İnceoğlu (1965-66 ortaklık, eleman.net), Zorlu (savunma, ihracat), Aydan (alanlar). Deneme kaydı Gürkan Aktaş Gürkan tarafından panelden kaldırıldı (31 isim).

## 2026-11-20 (2): Hocayla gözden geçirme düzeltmeleri
- Dernek adları panodaki gibi: 1. "Devlet Mimarlık ve Mühendislik Yüksekokulu Yaptırma ve Yaşatma Derneği" (eski "Yardım" yanlıştı), 2. ve 3. dernekte kısa ad kaldırıldı → plakada ve kişi sayfasında tam ad. Kişi sayfasının gümüş başlığı artık her zaman tam adı gösteriyor (plakaAdi(k, true)).
- PDF'teki OCR hataları düzeltildi: Kaşıkçı, Samanlıoğlu, Manasır (hocanın düzeltmesi).
- Yükseköğretim Vakfı: bugün burs vermiyor → "Bugün burs" katkısı ve cümlesi kaldırıldı.
- Özsoy: okul adı özet ve ilk paragrafta. Raşit Özkardeş: Nail Özkardeş Anaokulu. Metin Özkardeş: "İş hayatına". Musa Çelikkol: dil düzeltmesi. İnceoğlu Un.
- Ali Yağlı + Ceyhan Saldanlı: 2007 Temiz Enerji Evi (Bereket Enerji yaptırıp bağışladı; PAÜ Makine sayfası). İTÜ Elektrik Fakültesi (Aydem sayfasındaki ad; bölüm adı kaynakta yok).
- Zorlu: 2006 dış cephe kaplaması. Ramazan Özen: 50. Yıl Kaynak Eğitim Merkezi, lazer kaynak makinesi (Yakut). Tano: cihaz gönderdi (tarih yok). Aydan: Jeoloji Müh. ile ortak çalışma.
- Nalan Devrent, Nihat Kömürcüoğlu (vakıf + kendisi, mermer katkısı), Mehmet Hilmi Serter biyografileri yazıldı. Cenaze/hastalık/aile adları yazılmadı.
- BEKLEYEN (hoca pazartesi): 12. madde "Kaynak Eğitim Merkezi – Elmas sponsor" kime ait; Özsoy çırçır fabrikası; Serter: Gürkan onayıyla 1971 kuruluş, DSO/DENMERDER görevleri ve 2026 cami/Kur'an kursu/ASM eklendi; Bereket Enerji = Yağlı + Saldanlı (Gürkan teyit etti). Sürüm ?v=20261120b.

## 2026-11-20 (3): Bayrak ve Atatürk
- Gürkan: "koy gitsin". Köşeler yerine: tarihçenin başında çerçeveli Atatürk portresi + "Hayatta en hakiki mürşit ilimdir." (figure.ataturk), alt bilgide resmî ölçülerde SVG Türk bayrağı.
- Portre: Wikimedia Commons "Ataturk1930s.jpg" (29 Mart 1932, kamu malı), siyah-beyaz 320×400 WebP → assets/foto/ataturk.webp (~10 KB). Dekanlık resmî bir görsel verirse aynı adla değiştirilir. Sürüm ?v=20261120c.

## 2026-11-20 (4): Atatürk duvarı (Gürkan'ın çizimiyle)
- Gürkan: tek portre "sade" → tarihçenin ALTINDA, raylı spot lambalarla aydınlatılan 4 fotoğraf + söz + imza (çizim + ray spot fotoğrafı referans).
- section.ataturk-bolum: ray (.galeri::before), CSS spot (.spot), önde ışık konisi (.isik, screen) + duvarda ışık havuzu. Bölüm ekrana girince .acik → lambalar soldan sağa sırayla yanar (yalnızca opacity); JS yokken/azaltılmış harekette ışıklar açık.
- Fotoğraflar Wikimedia Commons, hepsi kamu malı: 1923 (Mustafa Kemal Atatürk.png), 1928 (Mustafa Kemal Atatürk (1928).jpg), 1930 (Portrait photograph ... military uniform 1930.jpg), 1932 (Ataturk1930s.jpg) → assets/ataturk/*.webp, 360×450 gri. İmza: "Signature of Mustafa Kemal Atatürk.svg" (kamu malı) → assets/ataturk/imza.svg, CSS mask ile gümüş. Eski tek portre (assets/foto/ataturk.webp) kaldırıldı. Sürüm ?v=20261120d.

## 2026-11-20 (5): Açılışta sol üstte logo yanıp sönmesi
- Gürkan: yenileyince amblemler önce sol üstte çıkıp 1 sn sonra kayboluyor. Sebep: .ust (kişi sayfası üst çubuğu) ana sayfada body[data-gorunum="ana"] ile gizleniyordu ama bu öznitelik veri yüklendikten sonra JS ile konuyordu. Çözüm: <body data-gorunum="ana"> HTML'de; #/kisi/ linkiyle açılışta küçük satır içi betik "kisi" yapıyor ve CSS ana görünümü gizliyor. Sürüm ?v=20261120e.

## 2026-11-20 (6): Tarihçe yavaşladı
- Gürkan: "biraz hızlı, 1 sn daha" → her olay 2,5 sn yerine 3,5 sn. Sürüm ?v=20261120f.
