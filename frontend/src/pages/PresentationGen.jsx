import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import SEO from '../components/SEO';
import { 
  MonitorPlay, Loader2, Download, Palette, Sparkles, 
  Layout, Presentation, HelpCircle, AlertTriangle, Zap,
  Check, ArrowRight, Eye, Mic
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
        title="Free AI Presentation Maker - Generate Slides Instantly" 
        canonical="/presentation-generator"
        description="Stop wasting hours on formatting. Use our free AI Presentation Maker to generate highly structured, beautifully designed slide decks from any topic instantly."
        keywords="ai presentation maker, free slide generator, create presentation ai, student presentation tool, ai powerpoint maker 2026"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Presentation Builder",
            "operatingSystem": "Web",
            "applicationCategory": "ProductivityApplication",
            "description": "Professional AI tool for automatically structuring and generating academic and business presentation slides.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is the AI Presentation Builder free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, it is 100% free to use. You can generate and download unlimited PDF presentations without needing to create an account." } },
              { "@type": "Question", "name": "Can I edit the generated slides?", "acceptedAnswer": { "@type": "Answer", "text": "Currently, the AI generates a fixed PDF output to ensure perfect formatting. We recommend generating the slide deck here to lock in your structure, and if you need heavy edits, copying the points into a tool like PowerPoint or Google Slides." } },
              { "@type": "Question", "name": "How many slides will it create?", "acceptedAnswer": { "@type": "Answer", "text": "The AI determines the optimal length based on your topic complexity, typically generating between 6 to 12 highly focused slides." } },
              { "@type": "Question", "name": "Is it suitable for university project defenses?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. The AI is trained to follow academic presentation structures, automatically generating logical flow: Title, Objectives, Methodology, Findings, and Conclusion." } },
              { "@type": "Question", "name": "Why does it export as PDF instead of PPTX?", "acceptedAnswer": { "@type": "Answer", "text": "PDF guarantees that your fonts, formatting, and layouts will not break when you plug your USB into a university computer. A PDF presented in Full Screen mode acts exactly like a slide deck, with 100% reliability." } }
            ]
          }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 mb-4 transition-transform hover:-translate-y-1">
            <MonitorPlay className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Presentation Builder</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Convert complex ideas into clear visual narratives. Generate structured slide decks with professional content, ready to present in seconds.
          </p>
        </div>

        {/* Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Config Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-200/60 dark:border-slate-700/60 h-fit">
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
                  placeholder="e.g. The impact of remote work on urban planning, focusing on public transportation and housing costs..." 
                  className="w-full h-48 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-white text-sm leading-relaxed resize-none" 
                />
              </div>
              
              <button 
                disabled={loading || !formData.topic} 
                type="submit" 
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold py-5 rounded-2xl transition-all shadow-xl shadow-sky-500/20 flex justify-center items-center gap-3 disabled:opacity-50 group"
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
                 className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-sky-500 text-white hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:grayscale"
               >
                 <Download className="w-4 h-4" />
                 Save as PDF
               </button>
             </div>
             
             <div className="flex-grow p-4 md:p-12 overflow-auto custom-scrollbar bg-slate-900/40">
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
                   <div className="flex flex-col items-center justify-center text-slate-500 h-[600px] opacity-30">
                     <Palette className="w-32 h-32 mb-8" />
                     <p className="text-3xl font-black italic">Canvas is empty...</p>
                     <p className="text-sm mt-4 font-normal">Enter your topic to generate a full slide deck.</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Deep Content Section (SEO & Value) */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-20 space-y-16">
          
          {/* Section 1: The Problem */}
          <section className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-10 md:p-16 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6" /></span>
              Escaping "Death by PowerPoint"
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  The biggest mistake students and professionals make when creating presentations is treating their slides like a script. They paste entire paragraphs of text onto a slide and then turn their back to the audience to read it aloud. This phenomenon, famously known as "Death by PowerPoint," guarantees that your audience stops listening within the first two minutes.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A presentation slide should not be a document. It should be a visual aid that supports what you are saying. Our AI Presentation Builder solves this inherently by strictly limiting the text it generates to highly condensed, high-impact bullet points. It forces you to actually present the material, rather than just reading it.
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-800/30">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-4">Signs of a Bad Presentation Deck:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>The Wall of Text:</strong> More than 6 bullet points or more than 6 words per line.</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>Formatting Nightmares:</strong> Clashing colors, tiny fonts, and low-contrast backgrounds.</li>
                  <li className="flex items-start gap-3 text-sm text-rose-800 dark:text-rose-200"><span className="text-rose-500 mt-1">âœ—</span> <strong>No Narrative Arc:</strong> Jumping from fact to fact without an introduction or conclusion.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Step by Step Guide */}
          <section>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">How to Use the Presentation AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Provide the Context", desc: "Don't just type 'Global Warming.' Type 'A 10-minute presentation on the economic impacts of global warming in coastal cities.' Context shapes the output." },
                { step: "02", title: "Review the Narrative", desc: "Read through the generated slides. The AI automatically structures the deck with a Title, Introduction, Body points, and a Conclusion." },
                { step: "03", title: "Export to PDF", desc: "Click the download button to instantly save your deck as a high-resolution, widescreen (16:9) PDF ready to be displayed on any projector." }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-sky-300 transition-colors">
                  <div className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute -top-2 -right-2 group-hover:scale-110 transition-transform">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Why PDF is Superior */}
          <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-6">Why We Export to PDF (Not PPTX)</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Every student knows the panic of arriving at the podium, plugging a USB drive into the university computer, and opening PowerPoint only to find that all the fonts have changed, the alignment is broken, and images are missing.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  PDF (Portable Document Format) completely eliminates this risk. A PDF locks in the exact visual design, typography, and spacing. When you open a PDF in Acrobat or any web browser and press `Ctrl + L` (Full Screen), it acts exactly like a presentation deck. Next slide, previous slide—it works flawlessly.
                </p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <h4 className="font-bold text-emerald-400 mb-6 flex items-center gap-2"><Check className="w-5 h-5"/> The PDF Presentation Advantage</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="text-emerald-500 mt-1">âœ“</span> <strong>Zero Font Issues:</strong> Fonts are embedded. No missing system fonts.
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="text-emerald-500 mt-1">âœ“</span> <strong>Universal Compatibility:</strong> Works on Windows, Mac, Linux, and even mobile phones natively.
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="text-emerald-500 mt-1">âœ“</span> <strong>No Accidental Edits:</strong> You cannot accidentally delete a text box right before presenting.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Tips for Presenting */}
          <section className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">How to Actually Present Well</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 text-sky-600"><Eye className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">The Screen is for Them, Not You</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Never turn your back to read the screen. You should know the slide content well enough that a quick glance at your laptop is all you need. Look at the audience.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 text-sky-600"><Mic className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Expand on the Bullet Points</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">If the AI generated a bullet point saying "Implementation costs rose by 20%", your job as the speaker is to explain *why* they rose and *what* the consequences were. The slide is the headline; you are the article.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-sky-50 dark:bg-sky-900/10 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-sky-500" /> Pro Tips for Generation
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-sky-600 dark:text-sky-400">1.</strong> 
                  <span><strong>Specify the audience.</strong> Say "Generate a presentation for high school students" vs "for university professors." The AI will adjust the vocabulary.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <strong className="text-sky-600 dark:text-sky-400">2.</strong> 
                  <span><strong>Feed it your essay.</strong> If you already wrote a paper using our AI Essay Writer, paste the entire essay into the topic box and say "Turn this essay into a presentation." It works flawlessly.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Extended FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "Is the AI Presentation Builder free?", a: "Yes. The tool is entirely free to use, and you can download unlimited presentations without any watermark." },
                { q: "Can I add my own images?", a: "Currently, the AI generates highly focused, text-based structural slides. If you need complex charts or specific images, we recommend using the generated PDF as a structural guide and rebuilding it in PowerPoint." },
                { q: "How does the AI determine slide count?", a: "The AI evaluates the density of the topic you provide. Simple topics may yield 5-6 slides, whereas complex prompts with multiple instructions might yield up to 15 slides to prevent overcrowding." },
                { q: "Will the formatting break if I have too much text?", a: "The AI is strictly prompted to keep bullet points concise (under 12 words) to ensure they fit perfectly within the 16:9 wide-screen format provided in the PDF export." },
                { q: "Can I use this for business meetings?", a: "Absolutely. Many junior analysts and consultants use this tool to quickly structure 'straw-man' pitch decks before spending hours on design." }
              ].map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">{faq.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PresentationGen;
