// v9 Speed Test Worker — Accurate Download + Upload
// Download: parallel streams from Cloudflare CDN
// Upload: sequential timed chunks, bytes counted on completion

const DOWNLOAD_CONCURRENCY = 4;
const UPLOAD_CONCURRENCY = 3;
const SAMPLE_INTERVAL = 200; // ms

const CLOUDFLARE_BASE = 'https://speed.cloudflare.com';

self.onmessage = async (e) => {
    const { type } = e.data;

    // ─── PING ──────────────────────────────────────────────────────────────────
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            try {
                await fetch(`${CLOUDFLARE_BASE}/__down?bytes=1&t=${Date.now()}`, {
                    cache: 'no-store',
                    mode: 'cors'
                });
                pings.push(performance.now() - start);
            } catch (_) {}
        }
        if (pings.length === 0) {
            self.postMessage({ type: 'PING_RESULT', value: '999' });
            return;
        }
        pings.sort((a, b) => a - b);
        const trimmed = pings.slice(1, Math.max(2, pings.length - 1));
        const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
        self.postMessage({ type: 'PING_RESULT', value: avg.toFixed(0) });
    }

    // ─── DOWNLOAD ──────────────────────────────────────────────────────────────
    if (type === 'DOWNLOAD') {
        const TEST_DURATION = 10000; // ms
        const WARMUP = 1500;         // ms
        const startTime = performance.now();
        let totalBytes = 0;
        let warmupBytes = 0;
        let warmupDone = false;
        const samples = [];
        const controllers = [];
        let stopped = false;

        const spawnStream = async () => {
            while (!stopped) {
                const ctrl = new AbortController();
                controllers.push(ctrl);
                try {
                    const res = await fetch(
                        `${CLOUDFLARE_BASE}/__down?bytes=25000000&r=${Math.random()}`,
                        { signal: ctrl.signal, cache: 'no-store', mode: 'cors' }
                    );
                    const reader = res.body.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done || stopped) break;
                        totalBytes += value.length;
                    }
                } catch (_) {
                    if (stopped) break;
                }
            }
        };

        const sampleTimer = setInterval(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(100, (elapsed / TEST_DURATION) * 100);

            if (!warmupDone && elapsed >= WARMUP) {
                warmupDone = true;
                warmupBytes = totalBytes;
            }

            if (warmupDone) {
                const measuredBytes = totalBytes - warmupBytes;
                const measuredTimeSec = (elapsed - WARMUP) / 1000;
                if (measuredTimeSec > 0) {
                    const mbps = (measuredBytes * 8) / (measuredTimeSec * 1024 * 1024);
                    samples.push(mbps);
                    self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps, progress });
                }
            } else {
                self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: 0, progress: progress * 0.15 });
            }

            if (elapsed >= TEST_DURATION) {
                clearInterval(sampleTimer);
                stopped = true;
                controllers.forEach(c => { try { c.abort(); } catch (_) {} });
                const sorted = [...samples].sort((a, b) => a - b);
                const p90 = sorted[Math.floor(sorted.length * 0.90)] || 0;
                self.postMessage({ type: 'DOWNLOAD_RESULT', value: p90 });
            }
        }, SAMPLE_INTERVAL);

        // Spawn concurrent download streams
        await Promise.allSettled(
            Array.from({ length: DOWNLOAD_CONCURRENCY }, () => spawnStream())
        );
    }

    // ─── UPLOAD ────────────────────────────────────────────────────────────────
    if (type === 'UPLOAD') {
        const TEST_DURATION = 8000; // ms
        const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk (smaller = more completions = better accuracy)
        const startTime = performance.now();
        const samples = [];
        let totalBytes = 0;
        let stopped = false;

        // Pre-generate random chunk
        const chunkData = new Uint8Array(CHUNK_SIZE);
        for (let i = 0; i < 256; i++) chunkData[i] = i; // fill start, rest is zeros — fine for throughput

        const sampleTimer = setInterval(() => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(100, (elapsed / TEST_DURATION) * 100);

            if (elapsed > 300 && totalBytes > 0) {
                const mbps = (totalBytes * 8) / ((elapsed / 1000) * 1024 * 1024);
                samples.push(mbps);
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps, progress });
            }

            if (elapsed >= TEST_DURATION) {
                clearInterval(sampleTimer);
                stopped = true;
                const sorted = [...samples].sort((a, b) => a - b);
                const p90 = sorted[Math.floor(sorted.length * 0.90)] || 0;
                self.postMessage({ type: 'UPLOAD_RESULT', value: p90 });
            }
        }, SAMPLE_INTERVAL);

        // Each "worker" does back-to-back chunk uploads
        const uploadWorker = async () => {
            while (!stopped) {
                const chunkStart = performance.now();
                try {
                    const blob = new Blob([chunkData]);
                    const res = await fetch(
                        `${CLOUDFLARE_BASE}/__up?t=${Date.now()}`,
                        {
                            method: 'POST',
                            body: blob,
                            mode: 'cors',
                            cache: 'no-store',
                        }
                    );
                    if (res.ok || res.status === 200) {
                        // Only count bytes AFTER successful upload
                        totalBytes += CHUNK_SIZE;
                    }
                } catch (_) {
                    // network error — ignore and retry
                }
                // Tiny yield to allow sampleTimer to fire
                await new Promise(r => setTimeout(r, 0));
            }
        };

        await Promise.allSettled(
            Array.from({ length: UPLOAD_CONCURRENCY }, () => uploadWorker())
        );
    }
};
