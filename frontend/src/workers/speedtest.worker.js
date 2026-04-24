// SpeedPulse v12 Worker — fetch + readable streams (CORS-safe)
// XHR onprogress had CORS blocking issues with Cloudflare CDN.
// fetch ReadableStream works correctly for real-time byte counting.

const CF         = 'https://speed.cloudflare.com';
const DL_STREAMS = 6;
const UL_STREAMS = 4;
const INTERVAL   = 150; // ms

self.onmessage = async (e) => {
    const { type } = e.data;

    // ── PING ──────────────────────────────────────────────────────────────────
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 12; i++) {
            const t = performance.now();
            try {
                await fetch(`${CF}/__down?bytes=1&nc=${Date.now()}${i}`, {
                    cache: 'no-store', mode: 'cors'
                });
                pings.push(performance.now() - t);
            } catch (_) {}
            await new Promise(r => setTimeout(r, 40));
        }
        if (!pings.length) { self.postMessage({ type: 'PING_RESULT', value: 999, jitter: 0 }); return; }
        pings.sort((a, b) => a - b);
        const trimmed = pings.slice(1, Math.max(3, pings.length - 2)); // drop best + worst
        const median  = trimmed[Math.floor(trimmed.length / 2)];
        const jitter  = Math.round((trimmed[trimmed.length - 1] - trimmed[0]) / 2);
        self.postMessage({ type: 'PING_RESULT', value: Math.round(median), jitter });
    }

    // ── DOWNLOAD ──────────────────────────────────────────────────────────────
    if (type === 'DOWNLOAD') {
        const DURATION = 14000; // ms
        const WARMUP   = 2000;  // ms — let streams saturate first
        const start    = performance.now();
        const byteLog  = []; // { t: timestamp, b: bytes }
        const samples  = [];
        let stopped    = false;
        const aborts   = [];

        // Each stream fetches large files in a loop, reading chunks as they arrive
        const spawnStream = async () => {
            while (!stopped) {
                const ctrl = new AbortController();
                aborts.push(ctrl);
                try {
                    const res = await fetch(
                        `${CF}/__down?bytes=30000000&r=${Math.random()}`,
                        { signal: ctrl.signal, cache: 'no-store', mode: 'cors' }
                    );
                    const reader = res.body.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done || stopped) break;
                        // *** KEY: push every chunk as it arrives ***
                        byteLog.push({ t: performance.now(), b: value.byteLength });
                    }
                } catch (_) {
                    if (stopped) break;
                }
            }
        };

        const timer = setInterval(() => {
            const elapsed  = performance.now() - start;
            const progress = Math.min(100, (elapsed / DURATION) * 100);

            if (elapsed >= WARMUP) {
                // Instantaneous: bytes received in last 600ms window
                const winMs  = 600;
                const cutoff = performance.now() - winMs;
                const wBytes = byteLog.filter(l => l.t >= cutoff).reduce((s, l) => s + l.b, 0);
                const mbps   = (wBytes * 8) / ((winMs / 1000) * 1024 * 1024);

                if (mbps > 0.05) {
                    samples.push(mbps);
                    self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: +mbps.toFixed(2), progress });
                }

                // Prune old log entries (keep last 2s only)
                const pruneCut = performance.now() - 2500;
                while (byteLog.length && byteLog[0].t < pruneCut) byteLog.shift();
            } else {
                // During warmup show 0 but update progress bar
                self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: 0, progress: progress * 0.1 });
            }

            if (elapsed >= DURATION) {
                clearInterval(timer);
                stopped = true;
                aborts.forEach(a => { try { a.abort(); } catch (_) {} });

                if (samples.length === 0) {
                    self.postMessage({ type: 'DOWNLOAD_RESULT', value: 0 });
                    return;
                }
                // p95 — captures peak without extreme outliers
                const sorted = [...samples].sort((a, b) => a - b);
                const p95    = sorted[Math.floor(sorted.length * 0.95)];
                self.postMessage({ type: 'DOWNLOAD_RESULT', value: +p95.toFixed(2) });
            }
        }, INTERVAL);

        // Start all download streams concurrently
        await Promise.allSettled(Array.from({ length: DL_STREAMS }, spawnStream));
    }

    // ── UPLOAD ────────────────────────────────────────────────────────────────
    if (type === 'UPLOAD') {
        const DURATION   = 12000;       // ms
        const WARMUP     = 1500;        // ms
        const CHUNK_SIZE = 512 * 1024;  // 512KB — good balance for all connections
        const start      = performance.now();
        const byteLog    = [];
        const samples    = [];
        let stopped      = false;

        // Pseudo-random data — prevents network compression
        const buf = new Uint8Array(CHUNK_SIZE);
        for (let i = 0; i < CHUNK_SIZE; i++) buf[i] = (i * 31 + 17) % 256;

        const timer = setInterval(() => {
            const elapsed  = performance.now() - start;
            const progress = Math.min(100, (elapsed / DURATION) * 100);

            if (elapsed >= WARMUP) {
                const winMs  = 800;
                const cutoff = performance.now() - winMs;
                const wBytes = byteLog.filter(l => l.t >= cutoff).reduce((s, l) => s + l.b, 0);
                const mbps   = (wBytes * 8) / ((winMs / 1000) * 1024 * 1024);

                if (mbps > 0.05) {
                    samples.push(mbps);
                    self.postMessage({ type: 'UPLOAD_UPDATE', mbps: +mbps.toFixed(2), progress });
                }

                const pruneCut = performance.now() - 2500;
                while (byteLog.length && byteLog[0].t < pruneCut) byteLog.shift();
            } else {
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps: 0, progress });
            }

            if (elapsed >= DURATION) {
                clearInterval(timer);
                stopped = true;
                if (samples.length === 0) { self.postMessage({ type: 'UPLOAD_RESULT', value: 0 }); return; }
                const sorted = [...samples].sort((a, b) => a - b);
                const p90    = sorted[Math.floor(sorted.length * 0.90)];
                self.postMessage({ type: 'UPLOAD_RESULT', value: +p90.toFixed(2) });
            }
        }, INTERVAL);

        const uploadLoop = async () => {
            while (!stopped) {
                try {
                    // Log bytes BEFORE fetch starts (tracks when data is sent)
                    const sentAt = performance.now();
                    const blob   = new Blob([buf]);
                    const res    = await fetch(
                        `${CF}/__up?nc=${Date.now()}${Math.random()}`,
                        { method: 'POST', body: blob, mode: 'cors', cache: 'no-store' }
                    );
                    // On completion: log at midpoint of transfer for better accuracy
                    if (!stopped && (res.ok || res.status === 200)) {
                        const duration = (performance.now() - sentAt) / 2;
                        byteLog.push({ t: sentAt + duration, b: CHUNK_SIZE });
                    }
                } catch (_) { /* ignore, retry */ }
                await new Promise(r => setTimeout(r, 0));
            }
        };

        await Promise.allSettled(Array.from({ length: UL_STREAMS }, uploadLoop));
    }
};
