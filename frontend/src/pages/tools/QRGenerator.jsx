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
        keywords="qr code generator, free qr maker, static qr code, online qr generator, student sharing tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Free QR Generator",
          "operatingSystem": "Web",
          "applicationCategory": "UtilitiesApplication",
          "description": "High-quality static QR code generator with no expiration and high-resolution PNG exports.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 py-16 border-t border-slate-200 dark:border-slate-800">
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
                { q: 'Will these codes expire?', a: 'No. These are static QR codes. They will work as long as the destination URL or text remains the same. Unlike dynamic QR codes from paid services, these never expire.' },
                { q: 'Can I change the link later?', a: 'Since these are static codes, the destination is hardcoded into the QR pattern. You would need to generate a new code if the link changes. For URLs that change frequently, use a URL shortener like bit.ly as the QR destination.' },
                { q: 'Are they free for commercial use?', a: 'Yes! StudentAI provides these tools with no licensing restrictions for academic or professional use. Download the PNG and use it anywhere.' },
                { q: 'What is the maximum amount of data I can store in a QR code?', a: 'A standard QR code at Level H error correction can store approximately 1,273 characters of text or a URL up to about 2,953 characters. For practical use, shorter URLs scan faster and more reliably.' },
                { q: 'What does "Level H error correction" mean?', a: 'QR codes have 4 error correction levels (L, M, Q, H). Level H means the code can be scanned even if up to 30% of it is obscured, damaged, or covered. This is why QR codes on printed posters still work even when slightly crumpled or marked.' },
                { q: 'Can I use a QR code for my college project poster?', a: 'Absolutely. This is one of the most common student use cases. Generate a QR code pointing to your research paper, GitHub repo, or presentation, then paste the PNG onto your poster. Judges can scan it to see the full project.' },
                { q: 'What resolution is the downloaded PNG?', a: 'The exported PNG is generated at 240×240 pixels with a white background and padding. For large print (e.g., A1 poster), scale it up in your design software while maintaining proportions — QR codes are vector-like and scale well.' },
                { q: 'Can I encode plain text instead of a URL?', a: 'Yes! QR codes can store any text — a WiFi password, a contact card (vCard), an email address, a phone number, or even a short poem. Simply type your text into the input field instead of a URL.' },
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

        {/* What is a QR Code */}
        <div className="mb-16 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">What Exactly is a QR Code?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            QR stands for "Quick Response." A QR code is a two-dimensional barcode that stores information in a grid of black and white squares. Unlike traditional barcodes which can only store ~25 numbers, a QR code can store up to 3,000 characters of text — including URLs, WiFi credentials, contact information, and more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">How QR Codes Work</h3>
              <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                <p>QR codes encode data using a matrix of black squares arranged on a white background. When your camera app scans the code, it reads the pattern from left to right and top to bottom, decodes the binary data, and translates it into human-readable text or a URL.</p>
                <p>The three square patterns in the corners (called "finder patterns") help your phone's camera orient itself — this is why QR codes can be scanned from any angle, even upside down.</p>
                <p>The error correction capability (Level L, M, Q, or H) determines how much of the code can be obscured before it becomes unreadable. Our generator uses Level H — the highest setting — which allows up to 30% damage tolerance.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Static vs. Dynamic QR Codes</h3>
              <div className="space-y-4 text-sm leading-relaxed">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                  <p className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">✅ Static QR Codes (Free — What We Generate)</p>
                  <p className="text-slate-600 dark:text-slate-400">The destination is permanently encoded into the QR pattern. Never expire. Work forever. Cannot be redirected after creation. Perfect for permanent links like your portfolio or a paper.</p>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-700/30 rounded-2xl">
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">💳 Dynamic QR Codes (Paid Services)</p>
                  <p className="text-slate-600 dark:text-slate-400">Redirect through a cloud server, so you can change the destination URL without reprinting. Provide scan analytics. Require a monthly subscription (e.g., Bitly QR, QR Tiger). Good for marketing campaigns.</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">For 99% of student use cases, static QR codes are the right choice — they are free, private, and permanent.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Student Use Cases */}
        <div className="mb-24 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">10 Ways Students Use QR Codes</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
            QR codes are not just for restaurant menus. Here are the most creative and effective ways university students are using them in 2026:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: '01', title: 'Science Fair & Project Posters', desc: 'Link to your full research paper, GitHub repo, or a YouTube video demo. Judges can scan to see the complete project without you having to carry extra materials.' },
              { num: '02', title: 'Digital Business Cards', desc: 'Print a QR code on the back of your visiting card that links to your LinkedIn profile or online portfolio. Far more impressive than writing a URL by hand.' },
              { num: '03', title: 'Sharing Study Notes', desc: 'Upload your notes to Google Drive, generate a QR code for the link, and share it to your study group\'s WhatsApp. They scan it instantly — no typing required.' },
              { num: '04', title: 'College Event Promotions', desc: 'Add a QR to your fest or club event poster, linking to the registration form or event details page. Passersby can register in seconds without typing a URL.' },
              { num: '05', title: 'Resume / CV Enhancement', desc: 'Add a QR code in the corner of your resume linking to your portfolio website or LinkedIn. Recruiters can instantly access your work with one scan.' },
              { num: '06', title: 'Library Resource Sharing', desc: 'Many physical textbooks are now paired with online resources. Generate QR codes linking to companion materials, YouTube explanations, or supplementary PDFs.' },
              { num: '07', title: 'Classroom WiFi Sharing', desc: 'Encode your home WiFi credentials (format: WIFI:T:WPA;S:NetworkName;P:Password;;) and share the QR with visiting friends instead of reading out the password.' },
              { num: '08', title: 'Attendance Tracking', desc: 'Teachers can display a QR code at the start of class that links to a Google Form attendance sheet. Students scan and submit their name — no paper, no fuss.' },
              { num: '09', title: 'Augmented Reality Textbooks', desc: 'Add QR codes to your handwritten notes that link to relevant YouTube videos, simulations, or 3D models. Makes your notes exponentially more interactive.' },
              { num: '10', title: 'Payment & Donation Links', desc: 'College clubs collecting donations for events can embed a UPI payment link or Razorpay donation URL in a QR code and display it at the entrance.' },
            ].map((uc, i) => (
              <div key={i} className="flex gap-4 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">{uc.num}</div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{uc.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRGenerator;

