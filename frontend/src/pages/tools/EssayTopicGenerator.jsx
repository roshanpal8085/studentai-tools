import { useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';
import { Lightbulb, Loader2, Target, CheckCircle, HelpCircle, GraduationCap, Edit3, MessageSquare } from 'lucide-react';

const EssayTopicGenerator = () => {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('High School');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateTopics = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: `Generate 10 highly engaging and original essay topics for the subject/theme: "${subject || 'General Academic'}" at a "${level}" level. Provide a variety of approaches (narrative, argumentative, analytical, descriptive). List them clearly without conversational filler, numbered 1 to 10.`,
        pdfText: "NO_PDF", history: []
      });
      const lines = res.data.answer.split('\n').filter(l => l.trim() && !l.includes('###') && /^\d/.test(l));
      setTopics(lines.length > 0 ? lines : res.data.answer.split('\n').filter(l => l.trim().length > 10).slice(0,10));
    } catch (err) {
      console.error('Topic Gen Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free AI Essay Topic Generator - Creative & Academic Ideas" 
        description="Stuck on your next assignment? Generate creative, argumentative, and academic essay topics instantly with our AI-powered topic generator. 100% free online tool."
        keywords="ai essay topic generator, essay idea maker, college essay topics, research paper ideas, free writing tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Essay Topic Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "AI-powered brainstorming tool for generating academic and creative essay topics and ideas.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 mb-4 transition-transform hover:-translate-y-1 hover:scale-105 shadow-lg shadow-amber-500/20">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Essay Topic <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #f59e0b, #ea580c)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Overcome writer's block instantly. Let our AI brainstorm 10 unique, compelling essay prompts perfectly tailored to your subject area and academic level.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">

            {/* Config Section */}
            <div className="lg:col-span-1 p-10 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
               <h2 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-8">Generation Settings</h2>
               
               <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Target className="w-4 h-4 text-amber-500" /> Subject / Core Theme
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Climate Change, AI Ethics..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <GraduationCap className="w-4 h-4 text-amber-500" /> Academic Level
                  </label>
                  <div className="relative">
                    <select 
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium appearance-none cursor-pointer"
                    >
                        <option>Middle School</option>
                        <option>High School</option>
                        <option>Undergraduate</option>
                        <option>PhD / Research</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={generateTopics}
                        disabled={loading || !subject}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex justify-center items-center gap-3 active:scale-[0.98] group disabled:opacity-50 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Lightbulb className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                        <span className="text-lg uppercase tracking-tight">{loading ? 'Brainstorming...' : 'Generate 10 Topics'}</span>
                    </button>
                </div>
               </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 p-10 md:p-12 relative overflow-hidden bg-white/50 dark:bg-slate-950/20 min-h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl point-events-none"></div>
                
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">AI Topic Suggestions</h2>

                {topics.length > 0 ? (
                <div className="space-y-4 relative z-10 pr-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {topics.map((topic, i) => (
                    <div key={i} className="p-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all duration-300 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 group cursor-text" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            {i+1}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
                            {topic.replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, '')}
                        </span>
                    </div>
                    ))}
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] opacity-40">
                        <Edit3 className="w-20 h-20 mb-6 text-slate-400" />
                        <h3 className="text-2xl font-bold text-slate-500 mb-2">Awaiting Parameters</h3>
                        <p className="text-slate-400 max-w-sm text-center">Enter your central theme and academic level on the left, then trigger the AI to start brainstorming.</p>
                    </div>
                )}
            </div>

          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Writing Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Ignite Your <span className="text-amber-500" style={{ backgroundImage: 'linear-gradient(to right, #f59e0b, #ea580c)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Imagination</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Level-Appropriate Prompts', desc: 'A high school essay requires a different approach than a PhD thesis. Our AI analyzes your requested level to produce appropriately scoped and complex ideas.', icon: GraduationCap },
                { title: 'Diverse Essay Types', desc: 'From hard-hitting argumentative prompts to thoughtful narrative structures, the engine ensures a mixed variety of angles for any given subject.', icon: Target },
                { title: 'Zero Writer\'s Block', desc: 'Sometimes starting is the hardest part. Instantly generate 10 unique thesis concepts so you can skip the brainstorming and start writing immediately.', icon: MessageSquare }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Topic Generator FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Can I generate topics for highly specialized niches?', a: 'Yes! The AI has been trained on extensive academic databases. Whether you need topics on "Quantum Computing" or "18th Century Poetry", it will adapt.' },
                { q: 'Will my classmates get the exact same topics?', a: 'Highly unlikely. The AI generates responses dynamically based on subtle random weights, meaning even the exact same prompt will likely yield different lists.' },
                { q: 'Can I use these topics commercially?', a: 'Yes, the topics generated are ideas and prompts meant to inspire your original writing. There are no copyright restrictions on using these concepts.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-amber-500" /> {faq.q}
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

export default EssayTopicGenerator;
