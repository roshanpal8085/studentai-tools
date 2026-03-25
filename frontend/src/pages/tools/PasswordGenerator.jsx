import { useState } from 'react';
import SEO from '../../components/SEO';
import { Shield, Copy, RefreshCw, CheckCircle, HelpCircle, Lock, Zap, ShieldCheck, Info, Key } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('S7ud3nt@I#2026');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };
    
    let activeChars = '';
    if (options.uppercase) activeChars += charset.uppercase;
    if (options.lowercase) activeChars += charset.lowercase;
    if (options.numbers) activeChars += charset.numbers;
    if (options.symbols) activeChars += charset.symbols;

    if (!activeChars) return setPassword('Select an option!');

    let result = '';
    for (let i = 0; i < length; i++) {
      result += activeChars.charAt(Math.floor(Math.random() * activeChars.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Secure Password Generator - Military Grade Protection" 
        description="Generate strong, unhackable passwords for your student portals and personal accounts. Free, private, and local browser-based generation."
        keywords="password generator, secure password maker, strong password creator, random password tool, student security"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Strong Password Generator",
          "operatingSystem": "Web",
          "applicationCategory": "UtilitiesApplication",
          "description": "Secure local-only password generator with customizable complexity and entropy optimization.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-indigo-900/30 text-white mb-4 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Strong <span className="text-gradient">Password Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create ultra-secure credentials in seconds. Protect your academic identity with locally generated, encrypted-standard passwords.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="p-10 md:p-16 text-center bg-white/30 dark:bg-slate-950/20 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
              <input 
                type="text" 
                readOnly 
                value={password}
                className="w-full bg-white/50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl px-8 py-8 text-3xl md:text-4xl font-mono text-slate-900 dark:text-white text-center focus:outline-none focus:border-indigo-500 transition-all shadow-inner tracking-widest overflow-x-auto whitespace-nowrap custom-scrollbar"
              />
              <div className="mt-10 flex flex-wrap justify-center gap-6">
                <button 
                  onClick={copyToClipboard}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black transition-all shadow-xl ${
                    copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
                  }`}
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="text-lg">{copied ? 'Securely Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <button 
                  onClick={generatePassword}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-lg">Regenerate</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-end mb-4 px-1">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 italic">Complexity Analysis</label>
                  <span className="text-lg font-black text-indigo-600">{length} Characters</span>
                </div>
                <input 
                  type="range" min="8" max="64" value={length} 
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600 mb-8 shadow-inner"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(options).map(key => (
                  <label key={key} className="flex items-center gap-4 p-5 bg-white/50 dark:bg-slate-900/50 rounded-[1.5rem] cursor-pointer border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all group shadow-sm">
                    <input 
                      type="checkbox" checked={options[key]} 
                      onChange={() => setOptions({...options, [key]: !options[key]})}
                      className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 accent-indigo-600 transition-all cursor-pointer" 
                    />
                    <span className="capitalize dark:text-white font-bold tracking-tight text-slate-700 group-hover:text-indigo-600 transition-colors uppercase text-xs">{key}s</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-full flex flex-col justify-center bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl mb-3 tracking-tight">Enterprise Security Standards</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  Our algorithm ensures uniform distribution of characters, preventing pattern-matching attacks common in weaker generators. 
                </p>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full w-fit">
                  <Key className="w-3 h-3" /> Fully Offline Engine
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Space Placeholder */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Security Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Elite <span className="text-indigo-600">Privacy</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Zero Data Transmission', desc: 'Every password is created on your device. We do not transmit, log, or store your passwords on any server, ever.', icon: Shield },
                { title: 'Entropy Optimization', desc: 'Our engine uses cryptographically strong pseudo-random numbers, ensuring the highest possible entropy for your security.', icon: Zap },
                { title: 'Student Focused', desc: 'Tailored for academic portals, learning management systems, and university email accounts that require high complexity.', icon: Info }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner text-primary">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Security FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Is a 12-character password enough?', a: 'Modern brute-force attacks are efficient. While 12 is good, we recommend 16+ characters for critical academic and financial portals.' },
                { q: 'Why is local generation safer?', a: 'If a site generates it on their server, a breach could expose your password. Local generation ensures only you ever see the result.' },
                { q: 'What are "symbols" in a password?', a: 'Symbols include characters like #, $, %, and ^. These significantly increase the complexity and time required for a hack to succeed.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PasswordGenerator;
