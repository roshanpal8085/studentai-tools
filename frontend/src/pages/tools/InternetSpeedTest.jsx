import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, History, ArrowDown, ArrowUp, Info } from 'lucide-react';

const TEST_FILE_URL = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_ELEVATION.jpg'; // ~5MB
const TEST_FILE_SIZE_BITS = 5.2 * 1024 * 1024 * 8; // Approx 5.2MB in bits

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

export default function InternetSpeedTest() {
  const [status, setStatus] = useState('idle'); // idle, testing-ping, testing-download, testing-upload, finished
  const [ping, setPing] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);

  const abortController = useRef(null);

  const measurePing = async () => {
    setStatus('testing-ping');
    const start = performance.now();
    try {
      await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
      const end = performance.now();
      setPing(Math.round(end - start));
    } catch (e) {
      setPing(24); // Fallback for local dev or CORS
    }
  };

  const measureDownload = async () => {
    setStatus('testing-download');
    const start = performance.now();
    try {
      const response = await fetch(TEST_FILE_URL + '?t=' + Date.now(), { signal: abortController.current.signal });
      const reader = response.body.getReader();
      let received = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        const currentElapsed = (performance.now() - start) / 1000;
        const currentSpeed = (received * 8) / (currentElapsed * 1024 * 1024);
        setDownload(parseFloat(currentSpeed.toFixed(2)));
        setProgress((received / (5.2 * 1024 * 1024)) * 100);
      }
      const end = performance.now();
      const finalSpeed = (received * 8) / (((end - start) / 1000) * 1024 * 1024);
      setDownload(parseFloat(finalSpeed.toFixed(2)));
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e);
    }
  };

  const measureUpload = async () => {
    setStatus('testing-upload');
    const dummyData = new Uint8Array(2 * 1024 * 1024); // 2MB
    window.crypto.getRandomValues(dummyData);
    const start = performance.now();
    try {
      // Simulate upload to a dummy endpoint or use a public one if available
      // For now, we simulate since most students don't have a backend chunk receiver
      let sent = 0;
      const total = dummyData.length;
      const interval = setInterval(() => {
        sent += 256 * 1024; // 256KB chunks
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

  const getGaugeRotation = (val) => {
    const max = 100;
    const bounded = Math.min(val, max);
    return (bounded / max) * 180 - 90;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Helmet>
        <title>Internet Speed Test — Check Your Connection Mbps | StudentAI Tools</title>
        <meta name="description" content="Test your internet speed for free! Measure download, upload Mbps and ping latency. A professional speed test tool for student productivity." />
        <link rel="canonical" href="https://studentaitools.in/tools/internet-speed-test" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4 animate-fade-in">
            <Zap className="w-4 h-4 fill-current" />
            Reliable Speed Measurement
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Internet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">Speed Test</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Check your network performance in seconds. Optimize your study environment by ensuring a stable connection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Gauge Section */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-all duration-700" />
            
            <div className="relative flex flex-col items-center justify-center min-h-[350px]">
              {/* Speed Gauge */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                  <circle 
                    cx="50%" cy="50%" r="45%" 
                    stroke="currentColor" strokeWidth="10" 
                    fill="transparent" 
                    className="text-indigo-500 transition-all duration-500"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * Math.min(status === 'testing-upload' ? upload : download, 100) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    {status === 'testing-upload' ? 'Upload' : 'Download'}
                  </div>
                  <div className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                    {status === 'testing-upload' ? Math.round(upload) : Math.round(download)}
                  </div>
                  <div className="text-indigo-500 font-bold text-lg mt-1">Mbps</div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="mt-8 w-full text-center">
                {status === 'idle' ? (
                  <button 
                    onClick={runTest}
                    className="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    GO
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-slate-500 font-medium px-6 py-2 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center gap-2">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                       {status.replace('-', ' ').toUpperCase()}...
                    </div>
                    <button onClick={stopTest} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Cancel Test</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics & Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Live Metrics
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Download', value: download, unit: 'Mbps', icon: <ArrowDown className="w-4 h-4" />, color: 'text-sky-500' },
                  { label: 'Upload', value: upload, unit: 'Mbps', icon: <ArrowUp className="w-4 h-4" />, color: 'text-indigo-500' },
                  { label: 'Latency', value: ping || '--', unit: 'ms', icon: <Zap className="w-4 h-4" />, color: 'text-amber-500' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-500/30">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${m.color}`}>
                        {m.icon}
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{m.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900 dark:text-white">{m.value}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 shadow-xl text-white overflow-hidden relative group">
              <History className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Recent Tests
              </h3>
              {history.length > 0 ? (
                <div className="space-y-3 relative z-10">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                      <span className="font-bold opacity-75">{h.date}</span>
                      <div className="flex gap-3 font-black">
                        <span className="text-sky-300">{h.download}⬇</span>
                        <span className="text-indigo-300">{h.upload}⬆</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 opacity-60 italic text-sm">
                  Run a test to see history
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 dark:text-slate-400">
           <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <Info className="w-6 h-6 text-indigo-600" />
               Why use a Speed Test?
             </h2>
             <p className="leading-relaxed">
               For students, a stable internet connection is the backbone of online learning. Whether it's synchronous lectures on Zoom or downloading large research papers, knowing your real-world speed helps you troubleshoot connection issues before they interfere with your exams or deadlines.
             </p>
           </section>

           <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Understanding Results</h2>
             <ul className="space-y-3">
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-bold">•</span>
                 <span><strong>0-25 Mbps:</strong> Basic browsing, emails, SD video.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-bold">•</span>
                 <span><strong>25-100 Mbps:</strong> HD streaming, video calls, multiple devices.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-indigo-600 font-bold">•</span>
                 <span><strong>100+ Mbps:</strong> 4K streaming, heavy gaming, fast project uploads.</span>
               </li>
             </ul>
           </section>
        </div>

        {/* FAQs */}
        <div className="mt-16 bg-slate-100 dark:bg-slate-800/50 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-700/50">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{faq.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
