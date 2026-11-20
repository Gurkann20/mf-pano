// Veri yükleme ve yardımcılar.
// İsim eklemek/çıkarmak için bu dosyaya DOKUNMA: data/bagiscilar.json düzenlenir.


let onbellek = null;

async function getir(yol) {
  const yanit = await fetch(yol, { cache: "no-cache" });
  if (!yanit.ok) throw new Error(`${yol} yüklenemedi (${yanit.status})`);
  return yanit.json();
}

export async function veriYukle() {
  if (onbellek) return onbellek;
  const [b, t, s] = await Promise.all([
    getir("data/bagiscilar.json"),
    getir("data/tarihce.json").catch(() => ({ olaylar: [] })),
    getir("data/site.json").catch(() => ({})),
  ]);
  const pano = { sutun: s.pano?.sutun || 4, satir: s.pano?.satir || 14 };
  const liste = (b.bagiscilar || [])
    .map(temizle)
    .filter((k) => k.id && k.ad)
    .sort((x, y) => x.satir - y.satir || x.sutun - y.sutun);
  onbellek = { liste, olaylar: t.olaylar || [], site: s, pano };
  return onbellek;
}

// İç not ve beklenmeyen alanlar sayfaya asla taşınmaz.
function temizle(k) {
  const { notlar, ...g } = k; // eslint-disable-line no-unused-vars
  return {
    ...g,
    satir: Number(g.satir) || 99,
    sutun: Number(g.sutun) || 99,
    biyografi: Array.isArray(g.biyografi) ? g.biyografi.filter(Boolean) : [],
    katki: Array.isArray(g.katki) ? g.katki.filter((x) => x && x.metin) : [],
    kaynaklar: Array.isArray(g.kaynaklar) ? g.kaynaklar.filter((x) => x && x.ad) : [],
    ozet: g.ozet || "",
  };
}

/** Biyografi bu modda gösterilebilir mi? */
export function bioGoster(k) {
  return k.yayinla !== false && k.biyografi.length > 0;
}

/** Türkçe karakter duyarsız karşılaştırma için sadeleştirir: "Özkardeş" → "ozkardes" */
export function sadelestir(s = "") {
  return String(s)
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ilkYil(k) {
  const yillar = k.katki.map((x) => parseInt(x.yil, 10)).filter((y) => y > 1800);
  return yillar.length ? Math.min(...yillar) : null;
}

/** Plaka üzerindeki yazım: kişilerde soyadı büyük harf (fiziksel panodaki gibi). */
export function plakaAdi(k, tam = false) {
  const ad = (!tam && k.kisaAd) || k.ad;
  if (k.tur !== "kisi") return ad;
  const parcalar = ad.trim().split(/\s+/);
  if (parcalar.length < 2) return ad;
  parcalar[parcalar.length - 1] = parcalar[parcalar.length - 1].toLocaleUpperCase("tr");
  return parcalar.join(" ");
}

const ATLA = new Set(["prof.", "dr.", "doç.", "dç.", "a.ş.", "ve", "–", "-", "ltd.", "şti."]);
export function basHarfler(k) {
  const kelimeler = k.ad.split(/\s+/).filter((w) => !ATLA.has(w.toLocaleLowerCase("tr")) && /\p{L}/u.test(w));
  if (!kelimeler.length) return "?";
  const secilen = k.tur === "kisi" ? [kelimeler[0], kelimeler[kelimeler.length - 1]] : kelimeler.slice(0, 2);
  return [...new Set(secilen)].map((w) => w[0].toLocaleUpperCase("tr")).join("");
}

export function yasamMetni(k) {
  const y = k.yasam;
  if (!y || (!y.dogum && !y.vefat)) return "";
  if (y.dogum && y.vefat) return `${y.dogum} – ${y.vefat}`;
  if (y.dogum) return `d. ${y.dogum}`;
  return `ö. ${y.vefat}`;
}

export function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Yalnızca http(s) bağlantılara izin ver. */
export function guvenliUrl(u) {
  try {
    const url = new URL(u, location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}
