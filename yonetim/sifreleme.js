// Yönetim paneli girişi: GitHub erişim anahtarı, kullanıcı adı + şifreyle şifrelenip
// yonetim/giris.json içinde saklanır. Site statik olduğu için şifreyi kontrol eden bir sunucu
// yoktur; şifre yalnızca anahtarı çözmek için kullanılır ve hiçbir yere kaydedilmez.
// Tarayıcının Web Crypto API'si: PBKDF2-SHA256 (600.000 tur) + AES-256-GCM.

const TUR = 600000;
const kodla = (bayt) => btoa(String.fromCharCode(...new Uint8Array(bayt)));
const coz64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// Kullanıcı adı da anahtarın parçası: ikisinden biri yanlışsa çözme başarısız olur.
async function anahtarTuret(kullanici, sifre, tuz, tur) {
  const malzeme = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(`${kullanici.trim().toLocaleLowerCase("tr")}\n${sifre}`),
    "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: tuz, iterations: tur },
    malzeme, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

/** Erişim anahtarını şifreler; giris.json içeriğini döner. */
export async function sifrele(token, kullanici, sifre, depo) {
  const tuz = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const anahtar = await anahtarTuret(kullanici, sifre, tuz, TUR);
  const veri = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, anahtar, new TextEncoder().encode(token));
  return {
    _aciklama: "Yönetim paneli girişi. GitHub erişim anahtarı kullanıcı adı ve şifreyle şifrelidir (PBKDF2-SHA256 + AES-256-GCM). Şifre bu dosyada yoktur. Yeniden oluşturmak için yonetim/kurulum.html.",
    surum: 1, sahip: depo.sahip, depo: depo.depo, dal: depo.dal || "main",
    tur: TUR, tuz: kodla(tuz), iv: kodla(iv), veri: kodla(veri),
  };
}

/** giris.json'daki anahtarı çözer. Kullanıcı adı ya da şifre yanlışsa hata fırlatır. */
export async function coz(giris, kullanici, sifre) {
  const anahtar = await anahtarTuret(kullanici, sifre, coz64(giris.tuz), giris.tur || TUR);
  try {
    const duz = await crypto.subtle.decrypt({ name: "AES-GCM", iv: coz64(giris.iv) }, anahtar, coz64(giris.veri));
    return new TextDecoder().decode(duz);
  } catch {
    throw Object.assign(new Error("Kullanıcı adı veya şifre hatalı."), { yanlisSifre: true });
  }
}
