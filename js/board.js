// Dijital pano: plakalar, filtreler, arama.

import { esc, sadelestir, plakaAdi, ilkYil, DEMO } from "./data.js?v=20261119j";
import { t } from "./i18n.js?v=20261119j";
import { kaziHtml, kaziGozle, egimBagla, duvarEgimiBagla } from "./effects.js?v=20261119j";

const durum = { tur: "hepsi", sorgu: "" };
let veri = null;

function altSatir(k) {
  const yil = ilkYil(k);
  return yil ? String(yil) : t.turTekil[k.tur] || "";
}

function aramaMetni(k) {
  const gorunur = k.yayinla !== false || DEMO;
  return sadelestir([k.ad, k.kisaAd, gorunur ? k.unvan : ""].filter(Boolean).join(" "));
}

function plakaHtml(k, sira) {
  const ad = plakaAdi(k);
  const { html, sure } = kaziHtml(ad, esc);
  return `
    <li class="yuva" style="--r:${k.satir};--c:${k.sutun};--sira:${sira}" data-id="${esc(k.id)}">
      <a class="plaka" href="#/kisi/${encodeURIComponent(k.id)}" style="--kazi-sure:${sure}ms" data-kazi-gecikme="${Math.min(sira, 12) * 40}">
        <span class="sr">${esc(k.ad)}</span>
        <span class="plaka__ad" aria-hidden="true">${html}</span>
        <span class="plaka__alt">${esc(altSatir(k))}</span>
      </a>
    </li>`;
}

function sekmelerCiz() {
  const kap = document.getElementById("sekmeler");
  const sayilar = { hepsi: veri.liste.length };
  for (const k of veri.liste) sayilar[k.tur] = (sayilar[k.tur] || 0) + 1;
  kap.innerHTML = Object.entries(t.tur)
    .filter(([anahtar]) => anahtar === "hepsi" || sayilar[anahtar])
    .map(([anahtar, ad]) => `
      <button type="button" class="sekme" data-tur="${anahtar}" aria-pressed="${anahtar === durum.tur}">
        ${esc(ad)}
      </button>`)
    .join("");
  kap.addEventListener("click", (e) => {
    const b = e.target.closest(".sekme");
    if (!b) return;
    durum.tur = b.dataset.tur;
    kap.querySelectorAll(".sekme").forEach((s) => s.setAttribute("aria-pressed", String(s === b)));
    suz();
  });
}

function suz() {
  const pano = document.getElementById("pano");
  const sorgu = sadelestir(durum.sorgu);
  const aktif = durum.tur !== "hepsi" || sorgu !== "";
  let gorunen = 0;
  for (const li of pano.querySelectorAll(".yuva")) {
    const k = veri.harita.get(li.dataset.id);
    const uygun = (durum.tur === "hepsi" || k.tur === durum.tur) && (!sorgu || k._ara.includes(sorgu));
    li.hidden = !uygun;
    if (uygun) gorunen++;
  }
  pano.classList.toggle("pano--suzgec", aktif);
  document.getElementById("sonuc-bilgi").textContent = aktif ? t.sonucSayisi(gorunen) : "";
  const bos = document.getElementById("bos-sonuc");
  bos.hidden = gorunen > 0;
  bos.textContent = gorunen ? "" : t.sonucYok;
}

function aramaBagla() {
  const girdi = document.getElementById("ara");
  const temizle = document.querySelector(".ara__temizle");
  let zaman;
  girdi.addEventListener("input", () => {
    temizle.hidden = !girdi.value;
    clearTimeout(zaman);
    zaman = setTimeout(() => { durum.sorgu = girdi.value; suz(); }, 80);
  });
  temizle.addEventListener("click", () => {
    girdi.value = ""; temizle.hidden = true; durum.sorgu = ""; suz(); girdi.focus();
  });
}

/* ---------- İletişim (alt bilgi + "Bize ulaşın" penceresi) ---------- */
const IKON = {
  telefon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  eposta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  adres: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

export function iletisimBagla(site) {
  const i = site.iletisim || {};
  const tel = i.telefon ? `tel:${i.telefon.replace(/[^\d+]/g, "")}` : null;
  const mail = i.eposta ? `mailto:${i.eposta}?subject=${encodeURIComponent(t.epostaKonu)}` : null;

  const alt = document.querySelector("[data-iletisim-satirlari]");
  if (alt) {
    alt.innerHTML = [
      tel && `<a href="${esc(tel)}">${esc(i.telefon)}</a>`,
      mail && `<a href="${esc(mail)}">${esc(i.eposta)}</a>`,
    ].filter(Boolean).join("<br>");
  }

  const pencere = document.getElementById("iletisim-pencere");
  if (i.baslik) document.getElementById("iletisim-baslik").textContent = i.baslik;
  pencere.querySelector("[data-iletisim-aciklama]").textContent = i.aciklama || "";
  const satirlar = [];
  if (tel) satirlar.push(`<li><a href="${esc(tel)}">${IKON.telefon}<span><small>${t.iletisim.telefon}</small>${esc(i.telefon)}</span></a></li>`);
  if (mail) satirlar.push(`<li><a href="${esc(mail)}">${IKON.eposta}<span><small>${t.iletisim.eposta}</small>${esc(i.eposta)}</span></a></li>`);
  if (i.adres) satirlar.push(`<li><span class="satir">${IKON.adres}<span><small>${t.iletisim.adres}</small>${esc(i.adres)}</span></span></li>`);
  document.getElementById("iletisim-liste").innerHTML = satirlar.join("");

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-iletisim-ac]")) pencere.showModal();
  });
  pencere.addEventListener("click", (e) => { if (e.target === pencere) pencere.close(); });
}

/* ---------- Pano ---------- */
export function panoCiz(v) {
  veri = v;
  veri.harita = new Map(v.liste.map((k) => [k.id, k]));
  for (const k of v.liste) k._ara = aramaMetni(k);

  const pano = document.getElementById("pano");
  pano.innerHTML = v.liste.map((k, i) => plakaHtml(k, Math.floor(i / 4) + (i % 4))).join("");

  sekmelerCiz();
  aramaBagla();
  suz();

  egimBagla(pano);
  // Açılışın tek gösterişli anı: plakalar sırayla kazınır, sonra panonun üzerinden bir ışık geçer.
  const cerceve = document.getElementById("pano-cerceve");
  duvarEgimiBagla(cerceve);
  kaziGozle(pano.querySelectorAll(".plaka"), () => cerceve.classList.add("isildi"));
}

/** Kişi sayfasından dönüşte ilgili plakayı bul. */
export function plakaBul(id) {
  return document.querySelector(`#pano .yuva[data-id="${CSS.escape(id)}"] .plaka`);
}
