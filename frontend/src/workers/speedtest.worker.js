// v7 Refined Web Worker (95th-Percentile Peak Engine)
const DOWNLOAD_CONCURRENCY = 8;
const UPLOAD_CONCURRENCY = 4;
const WARM_UP_TIME = 1500; // 1.5s warmup
const SAMPLE_INTERVAL = 50; // 50ms (20x per sec)

self.onmessage = async (e) => {
    const { type } = e.data;
    
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 12; i++) {
            const start = performance.now();
            try {
                await fetch('/api/ping?t=' + Math.random(), { cache: 'no-store' });
                pings.push(performance.now() - start);
            } catch (err) {}
        }
        const avg = pings.sort((a,b)=>a-b).slice(1, -1).reduce((a,b)=>a+b, 0) / (pings.length - 2);
        self.postMessage({ type: 'PING_RESULT', value: avg.toFixed(0) });
    }

    if (type === 'DOWNLOAD') {
        const startTime = performance.now();
        let totalBytes = 0;
        const samples = [];
        const controllers = Array.from({ length: DOWNLOAD_CONCURRENCY }).map(() => new AbortController());

        const spawnStream = async (id) => {
            try {
                const res = await fetch(`/api/speed-test/20mb.bin?cache=${Math.random()}`, {
                    signal: controllers[id].signal,
                    cache: 'no-store'
                });
                const reader = res.body.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    totalBytes += value.length;
                }
            } catch (err) {}
        };

        // Aggregator loop
        const sampleTimer = setInterval(() => {
            const elapsed = performance.now() - startTime;
            if (elapsed > WARM_UP_TIME) {
                const mbps = (totalBytes * 8) / ((elapsed - WARM_UP_TIME) / 1000 * 1024 * 1024);
                samples.push(mbps);
                self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps, progress: Math.min(100, (elapsed / 10000) * 100) });
            }
        }, SAMPLE_INTERVAL);

        const downloadPromises = Array.from({ length: DOWNLOAD_CONCURRENCY }).map((_, i) => spawnStream(i));
        
        await new Promise(resolve => setTimeout(resolve, 8000)); // 8s collection
        clearInterval(sampleTimer);
        controllers.forEach(c => c.abort());
        
        // Final: 95th Percentile Filter
        const sorted = samples.sort((a,b) => a - b);
        const peak = sorted[Math.floor(sorted.length * 0.95)] || 0;
        self.postMessage({ type: 'DOWNLOAD_RESULT', value: peak });
    }

    if (type === 'UPLOAD') {
        const startTime = performance.now();
        let totalBytes = 0;
        const samples = [];
        const UPLOAD_SIZE = 8 * 1024 * 1024; // 8MB
        const blob = new Blob([new Uint8Array(UPLOAD_SIZE)]);

        const sampleTimer = setInterval(() => {
            const elapsed = (performance.now() - startTime);
            if (elapsed > 500) {
                const mbps = (totalBytes * 8) / (elapsed / 1000 * 1024 * 1024);
                samples.push(mbps);
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps });
            }
        }, SAMPLE_INTERVAL);

        const spawnUpload = async () => {
            while (performance.now() - startTime < 6000) { // 6s upload phase
                try {
                    await fetch('/api/upload-test?t=' + Math.random(), {
                        method: 'POST',
                        body: blob
                    });
                    totalBytes += UPLOAD_SIZE;
                } catch (err) { break; }
            }
        };

        await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }).map(spawnUpload));
        clearInterval(sampleTimer);

        const sorted = samples.sort((a,b) => a - b);
        const peak = sorted[Math.floor(sorted.length * 0.95)] || 0;
        self.postMessage({ type: 'UPLOAD_RESULT', value: peak });
    }
};
