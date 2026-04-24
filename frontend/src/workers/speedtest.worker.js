// v10 Speed Test Worker — More Accurate Download + Upload
// Key improvements over v9:
//  - Upload: warmup period (1.5s), instantaneous per-interval speed (not cumulative avg)
//  - Upload: 1MB chunks → saturates fast connections (100Mbps+)
//  - Download: instantaneous window-based sampling (bytes in last 400ms)
//  - Ping: outlier removal (drop top 2), use median of remaining
//  - Final: p95 for download (capture peak), p85 for upload (more stable)

const CLOUDFLARE_BASE = 'https://speed.cloudflare.com';
const DOWNLOAD_CONCURRENCY = 6;  // more streams → better saturation
const UPLOAD_CONCURRENCY   = 4;
const SAMPLE_INTERVAL      = 250; // ms

self.onmessage = async (e) => {
    const { type } = e.data;

    // ─── PING ─────────────────────────────────────────────────────────────────
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 12; i++) {
            const t = performance.now();
            try {
                await fetch(`${CLOUDFLARE_BASE}/__down?bytes=1&nocache=${Date.now()}${i}`, {
                    cache: 'no-store', mode: 'cors'
                });
                pings.push(performance.now() - t);
            } catch (_) {}
        }
        if (pings.length === 0) {
            self.postMessage({ type: 'PING_RESULT', value: '999' });
            return;
        }
        pings.sort((a, b) => a - b);
        // Drop top 2 outliers, use median of rest
        const trimmed = pings.slice(0, Math.max(3, pings.length - 2));
        const median  = trimmed[Math.floor(trimmed.length / 2)];
        self.postMessage({ type: 'PING_RESULT', value: Math.round(median) });
    }

    // ─── DOWNLOAD ─────────────────────────────────────────────────────────────
    if (type === 'DOWNLOAD') {
        const TEST_DURATION = 12000; // ms
        const WARMUP        = 1800;  // ms — skip until connection saturated
        const startTime     = performance.now();

        // Track bytes in a rolling window for instantaneous speed
        const byteLog  = []; // [{ t, bytes }]
        let totalBytes = 0;
        let stopped    = false;
        const samples  = [];
        const controllers = [];

        const spawnStream = async () => {
            while (!stopped) {
                const ctrl = new AbortController();
                controllers.push(ctrl);
                try {
                    const res = await fetch(
                        `${CLOUDFLARE_BASE}/__down?bytes=30000000&r=${Math.random()}`,
                        { signal: ctrl.signal, cache: 'no-store', mode: 'cors' }
                    );
                    const reader = res.body.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done || stopped) break;
                        totalBytes += value.length;
                        byteLog.push({ t: performance.now(), b: value.length });
                    }
                } catch (_) {
                    if (stopped) break;
                }
            }
        };

        const sampleTimer = setInterval(() => {
            const elapsed  = performance.now() - startTime;
            const progress = Math.min(100, (elapsed / TEST_DURATION) * 100);

            if (elapsed >= WARMUP) {
                // Instantaneous speed: bytes received in last 600ms window
                const windowMs  = 600;
                const windowCut = performance.now() - windowMs;
                const windowBytes = byteLog
                    .filter(l => l.t >= windowCut)
                    .reduce((s, l) => s + l.b, 0);
                const mbps = (windowBytes * 8) / ((windowMs / 1000) * 1024 * 1024);

                if (mbps > 0) {
                    samples.push(mbps);
                    self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps, progress });
                }

                // Prune old entries to keep memory clean
                const pruneCut = performance.now() - 2000;
                while (byteLog.length > 0 && byteLog[0].t < pruneCut) byteLog.shift();
            } else {
                self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: 0, progress: progress * 0.15 });
            }

            if (elapsed >= TEST_DURATION) {
                clearInterval(sampleTimer);
                stopped = true;
                controllers.forEach(c => { try { c.abort(); } catch (_) {} });

                // p95 — captures peak throughput, standard for download
                const sorted = [...samples].sort((a, b) => a - b);
                const p95    = sorted[Math.floor(sorted.length * 0.95)] || 0;
                self.postMessage({ type: 'DOWNLOAD_RESULT', value: p95 });
            }
        }, SAMPLE_INTERVAL);

        await Promise.allSettled(
            Array.from({ length: DOWNLOAD_CONCURRENCY }, () => spawnStream())
        );
    }

    // ─── UPLOAD ───────────────────────────────────────────────────────────────
    if (type === 'UPLOAD') {
        const TEST_DURATION = 12000; // ms
        const WARMUP        = 1500;  // ms — skip ramp-up phase
        // 1MB chunks: fast enough to not stall pipes, large enough to saturate
        const CHUNK_SIZE    = 1024 * 1024;
        const startTime     = performance.now();
        const byteLog       = []; // [{ t, bytes }] for instantaneous calc
        const samples       = [];
        let stopped         = false;

        // Pre-fill with random-ish data (prevents compression by network stack)
        const chunkData = new Uint8Array(CHUNK_SIZE);
        crypto.getRandomValues(chunkData.subarray(0, Math.min(4096, CHUNK_SIZE)));
        for (let i = 4096; i < CHUNK_SIZE; i++) chunkData[i] = (i * 7 + 13) % 256;

        const sampleTimer = setInterval(() => {
            const elapsed  = performance.now() - startTime;
            const progress = Math.min(100, (elapsed / TEST_DURATION) * 100);

            if (elapsed >= WARMUP) {
                // Instantaneous speed: bytes uploaded in last 700ms
                const windowMs    = 700;
                const windowCut   = performance.now() - windowMs;
                const windowBytes = byteLog
                    .filter(l => l.t >= windowCut)
                    .reduce((s, l) => s + l.b, 0);
                const mbps = (windowBytes * 8) / ((windowMs / 1000) * 1024 * 1024);

                if (mbps > 0) {
                    samples.push(mbps);
                    self.postMessage({ type: 'UPLOAD_UPDATE', mbps, progress });
                }

                // Prune
                const pruneCut = performance.now() - 2000;
                while (byteLog.length > 0 && byteLog[0].t < pruneCut) byteLog.shift();
            } else {
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps: 0, progress });
            }

            if (elapsed >= TEST_DURATION) {
                clearInterval(sampleTimer);
                stopped = true;

                // p85 for upload — more stable than p90 (upload is noisier)
                const sorted = [...samples].sort((a, b) => a - b);
                const p85    = sorted[Math.floor(sorted.length * 0.85)] || 0;
                self.postMessage({ type: 'UPLOAD_RESULT', value: p85 });
            }
        }, SAMPLE_INTERVAL);

        const uploadWorker = async () => {
            while (!stopped) {
                try {
                    const blob     = new Blob([chunkData]);
                    const t0       = performance.now();
                    const res      = await fetch(
                        `${CLOUDFLARE_BASE}/__up?nocache=${Date.now()}${Math.random()}`,
                        { method: 'POST', body: blob, mode: 'cors', cache: 'no-store' }
                    );
                    const duration = performance.now() - t0;
                    if ((res.ok || res.status === 200) && !stopped) {
                        // Log completion time at end of transfer (more accurate)
                        byteLog.push({ t: performance.now(), b: CHUNK_SIZE });
                    }
                } catch (_) {
                    // network hiccup — retry
                }
                await new Promise(r => setTimeout(r, 0));
            }
        };

        await Promise.allSettled(
            Array.from({ length: UPLOAD_CONCURRENCY }, () => uploadWorker())
        );
    }
};
