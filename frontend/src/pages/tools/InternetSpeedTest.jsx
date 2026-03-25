import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, Share2, Copy, CheckCircle2 } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 10; // 10MB
const UPLOAD_SIZE = 1024 * 1024 * 6;   // 6MB

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ping, setPing] = useState(null);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v14') || '[]'));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem('st_history_v14', JSON.stringify(history));
    }, [history]);

    const calculateMbps = (bytes, timeInMs) => {
        const seconds = timeInMs / 1000;
        const bits = bytes * 8;
        return (bits / seconds) / 1000000;
    };

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch('/api/ping?cache=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
        }
        setPing((samples.reduce((a, b) => a + b) / samples.length).toFixed(2));
    };

    const runDownloadIteration = () => {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&cache=${Date.now()}`, true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            
            xhr.onprogress = (e) => {
                const elapsed = performance.now() - start;
                if (elapsed > 100) { 
                    const currentMbps = calculateMbps(e.loaded, elapsed);
                    setDownload(currentMbps);
                    setProgress(p => p + (e.loaded / DOWNLOAD_SIZE) * 13); // Iterative progress
                }
            };

            xhr.onload = () => {
                const elapsed = performance.now() - start;
                const finalMbps = calculateMbps(DOWNLOAD_SIZE, elapsed);
                resolve(finalMbps);
            };
            xhr.onerror = () => reject();
            xhr.send();
        });
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const results = [];
        for (let i = 0; i < 3; i++) { // Run 3 times for accuracy
            const res = await runDownloadIteration();
            results.push(res);
        }
        const avgMbps = results.reduce((a, b) => a + b) / results.length;
        setDownload(avgMbps);
    };

    const runUpload = () => {
        return new Promise((resolve, reject) => {
            setPhase('UPLOAD');
            const data = new Uint8Array(UPLOAD_SIZE);
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload-test?cache=${Date.now()}`, true);
            xhr.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

            xhr.upload.onprogress = (e) => {
                const elapsed = performance.now() - start;
                if (elapsed > 100) {
                    const currentMbps = calculateMbps(e.loaded, elapsed);
                    setUpload(currentMbps);
                    setProgress(50 + (e.loaded / UPLOAD_SIZE) * 50);
                }
            };

            xhr.onload = () => {
                const elapsed = performance.now() - start;
                const finalMbps = calculateMbps(UPLOAD_SIZE, elapsed);
                setUpload(finalMbps);
                resolve();
            };
            xhr.onerror = () => reject();
            xhr.send(data);
        });
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(null); setProgress(0);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
            setHistory(h => [{ ping, down: download.toFixed(2), up: upload.toFixed(2), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen bg-[#050710] text-white flex items-center justify-center p-4">
            <Helmet><title>Free Internet Speed Test Online | StudentAI Tools</title></Helmet>

            <div className="w-full max-w-[400px] bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-800">
                    <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6]" style={{ width: `${progress}%` }} />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase">Speed<span className="text-blue-500">Pulse</span></h1>
                    <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Diagnostic Engine v14</div>
                </div>

                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Circle Gauge */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                                strokeWidth="8" 
                                strokeDasharray="282.7" 
                                strokeDashoffset={282.7 - (282.7 * (phase === 'UPLOAD' ? Math.min(upload, 100) : Math.min(download, 100))) / 100} 
                                className="transition-all duration-300"
                                strokeLinecap="round" 
                            />
                        </svg>
                        <div className="text-center z-10">
                            <div className="text-4xl font-black tabular-nums">
                                {(status === 'testing' ? (phase === 'UPLOAD' ? upload : download) : (status === 'finished' ? download : 0)).toFixed(2)}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mbps</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-black/40 p-4 rounded-3xl border border-white/5 text-center">
                            <div className="text-[8px] font-black text-blue-400 tracking-widest uppercase mb-1 flex items-center justify-center gap-1"><ArrowDown className="w-2.5 h-2.5" /> DOWN</div>
                            <div className="text-xl font-black text-white">{download > 0 ? download.toFixed(2) : '--'}</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-3xl border border-white/5 text-center">
                            <div className="text-[8px] font-black text-purple-400 tracking-widest uppercase mb-1 flex items-center justify-center gap-1"><ArrowUp className="w-2.5 h-2.5" /> UP</div>
                            <div className="text-xl font-black text-white">{upload > 0 ? upload.toFixed(2) : '--'}</div>
                        </div>
                    </div>

                    <div className="flex w-full gap-4 items-center px-4">
                        <div className="flex-1 flex gap-2 text-[10px] font-bold text-slate-500">
                            <span className="opacity-40 uppercase">Ping</span> <span className="text-blue-400">{ping || '--'}ms</span>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(`⬇️ ${download.toFixed(2)} ⬆️ ${upload.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-white/5 rounded-xl">
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                        </button>
                    </div>

                    <div className="w-full pt-4 border-t border-white/5">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-lg transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                                {status === 'finished' ? 'TEST AGAIN' : 'START TEST'}
                            </button>
                        ) : (
                            <div className="flex gap-2 justify-center py-2 h-[52px] items-center">
                                <Activity className="w-6 h-6 text-blue-500 animate-spin" />
                                <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest animate-pulse">{phase}...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[8px] font-black text-slate-700 tracking-[0.4em] uppercase mb-3 text-center">HISTORY (Mbps)</div>
                    <div className="space-y-2">
                        {history.length > 0 ? history.map((log, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] opacity-40 hover:opacity-100 transition-opacity">
                                <span>{log.date}</span>
                                <div className="flex gap-4 font-black">
                                    <span className="text-blue-500">↓{log.down}</span>
                                    <span className="text-purple-500">↑{log.up}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[9px] text-slate-800 text-center py-2 italic text-center">No recent records</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
