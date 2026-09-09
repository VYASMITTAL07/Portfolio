"""Local preview server.

Same as `python -m http.server`, except it tells the browser never to cache.
Without that you edit styles.css, hit reload, and still see the old page.

    python dev-server.py          # http://localhost:4173
    python dev-server.py 5000     # a different port
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    print(f"Serving this folder on http://localhost:{port} (Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
