import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import AdBanner from '../components/AdBanner';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

const CaptionGen = () => {
  const [formData, setFormData] = useState({ topic: '', mood: 'aesthetic' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
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
      <Helmet><title>Instagram Caption Generator - StudentAI Tools</title></Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-500 mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Instagram Captions</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Generate viral, aesthetic, or funny captions and hashtags for your posts.</p>
        </div>

        <AdBanner format="horizontal" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Post Details</h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">What is your post about?</label>
                <textarea required name="topic" onChange={handleChange} placeholder="A trip to the mountains with friends..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white h-32 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Mood / Vibe</label>
                <select name="mood" onChange={handleChange} value={formData.mood} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-pink-500 outline-none transition-all dark:text-white cursor-pointer appearance-none">
                  <option value="aesthetic">Aesthetic & Chill</option>
                  <option value="funny">Funny & Witty</option>
                  <option value="motivational">Motivational & Inspiring</option>
                  <option value="mysterious">Short & Mysterious</option>
                  <option value="professional">Professional & Clean</option>
                </select>
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md mt-6 flex justify-center items-center space-x-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                <span>{loading ? 'Generating Captions...' : 'Generate Options'}</span>
              </button>
            </form>
          </div>

          <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col relative h-[500px] lg:h-auto min-h-[500px]">
            <div className="bg-slate-900 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Generated Options</h2>
              {result && (
                 <button onClick={() => navigator.clipboard.writeText(result)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 shadow-sm">
                   Copy Text
                 </button>
              )}
            </div>
            <div className="p-8 text-slate-300 font-sans text-base leading-relaxed whitespace-pre-wrap overflow-y-auto flex-grow">
              {result ? result : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-4">
                  <ImageIcon className="w-20 h-20 opacity-30" />
                  <p className="text-lg">Your generated captions will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionGen;
