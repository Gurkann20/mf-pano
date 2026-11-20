# PAÜ Mühendislik Fakültesi – Dijital Bağışçı Panosu

Bu dosya projenin tek kaynak spesifikasyonudur. Claude Code bu dosyayı her oturumda okur. Bir karar değişirse önce burayı güncelle, sonra kodu.

## 1. Ne yapıyoruz, neden

Fakülte girişinde "Katkılarınızdan Dolayı Teşekkür Ederiz" panosu var. Panoda 4 sütun x 14 satır = 56 plaka yeri bulunuyor: 30'u dolu, 26'sı boş. Panonun altına bir QR kod konacak. QR okutulunca açılan site:

- Panodaki her ismin kim olduğunu ve fakülteye ne kazandırdığını anlatır.
- Fakültenin 1971'den bugüne hikâyesini, yani bir şehrin bir okulu nasıl kurdurduğunu anlatır.
- **Asıl hedef:** Önümüzdeki hafta iş insanlarına tanıtılacak. QR'ı okutan kişi panonun önündedir; sayfa **doğrudan panoyla açılır**, isimler hemen görünür.

> **Tasarım revizyonu 4 (2026-11-19):** Bütün sitenin zemini fakülte girişindeki tuğla duvar (`assets/doku/tugla.svg`). Açılışta PAÜ ve MF logoları büyük madalyonlar. İçerik panoları (tarihçe, kişi sayfası) duvara asılı siyah kadife + gümüş çerçeve.
>
> **Tasarım revizyonu 3 (2026-11-19, "hâlâ çok sade"):** Pano, fiziksel panodaki gibi kırmızı tuğla duvar üzerinde (spot ışığı, gümüş çerçeve gölgesi). Masaüstünde kaydırınca pano eğik açıdan karşıya döner. Başlık gümüş metal yazı. Logolar büyük. Zenginlik süs ile değil, gerçek nesnenin malzemesiyle (tuğla, gümüş, kadife) sağlanır.
>
> **Tasarım revizyonu 2 (2026-11-18, Gürkan: "yapay zekâ yapmış gibi duruyor"):** Zemin logonun laciverti (#0b1f3f), malzeme gümüş; büyük harfli üst etiketler, blueprint ızgara, imleç ışığı, parallax, her bölümde kayarak beliriş, butonlarda "→" kaldırıldı. Hareket: tek açılış anı (plakalar sırayla kazınır, ardından panonun üzerinden tek ışık geçer) + yalnızca kullanıcı etkileşimine tepki veren hareketler.
>
> **Tasarım revizyonu 1 (2026-11-18, Gürkan):** Boş plakaları öne çıkaran davet bölümü, isim önizleme, büyük "50" rozeti, "1976–2026" etiketi, "Bu fakülteyi bir şehir kurdu" açılışı ve sol çizgili zaman tüneli **kaldırıldı**. Aşağıdaki bölümler buna göre güncellendi. Abartılı/pazarlama dili kullanılmaz; ton sade ve kurumsal.

Ziyaretçilerin neredeyse hepsi QR'ı **telefondan** okutacak. Her şey önce mobilde kusursuz olmalı.


## 2. Teknik kararlar (değiştirme)

| Konu | Karar | Neden |
| --- | --- | --- |
| Yapı | Statik site: düz HTML + CSS + vanilla JS (ES modülleri). Framework yok, build adımı yok. | Bakımı kolay; benden sonra gelen kişi de açıp düzenleyebilir. |
| Veri | `data/bagiscilar.json` ve `data/tarihce.json`. Site bunları `fetch` ile okur. | İsim eklemek/çıkarmak için kod değil yalnızca JSON değişir. |
| Barındırma | GitHub Pages (şimdilik). İleride PAÜ alt alan adına yönlendirme. | Ücretsiz, push = yayın. |
| Yönlendirme | Hash tabanlı: `#/` ana sayfa, `#/kisi/<id>` kişi sayfası, `#/tarihce`. | GitHub Pages'te sunucu ayarı gerektirmez; ileride her plakaya ayrı QR konabilir. |
| Animasyon | CSS geçişleri + `IntersectionObserver` + küçük vanilla JS. İhtiyaç olursa yalnızca GSAP (CDN, tek kütüphane). | Telefonda hızlı açılmalı. |
| Fontlar | Tek aile: **Archivo** (değişken kalınlık + genişlik). Başlıklar geniş kesim (`font-stretch: 125%`) = plaka yazısı; metin normal genişlik. `latin-ext` ile `assets/fonts/` içinde self-host. | Türkçe karakterler (ğ, ş, İ, ı) eksiksiz görünmeli. |
| İçerik yönetimi | `yonetim/` paneli (sitenin alt bilgisinde "Personel: panoyu düzenle" bağlantısı): personel formla isim ekler/düzenler/kaldırır, "Siteye yayınla" GitHub API ile commit atar (fine-grained token, yalnızca personelin tarayıcısında). **Giriş: kullanıcı adı + şifre** (Gürkan, 2026-11-19). GitHub anahtarı bu ikisiyle şifrelenip `yonetim/giris.json`'da durur (PBKDF2-SHA256 600k + AES-256-GCM, `yonetim/sifreleme.js`); şifre hiçbir yerde saklanmaz. Kurulum/şifre değiştirme: `yonetim/kurulum.html` (yalnızca proje sorumlusu, GitHub anahtarı gerekir). Oturum sessionStorage: tarayıcı kapanınca biter. Anahtarın süresi dolarsa kurulum sayfasından yenilenir. Yayınlama hata verirse giriş yapmış personel JSON indirebilir. | İsim ekleme/çıkarma kod bilmeyen personel tarafından yapılabilmeli. |
| Dil | Türkçe. Yapı ileride İngilizce eklenebilecek şekilde (metinler `data/` veya tek bir `i18n` nesnesinde). | Prof. Dr. Hisataka Tano gibi yabancı bağışçılar var. |

## 3. Klasör yapısı

```
/
├── CLAUDE.md              ← bu dosya
├── index.html
├── css/
│   ├── tokens.css         ← renkler, fontlar, boşluklar (TEK yer)
│   ├── base.css
│   └── components.css
├── js/
│   ├── main.js            ← açılış, router
│   ├── data.js            ← JSON yükleme + filtreleme (yayinla / demo modu)
│   ├── board.js           ← dijital pano
│   ├── person.js          ← kişi sayfası
│   ├── timeline.js        ← tarihçe
│   └── effects.js         ← tilt, parıltı, sayaç, scroll animasyonları
├── data/
│   ├── bagiscilar.json
│   ├── tarihce.json
│   └── site.json          ← iletişim bilgisi, son güncelleme, pano boyutu
├── yonetim/               ← personel paneli (index.html, yonetim.js, yonetim.css)
├── tools/qr.html          ← QR üretici (ekip içi)
├── docs/                  ← TEKNIK-OZET.md (hocaya/teknik sunum), TASARIM-REHBERI.md (tasarım + yaklaşım, başka projede kullanmak için), openapi.yaml + swagger.html
├── ozel/notlar.json       ← İÇ NOTLAR, .gitignore'da, asla yüklenmez
└── assets/
    ├── logo/              ← pau-logo.svg, muhendislik-logo.svg (Gürkan ekleyecek)
    ├── foto/              ← yalnızca izinli fotoğraflar, <id>.webp
    └── fonts/
```

Logo dosyaları yoksa site çökmesin. Logo yerine "PAMUKKALE ÜNİVERSİTESİ / MÜHENDİSLİK FAKÜLTESİ" yazılı bir yer tutucu göster.

## 4. Görsel kimlik

### Renkler

PAÜ sitesinin (pau.edu.tr) renklerine uyumlu olmalı. Aşağıdaki değerler **taslak**tır: fakülte logosundaki lacivert/açık mavi baz alınarak seçildi. Gürkan, pau.edu.tr'den tarayıcının renk seçicisiyle gerçek değerleri alıp yalnızca `css/tokens.css` içinde güncelleyecek.

```css
:root {
  /* PAÜ kurumsal (DOĞRULANACAK) */
  --pau-lacivert: #0b2d5b;
  --pau-mavi: #1a5fa8;
  --muh-mavi: #2aa7e0;         /* mühendislik logosundaki açık mavi */

  /* Zemin: koyu, teknolojik */
  --zemin: #050f1f;
  --zemin-2: #0a1a33;
  --cizgi: rgba(42, 167, 224, 0.18);

  /* Plaka: fırçalanmış gümüş */
  --plaka-1: #e9edf2;
  --plaka-2: #b9c1cc;
  --plaka-yazi: #1d2633;

  /* Metin */
  --yazi: #eaf2fb;
  --yazi-soluk: #93a4bb;

  /* Vurgu: 50. yıl ve boş plaka daveti */
  --vurgu: #2aa7e0;
}
```

### Atmosfer

- Koyu lacivert zemin üzerine ince bir **mühendislik çizim ızgarası** (blueprint grid). Çok hafif hareket etsin, parallax olsun.
- Plakalar fiziksel panodaki gibi **fırçalanmış gümüş** dokuda: CSS gradyan + ince gürültü katmanı.
- Işık efekti olarak açık mavi parıltılar kullanılsın. Neon değil, sade ve kurumsal.
- Bol boşluk, büyük tipografi. Gösterişli ama ciddi bir üniversite sitesi.

## 5. Sayfa yapısı

### 5.1 Giriş + pano (ilk ekran)

- Üstte iki logo yan yana: PAÜ ve Mühendislik Fakültesi. Yıl rozeti yok.
- Küçük üst başlık "Mühendislik Fakültesi", büyük başlık **"Teşekkür Panosu"**, bir cümlelik açıklama.
- Hemen altında filtreler, arama ve pano (§5.3). Sayaçlar, "50" rozeti, aşağı kaydır işareti yok.

### 5.2 Tarihçe: cetvel (panonun altında)

- Kart/kutu ve dikey çizgi kullanılmaz. Tek yatay çizgi üzerinde olay noktaları; olaylar **eşit aralıkla** dizilir (1976'da 5 olay var, zamanla orantılı dizilince üst üste biniyordu). Çentik, iğne yok (Gürkan: "çizgiler kötü duruyor").
- Altında yalnızca gerekli yıllar: masaüstünde her yılın ilk olayının altında yıl; telefonda yalnızca seçili olayın yılı.
- Seçili olay üstte: gümüş dolgulu büyük yıl + tarih, başlık, metin, kaynak. Gezinme: önceki/sonraki okları, noktalar, klavye okları, telefonda yana kaydırma. Oynat/durdur düğmesi yok.
- **Otomatik ilerleme (slayt sunusu):** Her olay 3,5 sn kalır (Gürkan önce "1-2 saniyede bir geçsin" dedi, 2026-11-20 "biraz hızlı, 1 sn daha" → 3,5 sn), olay yana kayarak değişir, mavi çizgi hızla (0,45 sn) bir sonraki noktaya uzanır. Bütün olaylar aynı hücrede üst üste durur, pano yüksekliği en uzun olaya göre sabittir. Sondan başa dönüşte çizgi anında sıfırlanır. Hep çalışır; yalnızca bölüm ekranda değilken, sekme gizliyken ve klavyeyle cetvelde gezinilirken bekler. Otomatik geçişte aria-live kapalıdır.
- `#/tarihce` adresi bu bölüme kaydırır.

### 5.3 Dijital pano (sitenin kalbi)

Fiziksel panonun dijital kopyası:

- Masaüstünde 4 sütun; telefonda 2 sütun. Sıralama `satir`, `sutun` alanlarına göre.
- Sekmeler/filtreler: **Tümü · Kişiler · Kurumlar · Dernek ve Vakıflar** (`tur` alanı). Bir de arama kutusu. Türkçe karakter duyarsız olsun: "ozkardes" yazınca "Özkardeş" bulunsun.
- Her plaka gümüş bir kart. Kartta ad yazar; altında küçük harfle `ozet` ya da ilk katkı yılı.
- **Plaka etkileşimleri** (aşağıda §6).
- Plakaya tıklanınca `#/kisi/<id>` açılır.

### 5.4 Boş plakalar

Sitede gösterilmez (revizyon). Pano yalnızca dolu plakaları, fiziksel konumlarıyla gösterir. Yönetim paneli boş yerleri yeni isim eklemek için gösterir.

### 5.5 Kişi / kurum sayfası (`#/kisi/<id>`)

- Üstte büyük plaka: ad, unvan, yaşam yılları (`yasam`).
- Fotoğraf varsa `assets/foto/<id>.webp`. Yoksa baş harflerden şık bir monogram (gümüş daire). **Asla internetten bulunan bir fotoğraf koyma.**
- "Fakülteye katkısı" bölümü `katki` listesinden mini bir zaman çizgisi olarak gösterilir. Bu bölüm biyografiden ÖNCE gelir; sayfanın ana mesajı budur.
- Biyografi paragrafları (`biyografi`).
- Kaynaklar listesi (`kaynaklar`). URL'si olanlar link olur.
- Biyografi yoksa ya da `yayinla: false` ise sadece ad + katkı gösterilir. Altında şu not yer alır: "Bu bağışçının hikâyesini derliyoruz. Bilgi ve fotoğraf paylaşmak isterseniz bize ulaşın."
- Altta "Önceki / Sonraki bağışçı" geçişi ve "Panoya dön" butonu.
- Sayfa geçişi: plaka büyüyerek sayfaya dönüşür (View Transitions API varsa onu kullan; yoksa basit fade).

### 5.6 Alt bilgi

Fakülte adresi, pau.edu.tr linki, "Son güncelleme" tarihi.

## 6. Animasyon ve etkileşim listesi

Hepsi telefonda da çalışmalı. Hover olmayan cihazlarda dokunma karşılığı olsun.

| # | Efekt | Masaüstü | Telefon |
| --- | --- | --- | --- |
| 1 | **3B eğim (tilt)** | Fare plakanın üzerinde gezdikçe plaka hafifçe (en fazla 8°) eğilir. | Dokununca kısa bir eğilip geri gelme. |
| 2 | **Metal parıltı** | Üzerine gelince plakanın üzerinden çapraz bir ışık şeridi geçer (CSS gradient + `background-position`). | Plaka ekrana girdiğinde bir kez geçer. |
| 3 | **Kazıma efekti** | Ad, plakaya kazınıyormuş gibi harf harf belirir (ilk görünüşte, bir kez). | Aynı. |
| 4 | **Sıralı beliriş** | Pano ekrana girince plakalar satır satır, küçük gecikmelerle yerine oturur. | Aynı, daha kısa. |
| 5 | ~~Sayaçlar~~ | Kaldırıldı. | |
| 6 | **Kart belirişi** | Tarihçe kartları kaydırınca belirir. | Yana kaydırmalı, beliriş yok. |
| 7 | **Blueprint ızgara** | Fareyi hafifçe takip eden parallax. | Yavaşça kayan sabit animasyon (veya cihaz eğimi, izin isteme). |
| 8 | ~~Boş plaka nefesi~~ | Kaldırıldı. | |
| 9 | **Sayfa geçişi** | Plaka → kişi sayfası büyüme geçişi. | Aynı. |
| 10 | **İmleç ışığı** (sadece masaüstü) | Pano üzerinde imleci takip eden yumuşak bir ışık halkası, plakaları aydınlatır. | Yok. |

Kurallar:
- `prefers-reduced-motion: reduce` açıksa tüm hareket kapanır, içerik doğrudan görünür.
- Sadece `transform` ve `opacity` animasyonu. Layout tetikleyen animasyon yok.
- Animasyonlar içerik okumayı engellemez. Hiçbir metin animasyon bitmeden okunamaz durumda kalmaz.

## 7. Veri modeli

`data/bagiscilar.json` → `bagiscilar[]`:

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | string | URL için, ASCII, küçük harf, tireli. Değişmez (QR linkleri buna bağlı). |
| `ad` | string | Panodaki yazımı. |
| `kisaAd` | string? | Uzun kurum adları için plaka üzerindeki kısa hali. |
| `tur` | `kisi` \| `kurum` \| `dernek-vakif` | Filtreler için. |
| `satir`, `sutun` | number | Fiziksel panodaki yeri. |
| `unvan` | string? | Meslek/unvan. |
| `yasam` | `{dogum, vefat}`? | Yıl olarak; `vefat: null` = hayatta. |
| `ozet` | string | Tek satır, plaka altı ve paylaşım önizlemesi. |
| `biyografi` | string[] | Paragraflar. Boş olabilir. |
| `katki` | `{yil, metin}[]` | Fakülteye ne kazandırdığı. |
| `durum` | `dogrulandi` \| `ekip-notu` \| `eksik` | Araştırma durumu. |
| `yayinla` | boolean | `false` ise biyografi gizlenir. |
| `foto` | string? | Dosya adı; yalnızca izinli. |
| `kaynaklar` | `{ad, url}[]` | |
| ~~`notlar`~~ | — | **Bu dosyada tutulmaz.** Depo herkese açık olduğundan iç notlar `ozel/notlar.json` içindedir (id → not), git'e girmez. |

Kurallar:
- ~~Demo modu (`?demo=1`)~~ **kaldırıldı (2026-11-19):** bütün biyografiler yayında, sunum normal siteden yapılıyor; ayrıca `yayinla: false` kayıtları linke `?demo=1` ekleyen herkese açıyordu.
- Yeni isim eklemek = JSON'a bir nesne eklemek. Kodda isim listesi olmayacak.

## 8. Gizlilik ve içerik kuralları

- Biyografiler kendi cümlelerimizle yazılır. Hiçbir siteden metin kopyalanmaz (Abalıoğlu Holding gibi kaynaklar yalnızca bilgi kaynağıdır).
- Fotoğraf sadece aile/kurum izniyle eklenir.
- ~~Hayattaki kişilerin biyografisi onaysız canlıya alınmaz.~~ **Gürkan'ın kararı (2026-11-19): bütün biyografiler yayında**, hayattakiler (Musa Çelikkol, Ceyhan Saldanlı, Erhan Boyvat, Ömer Aydan, Hisataka Tano) ve kaynak linki eksik ekip notları dahil. Yalnızca kamuya açık mesleki bilgi yazılır; bir kişi ya da aile itiraz ederse kaydı hemen `yayinla: false` yapılır. Dekanlıktan ve kişilerden onay almak yine önerilir. (Ali Yağlı 2024'te, Muhsin Özcan 2026'da vefat etti.)
- Vefat bilgisi yalnızca bir haber/resmî kaynakla doğrulanınca yazılır.
- Vefat etmiş bağışçıların biyografisi (kaynakla doğrulanmışsa) yayınlanır (Gürkan, 2026-11-19: "vefat etse bile yaz, onlar da destek vermiş").
- Cenaze, sağlık, aile içi olaylar gibi özel ayrıntılar yazılmaz.
- İç notlar yayınlanan hiçbir dosyada yer almaz: `ozel/notlar.json` (gitignore). `js/data.js` yine de olası bir `notlar` alanını yüklerken siler.
- Siteye analytics/çerez eklenmez.

## 9. Erişilebilirlik ve kalite

- Plakalar gerçek `<a>` veya `<button>`. Klavyeyle gezilebilir, odak halkası görünür.
- Kontrast en az WCAG AA. Gümüş plaka üzerindeki koyu yazı da buna dahil.
- `<html lang="tr">`, anlamlı başlık hiyerarşisi, görsellerde `alt`.
- Her kişi sayfası için `document.title` ve paylaşım önizlemesi (Open Graph): ad + özet.
- Hedef: Lighthouse mobil Performans ≥ 90, Erişilebilirlik ≥ 95.
- Toplam sayfa ağırlığı (fontlar dahil, fotoğraflar hariç) 500 KB altında.

## 10. QR

- Ana QR: sitenin kök adresi. Taslak aşamasında GitHub Pages adresi; kalıcı adres netleşmeden QR basılmaz.
- Her plakanın kendi linki var (`#/kisi/<id>`). İleride plakalara küçük QR eklenebilir.
- QR üretimi siteye dahil değil. Gerekirse `tools/qr.html` adında, yalnızca bizim kullanacağımız bir yardımcı sayfa olabilir.

## 11. Yapım sırası

Her adım bitince çalışır durumda commit at.

1. İskelet: `index.html`, `tokens.css`, router, JSON yükleme. Pano düz liste olarak görünsün.
2. Dijital pano: grid, plaka tasarımı (gümüş), filtreler, arama.
3. Kişi sayfası + monogram + "derleniyor" durumu + önceki/sonraki.
4. Hero + sayaçlar + blueprint zemin.
5. Tarihçe zaman çizgisi + `#/tarihce`.
6. ~~Boş plakalar bölümü + isim önizleme~~ (revizyonla kaldırıldı).
7. Efektler (§6), reduced-motion.
8. Demo modu, Open Graph, erişilebilirlik ve performans geçişi.
9. GitHub Pages'e yayın; telefonda (iOS Safari + Android Chrome) test.

## 12. Kabul kontrolü (sunumdan önce)

- [ ] Telefonda QR'dan açılış 2 saniyenin altında.
- [ ] 30 dolu plaka, panodaki yerleriyle aynı sırada.
- [ ] Her plaka kendi sayfasını açıyor; geri tuşu panoya döndürüyor.
- [ ] Türkçe karakterli aramalar çalışıyor ("İnceoğlu", "inceoglu").
- [ ] `yayinla: false` kayıtlar canlıda biyografi göstermiyor; `?demo=1` ile gösteriyor.
- [ ] `notlar` hiçbir yerde görünmüyor.
- [ ] Reduced-motion açıkken site hareketsiz ve eksiksiz.
- [ ] Logo dosyası yokken de site düzgün.

## 13. Açık konular

- ~~PAÜ renklerinin gerçek değerleri~~ → pau.edu.tr stil dosyasından alındı: `#0085d0`, `#004684` (tokens.css).
- Logolar pau.edu.tr'den alındı. Fakülte logosu yalnızca 113 px PNG; dekanlıktan SVG/yüksek çözünürlüklü hâli istenmeli.
- Kalıcı adres: PAÜ alt alan adı mı, yönlendirme mi?
- Dekanlık iletişim bilgisi (alt bilgi ve "Bize ulaşın" için) onaylanmalı.
- Satır 5–8: İŞKUR araştırması (2026-11-19) işlendi. Hâlâ bilgi yok: Faruk Basmacı, Nalan Devrent, Emirayşe – Ramazan Özen, Mehmet Hilmi Serter. Doğrulanacaklar ozel/notlar.json içinde.
- İngilizce sürüm gerekip gerekmediği.
