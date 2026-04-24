import { useState, useEffect, useRef, useCallback } from 'react';
import { Globe, RefreshCw, ArrowDown, ArrowUp, Activity, Wifi, Zap } from 'lucide-react';
import SEO from '../../components/SEO';

/* ── SEO Schema ─────────────────────────────────────────────────────────── */
const schema = {
  "@context": "https://schema.org", "@type": "WebApplication",
  "name": "Internet Speed Test", "url": "https://studentaitools.in/tools/internet-speed-test",
  "applicationCategory": "UtilityApplication",
  "description": "Free internet speed test — check download speed, upload speed, and ping instantly.",
  "offers": { "@type": "Offer", "price": "0" }
};

/* ── Gauge SVG (speedtest.net style 240° arc) ────────────────────────────── */
const ARC_DEG  = 240;
const ARC_GAP  = 360 - ARC_DEG; // 120° gap at bottom
const R        = 42;
const CX       = 50; const CY = 54;
const circumf  = 2 * Math.PI * R;
const arcLen   = (ARC_DEG / 360) * circumf;

function speedToPercent(v) {
  if (v <= 0)   return 0;
  if (v <= 10)  return (v / 10)  * 0.12;
  if (v <= 100) return 0.12 + ((v - 10)  / 90)  * 0.45;
  if (v <= 500) return 0.57 + ((v - 100) / 400) * 0.33;
  return Math.min(1, 0.90 + ((v - 500) / 500) * 0.10);
}

const TICKS = [0, 1, 5, 10, 30, 50, 100, 300, 500, 1000];
function tickAngle(v) { return -120 + speedToPercent(v) * 240; }

function Gauge({ value, phase }) {
  const pct    = speedToPercent(value);
  const filled = arcLen * pct;
  const color  = phase === 'UPLOAD' ? '#a855f7' : '#3b82f6';
  const glow   = phase === 'UPLOAD' ? '#a855f7' : '#60a5fa';

  // Needle angle: -120° (0) → +120° (1000)
  const needleAngle = -120 + pct * 240;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={glow}  stopOpacity="1"   />
        </linearGradient>
      </defs>

      {/* Track */}
      <circle cx={CX} cy={CY} r={R} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth="3.5"
        strokeDasharray={`${arcLen} ${circumf}`}
        strokeDashoffset={circumf * (ARC_GAP / 360) / 2 * -1}
        strokeLinecap="round"
        transform={`rotate(${(360 - ARC_DEG) / 2 + 90} ${CX} ${CY})`}
      />

      {/* Filled arc */}
      <circle cx={CX} cy={CY} r={R} fill="none"
        stroke="url(#arcGrad)" strokeWidth="3.5"
        strokeDasharray={`${filled} ${circumf}`}
        strokeDashoffset={circumf * (ARC_GAP / 360) / 2 * -1}
        strokeLinecap="round"
        transform={`rotate(${(360 - ARC_DEG) / 2 + 90} ${CX} ${CY})`}
        filter="url(#glow)"
        className="transition-all duration-150 ease-out"
      />

      {/* Tick marks */}
      {TICKS.map(t => {
        const ang = tickAngle(t);
        const rad = ang * Math.PI / 180;
        const inner = R - 5; const outer = R - 2;
        const x1 = CX + inner * Math.cos(rad - Math.PI/2);
        const y1 = CY + inner * Math.sin(rad - Math.PI/2);
        const x2 = CX + outer * Math.cos(rad - Math.PI/2);
        const y2 = CY + outer * Math.sin(rad - Math.PI/2);
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round" />;
      })}

      {/* Needle */}
      <g transform={`rotate(${needleAngle} ${CX} ${CY})`} className="transition-transform duration-150 ease-out">
        <line x1={CX} y1={CY + 3} x2={CX} y2={CY - (R - 8)}
          stroke={glow} strokeWidth="0.8" strokeLinecap="round"
          filter="url(#glow)"
        />
        <circle cx={CX} cy={CY} r="2.5" fill={color} filter="url(#glow)" />
        <circle cx={CX} cy={CY} r="1.2" fill="white" />
      </g>
    </svg>
  );
}

/* ── Animated number ─────────────────────────────────────────────────────── */
function useSmoothed(target, speed = 0.12) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);
  const raf = useRef(null);

  useEffect(() => {
    const animate = () => {
      const diff = target - ref.current;
      if (Math.abs(diff) < 0.05) { ref.current = target; setDisplay(target); return; }
      ref.current += diff * speed;
      setDisplay(ref.current);
      raf.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, speed]);

  return display;
}

/* ── Pulse ring during test ─────────────────────────────────────────────── */
function PulseRing({ active, color }) {
  return active ? (
    <div className="absolute inset-0 pointer-events-none">
      <div className={`absolute inset-0 rounded-full border-2 ${color} animate-ping opacity-20`} style={{ animationDuration: '1.5s' }} />
    </div>
  ) : null;
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function InternetSpeedTest() {
  const [status,   setStatus]   = useState('idle');   // idle | testing | done
  const [phase,    setPhase]    = useState('');        // PING | DOWNLOAD | UPLOAD
  const [ping,     setPing]     = useState(0);
  const [jitter,   setJitter]   = useState(0);
  const [dlRaw,    setDlRaw]    = useState(0);
  const [ulRaw,    setUlRaw]    = useState(0);
  const [progress, setProgress] = useState(0);
  const [isp,      setIsp]      = useState({ ip: '—', org: 'Detecting…', city: '', country: '' });
  const [history,  setHistory]  = useState(() => JSON.parse(localStorage.getItem('spt_hist_v11') || '[]'));
  const workerRef  = useRef(null);

  const dlSmooth = useSmoothed(dlRaw, 0.1);
  const ulSmooth = useSmoothed(ulRaw, 0.1);

  useEffect(() => {
    fetch('https://ipapi.co/json/').then(r => r.json())
      .then(d => setIsp({ ip: d.ip, org: d.org || d.asn, city: d.city, country: d.country_name }))
      .catch(() => {});
    return () => workerRef.current?.terminate();
  }, []);

  const startTest = useCallback(() => {
    workerRef.current?.terminate();
    setStatus('testing'); setPhase('PING');
    setDlRaw(0); setUlRaw(0); setPing(0); setJitter(0); setProgress(0);

    const w = new Worker(new URL('../../workers/speedtest.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;

    w.onmessage = ({ data }) => {
      const { type, value, mbps, progress: p, jitter: j } = data;

      if (type === 'PING_RESULT') {
        setPing(+value); setJitter(j || 0);
        setPhase('DOWNLOAD'); setProgress(10);
        w.postMessage({ type: 'DOWNLOAD' });
      }
      if (type === 'DOWNLOAD_UPDATE') {
        setDlRaw(mbps); setProgress(10 + p * 0.5);
      }
      if (type === 'DOWNLOAD_RESULT') {
        setDlRaw(value); setPhase('UPLOAD'); setProgress(60);
        w.postMessage({ type: 'UPLOAD' });
      }
      if (type === 'UPLOAD_UPDATE') {
        setUlRaw(mbps); setProgress(60 + p * 0.4);
      }
      if (type === 'UPLOAD_RESULT') {
        setUlRaw(value); setProgress(100); setStatus('done');
        w.terminate();
        setHistory(h => {
          const next = [{ dl: value, ul: dlRaw, ping, date: new Date().toLocaleTimeString() }, ...h].slice(0, 5);
          localStorage.setItem('spt_hist_v11', JSON.stringify(next));
          return next;
        });
      }
    };

    w.postMessage({ type: 'PING' });
  }, [dlRaw, ping]);

  const currentValue = phase === 'UPLOAD' ? ulSmooth : dlSmooth;
  const isDownload   = phase === 'DOWNLOAD';
  const isUpload     = phase === 'UPLOAD';
  const isTesting    = status === 'testing';

  const fmtSpeed = (v) => v >= 100 ? Math.round(v) : v.toFixed(v < 10 ? 2 : 1);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-start pt-20 pb-16 px-4 relative overflow-hidden">
      <SEO
        title="Internet Speed Test — Free Online Broadband Speed Checker"
        description="Free internet speed test. Check your download speed, upload speed, and ping in seconds. Accurate, no install needed."
        keywords="internet speed test, broadband speed test, download speed, upload speed, ping test, wifi speed"
        canonical="/tools/internet-speed-test"
        schema={schema}
      />

      {/* Background glows */}
      <div className="absolute top-[-20%] left-[10%]  w-[500px] h-[500px] bg-blue-600/8   rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-400 mb-4">
          <Wifi className="w-3 h-3" /> Powered by Cloudflare CDN
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Internet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Speed Test</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2">Accurate multi-stream measurement • No install required</p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-sm z-10">

        {/* ISP Info */}
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-3 mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono">{isp.ip}</span>
          </div>
          <span className="text-slate-500 truncate max-w-[160px]">{isp.org}</span>
        </div>

        {/* Gauge area */}
        <div className="relative flex flex-col items-center">
          {/* Outer ring glow */}
          <div className={`relative w-72 h-72 transition-all duration-700 ${isTesting ? 'scale-100' : 'scale-95'}`}>
            <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
              isDownload ? 'shadow-[0_0_80px_rgba(59,130,246,0.15)]' :
              isUpload   ? 'shadow-[0_0_80px_rgba(168,85,247,0.15)]' : ''
            }`} />
            <PulseRing active={isTesting} color={isUpload ? 'border-purple-500' : 'border-blue-500'} />
            <Gauge value={currentValue} phase={phase} />

            {/* Center readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '12px' }}>
              {status === 'idle' ? (
                <div className="text-center">
                  <div className="text-4xl font-black text-white/20">—</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Mbps</div>
                </div>
              ) : (
                <>
                  <div className={`text-5xl font-black tabular-nums tracking-tighter transition-colors duration-500 ${
                    isUpload ? 'text-purple-300' : 'text-blue-300'
                  }`}>
                    {fmtSpeed(currentValue)}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mbps</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest mt-2 px-3 py-1 rounded-full ${
                    isDownload ? 'bg-blue-500/10 text-blue-400' :
                    isUpload   ? 'bg-purple-500/10 text-purple-400' :
                    phase === 'PING' ? 'bg-yellow-500/10 text-yellow-400' : 'text-slate-500'
                  }`}>
                    {phase === 'PING' ? '⟳ Testing Ping…' :
                     isDownload ? '↓ Download' :
                     isUpload   ? '↑ Upload' : ''}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Start / Restart button */}
          {status !== 'testing' && (
            <button
              onClick={startTest}
              className={`mt-6 w-36 h-14 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-2xl ${
                status === 'idle'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/30 hover:shadow-blue-500/50'
                  : 'bg-white/10 hover:bg-white/15 border border-white/10'
              }`}
            >
              {status === 'idle' ? (
                <span className="flex items-center justify-center gap-2"><Zap className="w-4 h-4" /> GO</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Again</span>
              )}
            </button>
          )}

          {/* Progress bar */}
          {isTesting && (
            <div className="w-full mt-6 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isUpload ? 'bg-purple-500' : 'bg-blue-500'}`}
                style={{ width: `${progress}%`, boxShadow: `0 0 12px ${isUpload ? '#a855f7' : '#3b82f6'}` }}
              />
            </div>
          )}
        </div>

        {/* Results */}
        {(status === 'done' || (isTesting && ping > 0)) && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {/* Ping */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 text-center">
              <Activity className="w-4 h-4 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-black text-white tabular-nums">{ping}<span className="text-[9px] text-slate-500 ml-0.5">ms</span></div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Ping</div>
            </div>

            {/* Download */}
            <div className={`bg-white/[0.03] border rounded-2xl p-4 text-center transition-all duration-500 ${
              status === 'done' || isUpload ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/8'
            }`}>
              <ArrowDown className="w-4 h-4 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-black text-white tabular-nums">
                {fmtSpeed(status === 'done' ? dlRaw : dlSmooth)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Mbps ↓</div>
            </div>

            {/* Upload */}
            <div className={`bg-white/[0.03] border rounded-2xl p-4 text-center transition-all duration-500 ${
              status === 'done' ? 'border-purple-500/20 bg-purple-500/5' : 'border-white/8'
            }`}>
              <ArrowUp className="w-4 h-4 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-black text-white tabular-nums">
                {fmtSpeed(ulSmooth)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Mbps ↑</div>
            </div>
          </div>
        )}

        {/* Jitter (when done) */}
        {status === 'done' && jitter > 0 && (
          <div className="mt-3 text-center text-[11px] text-slate-600">
            Jitter: <span className="text-slate-400 font-semibold">{jitter}ms</span>
            &nbsp;·&nbsp; Connection quality:&nbsp;
            <span className={`font-bold ${dlRaw > 50 ? 'text-emerald-400' : dlRaw > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
              {dlRaw > 50 ? 'Excellent' : dlRaw > 10 ? 'Good' : 'Poor'}
            </span>
          </div>
        )}

        {/* History */}
        {history.length > 0 && status !== 'testing' && (
          <div className="mt-8">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-3 h-3" /> Recent Tests
            </div>
            <div className="space-y-2">
              {history.slice(0, 4).map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-xs">
                  <span className="text-slate-600 font-mono">{h.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400 font-bold">↓ {fmtSpeed(h.dl || 0)}</span>
                    <span className="text-purple-400 font-bold">↑ {fmtSpeed(h.ul || 0)}</span>
                    <span className="text-yellow-400 font-bold">{Math.round(h.ping)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="mt-16 max-w-lg text-center z-10">
        <p className="text-slate-700 text-xs leading-relaxed">
          Uses Cloudflare's global CDN endpoints with 8 parallel streams. Results represent p95 download / p90 upload throughput — same methodology used by professional speed test tools.
        </p>
      </div>
    </div>
  );
}
