"""Yerel önizleme sunucusu: tarayıcının eski CSS/JS'i önbellekten göstermesini engeller.

Kullanım (proje klasöründe):  python tools/sunucu.py   →  http://localhost:8765
"""
import functools, http.server, os, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765


class OnbelleksizIsleyici(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


http.server.ThreadingHTTPServer.allow_reuse_address = True
sunucu = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), functools.partial(OnbelleksizIsleyici, directory=KOK))
print(f"Önizleme: http://localhost:{PORT}  (durdurmak için Ctrl+C)")
sunucu.serve_forever()
