// v6 Multi-Threaded Speed Test Engine (Worker)
const DOWNLOAD_CONCURRENCY = 8;
const UPLOAD_CONCURRENCY = 4;
const DEFAULT_DOWNLOAD_FILE = "20mb.bin"; // Faster but enough for parallel
const UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB per stream

self.onmessage = async (e) => {
    const { type, config } = e.data;
    
    if (type === 'PING') {
        const pings = [];
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Math.random());
            pings.push(performance.now() - start);
        }
        self.postMessage({ type: 'PING_RESULT', value: (pings.reduce((a, b) => a + b) / 10).toFixed(0) });
    }

    if (type === 'DOWNLOAD') {
        const startTime = performance.now();
        let totalBytes = 0;
        const controllers = Array.from({ length: DOWNLOAD_CONCURRENCY }).map(() => new AbortController());

        const spawnStream = async (id) => {
            try {
                const res = await fetch(`/api/speed-test/${DEFAULT_DOWNLOAD_FILE}?cache=${Math.random()}`, {
                    signal: controllers[id].signal,
                    cache: 'no-store'
                });
                const reader = res.body.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    totalBytes += value.length;
                    
                    const elapsed = (performance.now() - startTime) / 1000;
                    const mbps = (totalBytes * 8) / (elapsed * 1024 * 1024);
                    
                    self.postMessage({ type: 'DOWNLOAD_UPDATE', mbps, progress: Math.min(100, (elapsed / 10) * 100) });
                }
            } catch (err) {}
        };

        const testPromise = Promise.all(Array.from({ length: DOWNLOAD_CONCURRENCY }).map((_, i) => spawnStream(i)));
        
        // Ensure test runs for at least 10s or until files finish
        await new Promise(resolve => setTimeout(resolve, 10000));
        controllers.forEach(c => c.abort());
        await testPromise;

        const finalElapsed = (performance.now() - startTime) / 1000;
        const finalMbps = (totalBytes * 8) / (finalElapsed * 1024 * 1024);
        self.postMessage({ type: 'DOWNLOAD_RESULT', value: finalMbps });
    }

    if (type === 'UPLOAD') {
        const startTime = performance.now();
        let totalBytes = 0;
        const blob = new Blob([new Uint8Array(UPLOAD_SIZE)]);

        const spawnUpload = async () => {
            try {
                await fetch('/api/upload-test?t=' + Math.random(), {
                    method: 'POST',
                    body: blob
                });
                totalBytes += UPLOAD_SIZE;
                const elapsed = (performance.now() - startTime) / 1000;
                const mbps = (totalBytes * 8) / (elapsed * 1024 * 1024);
                self.postMessage({ type: 'UPLOAD_UPDATE', mbps });
            } catch (err) {}
        };

        // Parallel uploads
        const uploadPromises = [];
        for(let i=0; i<4; i++) uploadPromises.push(spawnUpload());
        
        await Promise.all(uploadPromises);
        const finalElapsed = (performance.now() - startTime) / 1000;
        const finalMbps = (totalBytes * 8) / (finalElapsed * 1024 * 1024);
        self.postMessage({ type: 'UPLOAD_RESULT', value: finalMbps });
    }
};
