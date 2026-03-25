import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowUp, Zap, MapPin, Globe, User, Activity, CheckCircle, Copy, Share2, Info, RefreshCw } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 50; // 50MB for stable sampling

const Gauge = ({ value, phase }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 50) return -81 + ((v - 10) / 40) * 54;
        if (v <= 100) return -27 + ((v - 50) / 50) * 54;
        if (v <= 500) return 27 + ((v - 100) / 400) * 81;
        if (v <= 1000) return 108 + ((v - 500) / 500) * 27;
        return 135;
    };
    const angle = getAngle(value);

    return (
        <div className="relative w-72 h-72 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1f263e" strokeWidth="6" strokeDasharray="212 282" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3162e6'} 
                    strokeWidth="6" 
                    strokeDasharray={`${(212 * (angle + 135)) / 270} 282`} 
                    strokeLinecap="round" 
                    className="transition-all duration-300 ease-out" 
                />
            </svg>
            <div className="absolute w-1 h-[130px] bg-gradient-to-t from-blue-500 to-transparent origin-bottom transition-transform duration-300 ease-out z-20 rounded-full shadow-[0_0_15px_#3b82f6]" style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-16">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter shadow-blue-500/10 shadow-2xl">
                    {value.toFixed(0)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Mbps</div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [ping, setPing] = useState(0);
    const [jitter, setJitter] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [isp, setIsp] = useState({ name: 'Detecting...', ip: '0.0.0.0', city: 'Bhopal' });
    const [progress, setProgress] = useState(0);

    const abortController = useRef(null);

    useEffect(() => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp({ name: d.org, ip: d.ip, city: d.city })).catch(() => {});
        return () => abortController.current?.abort();
    }, []);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 8; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
            setProgress((i/8) * 10);
        }
        setPing(Math.min(...samples).toFixed(0));
        setJitter((Math.max(...samples) - Math.min(...samples)).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const start = performance.now();
        const response = await fetch(`/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, { cache: 'no-store' });
        const reader = response.body.getReader();
        let receivedBytes = 0;
        let lastMbps = 0;

        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            receivedBytes += value.length;
            const elapsed = (performance.now() - start) / 1000;
            if (elapsed > 0.4) {
                const currentMbps = (receivedBytes * 8) / (elapsed * 1000000);
                // Exponential Moving Average for smooth needle
                lastMbps = lastMbps === 0 ? currentMbps : (lastMbps * 0.8) + (currentMbps * 0.2);
                setDownload(lastMbps);
                setProgress(10 + (receivedBytes / DOWNLOAD_SIZE) * 40);
            }
        }
        setDownload((receivedBytes * 8) / ((performance.now() - start) / 1000 * 1000000));
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const start = performance.now();
        const data = new Uint8Array(1024 * 1024 * 8); // 8MB chunk
        const response = await fetch(`/api/upload-test?t=${Date.now()}`, {
            method: 'POST',
            body: data,
            cache: 'no-store'
        });
        const elapsed = (performance.now() - start) / 1000;
        const mbps = (data.length * 8) / (elapsed * 1000000);
        setUpload(mbps);
        setProgress(100);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(0); setProgress(0);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen bg-[#0b0e1a] text-white flex items-center justify-center p-4">
            <Helmet><title>SpeedPulse v17 – Professional High-Res Streamer</title></Helmet>

            <div className="w-full max-w-4xl bg-[#151c2d] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative flex flex-col items-center">
                
                {/* Stats Bar */}
                <div className="grid grid-cols-4 w-full gap-4 mb-10 bg-[#0b0e1a]/80 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <div className="text-center group border-r border-white/5 pr-4">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-blue-500">PING <span className="opacity-30">ms</span></div>
                        <div className="text-3xl font-black tabular-nums">{ping || 0}</div>
                    </div>
                    <div className="text-center group border-r border-white/5 pr-4">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-purple-500">JITTER <span className="opacity-30">ms</span></div>
                        <div className="text-3xl font-black tabular-nums">{jitter || 0}</div>
                    </div>
                    <div className="text-center group border-r border-white/5 pr-4">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-blue-500">DOWNLOAD <span className="opacity-30">Mbps</span></div>
                        <div className="text-3xl font-black text-blue-500 tabular-nums">{download > 0 ? download.toFixed(1) : '---'}</div>
                    </div>
                    <div className="text-center group">
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover:text-purple-500">UPLOAD <span className="opacity-30">Mbps</span></div>
                        <div className="text-3xl font-black text-purple-500 tabular-nums">{upload > 0 ? upload.toFixed(1) : '---'}</div>
                    </div>
                </div>

                {/* Gauge Area */}
                <div className="relative flex flex-col items-center mb-8">
                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} />
                    
                    <div className="mt-8 flex flex-col items-center gap-4">
                        {status === 'idle' || status === 'finished' ? (
                            <button onClick={startTest} className="w-32 h-32 bg-[#3162e6] hover:bg-[#254ccb] hover:scale-105 rounded-full flex items-center justify-center text-3xl font-black shadow-[0_0_30px_#3b82f644] transition-all border-4 border-[#0b0e1a] outline outline-8 outline-[#151c2d]">
                                {status === 'finished' ? <RefreshCw className="w-8 h-8" /> : 'GO'}
                            </button>
                        ) : (
                            <div className="flex flex-col items-center animate-pulse">
                                <Activity className="w-6 h-6 text-blue-500 mb-2 animate-spin" />
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">{phase}ING...</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div className="flex justify-between w-full mt-6 pt-10 border-t border-white/5 gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center shadow-lg"><User className="w-6 h-6 text-blue-500" /></div>
                        <div>
                            <div className="text-[10px] font-black text-slate-600 uppercase mb-0.5">Your Provider</div>
                            <div className="text-lg font-black text-white leading-tight">{isp.name}</div>
                            <div className="text-[10px] font-bold text-slate-500">{isp.ip} — {isp.city}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-5 text-right">
                        <div>
                            <div className="text-[10px] font-black text-slate-600 uppercase mb-0.5">Test Server</div>
                            <div className="text-lg font-black text-white leading-tight">StudentAI Node</div>
                            <div className="text-[10px] font-bold text-slate-500 flex items-center justify-end gap-1"><MapPin className="w-3 h-3" /> Global Edge (Local Cluster)</div>
                        </div>
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center shadow-lg"><Globe className="w-6 h-6 text-blue-500" /></div>
                    </div>
                </div>

                {/* Progress Strip */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden rounded-b-[2.5rem]">
                    <div className="h-full bg-blue-600 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
}
