// Kişi / kurum sayfası: #/kisi/<id>

import { esc, plakaAdi, basHarfler, yasamMetni, bioGoster, guvenliUrl, DEMO } from "./data.js?v=20261119j";
import { t } from "./i18n.js?v=20261119j";

const OK_SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const PAYLAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';

function miniPano(veri, k) {
  const dolu = new Set(veri.liste.map((x) => `${x.satir}-${x.sutun}`));
  let h = "";
  const sonSatir = Math.max(...veri.liste.map((x) => x.satir).filter((r) => r < 99));
  for (let r = 1; r <= sonSatir; r++)
    for (let c = 1; c <= veri.pano.sutun; c++) {
      const key = `${r}-${c}`;
      const sinif = r === k.satir && c === k.sutun ? "burada" : dolu.has(key) ? "dolu" : "";
      h += `<i class="${sinif}"></i>`;
    }
  return h;
}

function fotoHtml(k) {
  // Fotoğraf yalnızca izinliyse JSON'a yazılır; yüklenemezse monogram kalır.
  if (!k.foto || !/^[\w.-]+\.(webp|jpe?g|png)$/i.test(k.foto)) return "";
  return `<img src="assets/foto/${esc(k.foto)}" alt="${esc(k.ad)}" onerror="this.remove()">`;
}

export function kisiCiz(kap, veri, id) {
  const sira = veri.liste.findIndex((x) => x.id === id);
  const k = veri.liste[sira];

  if (!k) {
    kap.innerHTML = `
      <div class="kap kisi gecis-sol">
        <a class="geri" href="#/pano">${OK_SOL}${esc(t.panoyaDon)}</a>
        <h1 class="bolum__baslik">${esc(t.bulunamadi)}</h1>
      </div>`;
    document.title = t.sayfaBasligi;
    return null;
  }

  const acik = k.yayinla !== false || DEMO;
  const bio = bioGoster(k);
  const yasam = acik ? yasamMetni(k) : "";
  const altBilgi = [acik && k.unvan, yasam].filter(Boolean).join(" · ") || t.turTekil[k.tur];
  const onceki = veri.liste[(sira - 1 + veri.liste.length) % veri.liste.length];
  const sonraki = veri.liste[(sira + 1) % veri.liste.length];

  const katki = k.katki.length
    ? `<ol class="katki">${k.katki.map((x) => `
        <li><span class="katki__yil">${esc(x.yil || "")}</span><span class="katki__metin">${esc(x.metin)}</span></li>`).join("")}</ol>`
    : `<p class="derleniyor">${esc(t.katkiYok)}</p>`;

  const hayat = bio
    ? `<div class="biyografi">${k.biyografi.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
    : `<div class="derleniyor"><p>${esc(t.derleniyor)}</p>
         <p><button class="dugme dugme--hayalet dugme--kucuk" type="button" data-iletisim-ac>${esc(t.bizeUlasin)}</button></p></div>`;

  const kaynaklar = (bio || k.katki.length) && k.kaynaklar.length
    ? `<section class="kisi-bolum belir" aria-labelledby="kaynak-baslik">
         <h2 id="kaynak-baslik">${esc(t.kaynaklarBaslik)}</h2>
         <ul class="kaynaklar">${k.kaynaklar.map((x) => {
           const u = guvenliUrl(x.url);
           return `<li>${u ? `<a href="${esc(u)}" rel="noopener" target="_blank">${esc(x.ad)}</a>` : esc(x.ad)}</li>`;
         }).join("")}</ul>
       </section>`
    : "";

  const demoEtiketleri = DEMO
    ? `<span class="etiket etiket--sari">${esc(t.durum[k.durum] || k.durum || "")}</span>${k.yayinla === false ? `<span class="etiket etiket--sari">${esc(t.yayindaDegil)}</span>` : ""}`
    : "";

  kap.innerHTML = `
    <article class="kap kisi">
      <a class="geri" href="#/pano">${OK_SOL}${esc(t.panoyaDon)}</a>
      <div class="kadife-pano"><div class="kadife-pano__ic">

      <header class="kisi-ust">
        <div class="monogram" aria-hidden="true">${esc(basHarfler(k))}${fotoHtml(k)}</div>
        <div>
          <div class="plaka plaka--buyuk">
            <h1 class="plaka__ad">${esc(plakaAdi(k))}</h1>
            <span class="plaka__alt">${esc(altBilgi)}</span>
          </div>
          <div class="kisi-ust__meta">
            ${altBilgi !== t.turTekil[k.tur] ? `<span class="etiket">${esc(t.turTekil[k.tur] || "")}</span>` : ""}
            ${demoEtiketleri}
            <button class="paylas" type="button" data-paylas>${PAYLAS}${esc(t.paylas)}</button>
          </div>
          ${acik && k.ozet ? `<p class="kisi-ozet">${esc(k.ozet)}</p>` : ""}
        </div>
      </header>

      <div class="kisi-govde">
        <div>
          <section class="kisi-bolum belir" aria-labelledby="katki-baslik">
            <h2 id="katki-baslik">${esc(t.katkiBaslik)}</h2>
            ${katki}
          </section>
          <section class="kisi-bolum belir" aria-labelledby="hayat-baslik">
            <h2 id="hayat-baslik">${esc(t.hayatiBaslik[k.tur] || t.hayatiBaslik.kisi)}</h2>
            ${hayat}
          </section>
          ${kaynaklar}
        </div>
        <aside>
          <div class="yan-kart belir">
            <h3>${esc(t.panodakiYeri)}</h3>
            <div class="mini-pano" aria-hidden="true">${miniPano(veri, k)}</div>
            <p class="mini-pano__yazi">${esc(t.yerMetni(k.satir, k.sutun))}</p>
          </div>
        </aside>
      </div>

      <nav class="gezinme" aria-label="Bağışçılar arasında gezin">
        <a href="#/kisi/${encodeURIComponent(onceki.id)}" rel="prev"><small>${esc(t.onceki)}</small><span>${esc(plakaAdi(onceki))}</span></a>
        <a class="sonraki" href="#/kisi/${encodeURIComponent(sonraki.id)}" rel="next"><small>${esc(t.sonraki)}</small><span>${esc(plakaAdi(sonraki))}</span></a>
      </nav>
      </div></div>
    </article>`;

  // Başlık ve paylaşım önizlemesi
  document.title = `${k.ad} · ${t.sayfaBasligi}`;
  const aciklama = (acik && k.ozet) || k.katki[0]?.metin || t.sayfaBasligi;
  metaAyarla('meta[name="description"]', aciklama);
  metaAyarla('meta[property="og:title"]', k.ad);
  metaAyarla('meta[property="og:description"]', aciklama);

  const paylasDugme = kap.querySelector("[data-paylas]");
  paylasDugme.addEventListener("click", async () => {
    const veriPaylas = { title: k.ad, text: aciklama, url: location.href };
    try {
      if (navigator.share) await navigator.share(veriPaylas);
      else {
        await navigator.clipboard.writeText(location.href);
        paylasDugme.lastChild.textContent = t.kopyalandi;
      }
    } catch { /* kullanıcı vazgeçti */ }
  });

  return k;
}

const VARSAYILAN = new Map();
export function metaAyarla(secici, deger) {
  const m = document.querySelector(secici);
  if (!m) return;
  if (!VARSAYILAN.has(secici)) VARSAYILAN.set(secici, m.content);
  m.content = deger ?? VARSAYILAN.get(secici);
}
export function metaSifirla() {
  for (const [secici, deger] of VARSAYILAN) metaAyarla(secici, deger);
}
