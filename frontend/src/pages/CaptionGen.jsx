import { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { Image as ImageIcon, Loader2, Copy, Check, Sparkles, Send, HelpCircle, CheckCircle } from 'lucide-react';

const CaptionGen = () => {
  const [formData, setFormData] = useState({ topic: '', mood: 'aesthetic' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/caption`, formData);
      setResult(res.data.content);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating captions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Instagram Caption Generator - Viral Hashtags & Captions" 
        description="Generate viral, aesthetic, and engaging Instagram captions and hashtags instantly. Our AI helps you boost engagement and save time on social media." 
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-500 mb-4 transition-all hover:rotate-12 hover:scale-110">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Caption Generator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stop staring at a blank screen. Generate engaging, viral-ready captions for Instagram, TikTok, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 mt-10">
          <div className="glass-card rounded-[2.5rem] p-8 h-fit">
            <h2 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-pink-500" /> Post Details
            </h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 font-heading">What is your post about?</label>
                <textarea 
                  required 
                  name="topic" 
                  onChange={handleChange} 
                  placeholder="e.g., A sunset at the beach with best friends..." 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white h-32 resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 font-heading">Select Mood / Vibe</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'aesthetic', label: '✨ Aesthetic' },
                    { id: 'funny', label: '😂 Funny' },
                    { id: 'motivational', label: '🔥 Inspiring' },
                    { id: 'mysterious', label: '🌙 Mysterious' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({...formData, mood: m.id})}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                        formData.mood === m.id 
                        ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/20' 
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                disabled={loading || !formData.topic.trim()} 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-pink-500/20 mt-4 flex justify-center items-center space-x-2 group"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                <span>{loading ? 'Analyzing Vibe...' : 'Generate Viral Captions'}</span>
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 py-5 px-8 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">The Reveal</h2>
              {result && (
                 <button 
                  onClick={handleCopy} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold border transition-all shadow-sm ${
                    copied 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                 >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? 'Copied!' : 'Copy'}
                 </button>
              )}
            </div>
            <div className="p-8 text-slate-700 dark:text-slate-300 font-sans text-base leading-relaxed whitespace-pre-wrap overflow-y-auto flex-grow bg-white/30 dark:bg-transparent">
              {result ? result : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-4 opacity-30">
                  <ImageIcon className="w-24 h-24 mb-2" />
                  <p className="text-xl font-medium">Your catchy captions will land here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">How it Works</h2>
            <div className="space-y-6">
              {[
                { title: 'Describe Your Post', desc: 'Tell the AI what is happening in your photo or video.' },
                { title: 'Choose The Mood', desc: 'Select a vibe that matches your personal brand or the post content.' },
                { title: 'Instant Virality', desc: 'Get 5+ options with optimized emojis and trending hashtags.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-500 flex items-center justify-center font-bold text-xl flex-shrink-0">{i+1}</div>
                  <div>
                    <h3 className="font-bold text-xl dark:text-white leading-tight mb-1">{s.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Why Use Our AI?</h2>
            <ul className="space-y-4">
              {[
                'Optimized for the 2026 Hashtag Algorithm',
                'Perfect mix of emojis and high-impact text',
                'Multiple variations to choose from',
                '100% Free and works on mobile/desktop'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="glass-card rounded-[3rem] p-10 md:p-20 mb-20 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-12">Social Media FAQ</h2>
          <div className="space-y-10 text-left">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-pink-500" /> Are these captions SEO-friendly?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Yes! We include keywords and relevant hashtags that help the Instagram and TikTok algorithms categorize your content correctly, leading to higher reach.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-pink-500" /> Can I use these for TikTok?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Absolutely. While they are great for Instagram, they are also structured perfectly for TikTok descriptions and video captions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionGen;
