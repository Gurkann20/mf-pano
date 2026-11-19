// Tarihçe: ölçüm cetveli. Olaylar ay hassasiyetiyle cetvele yerleşir;
// seçili olay üstte büyük okunur. Ok tuşları, kaydırma ve dokunma ile gezilir.

import { esc, guvenliUrl } from "./data.js?v=20261119i";
import { t } from "./i18n.js?v=20261119i";
import { hareketAz } from "./effects.js?v=20261119i";

const DURDUR_IKON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.5" height="14" rx="1"/><rect x="14" y="5" width="3.5" height="14" rx="1"/></svg>';
const OYNAT_IKON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
const AYLAR = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"];

const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const SAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

/** "4 Şubat 1971" → 1971.12 (yıl + ayın ortası). Ay yoksa yılın ortası. */
function konum(tarih = "") {
  const s = String(tarih).toLocaleLowerCase("tr");
  const m = s.match(/\d{4}/);
  if (!m) return null;
  const once = s.slice(0, m.index);
  let ay = -1;
  AYLAR.forEach((a, i) => { if (once.includes(a)) ay = i; });
  if (ay < 0 && s.includes("ders yılı")) ay = 8; // ders yılı Eylül'de başlar
  return Number(m[0]) + (ay >= 0 ? (ay + 0.5) / 12 : 0.5);
}

/** Olay metnindeki bağışçı adlarını kişi sayfalarına bağlar. */
function baglayici(liste) {
  const adlar = [];
  for (const k of liste) {
    adlar.push([k.ad, k.id]);
    if (k.kisaAd && k.kisaAd !== k.ad) adlar.push([k.kisaAd, k.id]);
  }
  adlar.sort((a, b) => b[0].length - a[0].length);
  if (!adlar.length) return (s) => esc(s);
  const harita = new Map(adlar.map(([ad, id]) => [esc(ad), id]));
  const desen = new RegExp(adlar.map(([ad]) => esc(ad).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
  return (metin) => esc(metin).replace(desen, (m) => `<a href="#/kisi/${encodeURIComponent(harita.get(m))}">${m}</a>`);
}

export function cetvelCiz(kap, veri) {
  const olaylar = veri.olaylar.map((o) => ({ ...o, konum: konum(o.tarih) })).filter((o) => o.konum != null);
  if (!olaylar.length) { kap.closest("section").hidden = true; return; }
  const bagla = baglayici(veri.liste);

  const bas = Math.floor(Math.min(...olaylar.map((o) => o.konum)));
  const son = Math.floor(Math.max(...olaylar.map((o) => o.konum))) + 1;
  // Masaüstünde cetvel genişliğe sığar; telefonda yakın olaylar ayrışsın diye geniş tutulup kaydırılır.
  const YIL_PX = innerWidth >= 860 ? Math.max(44, Math.floor((kap.clientWidth - 56) / (son - bas))) : 80;
  const x = (k) => Math.round((k - bas) * YIL_PX);
  const olayYillari = new Set(olaylar.map((o) => Math.floor(o.konum)));

  let etiketler = "";
  for (let y = bas; y <= son; y++) {
    etiketler += `<span class="cetvel__etiket${olayYillari.has(y) ? " olayli" : ""}" style="left:${x(y)}px">${y}</span>`;
  }
  // Birbirine çok yakın işaretler basamaklanır (iğneleri farklı boyda) ki üst üste binmesin.
  let oncekiX = -999, seviye = 0;
  const seviyeler = olaylar.map((o) => {
    const px = x(o.konum);
    seviye = px - oncekiX < 16 ? (seviye + 1) % 3 : 0;
    oncekiX = px;
    return seviye;
  });
  const isaretler = olaylar.map((o, i) => `
    <button type="button" class="cetvel__isaret" style="left:${x(o.konum)}px;--s:${seviyeler[i]}" data-i="${i}"
      aria-label="${esc(o.tarih)}: ${esc(o.baslik)}" aria-current="false"></button>`).join("");

  kap.innerHTML = `
    <div class="cetvel__olay" aria-live="polite"></div>
    <div class="cetvel__alt">
      <span class="cetvel__sayac"></span>
      <div class="cetvel__oklar">
        <button type="button" class="dugme cetvel__ok cetvel__oynat" aria-pressed="true"></button>
        <button type="button" class="dugme cetvel__ok" data-yon="-1" aria-label="Önceki olay">${SOL}</button>
        <button type="button" class="dugme cetvel__ok" data-yon="1" aria-label="Sonraki olay">${SAG}</button>
      </div>
    </div>
    <div class="cetvel__serit">
      <div class="cetvel__olcek" style="width:${x(son) + 1}px;--yil-px:${YIL_PX}px" role="group" aria-label="Tarih cetveli, ${bas}–${son}">
        ${etiketler}
        <span class="cetvel__gecen" aria-hidden="true"></span>
        <span class="cetvel__imlec" aria-hidden="true"></span>
        ${isaretler}
      </div>
    </div>`;

  const alan = kap.querySelector(".cetvel__olay");
  const serit = kap.querySelector(".cetvel__serit");
  const imlec = kap.querySelector(".cetvel__imlec");
  const gecen = kap.querySelector(".cetvel__gecen");
  const olcek = kap.querySelector(".cetvel__olcek");
  const sayac = kap.querySelector(".cetvel__sayac");
  const oynatDugme = kap.querySelector(".cetvel__oynat");
  const [geriOk, ileriOk] = kap.querySelectorAll(".cetvel__ok[data-yon]");
  const isaretDugmeleri = [...kap.querySelectorAll(".cetvel__isaret")];
  const genislik = x(son);
  let secili = -1;

  /* ---------- Otomatik ilerleme ----------
     İmleç bir sonraki olaya doğru SURE boyunca yavaşça kayar, arkasında "geçen zaman"
     çizgisi dolar; işarete varınca olay değişir. Son olaydan sonra başa döner.
     Fare üzerindeyken, klavyeyle içindeyken, ekranda değilken ya da sekme gizliyken bekler. */
  const SURE = 8000;
  const KISA = 520; // elle seçimde imlecin yerine oturma süresi
  let oynuyor = true; // her zaman otomatik başlar; yalnızca durdur düğmesiyle durur
  const engeller = new Set();
  let zamanlayici = null, kayiyor = false, kaymaBasi = 0, kalan = SURE, hedefIndeks = 0;

  const aktif = () => oynuyor && engeller.size === 0;

  function konumla(px, sure = 0) {
    // sure < 0: hiç geçiş olmadan anında yerleş (sondan başa dönüş)
    const gecis = sure > 0 ? `transform ${sure}ms linear` : sure < 0 ? "none" : "";
    imlec.style.transition = gecis;
    gecen.style.transition = gecis;
    imlec.style.transform = `translateX(${px - 1}px)`;
    gecen.style.transform = `scaleX(${(px / genislik).toFixed(4)})`;
    // anında atlamayı tarayıcıya işlet; yoksa hemen ardından gelen kayma eski konumdan başlar
    if (sure < 0) void imlec.offsetWidth;
  }

  function ilerle() {
    zamanlayici = null;
    if (!aktif()) return;
    hedefIndeks = (secili + 1) % olaylar.length;
    // son olaydan sonra cetvelin sonuna kayar, sonra başa atlar
    konumla(hedefIndeks !== 0 ? x(olaylar[hedefIndeks].konum) : genislik, kalan);
    kayiyor = true;
    kaymaBasi = performance.now();
    zamanlayici = setTimeout(() => {
      zamanlayici = null; kayiyor = false; kalan = SURE;
      goster(hedefIndeks, { oto: true });
    }, kalan);
  }

  function durdur() {
    clearTimeout(zamanlayici); zamanlayici = null;
    if (!kayiyor) return;
    kayiyor = false;
    kalan = Math.max(400, kalan - (performance.now() - kaymaBasi));
    // imleci ve çizgiyi bulundukları yerde dondur
    for (const el of [imlec, gecen]) {
      const anlik = getComputedStyle(el).transform;
      el.style.transition = "none";
      el.style.transform = anlik;
    }
  }

  function durumGuncelle() {
    oynatDugme.innerHTML = oynuyor ? DURDUR_IKON : OYNAT_IKON;
    oynatDugme.setAttribute("aria-label", oynuyor ? "Otomatik ilerlemeyi durdur" : "Otomatik ilerlemeyi başlat");
    oynatDugme.setAttribute("aria-pressed", String(oynuyor));
    // Otomatik geçişler ekran okuyucuyu her birkaç saniyede bir konuşturmasın
    alan.setAttribute("aria-live", aktif() ? "off" : "polite");
    if (aktif() && !zamanlayici) ilerle();
    else if (!aktif() && zamanlayici) durdur();
  }
  const engelle = (ad, varMi) => {
    if (varMi) engeller.add(ad); else engeller.delete(ad);
    durumGuncelle();
  };

  function planla(oto) {
    clearTimeout(zamanlayici); zamanlayici = null; kayiyor = false;
    if (!oto) kalan = SURE - KISA;
    if (aktif()) zamanlayici = setTimeout(ilerle, oto ? 0 : KISA);
  }

  function goster(i, { animasyon = true, oto = false } = {}) {
    if (i < 0 || i >= olaylar.length || i === secili) return;
    // otomatik döngü sondan başa dönerken geri geri kaymasın, doğrudan başa atlasın
    const basaDonus = oto && i === 0 && secili === olaylar.length - 1;
    const yon = i > secili || basaDonus ? 1 : -1;
    secili = i;
    const o = olaylar[i];
    const yil = String(o.tarih).match(/\d{4}/)[0];
    const kaynak = t.kaynak[o.kaynak];
    const kUrl = kaynak && guvenliUrl(kaynak.url);
    alan.innerHTML = `
      <div class="cetvel__yil" aria-hidden="true">${esc(yil)}</div>
      <div class="cetvel__metin">
        ${String(o.tarih).trim() !== yil ? `<p class="cetvel__tarih">${esc(o.tarih)}</p>` : ""}
        <h3>${esc(o.baslik)}</h3>
        <p>${bagla(o.metin || "")}</p>
        ${kaynak ? `<p class="cetvel__kaynak">Kaynak: ${kUrl ? `<a href="${esc(kUrl)}" rel="noopener">${esc(kaynak.ad)}</a>` : esc(kaynak.ad)}</p>` : ""}
      </div>`;
    if (animasyon && !hareketAz()) {
      alan.classList.remove("degisti", "geri");
      void alan.offsetWidth;
      alan.classList.add("degisti");
      alan.classList.toggle("geri", yon < 0);
    }
    isaretDugmeleri.forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
    const px = x(o.konum);
    konumla(px, basaDonus ? -1 : 0);
    sayac.textContent = `${i + 1} / ${olaylar.length}`;
    geriOk.disabled = i === 0;
    ileriOk.disabled = i === olaylar.length - 1;
    const hedef = px + olcek.offsetLeft - serit.clientWidth / 2;
    serit.scrollTo({ left: Math.max(0, hedef), behavior: animasyon && !basaDonus && !hareketAz() ? "smooth" : "instant" });
    planla(oto);
  }

  kap.addEventListener("click", (e) => {
    if (e.target.closest(".cetvel__oynat")) { oynuyor = !oynuyor; return durumGuncelle(); }
    const isaret = e.target.closest(".cetvel__isaret");
    if (isaret) return goster(Number(isaret.dataset.i));
    const ok = e.target.closest(".cetvel__ok[data-yon]");
    if (ok) goster(secili + Number(ok.dataset.yon));
  });
  kap.addEventListener("keydown", (e) => {
    if (e.target.closest("a, input")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goster(secili + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goster(secili - 1); }
  });

  // Bekleme koşulları
  document.addEventListener("visibilitychange", () => engelle("gizli", document.hidden));
  if ("IntersectionObserver" in window) {
    engeller.add("gorunmuyor");
    new IntersectionObserver(([g]) => engelle("gorunmuyor", !g.isIntersecting), { threshold: 0.15 }).observe(kap);
  }

  // Telefonda metin alanını yana kaydırarak gezinme
  let baslangic = null;
  alan.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") baslangic = { x: e.clientX, y: e.clientY }; });
  alan.addEventListener("pointerup", (e) => {
    if (!baslangic) return;
    const dx = e.clientX - baslangic.x, dy = e.clientY - baslangic.y;
    baslangic = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) goster(secili + (dx < 0 ? 1 : -1));
  });
  alan.addEventListener("pointercancel", () => { baslangic = null; });
  alan.style.touchAction = "pan-y";

  goster(0, { animasyon: false });
  durumGuncelle();
}
