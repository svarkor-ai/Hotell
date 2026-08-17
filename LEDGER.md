# LEDGER — Hotell shoppable demo (parent MC#80)

**Goal:** Make the Hotell repo a fully functional, shippable, shoppable hotel booking demo per the repo specs (no IoT).
**DoD:** spec §12 (16 success metrics) verified + app reachable in a browser (hosting).

## Module status
- [x] T1 Spec verification (§12) — svarkor ran it directly (board refuses a standalone dobbie verify card without onfail; verifying returned work is my verify discipline). **16/16 metrics PASS** (VERIFIED this session).
- [x] App functional on local port **8501** — /health, /api/rooms/ (4), /api/bookings/, /api/calendar/ all 200; book + cancel + double-book-400 all VERIFIED. Demo DB clean (only Anna Andersson booking).
- [ ] T2 Hosting on vm106 — gunilla card **80.1** (queued, waiting runner cron). Git-mediated-app-hosting pipeline.

## Open questions
- None blocking code. Hosting landning pending.

## Notes
- Port 8000 is owned by chromadb — cannot use it for the app (gunilla's 2026-08-12 unit file was therefore never installed at 8000; correct route is the vm106 git pipeline, port range 8100-8199).
