// Tarihçe: ölçüm cetveli. Olaylar ay hassasiyetiyle cetvele yerleşir;
// seçili olay üstte büyük okunur. Ok tuşları, kaydırma ve dokunma ile gezilir.

import { esc, guvenliUrl } from "./data.js?v=20261124c";
import { t } from "./i18n.js?v=20261124c";
import { hareketAz } from "./effects.js?v=20261124c";

const AYLAR = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"];

const SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
const SAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

/** "4 Şubat 1971" → 1971.12 (yıl + ayın ortası). Ay yoksa tam yıl çizgisi. */
function konum(tarih = "") {
  const s = String(tarih).toLocaleLowerCase("tr");
  const m = s.match(/\d{4}/);
  if (!m) return null;
  const once = s.slice(0, m.index);
  let ay = -1;
  AYLAR.forEach((a, i) => { if (once.includes(a)) ay = i; });
  if (ay < 0 && s.includes("ders yılı")) ay = 8; // ders yılı Eylül'de başlar
  // yalnızca yıl verilmişse işaret tam o yılın çizgisine oturur
  return Number(m[0]) + (ay >= 0 ? (ay + 0.5) / 12 : 0);
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
  const son = Math.floor(Math.max(...olaylar.map((o) => o.konum)));
  const yilOf = (o) => String(o.tarih).match(/\d{4}/)[0];
  // Olaylar cetvele eşit aralıkla dizilir (1976'da 5 olay var; zamanla orantılı dizilince
  // noktalar üst üste biniyordu). Masaüstünde her yılın ilk olayının altında yıl yazar;
  // telefonda yer dar olduğu için yalnızca seçili olayın yılı yazar.
  const masaustu = innerWidth >= 860;
  const n = olaylar.length;
  const ARALIK = Math.max(masaustu ? 40 : 14, Math.floor((kap.clientWidth - (masaustu ? 96 : 56)) / Math.max(1, n - 1)));
  const ox = (i) => i * ARALIK;
  const genislik = ARALIK * Math.max(1, n - 1);

  let etiketler = "";
  if (masaustu) {
    let onceki = "";
    olaylar.forEach((o, i) => {
      const y = yilOf(o);
      if (y !== onceki) etiketler += `<span class="cetvel__etiket" data-yil="${y}" style="left:${ox(i)}px">${y}</span>`;
      onceki = y;
    });
  } else {
    etiketler = '<span class="cetvel__etiket cetvel__etiket--secili"></span>';
  }
  const isaretler = olaylar.map((o, i) => `
    <button type="button" class="cetvel__isaret" style="left:${ox(i)}px" data-i="${i}"
      aria-label="${esc(o.tarih)}: ${esc(o.baslik)}" aria-current="false"></button>`).join("");

  kap.innerHTML = `
    <div class="cetvel__olay" aria-live="polite"></div>
    <div class="cetvel__alt">
      <span class="cetvel__sayac"></span>
      <div class="cetvel__oklar">
        <button type="button" class="dugme cetvel__ok" data-yon="-1" aria-label="Önceki olay">${SOL}</button>
        <button type="button" class="dugme cetvel__ok" data-yon="1" aria-label="Sonraki olay">${SAG}</button>
      </div>
    </div>
    <div class="cetvel__serit">
      <div class="cetvel__olcek" style="width:${genislik + 1}px" role="group" aria-label="Tarih cetveli, ${bas}–${son}">
        <span class="cetvel__gecen" aria-hidden="true"></span>
        ${etiketler}
        ${isaretler}
      </div>
    </div>`;

  const alan = kap.querySelector(".cetvel__olay");
  // Bütün olaylar aynı hücrede üst üste durur: pano en uzun olayın yüksekliğini alır,
  // olay değişince boyutu oynamaz; olaylar slayt gibi yana kayarak değişir.
  alan.innerHTML = olaylar.map((o) => {
    const yil = yilOf(o);
    const kaynak = t.kaynak[o.kaynak];
    const kUrl = kaynak && guvenliUrl(kaynak.url);
    return `<div class="cetvel__slayt" aria-hidden="true" inert>
      <div class="cetvel__yil" aria-hidden="true">${esc(yil)}</div>
      <div class="cetvel__metin">
        ${String(o.tarih).trim() !== yil ? `<p class="cetvel__tarih">${esc(o.tarih)}</p>` : ""}
        <h3>${esc(o.baslik)}</h3>
        <p>${bagla(o.metin || "")}</p>
        ${kaynak ? `<p class="cetvel__kaynak">Kaynak: ${kUrl ? `<a href="${esc(kUrl)}" rel="noopener">${esc(kaynak.ad)}</a>` : esc(kaynak.ad)}</p>` : ""}
      </div>
    </div>`;
  }).join("");
  const slaytlar = [...alan.children];
  const serit = kap.querySelector(".cetvel__serit");
  const gecen = kap.querySelector(".cetvel__gecen");
  const olcek = kap.querySelector(".cetvel__olcek");
  const sayac = kap.querySelector(".cetvel__sayac");
  const [geriOk, ileriOk] = kap.querySelectorAll(".cetvel__ok[data-yon]");
  const isaretDugmeleri = [...kap.querySelectorAll(".cetvel__isaret")];
  const yilEtiketleri = [...kap.querySelectorAll(".cetvel__etiket[data-yil]")];
  const seciliEtiket = kap.querySelector(".cetvel__etiket--secili");
  let secili = -1;

  /* ---------- Otomatik ilerleme ----------
     Her olay SURE kadar ekranda kalır (slayt sunusu); sonra mavi çizgi hızla bir sonraki noktaya uzanır
     ve olay değişir. Son olaydan sonra başa döner (çizgi geri sarılmaz, sıfırdan başlar).
     Her zaman çalışır; yalnızca bölüm ekranda değilken, sekme gizliyken ve klavyeyle
     cetvelin içinde gezinilirken bekler. Elle seçimden sonra süre baştan sayılır. */
  const SURE = 3500; // slayt sunusu: her olay 3,5 sn
  const engeller = new Set();
  let zamanlayici = null;

  function planla() {
    clearTimeout(zamanlayici); zamanlayici = null;
    if (engeller.size === 0) zamanlayici = setTimeout(() => goster((secili + 1) % n, { oto: true }), SURE);
  }
  const engelle = (ad, varMi) => {
    if (varMi) engeller.add(ad); else engeller.delete(ad);
    // Otomatik geçişler ekran okuyucuyu her birkaç saniyede bir konuşturmasın
    alan.setAttribute("aria-live", engeller.size === 0 ? "off" : "polite");
    if (engeller.size === 0) { if (!zamanlayici) planla(); }
    else { clearTimeout(zamanlayici); zamanlayici = null; }
  };

  function goster(i, { animasyon = true, oto = false } = {}) {
    if (i < 0 || i >= n || i === secili) return;
    // sondan başa dönüşte çizgi geri geri sarılmasın, anında sıfırlansın
    const basaDonus = oto && i === 0 && secili === n - 1;
    const yon = i > secili || basaDonus ? 1 : -1;
    const onceki = secili;
    secili = i;
    const yil = yilOf(olaylar[i]);
    const yeni = slaytlar[i], eski = slaytlar[onceki];
    if (eski) {
      // yeni slayt gideceği yönün tersinden girer, eskisi öbür yana çıkar
      const kay = animasyon && !hareketAz();
      yeni.style.transition = "none";
      yeni.classList.toggle("sol", yon < 0);
      void yeni.offsetWidth;
      yeni.style.transition = kay ? "" : "none";
      eski.style.transition = kay ? "" : "none";
      eski.classList.remove("aktif");
      eski.classList.toggle("sol", yon > 0);
      eski.setAttribute("aria-hidden", "true"); eski.inert = true;
    }
    else yeni.style.transition = "none"; // ilk açılışta kaymadan görünsün
    yeni.classList.remove("sol");
    yeni.classList.add("aktif");
    yeni.removeAttribute("aria-hidden"); yeni.inert = false;
    isaretDugmeleri.forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
    yilEtiketleri.forEach((e) => e.classList.toggle("secili", e.dataset.yil === yil));
    const px = ox(i);
    if (seciliEtiket) { seciliEtiket.textContent = yil; seciliEtiket.style.transform = `translateX(calc(${px}px - 50%))`; }
    gecen.style.transition = basaDonus || !animasyon ? "none" : "";
    gecen.style.transform = `scaleX(${(px / genislik).toFixed(4)})`;
    if (seciliEtiket) seciliEtiket.style.transition = gecen.style.transition;
    sayac.textContent = `${i + 1} / ${n}`;
    geriOk.disabled = i === 0;
    ileriOk.disabled = i === n - 1;
    const hedef = px + olcek.offsetLeft - serit.clientWidth / 2;
    if (serit.scrollWidth > serit.clientWidth) serit.scrollTo({ left: Math.max(0, hedef), behavior: animasyon && !hareketAz() ? "smooth" : "instant" });
    planla();
  }

  kap.addEventListener("click", (e) => {
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

  // klavyeyle cetvelde gezinen kişi okurken olay değişmesin
  kap.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) engelle("klavye", true); });
  kap.addEventListener("focusout", (e) => { if (!kap.contains(e.relatedTarget)) engelle("klavye", false); });

  goster(0, { animasyon: false });
}
