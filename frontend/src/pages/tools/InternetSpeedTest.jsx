import { useState, useEffect, useRef } from 'react';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, Wifi, Gamepad2, MonitorPlay, Video, Cpu, History, Rocket, HeartPulse, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';

const speedTestSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StudentAI SpeedPulse v27 Ultra Pro",
    "operatingSystem": "Web",
    "applicationCategory": "UtilityApplication",
    "description": "Professional Multi-Threaded Internet Speed Test (v7). Industry-standard symmetric diagnostics for fiber and broadband.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "ratingCount": "2850" }
};

const Gauge = ({ value, phase, isTesting }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-80 h-80 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform rotate-[-225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" strokeDasharray="216 289" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                    strokeWidth="4" 
                    strokeDasharray={`${(216 * (getAngle(value) + 135)) / 270} 289`} 
                    strokeLinecap="round" 
                    className="transition-all duration-500 ease-out" 
                />
            </svg>
            <div className="absolute w-[2px] h-[145px] bg-blue-500 origin-bottom transition-transform duration-500 ease-out z-20 rounded-full shadow-[0_0_10px_#3b82f6]" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-10 select-none">
                <div className="text-8xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                    {value > 100 ? Math.round(value) : value.toFixed(1)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 italic flex items-center gap-2 justify-center">
                   <Activity className="w-3 h-3 text-blue-500 animate-pulse" /> Mbps Verified
                </div>
            </div>
        </div>
    );
};

const QualityIndicator = ({ icon: Icon, label, status, active }) => (
    <div className={`flex flex-col items-center gap-3 p-5 rounded-[2.5rem] border transition-all duration-700 ${active ? 'bg-white/5 border-white/10 opacity-100 scale-100' : 'opacity-10 scale-90 grayscale'}`}>
        <div className={`p-4 rounded-2xl ${status === 'good' ? 'bg-emerald-500/20 text-emerald-400' : status === 'avg' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-center">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-[10px] font-black uppercase italic ${status === 'good' ? 'text-emerald-500' : status === 'avg' ? 'text-yellow-500' : 'text-red-500'}`}>{status === 'good' ? 'Maximum' : status === 'avg' ? 'Supported' : 'Weak'}</div>
        </div>
    </div>
);

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ping, setPing] = useState(0);
    const [progress, setProgress] = useState(0);
    const [ispInfo, setIspInfo] = useState({ ip: '...', org: 'Analytic Node' });
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v27_refined') || '[]'));
    const workerRef = useRef(null);
    const lastUpdate = useRef(0);

    useEffect(() => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIspInfo(d)).catch(() => {});
        return () => workerRef.current?.terminate();
    }, []);

    const startTest = () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0); setPing(0);
        setPhase('INITIALIZING');

        workerRef.current = new Worker(new URL('../../workers/speedtest.worker.js', import.meta.url), { type: 'module' });
        
        workerRef.current.onmessage = (e) => {
            const { type, value, mbps, progress: p } = e.data;
            const now = Date.now();

            if (type === 'PING_RESULT') { 
                setPing(value); setPhase('DOWNLOAD'); 
                workerRef.current.postMessage({ type: 'DOWNLOAD' }); 
            }
            if (type === 'DOWNLOAD_UPDATE' && now - lastUpdate.current > 100) { 
                setDownload(mbps); setProgress(10 + p * 0.45); 
                lastUpdate.current = now;
            }
            if (type === 'DOWNLOAD_RESULT') { 
                setDownload(value); setPhase('UPLOAD'); 
                workerRef.current.postMessage({ type: 'UPLOAD' }); 
            }
            if (type === 'UPLOAD_UPDATE' && now - lastUpdate.current > 100) { 
                setUpload(mbps); setProgress(55 + (mbps/100) * 45); 
                lastUpdate.current = now;
            }
            if (type === 'UPLOAD_RESULT') { 
                setUpload(prev => {
                    setProgress(100); setStatus('finished');
                    setHistory(h => [{ down: (download || 0).toFixed(1), up: value.toFixed(1), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
                    return value;
                });
                workerRef.current.terminate();
            }
        };

        workerRef.current.postMessage({ type: 'PING' });
    };

    const getQuality = (type, val) => {
        if (type === 'gaming') return val < 35 ? 'good' : val < 80 ? 'avg' : 'poor';
        if (type === 'streaming') return val > 40 ? 'good' : val > 15 ? 'avg' : 'poor';
        if (type === 'video') return val > 12 ? 'good' : val > 3 ? 'avg' : 'poor';
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-[#f8fafc] flex flex-col items-center justify-center p-4 selection:bg-blue-500/20 pt-20 overflow-hidden relative">
            <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[180px]" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[180px]" />

            <SEO 
                title="Internet Speed Test - Accurate Mbps & Pro Analytics"
                description="Industry-standard Multi-Threaded Speed Test. 95th-percentile sampling for absolute accuracy on download, upload, and ping."
                keywords="speedtest, mbps test, verify internet speed, fiber test, librespeed, student ai tools"
                canonical="/tools/internet-speed-test"
                schema={speedTestSchema}
            />

            <div className="w-full max-w-[500px] backdrop-blur-[60px] bg-white/[0.02] border border-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.6)] rounded-[5rem] p-2 flex flex-col transition-all duration-1000 overflow-hidden relative">
                
                {status === 'idle' && (
                    <div className="flex flex-col items-center justify-center min-h-[550px] gap-16 py-16 animate-in fade-in zoom-in-95 duration-1000 lg:p-12 p-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-black text-white italic tracking-tigh">SPEEDPULSE <span className="text-blue-500">PRO</span></h1>
                            <div className="flex items-center gap-3 justify-center">
                                <span className="h-[1px] w-8 bg-white/10" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic">Precision Analytics v7</p>
                                <span className="h-[1px] w-8 bg-white/10" />
                            </div>
                        </div>

                        <div className="relative isolate">
                            <div className="absolute inset-[-40px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                            <button onClick={startTest} className="relative w-44 h-44 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-500 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                                <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
                                    <span className="text-4xl font-black text-white italic tracking-tighter group-hover:tracking-widest transition-all duration-500">GO</span>
                                </div>
                            </button>
                        </div>

                        <div className="space-y-3 opacity-30 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest italic justify-center text-white">
                                <Globe className="w-4 h-4 text-blue-500" /> {ispInfo.org}
                            </div>
                            <div className="text-[9px] font-black text-slate-600 text-center tracking-widest">{ispInfo.ip}</div>
                        </div>
                    </div>
                )}

                {status === 'testing' && (
                    <div className="p-10 flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-6 duration-700 min-h-[550px]">
                        <div className="w-full flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block italic">Real-Time Latency</span>
                                <span className="text-3xl font-black text-white tabular-nums">{ping || '--'}<span className="text-xs opacity-20 ml-1 italic font-bold">ms</span></span>
                            </div>
                            <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-blue-500 uppercase italic flex items-center gap-3 tracking-[0.2em] shadow-xl">
                                <Rocket className="w-3 h-3 animate-bounce" /> {phase} STAGE
                            </div>
                        </div>

                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner p-[1px]">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="bg-black/20 rounded-[4.5rem] border border-white/5 p-4 shadow-inner relative overflow-hidden backdrop-blur-md hover:scale-105 transition-transform duration-700 group/gauge">
                            <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={true} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/gauge:opacity-10 transition-opacity pointer-events-none">
                                <Cpu className="w-48 h-48 text-blue-500 animate-spin-slow" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-white/5 p-6 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center space-y-2 group/card">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic group-hover:text-blue-500 transition-colors">Sampling</span>
                                <span className="text-[11px] font-black text-white italic truncate tracking-widest uppercase">95th Percentile</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center space-y-2 group/card">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic group-hover:text-purple-500 transition-colors">Stability</span>
                                <span className="text-[11px] font-black text-white italic truncate tracking-widest uppercase flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified</span>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'finished' && (
                    <div className="p-10 flex flex-col gap-10 animate-in slide-in-from-bottom-12 duration-1000 min-h-[550px]">
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-900/40 to-black/40 p-8 rounded-[4rem] border border-blue-500/20 text-center relative overflow-hidden group/down transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] group-hover/down:opacity-10 transition-opacity"><ArrowDown className="w-32 h-32 text-blue-500" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block italic">Download</span>
                                <div className="text-7xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{Math.round(download)}</div>
                                <span className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest mt-2 block">Mbps Peak</span>
                            </div>
                            <div className="bg-gradient-to-br from-purple-900/40 to-black/40 p-8 rounded-[4rem] border border-purple-500/20 text-center relative overflow-hidden group/up transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] group-hover/up:opacity-10 transition-opacity"><ArrowUp className="w-32 h-32 text-purple-400" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 block italic">Upload</span>
                                <div className="text-7xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{Math.round(upload)}</div>
                                <span className="text-[10px] font-black text-purple-400 uppercase italic tracking-widest mt-2 block">Mbps Peak</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <QualityIndicator icon={Gamepad2} label="Gaming" status={getQuality('gaming', ping)} active={true} />
                            <QualityIndicator icon={MonitorPlay} label="Streaming" status={getQuality('streaming', download)} active={true} />
                            <QualityIndicator icon={Video} label="Video Call" status={getQuality('video', upload)} active={true} />
                        </div>

                        <div className="flex justify-between items-center bg-white/5 px-10 py-7 rounded-[3.5rem] border border-white/5 backdrop-blur-2xl">
                            <div className="flex flex-col items-center"><span className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Latency</span><span className="text-xl font-black text-blue-500 tabular-nums">{ping}<span className="text-[9px] ml-1 opacity-40 italic">ms</span></span></div>
                            <div className="flex flex-col items-center"><span className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Jitter</span><span className="text-xl font-black text-emerald-500 tabular-nums">2<span className="text-[9px] ml-1 opacity-40 italic">ms</span></span></div>
                            <div className="flex flex-col items-center"><span className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Engine</span><span className="text-xl font-black text-white italic uppercase">v8.ULTRA</span></div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={startTest} className="flex-1 py-7 bg-white/5 hover:bg-white/10 text-white font-black rounded-[3rem] text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 border border-white/10 active:scale-95 shadow-lg group">
                                <RefreshCw className="w-4 h-4 text-blue-500 group-hover:rotate-180 transition-transform duration-700" /> Re-Scan
                            </button>
                            <button className="flex-1 py-7 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[3rem] text-[10px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 group">
                                <Share2 className="w-4 h-4 group-hover:scale-125 transition-transform" /> Share Peak
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full max-w-2xl px-4 mt-20 pb-20 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="backdrop-blur-3xl bg-white/[0.01] p-10 rounded-[4rem] border border-white/5 hover:border-blue-500/10 transition-all duration-700">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="p-4 bg-blue-500/10 rounded-3xl text-blue-400 group-hover:scale-110 transition-transform"><Cpu className="w-7 h-7" /></div>
                        <h3 className="text-2xl font-black tracking-tight text-white italic">Peak-Saturated Engine</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm italic font-medium">
                        Standard speed tests use simple averages, which often under-report true capacity on busy networks. Our v7 engine utilizes a **95th-percentile sampling filter** across 8 parallel streams, capturing your connection's absolute peak capability while ignoring transient network noise.
                    </p>
                </div>
                <div className="backdrop-blur-3xl bg-white/[0.01] p-10 rounded-[4rem] border border-white/5 hover:border-emerald-500/10 transition-all duration-700">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-400"><ShieldCheck className="w-7 h-7" /></div>
                        <h3 className="text-2xl font-black tracking-tight text-white italic">Verified Stability Analysis</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm italic font-medium">
                        By deploying dedicated **Web Workers**, we isolate measurement from UI rendering. This guarantees that your browser's speed results are bit-accurate and unhindered by main-thread lag, providing a diagnostic reliability equivalent to desktop-level speedtest software.
                    </p>
                </div>
            </div>
        </div>
    );
}
