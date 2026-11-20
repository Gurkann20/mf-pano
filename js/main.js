// Açılış ve yönlendirme (hash tabanlı):
//   #/            ana sayfa
//   #/pano        ana sayfa → panoya kaydır  (ayrıca #/hikaye)
//   #/kisi/<id>   kişi / kurum sayfası
//   #/tarihce     ana sayfa → tarihçeye kaydır (eski bağlantılar için)

import { veriYukle, esc } from "./data.js?v=20261120f";
import { panoCiz, plakaBul, iletisimBagla } from "./board.js?v=20261120f";
import { kisiCiz, metaSifirla } from "./person.js?v=20261120f";
import { cetvelCiz } from "./timeline.js?v=20261120f";
import { hareketAz, gorununce } from "./effects.js?v=20261120f";
import { t } from "./i18n.js?v=20261120f";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const gorunumler = {
  ana: document.getElementById("gorunum-ana"),
  kisi: document.getElementById("gorunum-kisi"),
};
const HEDEFLER = { pano: "pano-bolum", hikaye: "hikaye" };

let veri = null;
let mevcut = null;
let anaKaydirma = null;
let sonKisiId = null;

function rotaCoz() {
  let h = location.hash.replace(/^#\/?/, "");
  try { h = decodeURIComponent(h); } catch { /* bozuk adres */ }
  const [bolum, id] = h.split("/");
  if (bolum === "kisi" && id) return { gorunum: "kisi", id };
  if (bolum === "tarihce") return { gorunum: "ana", hedef: "hikaye" };
  return { gorunum: "ana", hedef: HEDEFLER[bolum] };
}

function kaydir(y, yumusak) {
  window.scrollTo({ top: y, behavior: yumusak && !hareketAz() ? "smooth" : "instant" });
}
function ogeyeKaydir(id, yumusak) {
  const o = document.getElementById(id);
  if (o) kaydir(o.getBoundingClientRect().top + window.scrollY - 12, yumusak);
}

function odakla(kok) {
  const h = kok.querySelector("h1");
  if (!h) return;
  h.setAttribute("tabindex", "-1");
  h.focus({ preventScroll: true });
}

function goster(rota, onceki) {
  if (onceki === "ana" && rota.gorunum !== "ana") anaKaydirma = window.scrollY;
  for (const [ad, el] of Object.entries(gorunumler)) el.hidden = ad !== rota.gorunum;
  document.body.dataset.gorunum = rota.gorunum;

  if (rota.gorunum === "kisi") {
    kisiCiz(gorunumler.kisi, veri, rota.id);
    sonKisiId = rota.id;
    kaydir(0);
    odakla(gorunumler.kisi);
  } else {
    metaSifirla();
    document.title = t.sayfaBasligi;
    gorunumler.kisi.innerHTML = "";
    if (onceki === "kisi" && anaKaydirma !== null && (!rota.hedef || rota.hedef === "pano-bolum")) {
      kaydir(anaKaydirma);
      const p = sonKisiId && plakaBul(sonKisiId);
      if (p) {
        p.style.viewTransitionName = "plaka-aktif";
        // ekran okuyucu yerini kaybetmesin diye odak plakaya döner, ama mavi odak çerçevesi
        // yalnızca kullanıcı klavyeyle gezinmeye başlayınca görünür
        p.classList.add("sessiz-odak");
        p.addEventListener("blur", () => p.classList.remove("sessiz-odak"), { once: true });
        p.focus({ preventScroll: true });
      }
    } else if (rota.hedef) {
      ogeyeKaydir(rota.hedef, onceki === "ana");
    } else if (onceki && onceki !== "ana") {
      kaydir(anaKaydirma ?? 0);
    }
  }
  mevcut = rota.gorunum;
}

function git() {
  if (!veri) return;
  const rota = rotaCoz();
  const onceki = mevcut;
  const gecis = onceki !== null && (onceki !== rota.gorunum || rota.gorunum === "kisi");
  if (gecis && document.startViewTransition && !hareketAz()) {
    const vt = document.startViewTransition(() => goster(rota, onceki));
    vt.finished.finally(() => {
      document.querySelectorAll("#pano .plaka").forEach((p) => { p.style.viewTransitionName = ""; });
    });
  } else {
    goster(rota, onceki);
  }
}

// Plakaya tıklanınca o plaka kişi sayfasındaki büyük plakaya "dönüşür".
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a) return;
  const p = a.closest("#pano .plaka");
  if (p && !hareketAz()) p.style.viewTransitionName = "plaka-aktif";
  // Aynı adrese tekrar tıklanınca da çalışsın (ör. #/pano)
  if (a.getAttribute("href") === location.hash) { e.preventDefault(); git(); }
});
window.addEventListener("hashchange", git);

function altBilgi() {
  const s = veri.site;
  const tarih = s.sonGuncelleme && new Date(s.sonGuncelleme);
  const el = document.querySelector("[data-son-guncelleme]");
  if (tarih && !isNaN(tarih)) {
    el.dateTime = s.sonGuncelleme;
    el.textContent = tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }
  if (s.iletisim?.adres) document.querySelector("[data-adres]").textContent = s.iletisim.adres;
}

async function basla() {

  try {
    veri = await veriYukle();
  } catch (hata) {
    console.error(hata);
    document.getElementById("pano").innerHTML = `<li class="yukleniyor">Plakalar yüklenemedi. Sayfayı yenileyin.</li>`;
    return;
  }

  panoCiz(veri);
  cetvelCiz(document.getElementById("cetvel"), veri);
  gorununce(document.querySelectorAll(".ataturk-bolum"), (b) => b.classList.add("acik"), { esik: 0.3 });
  // başlıktaki ışık yalnızca ilk açılışta geçsin; panoya her dönüşte yeniden oynamasın
  setTimeout(() => document.body.classList.add("acilis-bitti"), 3000);
  iletisimBagla(veri.site);
  altBilgi();
  git();
}

basla();
