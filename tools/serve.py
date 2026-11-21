"""Local preview server for the GHANSHYAM GROUP site (no caching, so edits show on reload).

Run from the project folder:  python3 tools/serve.py   then open http://localhost:8765

It answers byte-range requests, as real web hosts do: Safari and iPhones will not
play a video from a server that cannot.
"""
import functools
import http.server
import os
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "ghanshyam-group"


class NoCache(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webm": "video/webm", ".webp": "image/webp", ".mp4": "video/mp4",
        ".webmanifest": "application/manifest+json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        self.range_left = None
        wanted = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not wanted or not os.path.isfile(path):
            return super().send_head()
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", wanted.strip())
        size = os.path.getsize(path)
        if not match or (not match[1] and not match[2]):
            return super().send_head()
        if match[1]:
            start, end = int(match[1]), min(int(match[2]) if match[2] else size - 1, size - 1)
        else:
            start, end = max(size - int(match[2]), 0), size - 1
        if start >= size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None
        source = open(path, "rb")
        source.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        self.range_left = end - start + 1
        return source

    def copyfile(self, source, outputfile):
        if self.range_left is None:
            return super().copyfile(source, outputfile)
        while self.range_left > 0:
            chunk = source.read(min(256 * 1024, self.range_left))
            if not chunk:
                break
            outputfile.write(chunk)
            self.range_left -= len(chunk)

    def log_message(self, format, *args):
        if "404" in str(args):
            super().log_message(format, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    handler = functools.partial(NoCache, directory=str(SITE))
    print(f"Serving {SITE} at http://localhost:{port}")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
