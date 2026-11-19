# Teşekkür Panosu: teknik özet

Fakülte girişindeki bağışçı panosunun dijital karşılığı. Panonun altındaki QR okutulunca açılan site:
- isimleri panodaki yerleriyle gösterir,
- her bağışçının fakülteye katkısını ve hikâyesini anlatır,
- fakültenin 1970'ten bugüne tarihçesini sunar.

## Kısaca

> Siteyi herhangi bir framework kullanmadan HTML, CSS ve JavaScript ile, statik bir site olarak yaptım. İsimler ve tarihçe JSON dosyalarında duruyor; isim eklemek için kod değil yalnızca veri değişiyor. Personel bunu bir yönetim sayfasından form doldurarak yapabiliyor. Şu an GitHub Pages'te yayında; kalıcı olarak fakültenin kendi alt alan adına (pau.edu.tr altına) taşımayı planlıyoruz.

## Kullandığım diller ve araçlar

| Ne | Nerede |
| --- | --- |
| **HTML5** | Sayfa iskeleti; anlamlı etiketler, erişilebilirlik (ARIA) |
| **CSS3** | Tasarımın tamamı: CSS değişkenleri, Grid/Flexbox, animasyonlar, `border-image` ile çerçeve işlemeleri, View Transitions API ile sayfa geçişi |
| **JavaScript (ES modülleri)** | Pano, arama, kişi sayfaları, tarihçe slaytı, efektler. Framework yok, kütüphane yok |
| **JSON** | Veri: `bagiscilar.json` (31 bağışçı), `tarihce.json` (16 olay), `site.json` (iletişim) |
| **SVG** | Tuğla duvar dokusu ve çerçevedeki boncuk/burgu işlemeleri; görsel değil, kodla üretildi |
| **Python** | Yerel test sunucusu, SVG dokularını üreten betikler |
| **Node.js + Puppeteer** | Otomatik test: siteyi görünmez bir Chrome'da telefon ve bilgisayar boyutunda açıp ölçüyor |
| **Git + GitHub** | Sürüm kontrolü ve yayın |
| **GitHub REST API** | Yönetim panelinin değişiklikleri siteye kaydetmesi |

## Mimari: neden böyle?

- **Statik site, sunucu kodu yok.** Veritabanı, PHP, Node sunucusu gerekmiyor. Herhangi bir web sunucusu dosyaları vermeye yeter. Bakımı kolay, güvenlik açığı yüzeyi çok küçük, barındırması ücretsiz.
- **Build adımı yok.** Benden sonra gelen biri dosyayı açıp doğrudan düzenleyebilir; derleme aracı kurmasına gerek yok.
- **Veri koddan ayrı.** Kodda hiçbir isim yazmıyor. Yeni bağışçı = JSON'a bir kayıt.
- **Adresler hash ile** (`#/kisi/cafer-sadik-abalioglu`): Her bağışçının kalıcı bir linki var. İleride plakaların yanına kişiye özel küçük QR'lar konabilir.

## Barındırma (sunucu)

- **Şu an:** GitHub Pages. Ücretsiz, HTTPS otomatik, `git push` ile birkaç dakikada yayına çıkıyor.
  - Adres: `gurkann20.github.io/mf-pano`
- **Hedef:** Bilgi İşlem'den bir alt alan adı (ör. `mf-pano.pau.edu.tr`) isteyip GitHub'a yönlendirmek (DNS'te tek bir CNAME kaydı).
  - QR'a PAÜ adresi basılır.
  - Barındırma ileride değişse bile QR hep çalışır.
- **Alternatif:** Dosyaları doğrudan PAÜ'nün web sunucusuna koymak (Apache/Nginx yeterli). Bu durumda yönetim panelinin "Siteye yayınla" butonu çalışmaz; güncellemeler elle yüklenir.
- **QR'ın basılması:** Kalıcı adres netleşmeden QR basılmayacak; basılan QR sonradan değiştirilemez.

## İçerik yönetimi (personel için)

- `/yonetim/` sayfasında form ile isim ekleme, düzenleme ve kaldırma yapılıyor. Panonun 4×14 mini haritası var; aynı yere iki isim konmasını engelliyor.
- "Siteye yayınla" butonu, GitHub REST API (Contents API) ile JSON dosyasını güncelliyor. Site birkaç dakika içinde kendiliğinden yenileniyor.
- **Yetki:** Personel, yalnızca bu depoya ve yalnızca dosya içeriğine yazabilen bir erişim anahtarı (fine-grained token) kullanıyor. Anahtar yalnızca personelin kendi tarayıcısında saklanıyor, sitede yok.
- **İnternet/GitHub bağlantısı yoksa:** Panel güncel JSON dosyasını indiriyor, elle yüklenebiliyor.
- Veri uçları ve API çağrıları **Swagger** dokümanında: `/docs/swagger.html`.

## Gizlilik ve içerik kuralları

- Analytics, çerez, takip kodu yok.
- İç notlar herkese açık depoya hiç yüklenmiyor; ayrı, git dışı bir dosyada duruyor.
- **Biyografiler:** Yalnızca kamuya açık mesleki bilgiler yazıldı. Bir kişi ya da ailesi itiraz ederse, yönetim panelinden tek tıkla o kişinin biyografisi gizlenebiliyor (yalnızca ad ve katkı kalır).
- **Fotoğraflar:** Yalnızca aile ya da kurum izniyle; internetten fotoğraf alınmıyor.
- **Metinler:** Biyografiler kaynaklardan bilgi alınarak kendi cümlelerimizle yazıldı. Kaynaklar her sayfada belirtiliyor.

## Performans, erişilebilirlik, test

- Ziyaretçilerin neredeyse hepsi telefondan gireceği için önce telefon tasarlandı. Telefonda da 4 sütun, panodaki gerçek yerleşim.
- **Sayfa ağırlığı:** Fontlar ve logolar dahil yaklaşık 390 KB. Fontlar kendi sunucumuzda; dışarıdan hiçbir şey yüklenmiyor.
- **Erişilebilirlik:** Klavyeyle gezilebilir. Ekran okuyucu için etiketler var. İşletim sisteminde "hareketi azalt" açıksa dekoratif animasyonlar kapanıyor.
- **Animasyonlar:** Akıcı olması için yalnızca `transform` ve `opacity` kullanılıyor.
- **Test:** Puppeteer ile otomatik testler var:
  - 31 plaka doğru yerde mi,
  - Türkçe karakterli arama çalışıyor mu ("inceoglu" → "İnceoğlu"),
  - iç notlar sayfaya sızıyor mu,
  - tarihçe kendiliğinden ilerliyor mu,
  - pano yüksekliği sabit mi.

  Ayrıca gerçek iPhone'da denendi.

## Sırada ne var?

1. Bilgi İşlem'den alt alan adı.
2. Kalıcı QR'ın üretilip önce kâğıtta denenmesi, sonra plaka yaptırılması.
3. Personel için erişim anahtarı ve kısa kullanım notu.
4. Dekanlıktan onay bekleyenler:
   - iletişim bilgileri,
   - PDF'te 32, panoda 31 isim olması,
   - eksik bilgiler.

## Gelebilecek sorular

**Neden React/Vue gibi bir framework kullanmadın?**
Site küçük ve içerik ağırlıklı. Framework, telefonda açılışı yavaşlatırdı ve bakım için derleme aracı gerektirirdi. Düz JavaScript ile hem hızlı hem de herkesin açıp düzenleyebileceği bir yapı oldu.

**Veritabanı neden yok?**
31 isim ve 16 olay için veritabanı gereksiz. JSON dosyası hem okunabilir hem de GitHub'da her değişikliğin geçmişi tutuluyor; yanlış bir silme tek tıkla geri alınabilir.

**Bir isim nasıl eklenir?**
Personel `/yonetim/` sayfasında formu doldurup "Siteye yayınla"ya basar; birkaç dakika sonra sitede görünür.

**GitHub kapanırsa ya da taşınmak gerekirse?**
Site düz dosyalardan oluşuyor; klasör herhangi bir sunucuya kopyalanıp çalışır. Alt alan adı kullanırsak QR'a dokunmadan yönlendirme değiştirilir.

**Yapay zekâ kullandın mı?**
Evet: kodlamada yapay zekâ destekli bir geliştirme aracı (Claude Code) kullandım. Tasarımı, içerik kurallarını ve her aşamadaki düzeltmeleri ben yönlendirdim; sonucu gerçek telefonda deneyip kontrol ettim.
