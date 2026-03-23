import { useState, useRef } from 'react';
import SEO from '../../components/SEO';
import { QrCode, Download, Loader2, CheckCircle, HelpCircle, Zap, ShieldCheck, Share2, Info, ArrowRight } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

const QRGenerator = () => {
  const [value, setValue] = useState('https://studentaitools.com');
  const [loading, setLoading] = useState(false);
  const qrRef = useRef(null);

  const downloadQR = async () => {
    if (!qrRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(qrRef.current, { backgroundColor: '#fff', padding: 20 });
      const link = document.createElement('a');
      link.download = `qrcode_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('QR Download Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free QR Code Generator - Professional & Fast" 
        description="Instantly generate high-quality QR codes for URLs, text, and social media. Free, static codes with no expiration or watermarks for students." 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:rotate-12">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Free <span className="text-gradient">QR Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create permanent QR codes for sharing notes, research links, or social profiles. High-resolution, watermark-free downloads.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 h-full min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Input Config */}
            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-6 ml-1">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Configure Data</span>
              </div>
              
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">Destination URL or Text</label>
              <textarea 
                className="w-full h-44 px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-lg leading-relaxed resize-none mb-8 placeholder:opacity-50"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. https://myportfolio.com"
              />
              
              <button 
                onClick={downloadQR}
                disabled={loading || !value}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3 disabled:opacity-50 active:scale-[0.98] group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />}
                <span className="text-lg">Export PNG Asset</span>
              </button>
            </div>

            {/* Live Preview */}
            <div className="p-10 md:p-14 bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-sm flex flex-col items-center justify-center relative">
              <div className="absolute top-8 right-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Static Engine
              </div>
              
              <div ref={qrRef} className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-white mb-8 transition-transform hover:scale-105 duration-300">
                <QRCode 
                  value={value || ' '} 
                  size={240} 
                  level="H" 
                  fgColor="#0f172a"
                />
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  Live Preview <ArrowRight className="w-3 h-3" /> Scan Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Sharing Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Digital <span className="text-indigo-600">Bridges</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Zero Persistence', desc: 'We don\'t track your links. The codes are generated locally in your browser, ensuring complete privacy for your sensitive data.', icon: ShieldCheck },
                { title: 'High Redundancy', desc: 'Codes are generated with Level H error correction, meaning they remain readable even if partially damaged or obscured.', icon: Info },
                { title: 'Social Ready', desc: 'Perfect for link-in-bio alternatives, printed group project flyers, or adding to your academic posters.', icon: Share2 }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">QR Generator FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Will these codes expire?', a: 'No. These are static QR codes. They will work as long as the destination target remains active on the web.' },
                { q: 'Can I change the link later?', a: 'Since these are static codes, the destination is hardcoded. You would need to generate a new code if the link changes.' },
                { q: 'Are they free for commercial use?', a: 'Yes! StudentAI provides these tools with no licensing restrictions for academic or professional use.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRGenerator;
