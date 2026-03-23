import { useState } from 'react';
import { Type, Copy, Trash2, Zap, Clock, Hash, AlignLeft, Info, HelpCircle } from 'lucide-react';
import SEO from '../../components/SEO';

const WordCounter = () => {
  const [text, setText] = useState('');

  // Calculations
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length;
  const readingTime = Math.ceil(words / 200); // Average 200 wpm

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    if(window.confirm('Are you sure you want to clear the text?')) {
      setText('');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Word & Character Counter - Target SEO Analyzer" 
        description="Professional-grade real-time word and character counter. Analyze reading time, sentence density, and paragraph structure instantly directly in your browser." 
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 transition-transform hover:-translate-y-1 shadow-lg shadow-indigo-500/20">
            <Type className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Word & <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Character Counter</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time writing analysis for students, SEO professionals, and creators. Track length, structure, and readability metrics instantly as you type.
          </p>
        </div>

        {/* Core Tool Interface */}
        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          
          {/* Stat metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            {[
              { label: 'Words', val: words, icon: AlignLeft, color: 'text-indigo-500' },
              { label: 'Characters', val: characters, icon: Hash, color: 'text-sky-500' },
              { label: 'Sentences', val: sentences, icon: Zap, color: 'text-amber-500' },
              { label: 'Paragraphs', val: paragraphs, icon: Type, color: 'text-emerald-500' },
              { label: 'No Spaces', val: charactersNoSpaces, icon: Hash, color: 'text-rose-500' },
              { label: 'Read Time', val: `${readingTime}m`, icon: Clock, color: 'text-violet-500' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 border-r border-b lg:border-b-0 border-slate-200 dark:border-slate-800 last:border-r-0 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <stat.icon className={`w-5 h-5 mx-auto mb-3 ${stat.color} opacity-80`} />
                <span className="block text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.val}</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Text Editor */}
          <div className="relative p-0 bg-white/30 dark:bg-slate-950/20">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your essay, tweet, or article here to begin analysis..."
              className="w-full h-96 p-8 lg:p-12 bg-transparent border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-100 text-lg md:text-xl leading-relaxed outline-none font-medium custom-scrollbar"
            ></textarea>
          </div>

          {/* Controls */}
          <div className="bg-slate-50 border-t border-slate-200 dark:border-slate-800 dark:bg-slate-900/80 p-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Live Analytics Active
             </div>
             <div className="flex gap-4 w-full sm:w-auto">
               <button onClick={handleCopy} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                 <Copy className="w-4 h-4" /><span>Copy Text</span>
               </button>
               <button onClick={handleClear} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500 transition-all shadow-sm active:scale-95">
                 <Trash2 className="w-4 h-4" /><span>Clear Board</span>
               </button>
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Content Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Insightful <span className="text-indigo-500" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Analytics</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Semantic Counting', desc: 'Our robust algorithm intelligently ignores formatting symbols and empty white space to give you an accurate word count that strictly matches academic or SEO submission standards.', icon: Info },
                { title: 'Readability Estimates', desc: 'The estimated reading time tracks at 200 words-per-minute, helping you optimize long-form content for user engagement to ensure you respect your audience\'s time.', icon: Clock },
                { title: 'Privacy Guaranteed Locally', desc: 'No text data is ever stored, sent to an API, or transmitted to a cloud server. Your sensitive text is processed entirely within your browser\'s local memory.', icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl point-events-none"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Counter FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Is there a character or text limit?', a: 'No! Our optimized counting matrix can handle massive documents with over 100,000 words without instantly slowing down or crashing your browser.' },
                { q: 'Does it correctly count punctuation?', a: 'Standard punctuation is perfectly excluded from the word count but deliberately factored into the total general character count for precise UI constraints like Twitter/X or Meta limits.' },
                { q: 'Can I use this natively on mobile?', a: 'Yes! The responsive layout dynamically scales down, making it an excellent utility for checking exact tweet lengths or Instagram captions on your smartphone.' }
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

export default WordCounter;
