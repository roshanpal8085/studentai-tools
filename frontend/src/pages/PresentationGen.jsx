import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import AdBanner from '../components/AdBanner';
import { MonitorPlay, Loader2, Download, Palette } from 'lucide-react';

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
      <Helmet><title>AI Presentation Builder - StudentAI Tools</title></Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-500 mb-4">
            <MonitorPlay className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">AI Presentation Builder</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Instantly generate a beautifully designed, structurally perfect PowerPoint outline ready to export.</p>
        </div>

        <AdBanner format="horizontal" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Topic Configuration</h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">What is your presentation about?</label>
                <textarea required name="topic" onChange={handleChange} placeholder="e.g. The economic impacts of artificial intelligence on the global supply chain" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white h-40 resize-none" />
              </div>
              
              <button disabled={loading || !formData.topic} type="submit" className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md mt-6 flex justify-center items-center space-x-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Palette className="w-5 h-5" />}
                <span>{loading ? 'Designing Slides...' : 'Build Presentation'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col relative h-[865px] lg:h-auto min-h-[700px]">
            <div className="bg-slate-900 border-b border-slate-700 py-4 px-6 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">
                {result ? `Theme: ${result.theme}` : 'Slide Preview'}
              </span>
              <button disabled={!result} onClick={downloadPdf} className="flex items-center space-x-2 text-white bg-sky-600 hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm">
                <Download className="w-4 h-4" />
                <span>Save Slides as PDF</span>
              </button>
            </div>
            
            <div className="p-4 md:p-8 flex-grow bg-slate-200 dark:bg-slate-950 overflow-x-auto overflow-y-auto" style={{ maxHeight: result ? '800px' : 'none' }}>
              <div 
                id="presentation-container"
                ref={presentationRef}
                className="w-full min-w-[800px] max-w-[1024px] mx-auto space-y-12 pb-12"
              >
                {result ? (
                   result.slides.map((slide, index) => {
                     const isTitleSlide = index === 0;
                     const isConclusion = index === result.slides.length - 1;

                     return (
                      <React.Fragment key={`wrapper-${index}`}>
                        {index !== 0 && <div className="html2pdf__page-break"></div>}
                        <div 
                          className={`pdf-slide rounded-2xl shadow-xl overflow-hidden aspect-[16/9] shrink-0 relative flex flex-col justify-center text-left border w-full 
                                     ${isTitleSlide ? 'bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900 text-white border-transparent' 
                                     : 'bg-white border-slate-200'} p-10 lg:p-14`} 
                        >
                        
                        {/* Decorative background blooms */}
                        {!isTitleSlide && (
                          <>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/3 -translate-x-1/3"></div>
                          </>
                        )}
                        
                        {/* Slide Navigation Number */}
                        {!isTitleSlide && (
                          <div className="absolute top-0 right-0 p-8 z-20">
                            <span className="text-sm font-bold text-slate-400">{index + 1} / {result.slides.length}</span>
                          </div>
                        )}

                        <div className={`relative z-10 w-full ${isTitleSlide ? 'text-center' : 'mt-8'}`}>
                          
                          <h2 className={`${isTitleSlide ? 'text-4xl md:text-5xl mb-6 leading-tight' : 'text-3xl md:text-4xl mb-8'} font-extrabold tracking-tight ${isTitleSlide ? 'text-white' : 'text-slate-800'}`}>
                            {slide.title}
                          </h2>
                          
                          {isTitleSlide && <div className="w-16 h-1.5 bg-sky-400 mx-auto rounded-full mb-6 relative z-20"></div>}
                          {isTitleSlide && <p className="text-lg md:text-xl text-sky-200 font-medium tracking-wide">{result.theme}</p>}

                          <ul className={`space-y-4 max-w-4xl mx-auto ${isTitleSlide ? 'hidden' : 'block'}`}>
                            {slide.points.map((point, pIndex) => (
                              <li key={pIndex} className="text-lg md:text-xl text-slate-600 flex items-start leading-relaxed">
                                <span className="text-sky-500 mr-4 mt-1.5 text-xl shrink-0">❖</span>
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
                       <div 
                          key="thank-you" 
                          className="pdf-slide rounded-2xl shadow-xl overflow-hidden aspect-[16/9] w-full shrink-0 relative flex flex-col justify-center items-center text-center border bg-gradient-to-br from-slate-900 via-sky-900 to-indigo-900 text-white border-transparent p-10 lg:p-14"
                        >
                        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                           Thank You!
                        </h2>
                        <div className="w-24 h-1.5 bg-sky-400 rounded-full mb-8 relative z-20"></div>
                        <p className="text-xl md:text-3xl text-sky-200 font-medium tracking-wide">Any Questions?</p>
                      </div>
                     </React.Fragment>
                   )
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 h-full mt-32">
                    <Palette className="w-20 h-20 opacity-30 mb-6" />
                    <p className="text-lg">Your beautifully designed slides will appear here...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PresentationGen;
