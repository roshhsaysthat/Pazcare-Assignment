#!/usr/bin/env bash
# Build, serve the production build, run every end-to-end check, stop the server.
# Needs: Node, Python 3 with `pip install playwright`, and a Chromium for Playwright (`python3 -m playwright install chromium`).
set -u
cd "$(dirname "$0")/.."
PORT="${PORT:-4173}"
npm run build >/dev/null || { echo "build failed"; exit 1; }
npx vite preview --port "$PORT" --strictPort >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 30); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 0.5; done
status=0
for t in messaging reader booking; do
  echo "== $t"
  BASE="http://localhost:$PORT" python3 "tests/e2e/$t.py" || status=1
done
[ $status -eq 0 ] && echo "ALL PASSED" || echo "SOME FAILED"
exit $status
