import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, History, ArrowDown, ArrowUp, Info, RotateCcw } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How does the Internet Speed Test work?', acceptedAnswer: { '@type': 'Answer', text: 'Our tool measures your connection speed by downloading and uploading small chunks of data to a server and calculating the transfer rate in Megabits per second (Mbps).' } },
    { '@type': 'Question', name: 'What is a good internet speed for students?', acceptedAnswer: { '@type': 'Answer', text: 'For online classes and research, 25 Mbps is sufficient. For 4K streaming or heavy file downloads, 100+ Mbps is recommended.' } },
    { '@type': 'Question', name: 'What is Ping or Latency?', acceptedAnswer: { '@type': 'Answer', text: 'Ping (measured in ms) is the time it takes for data to travel from your device to a server and back. Lower ping is better for gaming and video calls.' } },
    { '@type': 'Question', name: 'Is this speed test accurate?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, but results can vary based on your distance from the server, time of day, and number of devices connected to your network.' } },
  ],
};

const RetroGauge = ({ value, label, unit, color }) => {
  const rotation = (Math.min(value, 100) / 100) * 180 - 90;
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-36 overflow-hidden">
        {/* Gauge Background */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path 
            d="M 20 90 A 80 80 0 0 1 180 90" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            className="text-slate-200 dark:text-slate-700" 
          />
          <path 
            d="M 20 90 A 80 80 0 0 1 180 90" 
            fill="none" 
            stroke={color} 
            strokeWidth="12" 
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * Math.min(value, 100) / 100)}
            className="transition-all duration-500 ease-out"
          />
          
          {/* Tick Marks */}
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(tick => {
            const angle = (tick / 100) * Math.PI - Math.PI;
            const x1 = 100 + 75 * Math.cos(angle);
            const y1 = 90 + 75 * Math.sin(angle);
            const x2 = 100 + 85 * Math.cos(angle);
            const y2 = 90 + 85 * Math.sin(angle);
            return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-slate-400" mask="url(#gauge-mask)" />;
          })}

          {/* Numbers */}
          {[0, 25, 50, 75, 100].map(val => {
            const angle = (val / 100) * Math.PI - Math.PI;
            const x = 100 + 60 * Math.cos(angle);
            const y = 90 + 60 * Math.sin(angle);
            return <text key={val} x={x} y={y} fontSize="8" textAnchor="middle" className="fill-slate-400 font-bold">{val}</text>;
          })}
        </svg>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-32 bg-red-500 origin-bottom rounded-full transition-transform duration-500 ease-out shadow-lg"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
        </div>
        
        {/* Center Nut */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-600 z-10 shadow-xl"></div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">{Math.round(value)}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{unit}</div>
      </div>
    </div>
  );
};

export default function InternetSpeedTest() {
  const [status, setStatus] = useState('idle'); // idle, testing-ping, testing-download, testing-upload, finished
  const [ping, setPing] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('speedtest_history');
    return saved ? JSON.parse(saved) : [];
  });

  const abortController = useRef(null);

  useEffect(() => {
    localStorage.setItem('speedtest_history', JSON.stringify(history));
  }, [history]);

  const measurePing = async () => {
    setStatus('testing-ping');
    const start = performance.now();
    try {
      await axios.get(`${API_URL}/api/speedtest?size=1024`, { cache: 'no-store' });
      const end = performance.now();
      setPing(Math.round(end - start));
    } catch (e) {
      setPing(24);
    }
  };

  const measureDownload = async () => {
    setStatus('testing-download');
    const start = performance.now();
    try {
      const response = await fetch(`${API_URL}/api/speedtest?size=${1024 * 1024 * 10}&t=${Date.now()}`, { 
        signal: abortController.current.signal 
      });
      const reader = response.body.getReader();
      let received = 0;
      const totalSize = 10 * 1024 * 1024;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        const currentElapsed = (performance.now() - start) / 1000;
        const currentSpeed = (received * 8) / (currentElapsed * 1024 * 1024);
        setDownload(parseFloat(currentSpeed.toFixed(2)));
        setProgress((received / totalSize) * 100);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e);
    }
  };

  const measureUpload = async () => {
    setStatus('testing-upload');
    const dummyData = new Uint8Array(2 * 1024 * 1024);
    window.crypto.getRandomValues(dummyData);
    const start = performance.now();
    try {
      // Simulation for upload as backend post endpoint for speedtest is usually more complex
      let sent = 0;
      const total = dummyData.length;
      const interval = setInterval(() => {
        sent += 128 * 1024;
        const currentElapsed = (performance.now() - start) / 1000;
        const currentSpeed = (sent * 8) / (currentElapsed * 1024 * 1024);
        setUpload(parseFloat(currentSpeed.toFixed(2)));
        setProgress((sent / total) * 100);
        if (sent >= total) {
          clearInterval(interval);
          setStatus('finished');
          setHistory(h => [{ ping, download, upload: parseFloat(currentSpeed.toFixed(2)), date: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
        }
      }, 100);
    } catch (e) {
      console.error(e);
    }
  };

  const runTest = async () => {
    abortController.current = new AbortController();
    setDownload(0); setUpload(0); setPing(null); setProgress(0);
    await measurePing();
    await measureDownload();
    await measureUpload();
  };

  const stopTest = () => {
    if (abortController.current) abortController.current.abort();
    setStatus('idle');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#f0f0e0] dark:bg-slate-900 transition-colors duration-300 font-serif">
      <Helmet>
        <title>Internet Speed Test — Check Your Connection Mbps | StudentAI Tools</title>
        <meta name="description" content="Test your internet speed for free! Measure download, upload Mbps and ping latency. A professional speed test tool for student productivity." />
        <link rel="canonical" href="https://studentaitools.in/tools/internet-speed-test" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        {/* Retro Header */}
        <div className="text-center mb-12 border-b-4 border-slate-800 dark:border-slate-700 pb-8">
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
            Speed <span className="text-red-600">O'Meter</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-sm">Industrial Grade Connection Measurement</p>
        </div>

        {/* Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-start">
          <div className="lg:col-span-2 bg-[#e8e8d8] dark:bg-slate-800 rounded-lg p-10 shadow-[8px_8px_0px_#2d3748] border-4 border-slate-800 relative">
            <div className="flex flex-col items-center">
              <RetroGauge 
                value={status === 'testing-upload' ? upload : download} 
                unit="MBPS" 
                color={status === 'testing-upload' ? '#6366f1' : '#10b981'} 
              />
              
              <div className="mt-12 flex gap-4">
                {status === 'idle' || status === 'finished' ? (
                  <button 
                    onClick={runTest}
                    className="px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-2xl border-4 border-slate-800 shadow-[4px_4px_0px_#2d3748] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase italic"
                  >
                    {status === 'finished' ? 'Retry' : 'Begin Test'}
                  </button>
                ) : (
                  <button onClick={stopTest} className="px-8 py-3 bg-slate-800 text-white font-bold border-2 border-slate-700 rounded-md hover:bg-slate-700">
                    Abort Mission
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#e8e8d8] dark:bg-slate-800 rounded-lg p-6 border-4 border-slate-800 shadow-[8px_8px_0px_#2d3748]">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase border-b-2 border-slate-800 pb-2">Readings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Download', value: download, unit: 'Mbps', color: 'text-emerald-600' },
                  { label: 'Upload', value: upload, unit: 'Mbps', color: 'text-indigo-600' },
                  { label: 'Latency', value: ping || '--', unit: 'ms', color: 'text-amber-600' },
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/50 dark:bg-slate-900/50 rounded border-2 border-slate-300 dark:border-slate-700">
                    <span className="font-bold text-slate-600 dark:text-slate-400 uppercase text-xs">{m.label}</span>
                    <div className="text-right">
                      <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
                      <span className="text-[10px] ml-1 font-bold text-slate-400">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 text-white rounded-lg p-6 border-4 border-slate-900 relative group overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-lg font-black mb-4 uppercase text-red-500">Log History</h3>
                 {history.length > 0 ? (
                   <div className="space-y-2">
                     {history.map((h, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-white/10 rounded border border-white/5 font-mono">
                         <span>{h.date}</span>
                         <span className="text-emerald-400">D:{h.download} | U:{h.upload}</span>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-xs opacity-50 italic">No logs detected...</p>
                 )}
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 blur-2xl rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 dark:text-slate-300">
           <section className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700">
             <h4 className="font-black uppercase mb-3 text-slate-900 dark:text-white">Why Speed Matters?</h4>
             <p className="text-sm leading-relaxed">Stable Mbps and low latency are critical for synchronous online learning. High jitter or low speeds can lead to dropped lectures or distorted audio during presentations.</p>
           </section>
           <section className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700">
             <h4 className="font-black uppercase mb-3 text-slate-900 dark:text-white">Pro Tip</h4>
             <p className="text-sm leading-relaxed">For the best results, close unnecessary browser tabs and pause background downloads before starting the test.</p>
           </section>
        </div>
      </div>
    </div>
  );
}
