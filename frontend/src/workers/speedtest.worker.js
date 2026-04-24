// SpeedPulse v11 Worker — XHR-based accurate measurement
const CF = 'https://speed.cloudflare.com';
const DL_STREAMS = 8;
const UL_STREAMS = 4;
const INTERVAL   = 150; // ms

self.onmessage = async (e) => {
    const { type } = e.data;

    // ── PING ─────────────────────────────────────────────────────────────────
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 15; i++) {
            const t = performance.now();
            try {
                await fetch(`${CF}/__down?bytes=1&nc=${Date.now()}${i}`, { cache: 'no-store', mode: 'cors' });
                pings.push(performance.now() - t);
            } catch (_) {}
            await new Promise(r => setTimeout(r, 50));
        }
        if (!pings.length) { self.postMessage({ type: 'PING_RESULT', value: 999 }); return; }
        pings.sort((a, b) => a - b);
        const trimmed = pings.slice(1, pings.length - 2); // drop min + top 2
        const median  = trimmed[Math.floor(trimmed.length / 2)];
        const jitter  = Math.round((trimmed[trimmed.length - 1] - trimmed[0]) / 2);
        self.postMessage({ type: 'PING_RESULT', value: Math.round(median), jitter });
    }

    // ── DOWNLOAD ──────────────────────────────────────────────────────────────
    if (type === 'DOWNLOAD') {
        const DURATION = 15000;
        const WARMUP   = 2000;
        const start    = performance.now();
        const byteLog  = []; // { t, b }
        const samples  = [];
        let stopped    = false;

        const spawnXHR = () => new Promise(resolve => {
            const loop = () => {
                if (stopped) { resolve(); return; }
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `${CF}/__down?bytes=35000000&r=${Math.random()}`, true);
                xhr.responseType = 'arraybuffer';
                xhr.setRequestHeader('Cache-Control', 'no-cache');
                let lastLoaded = 0;
                xhr.onprogress = (ev) => {
                    if (stopped) { xhr.abort(); return; }
                    const chunk = ev.loaded - lastLoaded;
                    lastLoaded  = ev.loaded;
                    byteLog.push({ t: performance.now(), b: chunk });
                };
                xhr.onloadend = () => { if (!stopped) loop(); else resolve(); };
                xhr.onerror   = () => { if (!stopped) loop(); else resolve(); };
                xhr.send();
            };
            loop();
        });

        const timer = setInterval(() => {
            const elapsed  = performance.now() - start;
            const progress = Math.min(100, (elapsed / DURATION) * 100);

            if (elapsed >= WARMUP) {
                const win    = 800;
                const cutoff = performance.now() - win;
                const wBytes = byteLog.filter(l => l.t >= cutoff).reduce((s, l) => s + l.b, 0);
                const mbps   = (wBytes * 8) / ((win / 1000) * 1024 * 1024);
                if (mbps > 0.1) {
                    samples.push(mbps);
                    self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: +mbps.toFixed(2), progress });
                }
                // Prune old
                while (byteLog.length && byteLog[0].t < performance.now() - 3000) byteLog.shift();
            } else {
                self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps: 0, progress: progress * 0.1 });
            }

            if (elapsed >= DURATION) {
                clearInterval(timer);
                stopped = true;
                const sorted = [...samples].sort((a, b) => a - b);
                const p95    = sorted[Math.floor(sorted.length * 0.95)] || 0;
                self.postMessage({ type: 'DOWNLOAD_RESULT', value: +p95.toFixed(2) });
            }
        }, INTERVAL);

        await Promise.allSettled(Array.from({ length: DL_STREAMS }, spawnXHR));
    }

    // ── UPLOAD ────────────────────────────────────────────────────────────────
    if (type === 'UPLOAD') {
        const DURATION   = 12000;
        const WARMUP     = 1800;
        const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
        const start      = performance.now();
        const byteLog    = [];
        const samples    = [];
        let stopped      = false;

        const buf = new Uint8Array(CHUNK_SIZE);
        crypto.getRandomValues(buf.subarray(0, 4096));
        for (let i = 4096; i < CHUNK_SIZE; i++) buf[i] = (i * 31 + 17) % 256;

        const timer = setInterval(() => {
            const elapsed  = performance.now() - start;
            const progress = Math.min(100, (elapsed / DURATION) * 100);

            if (elapsed >= WARMUP) {
                const win    = 900;
                const cutoff = performance.now() - win;
                const wBytes = byteLog.filter(l => l.t >= cutoff).reduce((s, l) => s + l.b, 0);
                const mbps   = (wBytes * 8) / ((win / 1000) * 1024 * 1024);
                if (mbps > 0.1) {
                    samples.push(mbps);
                    self.postMessage({ type: 'UPLOAD_UPDATE', mbps: +mbps.toFixed(2), progress });
                }
                while (byteLog.length && byteLog[0].t < performance.now() - 3000) byteLog.shift();
            } else {
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps: 0, progress });
            }

            if (elapsed >= DURATION) {
                clearInterval(timer);
                stopped = true;
                const sorted = [...samples].sort((a, b) => a - b);
                const p90    = sorted[Math.floor(sorted.length * 0.90)] || 0;
                self.postMessage({ type: 'UPLOAD_RESULT', value: +p90.toFixed(2) });
            }
        }, INTERVAL);

        const uploader = async () => {
            while (!stopped) {
                try {
                    const blob = new Blob([buf]);
                    await new Promise((res, rej) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', `${CF}/__up?nc=${Date.now()}${Math.random()}`, true);
                        xhr.upload.onprogress = (ev) => {
                            if (stopped) { xhr.abort(); return; }
                            byteLog.push({ t: performance.now(), b: ev.loaded });
                        };
                        xhr.onloadend = res;
                        xhr.onerror   = rej;
                        xhr.send(blob);
                    });
                } catch (_) {}
                await new Promise(r => setTimeout(r, 0));
            }
        };

        await Promise.allSettled(Array.from({ length: UL_STREAMS }, uploader));
    }
};
