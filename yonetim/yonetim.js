// Pano yönetim paneli.
// Veriyi okur, formla düzenletir; "Siteye yayınla" ile GitHub'a commit atar
// (bağlantı yoksa JSON indirilir). Kod bilgisi gerekmez.

const SATIR = 14, SUTUN = 4;
const AYAR_ANAHTARI = "pano-yonetim-ayar";
const YOL = { bagiscilar: "data/bagiscilar.json", site: "data/site.json" };

const durum = {
  belge: null,          // bagiscilar.json'ın tamamı
  site: null,           // site.json
  sha: {},              // GitHub dosya sürümleri
  fotolar: new Map(),   // yol -> base64 (yayınlanmayı bekleyen)
  degisiklikler: [],
  siteDegisti: false,
  secili: null,         // { id } ya da { yeni: true, satir, sutun }
  formFoto: undefined,  // undefined: dokunulmadı, null: kaldırıldı, {base64, uzanti, url}: yeni
};

const $ = (s, k = document) => k.querySelector(s);
const $$ = (s, k = document) => [...k.querySelectorAll(s)];
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------------- Yardımcılar ---------------- */
function sadelestir(s = "") {
  return String(s).toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function kimlikUret(ad) {
  const temel = sadelestir(ad).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "bagisci";
  let id = temel, n = 2;
  while (liste().some((k) => k.id === id)) id = `${temel}-${n++}`;
  return id;
}
function plakaAdi(k) {
  const ad = k.kisaAd || k.ad;
  if (k.tur !== "kisi") return ad;
  const p = ad.trim().split(/\s+/);
  if (p.length > 1) p[p.length - 1] = p[p.length - 1].toLocaleUpperCase("tr");
  return p.join(" ");
}
const liste = () => durum.belge.bagiscilar;
const bugun = () => new Date().toISOString().slice(0, 10);

function bildir(metin, hata = false) {
  const b = $("#bildirim");
  b.textContent = metin;
  b.classList.toggle("hata-b", hata);
  b.classList.add("acik");
  clearTimeout(bildir.z);
  bildir.z = setTimeout(() => b.classList.remove("acik"), hata ? 7000 : 3500);
}

function b64Kodla(metin) {
  const bayt = new TextEncoder().encode(metin);
  let s = "";
  for (let i = 0; i < bayt.length; i += 0x8000) s += String.fromCharCode(...bayt.subarray(i, i + 0x8000));
  return btoa(s);
}
function b64Coz(b64) {
  const s = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(s, (c) => c.charCodeAt(0)));
}

/* ---------------- GitHub ---------------- */
function ayarlar() {
  try { return JSON.parse(localStorage.getItem(AYAR_ANAHTARI)) || {}; } catch { return {}; }
}
const bagli = () => { const a = ayarlar(); return !!(a.sahip && a.depo && a.token); };

async function gh(yol, secenek = {}) {
  const a = ayarlar();
  const yanit = await fetch(`https://api.github.com/repos/${encodeURIComponent(a.sahip)}/${encodeURIComponent(a.depo)}${yol}`, {
    ...secenek,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${a.token}`,
      ...(secenek.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!yanit.ok) {
    const e = new Error(`GitHub ${yanit.status}`);
    e.durum = yanit.status;
    try { e.detay = (await yanit.json()).message; } catch { /* boş */ }
    throw e;
  }
  return yanit.status === 204 ? null : yanit.json();
}
async function dosyaOku(yol) {
  const a = ayarlar();
  const d = await gh(`/contents/${yol}?ref=${encodeURIComponent(a.dal || "main")}`);
  durum.sha[yol] = d.sha;
  return b64Coz(d.content);
}
async function dosyaYaz(yol, b64, mesaj) {
  const a = ayarlar();
  if (!(yol in durum.sha)) {
    try { await dosyaOku(yol); } catch (e) { if (e.durum !== 404) throw e; durum.sha[yol] = undefined; }
  }
  const d = await gh(`/contents/${yol}`, {
    method: "PUT",
    body: JSON.stringify({ message: mesaj, content: b64, branch: a.dal || "main", ...(durum.sha[yol] ? { sha: durum.sha[yol] } : {}) }),
  });
  durum.sha[yol] = d.content.sha;
}

/* ---------------- Yükleme ---------------- */
async function yukle() {
  try {
    if (bagli()) {
      const [b, s] = await Promise.all([dosyaOku(YOL.bagiscilar), dosyaOku(YOL.site).catch(() => "{}")]);
      durum.belge = JSON.parse(b);
      durum.site = JSON.parse(s);
    } else {
      const [b, s] = await Promise.all([
        fetch(`../${YOL.bagiscilar}`, { cache: "no-cache" }).then((r) => r.json()),
        fetch(`../${YOL.site}`, { cache: "no-cache" }).then((r) => r.json()).catch(() => ({})),
      ]);
      durum.belge = b; durum.site = s;
    }
  } catch (e) {
    bildir(`Veri yüklenemedi: ${e.detay || e.message}`, true);
    return;
  }
  durum.belge.bagiscilar ||= [];
  durum.degisiklikler = []; durum.siteDegisti = false; durum.fotolar.clear();
  baglantiGoster();
  panoCiz();
  siteFormDoldur();
  cubukGuncelle();
}

function baglantiGoster() {
  const el = $("#baglanti-durum");
  const a = ayarlar();
  el.textContent = bagli() ? `Bağlı: ${a.sahip}/${a.depo}` : "Bağlantı yok (yalnızca JSON indir)";
  el.classList.toggle("var", bagli());
}

/* ---------------- Mini pano ---------------- */
function panoCiz() {
  const harita = new Map(liste().map((k) => [`${k.satir}-${k.sutun}`, k]));
  const q = sadelestir($("#liste-ara").value.trim());
  const degisen = new Set(durum.degisiklikler.map((d) => d.id));
  let h = "";
  for (let r = 1; r <= SATIR; r++)
    for (let c = 1; c <= SUTUN; c++) {
      const k = harita.get(`${r}-${c}`);
      if (k) {
        const secili = durum.secili?.id === k.id ? " secili" : "";
        const soluk = q && !sadelestir(k.ad + " " + (k.kisaAd || "")).includes(q) ? " soluk-h" : "";
        const deg = degisen.has(k.id) ? " degisti" : "";
        h += `<button type="button" class="hucre${secili}${soluk}${deg}" data-id="${esc(k.id)}" title="${esc(k.ad)} (${r}. satır, ${c}. sütun)">${esc(plakaAdi(k))}</button>`;
      } else {
        const secili = durum.secili?.yeni && durum.secili.satir === r && durum.secili.sutun === c ? " secili" : "";
        h += `<button type="button" class="hucre bos${secili}" data-r="${r}" data-c="${c}" aria-label="Boş yer: ${r}. satır, ${c}. sütun. Yeni ekle">+</button>`;
      }
    }
  $("#mini-pano").innerHTML = h;
  $("#pano-ozet").textContent = `${liste().length} dolu · ${SATIR * SUTUN - liste().length} boş`;
}

$("#mini-pano").addEventListener("click", (e) => {
  const b = e.target.closest(".hucre");
  if (!b) return;
  if (b.dataset.id) sec({ id: b.dataset.id });
  else sec({ yeni: true, satir: +b.dataset.r, sutun: +b.dataset.c });
});
$("#liste-ara").addEventListener("input", panoCiz);

/* ---------------- Form ---------------- */
const form = $("#form");

function tekrarSatiri(tur, d = {}) {
  const div = document.createElement("div");
  div.className = `tekrar__satir ${tur}`;
  div.innerHTML = tur === "katki"
    ? `<input class="girdi" data-alan="yil" placeholder="Yıl (ör. 1974)" value="${esc(d.yil || "")}" aria-label="Yıl">
       <input class="girdi" data-alan="metin" placeholder="Ne kazandırdı? (ör. Laboratuvar bağışı)" value="${esc(d.metin || "")}" aria-label="Katkı">
       <button type="button" class="dugme sil-satir" aria-label="Satırı sil">✕</button>`
    : `<input class="girdi" data-alan="ad" placeholder="Kaynak adı" value="${esc(d.ad || "")}" aria-label="Kaynak adı">
       <input class="girdi" data-alan="url" placeholder="https://… (varsa)" value="${esc(d.url || "")}" aria-label="Bağlantı">
       <button type="button" class="dugme sil-satir" aria-label="Satırı sil">✕</button>`;
  $(`#${tur}-liste`).appendChild(div);
}
form.addEventListener("click", (e) => {
  if (e.target.closest(".sil-satir")) e.target.closest(".tekrar__satir").remove();
  const ekle = e.target.closest("[data-ekle]");
  if (ekle) tekrarSatiri(ekle.dataset.ekle);
});

function sec(secim) {
  durum.secili = secim;
  durum.formFoto = undefined;
  $("#form-hata").textContent = "";
  const k = secim.id ? liste().find((x) => x.id === secim.id) : null;
  const d = k || { tur: "kisi", satir: secim.satir, sutun: secim.sutun, durum: "eksik", yayinla: true, katki: [], kaynaklar: [], biyografi: [] };

  $("#bos-durum").hidden = true;
  form.hidden = false;
  $("#form-baslik").textContent = k ? "Bağışçıyı düzenle" : "Yeni bağışçı ekle";
  $("#sil").hidden = !k;
  const f = form.elements;
  f.ad.value = d.ad || "";
  f.kisaAd.value = d.kisaAd || "";
  f.tur.value = d.tur || "kisi";
  f.satir.value = d.satir ?? "";
  f.sutun.value = d.sutun ?? "";
  f.unvan.value = d.unvan || "";
  f.dogum.value = d.yasam?.dogum || "";
  f.vefat.value = d.yasam?.vefat || "";
  f.ozet.value = d.ozet || "";
  f.biyografi.value = (d.biyografi || []).join("\n\n");
  f.durum.value = d.durum || "eksik";
  f.yayinla.checked = d.yayinla !== false;
  $("#kimlik").textContent = k ? k.id : "(kaydedince addan üretilecek)";
  $("#kimlik-not").textContent = k ? "— değişmez; QR ve paylaşılan linkler buna bağlı." : "";
  $("#katki-liste").innerHTML = ""; (d.katki || []).forEach((x) => tekrarSatiri("katki", x));
  $("#kaynak-liste").innerHTML = ""; (d.kaynaklar || []).forEach((x) => tekrarSatiri("kaynak", x));
  if (!k) tekrarSatiri("katki");
  $("#foto-izin").checked = !!d.foto;
  $("#foto-dosya").disabled = !d.foto;
  $("#foto-dosya").value = "";
  fotoGoster(d.foto ? `../assets/foto/${d.foto}` : null);
  panoCiz();
  if (innerWidth < 1000) form.scrollIntoView({ behavior: "smooth" });
  f.ad.focus({ preventScroll: true });
}

function fotoGoster(url) {
  $("#foto-onizleme").innerHTML = url ? `<img src="${esc(url)}" alt="" onerror="this.parentNode.textContent='–'">` : "–";
  $("#foto-kaldir").hidden = !url;
}

$("#foto-izin").addEventListener("change", (e) => { $("#foto-dosya").disabled = !e.target.checked; });
$("#foto-kaldir").addEventListener("click", () => { durum.formFoto = null; fotoGoster(null); $("#foto-dosya").value = ""; });
$("#foto-dosya").addEventListener("change", async (e) => {
  const dosya = e.target.files[0];
  if (!dosya) return;
  try {
    const bmp = await createImageBitmap(dosya);
    const olcek = Math.min(1, 800 / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(bmp.width * olcek); cv.height = Math.round(bmp.height * olcek);
    cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
    let blob = await new Promise((r) => cv.toBlob(r, "image/webp", 0.82));
    if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => cv.toBlob(r, "image/jpeg", 0.85));
    const uzanti = blob.type === "image/webp" ? "webp" : "jpg";
    const url = URL.createObjectURL(blob);
    const base64 = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
    durum.formFoto = { base64, uzanti, url };
    fotoGoster(url);
  } catch {
    bildir("Fotoğraf okunamadı. Başka bir dosya deneyin.", true);
  }
});

function formOku() {
  const f = form.elements;
  const hata = (m) => { throw new Error(m); };
  const ad = f.ad.value.trim().replace(/\s+/g, " ");
  if (!ad) hata("Ad boş olamaz.");
  const satir = Number(f.satir.value), sutun = Number(f.sutun.value);
  if (!Number.isInteger(satir) || satir < 1 || satir > SATIR) hata(`Satır 1 ile ${SATIR} arasında olmalı.`);
  if (!Number.isInteger(sutun) || sutun < 1 || sutun > SUTUN) hata(`Sütun 1 ile ${SUTUN} arasında olmalı.`);
  const mevcutId = durum.secili.id;
  const cakisan = liste().find((k) => k.satir === satir && k.sutun === sutun && k.id !== mevcutId);
  if (cakisan) hata(`Bu yer dolu: ${cakisan.ad}. Başka bir satır/sütun seçin.`);
  const yil = (v, ad) => { v = v.trim(); if (v && !/^\d{4}$/.test(v)) hata(`${ad} 4 haneli bir yıl olmalı.`); return v || null; };
  const dogum = yil(f.dogum.value, "Doğum yılı"), vefat = yil(f.vefat.value, "Vefat yılı");
  const katki = $$("#katki-liste .tekrar__satir").map((s) => ({ yil: $('[data-alan="yil"]', s).value.trim(), metin: $('[data-alan="metin"]', s).value.trim() })).filter((x) => x.metin);
  const kaynaklar = $$("#kaynak-liste .tekrar__satir").map((s) => {
    const url = $('[data-alan="url"]', s).value.trim();
    if (url && !/^https?:\/\//i.test(url)) hata("Kaynak bağlantısı http:// ya da https:// ile başlamalı.");
    return { ad: $('[data-alan="ad"]', s).value.trim(), url: url || null };
  }).filter((x) => x.ad);
  const eski = mevcutId ? liste().find((k) => k.id === mevcutId) : {};
  const id = mevcutId || kimlikUret(ad);

  let foto = eski.foto ?? null;
  if (durum.formFoto === null) foto = null;
  else if (durum.formFoto) {
    if (!$("#foto-izin").checked) hata("Fotoğraf için izin kutusunu işaretleyin.");
    foto = `${id}.${durum.formFoto.uzanti}`;
  }

  const kayit = {
    id, ad,
    ...(f.kisaAd.value.trim() ? { kisaAd: f.kisaAd.value.trim() } : {}),
    tur: f.tur.value, satir, sutun,
    ...(f.unvan.value.trim() ? { unvan: f.unvan.value.trim() } : {}),
    ...(dogum || vefat ? { yasam: { dogum, vefat } } : {}),
    ozet: f.ozet.value.trim(),
    biyografi: f.biyografi.value.split(/\n\s*\n/).map((p) => p.trim().replace(/\s*\n\s*/g, " ")).filter(Boolean),
    katki,
    durum: f.durum.value,
    yayinla: f.yayinla.checked,
    foto,
    kaynaklar,
  };
  return { kayit, eski: mevcutId ? eski : null };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let sonuc;
  try { sonuc = formOku(); } catch (h) { $("#form-hata").textContent = h.message; return; }
  const { kayit, eski } = sonuc;
  if (durum.formFoto) {
    durum.fotolar.set(`assets/foto/${kayit.foto}`, durum.formFoto.base64);
  }
  if (eski) {
    liste()[liste().indexOf(eski)] = kayit;
    durum.degisiklikler.push({ id: kayit.id, metin: `${kayit.ad} güncellendi` });
  } else {
    liste().push(kayit);
    durum.degisiklikler.push({ id: kayit.id, metin: `${kayit.ad} eklendi` });
  }
  liste().sort((a, b) => a.satir - b.satir || a.sutun - b.sutun);
  bildir(`Uygulandı. Siteye göndermek için “Siteye yayınla”ya basın.`);
  sec({ id: kayit.id });
  cubukGuncelle();
});

$("#vazgec").addEventListener("click", () => {
  durum.secili = null; form.hidden = true; $("#bos-durum").hidden = false; panoCiz();
});

$("#sil").addEventListener("click", () => {
  const k = liste().find((x) => x.id === durum.secili?.id);
  if (!k) return;
  if (!confirm(`“${k.ad}” panodan kaldırılsın mı?\n\nBu kişinin sayfası ve ona verilmiş QR/link artık çalışmaz.`)) return;
  durum.belge.bagiscilar = liste().filter((x) => x !== k);
  durum.degisiklikler.push({ id: null, metin: `${k.ad} kaldırıldı` });
  $("#vazgec").click();
  cubukGuncelle();
  bildir(`${k.ad} kaldırıldı. Yayınlamayı unutmayın.`);
});

/* ---------------- Site / iletişim ---------------- */
function siteFormDoldur() {
  const i = durum.site?.iletisim || {};
  const f = $("#site-form").elements;
  for (const ad of ["baslik", "aciklama", "telefon", "eposta", "adres"]) f[ad].value = i[ad] || "";
}
$("#site-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target.elements;
  durum.site.iletisim = {};
  for (const ad of ["baslik", "aciklama", "telefon", "eposta", "adres"]) durum.site.iletisim[ad] = f[ad].value.trim();
  durum.siteDegisti = true;
  durum.degisiklikler.push({ id: null, metin: "İletişim bilgileri güncellendi" });
  cubukGuncelle();
  bildir("Uygulandı. Yayınlamayı unutmayın.");
});

/* ---------------- Yayın ---------------- */
function cubukGuncelle() {
  const n = durum.degisiklikler.length;
  $("#degisiklik-yazi").textContent = n ? `${n} yayınlanmamış değişiklik: ${durum.degisiklikler.slice(-3).map((d) => d.metin).join(", ")}${n > 3 ? "…" : ""}` : "Değişiklik yok";
  $("#yayin-cubugu").classList.toggle("var", n > 0);
  $("#yayinla").disabled = n === 0;
}

const jsonMetni = (o) => JSON.stringify(o, null, 2) + "\n";

function indir(ad, metin) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([metin], { type: "application/json" }));
  a.download = ad;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#json-indir").addEventListener("click", () => {
  indir("bagiscilar.json", jsonMetni(durum.belge));
  if (durum.siteDegisti) indir("site.json", jsonMetni({ ...durum.site, sonGuncelleme: bugun() }));
  if (durum.fotolar.size) bildir("Not: fotoğraflar JSON ile indirilmez; yalnızca GitHub bağlantısıyla yayınlanır.", true);
});

$("#yayinla").addEventListener("click", async () => {
  if (!bagli()) { $("#ayarlar").showModal(); bildir("Yayınlamak için önce GitHub bağlantısını kurun.", true); return; }
  const d = $("#yayinla");
  d.disabled = true; d.textContent = "Yayınlanıyor…";
  const ozet = durum.degisiklikler.map((x) => x.metin);
  const mesaj = `Pano: ${ozet.slice(0, 3).join(", ")}${ozet.length > 3 ? ` (+${ozet.length - 3})` : ""}`;
  try {
    for (const [yol, b64] of durum.fotolar) await dosyaYaz(yol, b64, `Fotoğraf: ${yol.split("/").pop()}`);
    durum.fotolar.clear();
    await dosyaYaz(YOL.bagiscilar, b64Kodla(jsonMetni(durum.belge)), mesaj);
    durum.site.sonGuncelleme = bugun();
    await dosyaYaz(YOL.site, b64Kodla(jsonMetni(durum.site)), "Son güncelleme tarihi");
    durum.degisiklikler = []; durum.siteDegisti = false;
    bildir("Yayınlandı! Site 1–2 dakika içinde güncellenir.");
    panoCiz();
  } catch (e) {
    const neden = e.durum === 409 || e.durum === 422
      ? "Dosya bu arada başka biri tarafından değiştirilmiş. Değişikliklerinizi not alıp sayfayı yenileyin."
      : e.durum === 401 || e.durum === 403 ? "Token geçersiz ya da yazma izni yok. Bağlantı ayarlarını kontrol edin."
      : `Yayınlanamadı (${e.detay || e.message}).`;
    bildir(neden, true);
  } finally {
    d.textContent = "Siteye yayınla";
    cubukGuncelle();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (durum.degisiklikler.length) { e.preventDefault(); e.returnValue = ""; }
});

/* ---------------- Ayarlar ---------------- */
function ayarFormDoldur() {
  const a = ayarlar();
  const f = $("#ayar-form").elements;
  // GitHub Pages'te çalışıyorsa depo bilgisini adresten tahmin et
  const gp = location.hostname.endsWith(".github.io");
  f.sahip.value = a.sahip || (gp ? location.hostname.split(".")[0] : "");
  f.depo.value = a.depo || (gp ? location.pathname.split("/")[1] || "" : "");
  f.dal.value = a.dal || "main";
  f.token.value = a.token || "";
}
$("#ayarlar-ac").addEventListener("click", () => { ayarFormDoldur(); $("#ayar-hata").textContent = ""; $("#ayarlar").showModal(); });
$("#baglan").addEventListener("click", async () => {
  const f = $("#ayar-form").elements;
  const yeni = { sahip: f.sahip.value.trim(), depo: f.depo.value.trim(), dal: f.dal.value.trim() || "main", token: f.token.value.trim() };
  if (!yeni.sahip || !yeni.depo || !yeni.token) { $("#ayar-hata").textContent = "Tüm alanları doldurun."; return; }
  if (durum.degisiklikler.length && !confirm("Yayınlanmamış değişiklikler var; bağlanınca veri GitHub'dan yeniden yüklenecek ve bu değişiklikler kaybolacak. Devam edilsin mi?")) return;
  const eski = localStorage.getItem(AYAR_ANAHTARI);
  localStorage.setItem(AYAR_ANAHTARI, JSON.stringify(yeni));
  try {
    const depo = await gh("");
    if (!depo.permissions?.push) throw Object.assign(new Error("Bu token ile depoya yazma izni yok."), { detay: "Bu token ile depoya yazma izni yok." });
    durum.sha = {};
    $("#ayarlar").close();
    await yukle();
    bildir("Bağlantı kuruldu.");
  } catch (e) {
    if (eski) localStorage.setItem(AYAR_ANAHTARI, eski); else localStorage.removeItem(AYAR_ANAHTARI);
    $("#ayar-hata").textContent = e.durum === 401 ? "Token geçersiz." : e.durum === 404 ? "Depo bulunamadı (ad ya da token izni yanlış)." : e.detay || e.message;
  }
});
$("#baglanti-kes").addEventListener("click", () => {
  localStorage.removeItem(AYAR_ANAHTARI);
  durum.sha = {};
  $("#ayarlar").close();
  baglantiGoster();
  bildir("Bağlantı kesildi; token bu tarayıcıdan silindi.");
});

/* ---------------- Sekmeler ---------------- */
$$(".sekme").forEach((s) => s.addEventListener("click", () => {
  $$(".sekme").forEach((x) => x.setAttribute("aria-pressed", String(x === s)));
  $$("[data-bolum]").forEach((b) => { b.hidden = b.dataset.bolum !== s.dataset.sekme; });
}));

yukle();
