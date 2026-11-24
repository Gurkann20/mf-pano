// Görsel efektler: eğim, parıltı, kazıma.
// Kural: yalnızca transform ve opacity hareket eder; reduced-motion açıksa hepsi kapanır.

const hareketAzMq = matchMedia("(prefers-reduced-motion: reduce)");
export const hareketAz = () => hareketAzMq.matches;
export const inceImlec = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
export const dokunmatik = () => matchMedia("(hover: none)").matches;

/** Öğe ekrana girince bir kez çağırır. */
export function gorununce(ogeler, geriCagir, secenek = {}) {
  const liste = [...ogeler];
  if (!("IntersectionObserver" in window) || hareketAz()) {
    liste.forEach((o) => geriCagir(o));
    return;
  }
  const io = new IntersectionObserver((girisler) => {
    for (const g of girisler) {
      if (g.isIntersecting) {
        io.unobserve(g.target);
        geriCagir(g.target);
      }
    }
  }, { threshold: secenek.esik ?? 0.15, rootMargin: secenek.kenar ?? "0px 0px -8% 0px" });
  liste.forEach((o) => io.observe(o));
}

/** Ad metnini kazıma animasyonu için harf harf böler. Erişilebilir metin ayrıca verilir. */
export function kaziHtml(metin, esc) {
  const harfler = [...metin];
  const sure = Math.min(1100, Math.max(520, harfler.length * 32));
  let i = 0;
  const kelimeler = metin.split(" ").map((kelime) => {
    const ic = [...kelime].map((h) => {
      const gecikme = Math.round((i++ / harfler.length) * sure);
      return `<span class="harf" style="--hg:${gecikme}ms">${esc(h)}</span>`;
    }).join("");
    i++; // boşluk
    return `<span class="kelime">${ic}</span>`;
  });
  return { html: kelimeler.join(" "), sure };
}

/** Plakaları ekrana girdikçe kazır; dokunmatikte ardından parıltı geçirir. */
export function kaziGozle(plakalar, ilkKaziBitince) {
  if (hareketAz()) return;
  const liste = [...plakalar];
  let ilk = true;
  liste.forEach((p) => p.classList.add("kazinacak"));
  gorununce(liste, (p) => {
    if (ilk && ilkKaziBitince) { ilk = false; setTimeout(ilkKaziBitince, 1500); }
    const gecikme = Number(p.dataset.kaziGecikme || 0);
    const sure = parseInt(p.style.getPropertyValue("--kazi-sure"), 10) || 900;
    setTimeout(() => {
      p.classList.add("kaziniyor");
      // Kazıma bitince sınıfları kaldır: pano gizlenip yeniden açıldığında
      // (kişi sayfasından dönüş) tarayıcı bütün harf animasyonlarını baştan oynatmasın.
      setTimeout(() => p.classList.remove("kazinacak", "kaziniyor"), sure + 450);
    }, gecikme);
  }, { esik: 0.4 });
}

/** 3B eğim (masaüstü) ve dokunma tepkisi (telefon). */
export function egimBagla(kap) {
  if (hareketAz()) return;
  if (inceImlec()) {
    const MAKS = 8;
    kap.addEventListener("pointermove", (e) => {
      const p = e.target.closest(".plaka");
      if (!p || p.classList.contains("pano-alt-plaka")) return;
      const r = p.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      p.classList.add("egik");
      p.style.setProperty("--ry", `${(x * MAKS * 2).toFixed(2)}deg`);
      p.style.setProperty("--rx", `${(-y * MAKS * 2).toFixed(2)}deg`);
    });
    kap.addEventListener("pointerout", (e) => {
      const p = e.target.closest(".plaka");
      if (!p || p.contains(e.relatedTarget)) return;
      p.classList.remove("egik");
      p.style.setProperty("--rx", "0deg");
      p.style.setProperty("--ry", "0deg");
    });
  } else {
    kap.addEventListener("pointerdown", (e) => {
      const p = e.target.closest(".plaka");
      if (!p) return;
      p.classList.remove("dokundu");
      void p.offsetWidth;
      p.classList.add("dokundu");
    }, { passive: true });
    kap.addEventListener("animationend", (e) => {
      if (e.animationName === "dokun") e.target.classList.remove("dokundu");
    });
  }
}

/** Pano ekrana girerken eğik açıdan karşıya döner (kaydırmaya bağlı). */
export function duvarEgimiBagla(cerceve) {
  // PAÜ sayfasındaki iframe'de kaydıran üst sayfadır; iPhone'da eğim yarıda kalıp
  // panonun üstünü ve MF amblemini kesiyordu. Orada pano hep düz durur.
  if (hareketAz() || !cerceve || document.documentElement.classList.contains("gomulu")) return;
  let bekliyor = false;
  const guncelle = () => {
    bekliyor = false;
    const ust = cerceve.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, (innerHeight - ust) / (innerHeight * 0.75)));
    cerceve.style.setProperty("--egim", (1 - p).toFixed(3));
  };
  const iste = () => { if (!bekliyor) { bekliyor = true; requestAnimationFrame(guncelle); } };
  addEventListener("scroll", iste, { passive: true });
  addEventListener("resize", iste, { passive: true });
  guncelle();
}
