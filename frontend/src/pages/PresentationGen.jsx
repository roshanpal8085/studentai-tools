import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import SEO from '../components/SEO';
import { 
  MonitorPlay, Loader2, Download, Palette, Sparkles, 
  Layout, Presentation, Languages, CheckCircle, HelpCircle, 
  FileText, Zap 
} from 'lucide-react';

const PresentationGen = () => {
  const [formData, setFormData] = useState({ topic: '' });
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presentationRef = useRef(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/presentation`, formData);
      setResult(res.data.content); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating presentation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const downloadPdf = () => {
    const element = presentationRef.current;
    if (!element) return;

    element.classList.remove('space-y-12', 'pb-12');
    element.classList.add('space-y-0', 'pb-0');
    
    const oldWidth = element.style.width;
    const oldMaxWidth = element.style.maxWidth;
    const oldMargin = element.style.margin;
    
    element.style.width = '1024px';
    element.style.maxWidth = '1024px';
    element.style.margin = '0';

    const opt = {
      margin:       0,
      filename:     `${formData.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation'}.pdf`,
      image:        { type: 'png' },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, width: 1024, windowWidth: 1024 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' },
      pagebreak:    { mode: ['legacy'] }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.add('space-y-12', 'pb-12');
      element.classList.remove('space-y-0', 'pb-0');
      element.style.width = oldWidth;
      element.style.maxWidth = oldMaxWidth;
      element.style.margin = oldMargin;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="AI Presentation Builder - Create Professional Slides Instantly" 
        description="Turn any topic into a beautifully structured presentation. Our AI generates slide content, themes, and layouts ready for academic or professional use." 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 mb-4 transition-transform hover:rotate-12">
            <MonitorPlay className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            AI <span className="text-gradient">Presentation Builder</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Convert complex ideas into clear narratives. Generate structured slide decks with professional content and themes in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Config Panel */}
          <div className="lg:col-span-4 glass-card rounded-[2.5rem] p-8 md:p-10 h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <Layout className="w-6 h-6 text-sky-500" /> Narrative Engine
              </h2>
              <Sparkles className="w-5 h-5 text-sky-500 animate-pulse" />
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Presentation Topic</label>
                <textarea 
                  required 
                  name="topic" 
                  onChange={handleChange} 
                  placeholder="e.g. The impact of remote work on urban planning and infrastructure..." 
                  className="w-full h-48 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white text-sm leading-relaxed resize-none" 
                />
              </div>
              
              <button 
                disabled={loading || !formData.topic} 
                type="submit" 
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-sky-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Palette className="w-5 h-5 group-hover:-rotate-12 transition-transform" />}
                <span>{loading ? 'Curating Slides...' : 'Build Presentation'}</span>
              </button>
            </form>
          </div>

          {/* Result Area */}
          <div className="lg:col-span-8 bg-slate-800 dark:bg-slate-900/50 rounded-[2.5rem] shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col min-h-[700px]">
             <div className="px-8 py-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <Presentation className="w-6 h-6 text-sky-400" />
                 <h2 className="text-xl font-bold text-white">
                   {result ? `Theme: ${result.theme}` : 'Slide Preview'}
                 </h2>
               </div>
               <button 
                 disabled={!result} 
                 onClick={downloadPdf} 
                 className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-sky-600 text-white hover:bg-sky-500 transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:grayscale"
               >
                 <Download className="w-4 h-4" />
                 Save as PDF
               </button>
             </div>
             
             <div className="flex-grow p-4 md:p-12 overflow-auto custom-scrollbar bg-slate-200 dark:bg-slate-950/50">
               {error && <div className="p-4 bg-red-900/20 text-red-400 rounded-2xl mb-6 border border-red-900/50 text-sm font-bold text-center">{error}</div>}
               
               <div id="presentation-container" ref={presentationRef} className="w-full max-w-[1024px] mx-auto space-y-12 pb-12">
                 {result ? (
                    result.slides.map((slide, index) => {
                      const isTitleSlide = index === 0;

                      return (
                       <React.Fragment key={`wrapper-${index}`}>
                         {index !== 0 && <div className="html2pdf__page-break"></div>}
                         <div className={`pdf-slide rounded-3xl shadow-2xl overflow-hidden aspect-[16/9] relative flex flex-col justify-center text-left border w-full 
                                      ${isTitleSlide 
                                        ? 'bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900 text-white border-transparent' 
                                        : 'bg-white border-slate-200'} p-10 lg:p-16`} 
                         >
                         
                         {!isTitleSlide && (
                           <>
                             <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3"></div>
                             <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/3 -translate-x-1/3"></div>
                           </>
                         )}
                         
                         {!isTitleSlide && (
                           <div className="absolute top-0 right-0 p-8 z-20">
                             <span className="text-sm font-black text-slate-300">{index + 1} / {result.slides.length}</span>
                           </div>
                         )}

                         <div className={`relative z-10 w-full ${isTitleSlide ? 'text-center' : ''}`}>
                           <h2 className={`${isTitleSlide ? 'text-4xl md:text-6xl mb-8 leading-tight drop-shadow-sm' : 'text-3xl md:text-5xl mb-10'} font-black tracking-tight ${isTitleSlide ? 'text-white' : 'text-slate-900'}`}>
                             {slide.title}
                           </h2>
                           
                           {isTitleSlide && <div className="w-24 h-2 bg-sky-400 mx-auto rounded-full mb-8"></div>}
                           {isTitleSlide && <p className="text-xl md:text-2xl text-sky-200/80 font-bold uppercase tracking-[0.2em]">{result.theme}</p>}

                           <ul className={`space-y-6 max-w-4xl ${isTitleSlide ? 'hidden' : 'block'}`}>
                             {slide.points.map((point, pIndex) => (
                               <li key={pIndex} className="text-lg md:text-2xl text-slate-600 flex items-start leading-relaxed font-medium">
                                 <span className="text-sky-500 mr-5 mt-2 text-2xl shrink-0">❖</span>
                                 <span>{point}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                        </div>
                       </React.Fragment>
                      );
                    }).concat(
                      <React.Fragment key="thank-you-wrapper">
                        <div className="html2pdf__page-break"></div>
                        <div className="pdf-slide rounded-3xl shadow-2xl overflow-hidden aspect-[16/9] w-full relative flex flex-col justify-center items-center text-center border bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900 text-white border-transparent p-10 lg:p-16">
                         <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-tight drop-shadow-lg">
                           Final Thoughts
                         </h2>
                         <div className="w-32 h-2 bg-sky-400 rounded-full mb-10"></div>
                         <p className="text-2xl md:text-4xl text-sky-200 font-bold uppercase tracking-[0.3em]">Any Questions?</p>
                       </div>
                      </React.Fragment>
                    )
                 ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 h-[600px] opacity-20">
                     <Palette className="w-32 h-32 mb-8" />
                     <p className="text-3xl font-black italic">Canvas is empty...</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-32 glass-card rounded-3xl flex items-center justify-center text-slate-400 text-sm mb-24 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Creative Tools Sponsorship
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Professional <span className="text-sky-600">Visuals</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Structural Integrity', desc: 'Each deck follows a logical progression: Title, Objectives, Body Content, and Conclusion, ensuring your message is coherent.', icon: Layout },
                { title: 'Information Density', desc: 'Our AI optimizes point length for maximum readability on screen, preventing the "Wall of Text" common in poor slides.', icon: Zap },
                { title: 'Academic Standards', desc: 'Perfect for lectures, seminar presentations, or business pitches where clarity and professional tone are paramount.', icon: Presentation }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Presentation FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'Can I export to PowerPoint?', a: 'Currently, we support high-quality PDF exports which are compatible with all presentation hardware and preserve design.' },
                { q: 'How many slides are generated?', a: 'Our AI typically curates between 6 to 12 high-impact slides depending on the complexity of your topic.' },
                { q: 'Is the content original?', a: 'Yes! The narrative is generated specifically for your topic, unique every time you run the builder.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-500" /> {faq.q}
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

export default PresentationGen;
