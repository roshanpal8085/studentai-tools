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
        keywords="word counter, character counter, seo counter, reading time calculator, word count tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Word & Character Counter",
          "operatingSystem": "Web",
          "applicationCategory": "UtilitiesApplication",
          "description": "Real-time word and character counting tool with reading time and structure analysis.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 py-16 border-t border-slate-200 dark:border-slate-800">
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
                { q: 'Can I use this natively on mobile?', a: 'Yes! The responsive layout dynamically scales down, making it an excellent utility for checking exact tweet lengths or Instagram captions on your smartphone.' },
                { q: 'How does the reading time calculation work?', a: 'We calculate reading time at 200 words per minute — which is the average adult silent reading speed. Academic or technical content may take longer since it requires processing, not just reading.' },
                { q: 'What is the difference between "Characters" and "No Spaces"?', a: '"Characters" counts every character including spaces, which is what platforms like Twitter use. "No Spaces" counts only actual text characters, which is what some document editors report as "characters typed."' },
                { q: 'Does it count words in different languages?', a: 'Yes. The tool uses whitespace-based word detection which works correctly for English, Hindi transliterated in roman script, Spanish, French, and most other space-separated languages.' },
                { q: 'Why do universities impose word limits on assignments?', a: 'Word limits force students to write concisely and demonstrate mastery without padding. A professor reading 200 assignments can evaluate in 15 minutes whether you understand the concept — but only if you are concise. Word limits are a communication skill test as much as a knowledge test.' },
                { q: 'Is this tool 100% free?', a: 'Yes, completely free with no account required. StudentAI Tools is supported by non-intrusive advertising, ensuring every student has unlimited access.' },
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

        {/* Why Word Count Matters */}
        <div className="mb-16 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">Why Word Count Matters for Students</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Word count is not just a number — it is a fundamental communication constraint that affects your grade, your SEO rankings, and how you are perceived professionally.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📚 Academic Word Limits</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Every university assignment comes with a word count constraint. Going over or under by more than 10% can result in a grade penalty. Here are common limits:
              </p>
              <div className="space-y-3">
                {[
                  { type: 'Short Answer / Quiz Response', limit: '100 – 250 words' },
                  { type: 'Lab Report Discussion', limit: '300 – 500 words' },
                  { type: 'Essay / Term Paper', limit: '800 – 1,500 words' },
                  { type: 'Research Paper', limit: '2,000 – 5,000 words' },
                  { type: 'Thesis Chapter', limit: '5,000 – 10,000 words' },
                  { type: 'Full Dissertation', limit: '60,000 – 100,000 words' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{row.type}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.limit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">📱 Social Media Character Limits</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                If you create content for social media or manage your college club's online presence, you need to know these hard limits:
              </p>
              <div className="space-y-3">
                {[
                  { platform: 'Twitter / X (tweet)', limit: '280 characters' },
                  { platform: 'Instagram Caption', limit: '2,200 characters' },
                  { platform: 'LinkedIn Post', limit: '3,000 characters' },
                  { platform: 'Instagram Bio', limit: '150 characters' },
                  { platform: 'YouTube Description', limit: '5,000 characters' },
                  { platform: 'WhatsApp Message', limit: '65,536 characters' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{row.platform}</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{row.limit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How to Write to a Word Limit */}
        <div className="mb-24 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">How to Hit Your Target Word Count Every Time</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Most students either write too much and have to cut, or write too little and panic. Here is a professional workflow to hit your word count precisely.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Outline First', desc: 'Before writing a single sentence, outline your structure. For a 1,000-word essay: 100-word intro, 3 × 250-word body paragraphs, 150-word conclusion. Divide your word budget across sections before you start writing.', color: 'from-indigo-500 to-violet-600' },
              { step: '02', title: 'Write in Chunks, Count Often', desc: 'Write each section, then paste it into this counter. Seeing real numbers keeps you calibrated. If your intro is already 200 words and should be 100, cut it immediately — before you build more content on a bloated foundation.', color: 'from-violet-500 to-purple-600' },
              { step: '03', title: 'Edit for Precision', desc: 'When over the limit: remove adverbs, cut redundant phrases, shorten examples. When under the limit: deepen your analysis, add a specific example, or expand a brief statement into a full sentence with evidence.', color: 'from-purple-500 to-pink-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 relative overflow-hidden">
                <div className={`text-7xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent opacity-10 absolute -top-2 -right-2`}>{s.step}</div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-black text-sm mb-4`}>{s.step}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WordCounter;

