import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, Share2, Copy, CheckCircle2 } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 8; // 8MB
const UPLOAD_SIZE = 1024 * 1024 * 4;   // 4MB

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ping, setPing] = useState(null);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v13') || '[]'));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem('st_history_v13', JSON.stringify(history));
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 4; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
        }
        setPing((samples.reduce((a, b) => a + b) / samples.length).toFixed(1));
    };

    const runDownload = () => {
        return new Promise((resolve, reject) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, true);
            xhr.responseType = 'blob';
            
            xhr.onprogress = (e) => {
                const elapsed = (performance.now() - start) / 1000;
                if (elapsed > 0.05) { 
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setDownload(mbps);
                    setProgress(10 + (e.loaded / DOWNLOAD_SIZE) * 40);
                }
            };

            xhr.onload = () => {
                const totalTime = (performance.now() - start) / 1000;
                const finalMbps = (DOWNLOAD_SIZE * 8) / (totalTime * 1000000);
                setDownload(finalMbps);
                resolve();
            };
            xhr.onerror = () => reject();
            xhr.send();
        });
    };

    const runUpload = () => {
        return new Promise((resolve, reject) => {
            setPhase('UPLOAD');
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload-test?t=${Date.now()}`, true);
            
            xhr.upload.onprogress = (e) => {
                const elapsed = (performance.now() - start) / 1000;
                if (elapsed > 0.05) {
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setUpload(mbps);
                    setProgress(50 + (e.loaded / UPLOAD_SIZE) * 50);
                }
            };

            xhr.onload = () => {
                const totalTime = (performance.now() - start) / 1000;
                const finalMbps = (UPLOAD_SIZE * 8) / (totalTime * 1000000);
                setUpload(finalMbps);
                resolve();
            };
            xhr.onerror = () => reject();
            xhr.send(new Uint8Array(UPLOAD_SIZE));
        });
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(null); setProgress(0);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
            setHistory(h => [{ ping, down: download.toFixed(1), up: upload.toFixed(1), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen bg-[#050710] text-white flex items-center justify-center p-4">
            <Helmet><title>SpeedPulse Mini — Accurate Speed Test</title></Helmet>

            <div className="w-full max-w-[400px] bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-800">
                    <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6]" style={{ width: `${progress}%` }} />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase">Speed<span className="text-blue-500">Pulse</span></h1>
                    <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Diagnostic Engine v13</div>
                </div>

                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Compact Circle Gauge */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                                strokeWidth="8" 
                                strokeDasharray="282.7" 
                                strokeDashoffset={282.7 - (282.7 * (phase === 'UPLOAD' ? upload : download)) / 100} 
                                className="transition-all duration-300"
                                strokeLinecap="round" 
                            />
                        </svg>
                        <div className="text-center z-10">
                            <div className="text-5xl font-black tabular-nums">
                                {status === 'testing' ? (phase === 'UPLOAD' ? upload.toFixed(1) : download.toFixed(1)) : (status === 'finished' ? download.toFixed(1) : '0')}
                            </div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mbps</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-black/40 p-4 rounded-3xl border border-white/5 text-center">
                            <div className="text-[8px] font-black text-blue-400 tracking-widest uppercase mb-1 flex items-center justify-center gap-1"><ArrowDown className="w-2.5 h-2.5" /> DOWN</div>
                            <div className="text-xl font-black text-white">{download > 0 ? download.toFixed(1) : '--'}</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-3xl border border-white/5 text-center">
                            <div className="text-[8px] font-black text-purple-400 tracking-widest uppercase mb-1 flex items-center justify-center gap-1"><ArrowUp className="w-2.5 h-2.5" /> UP</div>
                            <div className="text-xl font-black text-white">{upload > 0 ? upload.toFixed(1) : '--'}</div>
                        </div>
                    </div>

                    <div className="flex w-full gap-4 items-center px-4">
                        <div className="flex-1 flex gap-4 text-[10px] font-bold text-slate-500">
                            <div className="flex gap-2"><span className="opacity-40">Ping</span> <span className="text-blue-400">{ping || '--'}ms</span></div>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(`⬇️ ${download.toFixed(1)} ⬆️ ${upload.toFixed(1)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                        </button>
                    </div>

                    <div className="w-full pt-4 border-t border-white/5">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                                {status === 'finished' ? 'TEST AGAIN' : 'START TEST'}
                            </button>
                        ) : (
                            <div className="flex flex-center gap-2 justify-center py-2 h-[52px]">
                                {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Micro History */}
                {history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="text-[8px] font-black text-slate-700 tracking-[0.4em] uppercase mb-3 text-center">Recent Runs</div>
                        <div className="space-y-2">
                            {history.slice(0, 2).map((log, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] opacity-40 hover:opacity-100 transition-opacity">
                                    <span>{log.date}</span>
                                    <div className="flex gap-4 font-black italic">
                                        <span className="text-blue-500">↓{log.down}</span>
                                        <span className="text-purple-500">↑{log.up}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
