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
| İçerik yönetimi | `yonetim/` paneli: personel formla isim ekler/düzenler/kaldırır, "Siteye yayınla" GitHub API ile commit atar (fine-grained token, yalnızca personelin tarayıcısında). Bağlantı yoksa JSON indirilir. | İsim ekleme/çıkarma kod bilmeyen personel tarafından yapılabilmeli. |
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
- **Otomatik ilerleme:** Her olay 8 sn kalır, sonra mavi çizgi hızla (0,45 sn) bir sonraki noktaya uzanır. Sondan başa dönüşte çizgi anında sıfırlanır. Hep çalışır; yalnızca bölüm ekranda değilken, sekme gizliyken ve klavyeyle cetvelde gezinilirken bekler. Otomatik geçişte aria-live kapalıdır.
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
- **Demo modu:** URL'de `?demo=1` varsa `yayinla: false` kayıtların biyografisi de görünür ve sayfanın köşesinde küçük bir "TASLAK" etiketi çıkar. Haftaki sunum bu modla yapılabilir; canlı QR asla demo linkine gitmez.
- Yeni isim eklemek = JSON'a bir nesne eklemek. Kodda isim listesi olmayacak.

## 8. Gizlilik ve içerik kuralları

- Biyografiler kendi cümlelerimizle yazılır. Hiçbir siteden metin kopyalanmaz (Abalıoğlu Holding gibi kaynaklar yalnızca bilgi kaynağıdır).
- Fotoğraf sadece aile/kurum izniyle eklenir.
- Hayattaki kişilerin (Musa Çelikkol, Ali Yağlı, Ceyhan Saldanlı, Muhsin Özcan vb.) biyografisi kendilerinin onayı olmadan canlıya alınmaz.
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
- Satır 5–8'deki isimlerin bilgileri (arkadaşın araştırması gelince JSON güncellenecek).
- İngilizce sürüm gerekip gerekmediği.
