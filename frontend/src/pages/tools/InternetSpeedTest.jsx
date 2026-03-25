import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Share2, Copy, CheckCircle2 } from 'lucide-react';

// Configuration
const DOWNLOAD_SIZE = 1024 * 1024 * 10; // 10MB
const UPLOAD_SIZE = 1024 * 1024 * 5;   // 5MB

const getQuality = (mbps) => {
    if (mbps >= 50) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (mbps >= 25) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (mbps >= 10) return { label: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { label: 'Slow', color: 'text-red-400', bg: 'bg-red-400/10' };
};

const Gauge = ({ value, label, isTesting, phase }) => {
    const angle = (value / 100) * 270 - 135; // Map 0-100 to -135 to 135 degrees
    const constrainedAngle = Math.min(Math.max(angle, -135), 135);
    
    return (
        <div className="relative flex flex-col items-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Gauge Background */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="188.5" strokeDashoffset="47.1" className="text-slate-800" strokeLinecap="round" />
                    <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                        strokeWidth="8" 
                        strokeDasharray="188.5" 
                        strokeDashoffset={188.5 - (188.5 * Math.min(value, 100) * 0.75) / 100} 
                        className="transition-all duration-300 ease-out"
                        strokeLinecap="round" 
                    />
                </svg>

                {/* Needle */}
                <div 
                    className="absolute w-1 h-32 bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-500 ease-out rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    style={{ transform: `rotate(${constrainedAngle}deg)`, bottom: '50%' }}
                />

                {/* Center Value */}
                <div className="text-center z-10 pt-4">
                    <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                        {Math.round(value)}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mbps</div>
                </div>
            </div>
            <div className="mt-4 px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{label}</span>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); // idle, testing, finished, error
    const [phase, setPhase] = useState(''); // PING, DOWNLOAD, UPLOAD
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [ping, setPing] = useState(null);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v7') || '[]'));
    const [copied, setCopied] = useState(false);

    const xhrRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('st_history_v7', JSON.stringify(history));
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        setProgress(10);
        const samples = [];
        for (let i = 0; i < 4; i++) {
            const start = Date.now();
            await fetch('/api/ping?t=' + start);
            samples.push(Date.now() - start);
        }
        setPing(Math.round(samples.reduce((a, b) => a + b) / samples.length));
    };

    const runDownload = () => {
        return new Promise((resolve, reject) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            xhrRef.current = new XMLHttpRequest();
            xhrRef.current.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, true);
            xhrRef.current.responseType = 'blob';

            xhrRef.current.onprogress = (e) => {
                const elapsed = (performance.now() - start) / 1000;
                if (elapsed > 0) {
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setDownload(mbps);
                    setProgress(20 + (e.loaded / DOWNLOAD_SIZE) * 40);
                }
            };

            xhrRef.current.onload = () => resolve();
            xhrRef.current.onerror = () => reject('Download Failed');
            xhrRef.current.send();
        });
    };

    const runUpload = () => {
        return new Promise((resolve, reject) => {
            setPhase('UPLOAD');
            const data = new Uint8Array(UPLOAD_SIZE);
            const start = performance.now();
            xhrRef.current = new XMLHttpRequest();
            xhrRef.current.open('POST', `/api/upload-test?t=${Date.now()}`, true);

            xhrRef.current.upload.onprogress = (e) => {
                const elapsed = (performance.now() - start) / 1000;
                if (elapsed > 0) {
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setUpload(mbps);
                    setProgress(60 + (e.loaded / UPLOAD_SIZE) * 40);
                }
            };

            xhrRef.current.onload = () => resolve();
            xhrRef.current.onerror = () => reject('Upload Failed');
            xhrRef.current.send(data);
        });
    };

    const startTest = async () => {
        setStatus('testing'); setProgress(0); setDownload(0); setUpload(0); setPing(null); setError(null);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
            setHistory(h => [{ ping: ping, down: download, up: upload, date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch (e) {
            setError(typeof e === 'string' ? e : 'Test interupted');
            setStatus('error');
        }
    };

    const shareResults = () => {
        const text = `My Internet Speed: ⬇️ ${Math.round(download)} Mbps | ⬆️ ${Math.round(upload)} Mbps | 🌍 StudentAI Tools`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const quality = getQuality(download);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
            <Helmet>
                <title>Free Internet Speed Test – Check Download, Upload & Ping Online</title>
                <meta name="description" content="Test your internet speed instantly. Measure download speed, upload speed, and ping with our fast and accurate online speed test tool." />
            </Helmet>

            <div className="max-w-4xl mx-auto px-4">
                {/* High-End Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                        <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Enterprise Diagnostic Tool</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Speed<span className="text-blue-500">Pulse</span></h1>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">Professional grade network analysis powered by StudentAI infrastructure.</p>
                </div>

                {/* Main Test Area */}
                <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                        <div className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_#3b82f6]" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="flex flex-col items-center py-6">
                        <Gauge 
                            value={phase === 'UPLOAD' ? upload : download} 
                            label={phase || 'READY'} 
                            isTesting={status === 'testing'}
                            phase={phase}
                        />

                        <div className="mt-12 w-full max-w-sm">
                            {status === 'idle' || status === 'finished' || status === 'error' ? (
                                <button onClick={startTest} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2rem] text-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3">
                                    <Activity className="w-6 h-6" /> {status === 'finished' ? 'TEST AGAIN' : 'START TEST'}
                                </button>
                            ) : (
                                <div className="text-center animate-pulse">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Diagnostic in progress...</div>
                                    <div className="text-xs font-bold text-blue-400 italic">Capturing atomic stream packets</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {status === 'finished' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><ArrowDown className="w-3 h-3 text-blue-500" /> DOWNLOAD</div>
                            <div className="text-4xl font-black text-white">{Math.round(download)} <span className="text-sm text-slate-600">Mbps</span></div>
                        </div>
                        <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><ArrowUp className="w-3 h-3 text-purple-500" /> UPLOAD</div>
                            <div className="text-4xl font-black text-white">{Math.round(upload)} <span className="text-sm text-slate-600">Mbps</span></div>
                        </div>
                        <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center">
                            <div className={`px-4 py-1 rounded-full ${quality.bg} ${quality.color} text-[10px] font-black uppercase tracking-widest mb-1`}>{quality.label}</div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase italic">Network Quality</div>
                        </div>
                    </div>
                )}

                {/* Ads Placeholder */}
                <div className="mt-12 p-8 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">Advertisement - StudentAI Recommended</p>
                    <div className="h-24 flex items-center justify-center text-slate-800 font-bold italic">AdSense Unit Placeholder</div>
                </div>

                {/* Tools Footer */}
                <div className="mt-12 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" /> Recent Tests</h3>
                            <button onClick={shareResults} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                            </button>
                        </div>
                        <div className="space-y-3">
                            {history.map((log, i) => (
                                <div key={i} className="flex justify-between items-center text-[11px] bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <span className="text-slate-600">{log.date}</span>
                                    <div className="flex gap-4 font-black">
                                        <span className="text-blue-400">⬇️ {Math.round(log.down)}</span>
                                        <span className="text-purple-400">⬆️ {Math.round(log.up)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
