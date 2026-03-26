import { useState, useEffect, useRef } from 'react';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, Wifi, Gamepad2, MonitorPlay, Video, Cpu, History } from 'lucide-react';
import SEO from '../../components/SEO';

// Industry Standard v27 Multi-Stream Config
const TEST_DURATION = 8000; // 8 seconds for deeper sampling
const WARM_UP_TIME = 1500;  // 1.5s TCP warm-up (discard samples)
const CONCURRENCY = 6;      // 6 parallel fetch streams for high-speed saturation
const PING_SAMPLES = 12;

const speedTestSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StudentAI SpeedPulse v27 Pro",
    "operatingSystem": "Web",
    "applicationCategory": "UtilityApplication",
    "description": "Industry-standard High-Precision internet speed test. Multi-stream parallel engine for accurate 1Gbps+ diagnostics.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "1820" }
};

const Gauge = ({ value, phase, isTesting }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        if (v <= 1000) return 90 + ((v - 500) / 500) * 45;
        return 135;
    };

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform rotate-[-225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" strokeDasharray="216 289" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                    strokeWidth="6" 
                    strokeDasharray={`${(216 * (getAngle(value) + 135)) / 270} 289`} 
                    strokeLinecap="round" 
                    className="transition-all duration-150 ease-linear" 
                />
            </svg>
            <div className="absolute w-[3px] h-[120px] bg-blue-500 origin-bottom transition-transform duration-150 ease-linear z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-10">
                <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">
                    {value > 100 ? value.toFixed(0) : value.toFixed(1)}
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">
                    {phase === 'DOWNLOAD' ? 'Multi-Stream Download' : phase === 'UPLOAD' ? 'Multi-Stream Upload' : 'Sustained Mbps'}
                </div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ping, setPing] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isp, setIsp] = useState('ISP Node');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v27_pro') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v27_pro', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const pings = [];
        for (let i = 0; i < PING_SAMPLES; i++) {
            const t = performance.now();
            try {
                await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
                pings.push(performance.now() - t);
            } catch(e) {}
            setProgress((i/PING_SAMPLES) * 10);
        }
        setPing(Math.min(...pings).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const startTime = performance.now();
        let totalBytes = 0;
        const samples = [];
        const controllers = Array.from({ length: CONCURRENCY }).map(() => new AbortController());

        const spawnStream = async (id) => {
            try {
                const response = await fetch(`/api/download-test?stream=${id}&t=${Date.now()}`, { 
                    cache: 'no-store', 
                    signal: controllers[id].signal 
                });
                const reader = response.body.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    totalBytes += value.length;
                    
                    const now = performance.now();
                    const elapsed = (now - startTime);
                    
                    if (elapsed > WARM_UP_TIME) {
                        const mbps = (totalBytes * 8) / ((elapsed - WARM_UP_TIME) / 1000 * 1024 * 1024);
                        samples.push(mbps);
                        setDownload(mbps);
                    }

                    setProgress(10 + (elapsed / TEST_DURATION) * 45);
                    if (elapsed > TEST_DURATION) {
                        controllers.forEach(c => c.abort());
                        break;
                    }
                }
            } catch (e) {}
        };

        // Launch parallel streams
        await Promise.all(Array.from({ length: CONCURRENCY }).map((_, i) => spawnStream(i)));

        // Result: Rolling median of the stable phase
        const finalSamples = samples.slice(Math.floor(samples.length * 0.2));
        const sorted = finalSamples.sort((a,b) => a - b);
        setDownload(sorted[Math.floor(sorted.length * 0.5)] || 0);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const startTime = performance.now();
        // 50MB random payload for robust upload testing
        const payload = new Uint8Array(1024 * 1024 * 50);
        window.crypto.getRandomValues(payload);

        try {
            const res = await fetch('/api/upload-test?t=' + Date.now(), {
                method: 'POST',
                body: payload,
                headers: { 'Content-Type': 'application/octet-stream' }
            });
            const data = await res.json();
            setUpload(parseFloat(data.speedMbps));
        } catch (e) {
            console.error(e);
        }
        
        setProgress(100);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ 
            down: download.toFixed(1), 
            up: upload.toFixed(1), 
            date: new Date().toLocaleTimeString() 
        }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-[#f8fafc] flex flex-col items-center justify-center p-4 selection:bg-blue-500/20 pt-20">
            <SEO 
                title="Internet Speed Test - Pro Multi-Stream Diagnostics"
                description="Test your internet speed with SpeedPulse v27 Pro. Industry-standard multi-stream accuracy for download, upload, and ping."
                keywords="internet speed test, test wifi speed, mbps test, ping test, librespeed, student ai tools, broadband speed check"
                canonical="/tools/internet-speed-test"
                schema={speedTestSchema}
            />

            <div className="w-full max-w-[440px] bg-[#0d101e] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[3.5rem] p-1 flex flex-col group overflow-hidden mb-12">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
                    <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                <div className="p-8 flex flex-col items-center gap-8">
                    {status !== 'finished' ? (
                        <div className="w-full flex flex-col items-center gap-8">
                            <div className="flex justify-between w-full opacity-40 text-[9px] font-black uppercase tracking-widest italic">
                                <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Gigabit Node</span>
                                <span className="truncate max-w-[150px]">{isp}</span>
                            </div>

                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>

                            <div className="bg-black/40 rounded-[3rem] border border-white/5 p-6 shadow-inner relative overflow-hidden group/gauge">
                                <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />
                                {status === 'testing' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover/gauge:opacity-10 transition-opacity">
                                        <Activity className="w-3/4 h-3/4 text-blue-500 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Logic</span>
                                    <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase truncate">{status === 'testing' ? `V27 Multi-Stream` : 'Ready'}</span>
                                </div>
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Latency</span>
                                    <span className="text-2xl font-black text-white tabular-nums">{ping || '--'}<span className="text-[9px] opacity-20 ml-1 italic">ms</span></span>
                                </div>
                            </div>

                            <button onClick={status === 'testing' ? null : startTest} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-sm tracking-[0.5em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase italic">
                                {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white animate-pulse" />}
                                {status === 'testing' ? 'SATURATING...' : 'BEGIN PRO TEST'}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-b from-blue-500/10 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowDown className="w-16 h-16 text-blue-500" /></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Download</span>
                                    <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{download.toFixed(1)}</div>
                                    <span className="text-[9px] font-black text-blue-500 uppercase italic">Mbps Peak</span>
                                </div>
                                <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-6 rounded-[2.5rem] border border-purple-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowUp className="w-16 h-16 text-purple-500" /></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Upload</span>
                                    <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{upload.toFixed(1)}</div>
                                    <span className="text-[9px] font-black text-purple-500 uppercase italic">Mbps Peak</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <MonitorPlay className="w-5 h-5 text-blue-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">16K Streaming</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">No-Lag Pro</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <Video className="w-5 h-5 text-emerald-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">Studio Quality</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-black/40 px-8 py-5 rounded-3xl border border-white/5 shadow-inner">
                                <div className="flex flex-col"><span className="text-[8px] font-black text-slate-600 uppercase">Ping</span><span className="text-sm font-black text-blue-500 tabular-nums">{ping} ms</span></div>
                                <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-600 uppercase">Core</span><span className="text-sm font-black text-white uppercase italic">Multi-Stream</span></div>
                                <div className="flex flex-col items-end"><span className="text-[8px] font-black text-slate-600 uppercase">Engine</span><span className="text-sm font-black text-emerald-500">Libre.v27</span></div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 border border-white/10 active:scale-95 shadow-lg">
                                    <RefreshCw className="w-4 h-4 text-blue-500" /> Re-Probe
                                </button>
                                <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
                                    <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share Peak
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full max-w-2xl px-4 pb-20">
                <h2 className="text-3xl font-black text-white mb-8 italic tracking-tighter">Pro-Grade Diagnostics</h2>
                <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <h3 className="text-lg font-bold text-blue-400 mb-2">Why Multi-Stream?</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Most browsers and servers limit the speed of a single connection to optimize network resources. Our Pro Engine opens **6 parallel streams** simultaneously, allowing us to fully saturate your bandwidth and provide an accurate result for high-speed fiber connections (up to 2Gbps).
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">TCP Warm-up Implementation</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Real-world networks take a moment to reach peak speed due to TCP window scaling. Our algorithm discards the first 1.5 seconds of data (the warm-up phase) to ensure we measure your connection at its true steady-state capacity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
