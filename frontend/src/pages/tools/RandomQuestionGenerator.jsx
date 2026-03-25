import { useState } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';
import { HelpCircle, Loader2, RefreshCw, Brain, Lightbulb, Target, Sparkles } from 'lucide-react';

const RandomQuestionGenerator = () => {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateQuestion = async () => {
    if (!subject) return;
    setLoading(true);
    setShowAnswer(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/chat-pdf`, {
        question: `Generate 1 unique and challenging trivia/practice question about the subject: "${subject}" at a "${difficulty}" difficulty level. Format STRICTLY as JSON like this: {"question": "text", "answer": "text"}. Do not include any other markdown or text.`,
        pdfText: "NO_PDF", history: []
      });
      const data = JSON.parse(res.data.answer.replace(/```json/gi, '').replace(/```/g, '').trim());
      setQuestion(data);
    } catch (err) {
      console.error('Question Gen Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Random Practice Question Generator - AI Quiz Tool" 
        description="Test your knowledge with AI-generated random practice questions on any subject. Perfect for trivia, exam prep, and flashcard-style learning. 100% free online."
        keywords="random question generator, practice questions, ai quiz maker, trivia generator, student study tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Random Question Generator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "AI-powered tool for generating unique practice and trivia questions for academic mastery.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 transition-transform hover:scale-110 shadow-lg shadow-indigo-500/20">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Random Question <span className="text-gradient" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Challenge yourself limits. Generate random, high-quality practice questions instantly to test your mastery of any subject or topic.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16 h-full min-h-[400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Input Side */}
            <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="max-w-md mx-auto w-full space-y-8">
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Target className="w-4 h-4 text-indigo-500" /> Target Subject
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Molecular Biology, WWII, Python..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-indigo-500" /> Difficulty Level
                  </label>
                  <div className="relative">
                    <select 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer"
                    >
                        <option>Elementary</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                        <option>Expert (PhD Level)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>

                <div className="pt-2">
                    <button 
                        onClick={generateQuestion}
                        disabled={loading || !subject}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex justify-center items-center gap-3 active:scale-[0.98] group disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />}
                        <span className="text-lg uppercase tracking-tight">{loading ? 'Synthesizing...' : 'Generate Challenge'}</span>
                    </button>
                </div>
              </div>
            </div>

            {/* Output Side */}
            <div className="p-10 md:p-14 relative bg-white/30 dark:bg-slate-950/20 flex flex-col justify-center min-h-[400px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl point-events-none"></div>
                
                {question ? (
                  <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
                    <div className="glass-card rounded-3xl p-8 mb-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl bg-white/80 dark:bg-slate-800/80">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">Question</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                            {question.question}
                        </h3>
                    </div>
                    
                    {!showAnswer ? (
                        <button 
                            onClick={() => setShowAnswer(true)}
                            className="w-full py-4 border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex justify-center items-center gap-2"
                        >
                            <Lightbulb className="w-5 h-5" /> Click to Reveal Answer
                        </button>
                    ) : (
                        <div className="p-8 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800/50 rounded-3xl animate-in flip-in-x duration-500 shadow-inner">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-200 dark:bg-green-800/60 text-green-800 dark:text-green-300 text-[10px] font-black uppercase tracking-widest mb-4">Correct Answer</span>
                            <p className="text-xl text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                {question.answer}
                            </p>
                        </div>
                    )}
                  </div>
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-40">
                        <HelpCircle className="w-24 h-24 mb-6 text-slate-400" />
                        <h3 className="text-2xl font-bold text-slate-500 mb-2">Ready to test yourself?</h3>
                        <p className="text-slate-400 max-w-sm text-center">Enter any subject on the left, select your difficulty, and trigger the AI to start your pop quiz.</p>
                    </div>
                )}
            </div>

          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Educational Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Accelerate Your <span className="text-indigo-500" style={{ backgroundImage: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Learning</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Active Recall Training', desc: 'Instead of passively re-reading notes, our generator forces you to use \'active recall\', proven by cognitive science to be the most effective study method.', icon: Brain },
                { title: 'Infinite Subjects', desc: 'From obscure historical events to advanced programming languages, the AI draws upon a vast dataset to quiz you on virtually anything.', icon: Target },
                { title: 'Adaptive Difficulty', desc: 'Start at the Elementary level to build foundational confidence, and scale up to Expert/PhD levels to truly test the limits of your mastery.', icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
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
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-extrabold dark:text-white mb-8 relative z-10">Quiz Generator FAQ</h2>
            <div className="space-y-6 relative z-10">
              {[
                { q: 'Can I generate multiple choice questions?', a: 'Currently, the engine focuses on open-ended "flashcard" style questions to encourage active recall rather than recognition, which is better for memory retention.' },
                { q: 'Is the information always accurate?', a: 'While our AI is highly trained on vast factual datasets, it is always recommended to double-check highly specific or critical academic facts against your syllabus materials.' },
                { q: 'Can I save the questions?', a: 'At this time, questions are generated uniquely per session to keep you on your toes. You can manually copy specific questions you find highly valuable.' }
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

export default RandomQuestionGenerator;
